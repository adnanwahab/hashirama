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

type PublishInterceptor func(next PublishHandler) PublishHandler
type SubscribeInterceptor func(ctx context.Context, channel string, next ReadHandler) ReadHandler

type PublishHandler func(ctx context.Context, channel string, msg proto.Message) error
type ReadHandler func() ([]byte, bool)

type TestBusOption func(*TestBusOpts)

type TestBusOpts struct {
	PublishInterceptors   []PublishInterceptor
	SubscribeInterceptors []SubscribeInterceptor
}

func NewTestBus(bus MessageBus, opts ...TestBusOption) MessageBus {
	o := &TestBusOpts{}
	for _, opt := range opts {
		opt(o)
	}

	var publishHandler PublishHandler = bus.Publish
	for i := len(o.PublishInterceptors) - 1; i >= 0; i-- {
		publishHandler = o.PublishInterceptors[i](publishHandler)
	}

	return &testBus{
		bus:                   bus,
		publishHandler:        publishHandler,
		subscribeInterceptors: o.SubscribeInterceptors,
	}
}

type testBus struct {
	bus                   MessageBus
	publishHandler        PublishHandler
	subscribeInterceptors []SubscribeInterceptor
}

func (l *testBus) Publish(ctx context.Context, channel string, msg proto.Message) error {
	return l.publishHandler(ctx, channel, msg)
}

func (l *testBus) Subscribe(ctx context.Context, channel string, size int) (Reader, error) {
	r, err := l.bus.Subscribe(ctx, channel, size)
	if err != nil {
		return nil, err
	}
	return &testReader{r, l.chainSubscribeInterceptors(ctx, channel, r.read)}, nil
}

func (l *testBus) SubscribeQueue(ctx context.Context, channel string, size int) (Reader, error) {
	r, err := l.bus.SubscribeQueue(ctx, channel, size)
	if err != nil {
		return nil, err
	}
	return &testReader{r, l.chainSubscribeInterceptors(ctx, channel, r.read)}, nil
}

func (l *testBus) chainSubscribeInterceptors(ctx context.Context, channel string, handler ReadHandler) ReadHandler {
	for i := len(l.subscribeInterceptors) - 1; i >= 0; i-- {
		handler = l.subscribeInterceptors[i](ctx, channel, handler)
	}
	return handler
}

type testReader struct {
	Reader
	readHandler ReadHandler
}

func (r *testReader) read() ([]byte, bool) {
	return r.readHandler()
}
