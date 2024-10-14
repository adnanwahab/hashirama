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

package utils

import (
	"database/sql/driver"
	"encoding/binary"
	"errors"
	"fmt"
	"sync"
	"time"

	"go.uber.org/atomic"

	"github.com/livekit/protocol/livekit"
)

const tickBits uint64 = 13
const tickMask uint64 = (1 << tickBits) - 1

var epoch = time.Date(2000, 0, 0, 0, 0, 0, 0, time.UTC).UnixMicro()

type TimedVersionGenerator interface {
	New() *TimedVersion
	Next() TimedVersion
}

func timedVersionComponents(v uint64) (ts int64, ticks int32) {
	return int64(v>>tickBits) + epoch, int32(v & tickMask)
}

func timedVersionFromComponents(ts int64, ticks int32) TimedVersion {
	if ts < epoch {
		ts = epoch
	}
	return TimedVersion{v: *atomic.NewUint64((uint64(ts-epoch) << tickBits) | uint64(ticks))}
}

type timedVersionGenerator struct {
	mu    sync.Mutex
	ts    int64
	ticks uint64
}

func NewDefaultTimedVersionGenerator() TimedVersionGenerator {
	return new(timedVersionGenerator)
}

func (g *timedVersionGenerator) New() *TimedVersion {
	v := g.Next()
	return &v
}

func (g *timedVersionGenerator) Next() TimedVersion {
	ts := time.Now().UnixMicro()

	g.mu.Lock()
	defer g.mu.Unlock()

	for {
		if ts < g.ts {
			ts = g.ts
		}
		if g.ts == ts {
			// if incrementing the ticks would overflow the version sleep for a
			// microsecond then try again.
			if g.ticks == tickMask {
				time.Sleep(time.Microsecond)
				ts = time.Now().UnixMicro()
				continue
			}
			g.ticks++
		} else {
			g.ts = ts
			g.ticks = 0
		}
		return timedVersionFromComponents(g.ts, int32(g.ticks))
	}
}

type TimedVersion struct {
	v atomic.Uint64
}

func NewTimedVersionFromProto(proto *livekit.TimedVersion) *TimedVersion {
	v := timedVersionFromComponents(proto.GetUnixMicro(), proto.GetTicks())
	return &v
}

func NewTimedVersionFromTime(t time.Time) *TimedVersion {
	v := timedVersionFromComponents(t.UnixMicro(), 0)
	return &v
}

func TimedVersionFromProto(proto *livekit.TimedVersion) TimedVersion {
	return timedVersionFromComponents(proto.GetUnixMicro(), proto.GetTicks())
}

func TimedVersionFromTime(t time.Time) TimedVersion {
	return timedVersionFromComponents(t.UnixMicro(), 0)
}

func (t *TimedVersion) Update(other *TimedVersion) bool {
	return t.Upgrade(other)
}

func (t *TimedVersion) Upgrade(other *TimedVersion) bool {
	return t.update(other, func(ov, prev uint64) bool { return ov > prev })
}

func (t *TimedVersion) Downgrade(other *TimedVersion) bool {
	return t.update(other, func(ov, prev uint64) bool { return ov < prev })
}

func (t *TimedVersion) update(other *TimedVersion, cmp func(ov, prev uint64) bool) bool {
	ov := other.v.Load()
	for {
		prev := t.v.Load()
		if !cmp(ov, prev) {
			return false
		}
		if t.v.CompareAndSwap(prev, ov) {
			return true
		}
	}
}

func (t *TimedVersion) Store(other *TimedVersion) {
	t.v.Store(other.v.Load())
}

func (t *TimedVersion) Load() TimedVersion {
	return TimedVersion{v: *atomic.NewUint64(t.v.Load())}
}

func (t *TimedVersion) After(other *TimedVersion) bool {
	return t.v.Load() > other.v.Load()
}

func (t *TimedVersion) Compare(other *TimedVersion) int {
	ov := other.v.Load()
	v := t.v.Load()
	if v < ov {
		return -1
	}
	if v == ov {
		return 0
	}
	return 1
}

func (t *TimedVersion) IsZero() bool {
	return t.v.Load() == 0
}

func (t *TimedVersion) ToProto() *livekit.TimedVersion {
	ts, ticks := timedVersionComponents(t.v.Load())
	return &livekit.TimedVersion{
		UnixMicro: ts,
		Ticks:     ticks,
	}
}

func (t *TimedVersion) Time() time.Time {
	ts, _ := timedVersionComponents(t.v.Load())
	return time.UnixMicro(ts)
}

func (t *TimedVersion) String() string {
	ts, ticks := timedVersionComponents(t.v.Load())
	return fmt.Sprintf("%d.%d", ts, ticks)
}

func (t TimedVersion) Value() (driver.Value, error) {
	if t.IsZero() {
		return nil, nil
	}

	ts, ticks := timedVersionComponents(t.v.Load())
	b := make([]byte, 0, 12)
	b = binary.BigEndian.AppendUint64(b, uint64(ts))
	b = binary.BigEndian.AppendUint32(b, uint32(ticks))
	return b, nil
}

func (t *TimedVersion) Scan(src interface{}) (err error) {
	switch b := src.(type) {
	case []byte:
		switch len(b) {
		case 0:
			t.v.Store(0)
		case 12:
			ts := int64(binary.BigEndian.Uint64(b))
			ticks := int32(binary.BigEndian.Uint32(b[8:]))
			*t = timedVersionFromComponents(ts, ticks)
		default:
			return errors.New("(*TimedVersion).Scan: unsupported format")
		}
	case nil:
		t.v.Store(0)
	default:
		return errors.New("(*TimedVersion).Scan: unsupported data type")
	}
	return nil
}
