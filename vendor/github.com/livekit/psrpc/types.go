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

package psrpc

import (
	"context"

	"google.golang.org/protobuf/proto"

	"github.com/livekit/psrpc/internal/bus"
)

type Subscription[MessageType proto.Message] bus.Subscription[MessageType]

type Response[ResponseType proto.Message] struct {
	Result ResponseType
	Err    error
}

type Stream[SendType, RecvType proto.Message] interface {
	Context() context.Context
	Channel() <-chan RecvType
	Send(msg SendType, opts ...StreamOption) error
	Close(cause error) error
	Err() error
}

type ClientStream[SendType, RecvType proto.Message] interface {
	Stream[SendType, RecvType]
}

type ServerStream[SendType, RecvType proto.Message] interface {
	Stream[SendType, RecvType]
	Hijack()
}
