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
	"time"

	"google.golang.org/protobuf/proto"
)

const DefaultServerTimeout = time.Second * 3

type ServerOption func(*ServerOpts)

type ServerOpts struct {
	ServerID           string
	Timeout            time.Duration
	ChannelSize        int
	Interceptors       []ServerRPCInterceptor
	StreamInterceptors []StreamInterceptor
	ChainedInterceptor ServerRPCInterceptor
}

func WithServerID(id string) ServerOption {
	return func(o *ServerOpts) {
		o.ServerID = id
	}
}

func WithServerTimeout(timeout time.Duration) ServerOption {
	return func(o *ServerOpts) {
		o.Timeout = timeout
	}
}

func WithServerChannelSize(size int) ServerOption {
	return func(o *ServerOpts) {
		if size > 0 {
			o.ChannelSize = size
		}
	}
}

// Server interceptors wrap the service implementation
type ServerRPCInterceptor func(ctx context.Context, req proto.Message, info RPCInfo, handler ServerRPCHandler) (proto.Message, error)
type ServerRPCHandler func(context.Context, proto.Message) (proto.Message, error)

func WithServerRPCInterceptors(interceptors ...ServerRPCInterceptor) ServerOption {
	return func(o *ServerOpts) {
		for _, interceptor := range interceptors {
			if interceptor != nil {
				o.Interceptors = append(o.Interceptors, interceptor)
			}
		}
	}
}

func WithServerStreamInterceptors(interceptors ...StreamInterceptor) ServerOption {
	return func(o *ServerOpts) {
		o.StreamInterceptors = append(o.StreamInterceptors, interceptors...)
	}
}

func WithServerOptions(opts ...ServerOption) ServerOption {
	return func(o *ServerOpts) {
		for _, opt := range opts {
			opt(o)
		}
	}
}
