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
	"time"

	"google.golang.org/protobuf/proto"
)

type StreamOption func(*StreamOpts)

type StreamOpts struct {
	Timeout time.Duration
}

func WithTimeout(timeout time.Duration) StreamOption {
	return func(o *StreamOpts) {
		o.Timeout = timeout
	}
}

type StreamInterceptor func(info RPCInfo, next StreamHandler) StreamHandler
type StreamHandler interface {
	Recv(msg proto.Message) error
	Send(msg proto.Message, opts ...StreamOption) error
	Close(cause error) error
}
