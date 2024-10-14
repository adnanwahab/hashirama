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
	"sync/atomic"
	"time"

	"github.com/gammazero/deque"
	"github.com/livekit/protocol/logger"
)

const (
	maxOvershootFactor = 2.0
)

type PacerLeakyBucket struct {
	*Base
	logger     logger.Logger
	lock       sync.RWMutex
	bitrate    int
	interval   time.Duration
	maxLatency time.Duration

	packets    deque.Deque[*Packet]
	queueBytes int

	isStopped atomic.Bool
}

func NewPacerLeakyBucket(interval time.Duration, bitrate int, maxLatency time.Duration, logger logger.Logger) *PacerLeakyBucket {
	p := &PacerLeakyBucket{
		Base:       NewBase(logger),
		interval:   interval,
		bitrate:    bitrate,
		maxLatency: maxLatency,
		logger:     logger,
	}
	p.packets.SetMinCapacity(9)
	return p
}

func (p *PacerLeakyBucket) Start() {
	if !p.isStopped.Load() {
		go p.sendWorker()
	}
}

func (p *PacerLeakyBucket) Enqueue(pkt *Packet) {
	if p.isStopped.Load() {
		return
	}

	pktSize := pkt.getPktSize()

	p.lock.Lock()
	p.packets.PushBack(pkt)
	p.queueBytes += pktSize
	p.lock.Unlock()
}

func (p *PacerLeakyBucket) Stop() {
	p.isStopped.Store(true)
}

func (p *PacerLeakyBucket) SetBitrate(bitrate int) {
	p.lock.Lock()
	p.bitrate = bitrate
	p.lock.Unlock()
}

func (p *PacerLeakyBucket) sendWorker() {
	p.lock.RLock()
	interval := p.interval
	p.lock.RUnlock()

	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	overage := 0
	lastProcess := time.Now()

	for !p.isStopped.Load() {
		<-ticker.C
		p.lock.RLock()
		bitrate := p.bitrate
		if p.maxLatency > 0 {
			if neededBitrate := int(float64(p.queueBytes*8) / (p.maxLatency.Seconds())); neededBitrate > p.bitrate {
				bitrate = neededBitrate
			}
		}
		p.lock.RUnlock()
		elapsed := time.Since(lastProcess)

		// calculate number of bytes that can be sent in this interval
		// adjusting for overage.
		intervalBytes := int(elapsed.Seconds() * float64(bitrate) / 8.0)
		maxOvershootBytes := int(float64(intervalBytes) * maxOvershootFactor)
		toSendBytes := intervalBytes - overage
		if toSendBytes < 0 {
			// too much overage, wait for next interval
			overage = -toSendBytes
			lastProcess = time.Now()
			continue
		}

		// do not allow too much overshoot in an interval
		if toSendBytes > maxOvershootBytes {
			toSendBytes = maxOvershootBytes
		}

		for !p.isStopped.Load() {
			p.lock.Lock()
			if p.packets.Len() == 0 {
				p.lock.Unlock()
				// allow overshoot in next interval with shortage in this interval
				overage = -toSendBytes
				break
			}
			pkt := p.packets.PopFront()
			pktSize := pkt.getPktSize()
			p.queueBytes -= pktSize
			p.lock.Unlock()

			p.Base.SendPacket(pkt)
			toSendBytes -= pktSize
			if toSendBytes < 0 {
				// overage, wait for next interval
				overage = -toSendBytes
				break
			}
		}
		lastProcess = time.Now()
	}
}

// ------------------------------------------------
