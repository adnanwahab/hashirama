// Copyright 2023 LiveKit, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package mediatransportutil

import (
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/pion/rtcp"
)

var (
	ntpEpoch = time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC)
)

type NtpTime uint64

func (t NtpTime) Duration() time.Duration {
	sec := (t >> 32) * 1e9
	frac := (t & 0xffffffff) * 1e9
	nsec := frac >> 32
	if uint32(frac) >= 0x80000000 {
		nsec++
	}
	return time.Duration(sec + nsec)
}

func (t NtpTime) Time() time.Time {
	return ntpEpoch.Add(t.Duration())
}

func ToNtpTime(t time.Time) NtpTime {
	nsec := uint64(t.Sub(ntpEpoch))
	sec := nsec / 1e9
	nsec = (nsec - sec*1e9) << 32
	frac := nsec / 1e9
	if nsec%1e9 >= 1e9/2 {
		frac++
	}
	return NtpTime(sec<<32 | frac)
}

// ------------------------------------------

var (
	ErrRttNoLastSenderReport      = errors.New("no last sender report")
	ErrRttNotLastSenderReport     = errors.New("not last sender report")
	ErrRttNoLastSendTime          = errors.New("no last sent time")
	ErrRttAnachronousSenderReport = errors.New("anachronous sender report")
)

func getRttMs(report *rtcp.ReceptionReport, lastSRNTP NtpTime, lastSentAt time.Time, ignoreLast bool) (uint32, error) {
	if report.LastSenderReport == 0 {
		return 0, ErrRttNoLastSenderReport
	}

	if !ignoreLast && report.LastSenderReport != uint32((lastSRNTP>>16)&0xFFFFFFFF) {
		return 0, fmt.Errorf("%w, lastSR: 0x%x, received: 0x%x", ErrRttNotLastSenderReport, uint32((lastSRNTP>>16)&0xFFFFFFFF), report.LastSenderReport)
	}

	if !ignoreLast && lastSentAt.IsZero() {
		return 0, ErrRttNoLastSendTime
	}

	// RTT calculation reference: https://datatracker.ietf.org/doc/html/rfc3550#section-6.4.1

	// middle 32-bits of current NTP time
	now := time.Now()
	timeSinceLastSR := time.Duration(0)
	if !ignoreLast {
		timeSinceLastSR = time.Since(lastSentAt)
		now = lastSRNTP.Time().Add(timeSinceLastSR)
	}
	nowNTP := ToNtpTime(now)
	nowNTP32 := uint32(nowNTP >> 16)
	if (nowNTP32 - report.LastSenderReport - report.Delay) > (1 << 31) {
		return 0, fmt.Errorf(
			"%w, lastSRNTP: %d / %+v, lastSentAt: %+v, since: %+v, now: %+v, nowNTP: %d, lsr: %d, dlsr: %d / %+v, diff: %d",
			ErrRttAnachronousSenderReport,
			lastSRNTP,
			lastSRNTP.Time().String(),
			lastSentAt,
			timeSinceLastSR,
			now.String(),
			nowNTP,
			report.LastSenderReport,
			report.Delay,
			time.Duration(float64(report.Delay)/65536.*float64(time.Second)),
			int32(nowNTP32-report.LastSenderReport-report.Delay),
		)
	}

	ntpDiff := nowNTP32 - report.LastSenderReport - report.Delay
	return uint32(math.Ceil(float64(ntpDiff) * 1000.0 / 65536.0)), nil
}

func GetRttMs(report *rtcp.ReceptionReport, lastSRNTP NtpTime, lastSentAt time.Time) (uint32, error) {
	return getRttMs(report, lastSRNTP, lastSentAt, false)
}

func GetRttMsFromReceiverReportOnly(report *rtcp.ReceptionReport) (uint32, error) {
	return getRttMs(report, 0, time.Time{}, true)
}
