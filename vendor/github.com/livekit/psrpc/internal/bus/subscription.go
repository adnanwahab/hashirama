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

package bus

import (
	"google.golang.org/protobuf/proto"

	"github.com/livekit/psrpc/internal/logger"
)

type Subscription[MessageType proto.Message] interface {
	Channel() <-chan MessageType
	Close() error
}

type subscription[MessageType proto.Message] struct {
	Reader
	c <-chan MessageType
}

func newSubscription[MessageType proto.Message](sub Reader, size int) Subscription[MessageType] {
	msgChan := make(chan MessageType, size)
	go func() {
		for {
			b, ok := sub.read()
			if !ok {
				close(msgChan)
				return
			}

			p, err := deserialize(b)
			if err != nil {
				logger.Error(err, "failed to deserialize message")
				continue
			}
			msgChan <- p.(MessageType)
		}
	}()

	return &subscription[MessageType]{
		Reader: sub,
		c:      msgChan,
	}
}

func (s *subscription[MessageType]) Channel() <-chan MessageType {
	return s.c
}
