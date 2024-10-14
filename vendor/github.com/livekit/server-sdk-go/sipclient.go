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

package lksdk

import (
	"context"
	"net/http"

	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
)

type SIPClient struct {
	sipClient livekit.SIP
	authBase
}

func NewSIPClient(url string, apiKey string, secretKey string) *SIPClient {
	return &SIPClient{
		sipClient: livekit.NewSIPProtobufClient(ToHttpURL(url), &http.Client{}),
		authBase: authBase{
			apiKey:    apiKey,
			apiSecret: secretKey,
		},
	}
}

func (s *SIPClient) CreateSIPTrunk(ctx context.Context, in *livekit.CreateSIPTrunkRequest) (*livekit.SIPTrunkInfo, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.CreateSIPTrunk(ctx, in)
}

func (s *SIPClient) ListSIPTrunk(ctx context.Context, in *livekit.ListSIPTrunkRequest) (*livekit.ListSIPTrunkResponse, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.ListSIPTrunk(ctx, in)
}

func (s *SIPClient) DeleteSIPTrunk(ctx context.Context, in *livekit.DeleteSIPTrunkRequest) (*livekit.SIPTrunkInfo, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.DeleteSIPTrunk(ctx, in)
}

func (s *SIPClient) CreateSIPDispatchRule(ctx context.Context, in *livekit.CreateSIPDispatchRuleRequest) (*livekit.SIPDispatchRuleInfo, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.CreateSIPDispatchRule(ctx, in)
}

func (s *SIPClient) ListSIPDispatchRule(ctx context.Context, in *livekit.ListSIPDispatchRuleRequest) (*livekit.ListSIPDispatchRuleResponse, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.ListSIPDispatchRule(ctx, in)
}

func (s *SIPClient) DeleteSIPDispatchRule(ctx context.Context, in *livekit.DeleteSIPDispatchRuleRequest) (*livekit.SIPDispatchRuleInfo, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.DeleteSIPDispatchRule(ctx, in)
}

func (s *SIPClient) CreateSIPParticipant(ctx context.Context, in *livekit.CreateSIPParticipantRequest) (*livekit.SIPParticipantInfo, error) {
	if in == nil {
		return nil, ErrInvalidParameter
	}

	ctx, err := s.withAuth(ctx, auth.VideoGrant{})
	if err != nil {
		return nil, err
	}
	return s.sipClient.CreateSIPParticipant(ctx, in)
}
