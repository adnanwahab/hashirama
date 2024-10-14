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

	"google.golang.org/protobuf/proto"
)

const (
	DefaultChannelSize = 100
)

type MessageBus interface {
	Publish(ctx context.Context, channel string, msg proto.Message) error
	Subscribe(ctx context.Context, channel string, channelSize int) (Reader, error)
	SubscribeQueue(ctx context.Context, channel string, channelSize int) (Reader, error)
}

type Reader interface {
	read() ([]byte, bool)
	Close() error
}

func Subscribe[MessageType proto.Message](
	ctx context.Context,
	bus MessageBus,
	channel string,
	channelSize int,
) (Subscription[MessageType], error) {

	sub, err := bus.Subscribe(ctx, channel, channelSize)
	if err != nil {
		return nil, err
	}

	return newSubscription[MessageType](sub, channelSize), nil
}

func SubscribeQueue[MessageType proto.Message](
	ctx context.Context,
	bus MessageBus,
	channel string,
	channelSize int,
) (Subscription[MessageType], error) {

	sub, err := bus.SubscribeQueue(ctx, channel, channelSize)
	if err != nil {
		return nil, err
	}

	return newSubscription[MessageType](sub, channelSize), nil
}
