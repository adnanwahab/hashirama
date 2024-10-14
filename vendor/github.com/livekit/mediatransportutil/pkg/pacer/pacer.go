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

package pacer

import (
	"sync"
	"time"

	"github.com/pion/rtp"
)

type ExtensionData struct {
	ID      uint8
	Payload []byte
}

type RTPWriter func(*rtp.Header, []byte) (int, error)

type Packet struct {
	Header             *rtp.Header
	Extensions         []ExtensionData
	Payload            []byte
	AbsSendTimeExtID   uint8
	TransportWideExtID uint8
	Writer             RTPWriter
	Pool               *sync.Pool
	PoolEntity         *[]byte

	pktSize int
}

// calculate approximate packet size
func (p *Packet) getPktSize() int {
	if p.pktSize == 0 {
		pktSize := len(p.Payload) + p.Header.MarshalSize()
		for _, ext := range p.Extensions {
			pktSize += len(ext.Payload) + 1
		}
		p.pktSize = pktSize
	}
	return p.pktSize
}

type Pacer interface {
	Start()
	Enqueue(p *Packet)
	Stop()

	SetInterval(interval time.Duration)
	SetBitrate(bitrate int)
}

// ------------------------------------------------

type Factory interface {
	NewPacer() (Pacer, error)
}
