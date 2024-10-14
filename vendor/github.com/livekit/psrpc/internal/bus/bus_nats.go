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
	"context"

	"github.com/nats-io/nats.go"
	"google.golang.org/protobuf/proto"
)

type natsMessageBus struct {
	nc *nats.Conn
}

func NewNatsMessageBus(nc *nats.Conn) MessageBus {
	return &natsMessageBus{
		nc: nc,
	}
}

func (n *natsMessageBus) Publish(_ context.Context, channel string, msg proto.Message) error {
	b, err := serialize(msg)
	if err != nil {
		return err
	}

	return n.nc.Publish(channel, b)
}

func (n *natsMessageBus) Subscribe(_ context.Context, channel string, size int) (Reader, error) {
	msgChan := make(chan *nats.Msg, size)
	sub, err := n.nc.ChanSubscribe(channel, msgChan)
	if err != nil {
		return nil, err
	}

	return &natsSubscription{
		sub:     sub,
		msgChan: msgChan,
	}, nil
}

func (n *natsMessageBus) SubscribeQueue(_ context.Context, channel string, size int) (Reader, error) {
	msgChan := make(chan *nats.Msg, size)
	sub, err := n.nc.ChanQueueSubscribe(channel, "bus", msgChan)
	if err != nil {
		return nil, err
	}

	return &natsSubscription{
		sub:     sub,
		msgChan: msgChan,
	}, nil
}

type natsSubscription struct {
	sub     *nats.Subscription
	msgChan chan *nats.Msg
}

func (n *natsSubscription) read() ([]byte, bool) {
	msg, ok := <-n.msgChan
	if !ok {
		return nil, false
	}
	return msg.Data, true
}

func (n *natsSubscription) Close() error {
	err := n.sub.Unsubscribe()
	close(n.msgChan)
	return err
}
