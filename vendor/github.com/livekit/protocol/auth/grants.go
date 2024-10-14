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

package auth

import (
	"strings"

	"golang.org/x/exp/slices"

	"github.com/livekit/protocol/livekit"
)

type VideoGrant struct {
	// actions on rooms
	RoomCreate bool `json:"roomCreate,omitempty"`
	RoomList   bool `json:"roomList,omitempty"`
	RoomRecord bool `json:"roomRecord,omitempty"`

	// actions on a particular room
	RoomAdmin bool   `json:"roomAdmin,omitempty"`
	RoomJoin  bool   `json:"roomJoin,omitempty"`
	Room      string `json:"room,omitempty"`

	// permissions within a room, if none of the permissions are set explicitly
	// it will be granted with all publish and subscribe permissions
	CanPublish     *bool `json:"canPublish,omitempty"`
	CanSubscribe   *bool `json:"canSubscribe,omitempty"`
	CanPublishData *bool `json:"canPublishData,omitempty"`
	// TrackSource types that a participant may publish.
	// When set, it supersedes CanPublish. Only sources explicitly set here can be published
	CanPublishSources []string `json:"canPublishSources,omitempty"` // keys keep track of each source
	// by default, a participant is not allowed to update its own metadata
	CanUpdateOwnMetadata *bool `json:"canUpdateOwnMetadata,omitempty"`

	// actions on ingresses
	IngressAdmin bool `json:"ingressAdmin,omitempty"` // applies to all ingress

	// participant is not visible to other participants
	Hidden bool `json:"hidden,omitempty"`
	// indicates to the room that current participant is a recorder
	Recorder bool `json:"recorder,omitempty"`
	// indicates that the holder can register as an Agent framework worker
	// it is also set on all participants that are joining as Agent
	Agent bool `json:"agent,omitempty"`
}

type ClaimGrants struct {
	Identity string      `json:"-"`
	Name     string      `json:"name,omitempty"`
	Kind     string      `json:"kind,omitempty"`
	Video    *VideoGrant `json:"video,omitempty"`
	// for verifying integrity of the message body
	Sha256   string `json:"sha256,omitempty"`
	Metadata string `json:"metadata,omitempty"`
}

func (c *ClaimGrants) SetParticipantKind(kind livekit.ParticipantInfo_Kind) {
	c.Kind = kindFromProto(kind)
}

func (c *ClaimGrants) GetParticipantKind() livekit.ParticipantInfo_Kind {
	return kindToProto(c.Kind)
}

func (c *ClaimGrants) Clone() *ClaimGrants {
	if c == nil {
		return nil
	}

	clone := *c
	clone.Video = c.Video.Clone()

	return &clone
}

func (v *VideoGrant) SetCanPublish(val bool) {
	v.CanPublish = &val
}

func (v *VideoGrant) SetCanPublishData(val bool) {
	v.CanPublishData = &val
}

func (v *VideoGrant) SetCanSubscribe(val bool) {
	v.CanSubscribe = &val
}

func (v *VideoGrant) SetCanPublishSources(sources []livekit.TrackSource) {
	v.CanPublishSources = make([]string, 0, len(sources))
	for _, s := range sources {
		v.CanPublishSources = append(v.CanPublishSources, sourceToString(s))
	}
}

func (v *VideoGrant) SetCanUpdateOwnMetadata(val bool) {
	v.CanUpdateOwnMetadata = &val
}

func (v *VideoGrant) GetCanPublish() bool {
	if v.CanPublish == nil {
		return true
	}
	return *v.CanPublish
}

func (v *VideoGrant) GetCanPublishSource(source livekit.TrackSource) bool {
	if !v.GetCanPublish() {
		return false
	}
	// don't differentiate between nil and unset, since that distinction doesn't survive serialization
	if len(v.CanPublishSources) == 0 {
		return true
	}
	sourceStr := sourceToString(source)
	for _, s := range v.CanPublishSources {
		if s == sourceStr {
			return true
		}
	}
	return false
}

func (v *VideoGrant) GetCanPublishSources() []livekit.TrackSource {
	if len(v.CanPublishSources) == 0 {
		return nil
	}

	sources := make([]livekit.TrackSource, 0, len(v.CanPublishSources))
	for _, s := range v.CanPublishSources {
		sources = append(sources, sourceToProto(s))
	}
	return sources
}

func (v *VideoGrant) GetCanPublishData() bool {
	if v.CanPublishData == nil {
		return v.GetCanPublish()
	}
	return *v.CanPublishData
}

func (v *VideoGrant) GetCanSubscribe() bool {
	if v.CanSubscribe == nil {
		return true
	}
	return *v.CanSubscribe
}

func (v *VideoGrant) GetCanUpdateOwnMetadata() bool {
	if v.CanUpdateOwnMetadata == nil {
		return false
	}
	return *v.CanUpdateOwnMetadata
}

func (v *VideoGrant) MatchesPermission(permission *livekit.ParticipantPermission) bool {
	if permission == nil {
		return false
	}

	if v.GetCanPublish() != permission.CanPublish {
		return false
	}
	if v.GetCanPublishData() != permission.CanPublishData {
		return false
	}
	if v.GetCanSubscribe() != permission.CanSubscribe {
		return false
	}
	if v.GetCanUpdateOwnMetadata() != permission.CanUpdateMetadata {
		return false
	}
	if v.Hidden != permission.Hidden {
		return false
	}
	if v.Recorder != permission.Recorder {
		return false
	}
	if v.Agent != permission.Agent {
		return false
	}
	if !slices.Equal(v.GetCanPublishSources(), permission.CanPublishSources) {
		return false
	}

	return true
}

func (v *VideoGrant) UpdateFromPermission(permission *livekit.ParticipantPermission) {
	if permission == nil {
		return
	}

	v.SetCanPublish(permission.CanPublish)
	v.SetCanPublishData(permission.CanPublishData)
	v.SetCanPublishSources(permission.CanPublishSources)
	v.SetCanSubscribe(permission.CanSubscribe)
	v.SetCanUpdateOwnMetadata(permission.CanUpdateMetadata)
	v.Hidden = permission.Hidden
	v.Recorder = permission.Recorder
	v.Agent = permission.Agent
}

func (v *VideoGrant) ToPermission() *livekit.ParticipantPermission {
	pp := &livekit.ParticipantPermission{
		CanPublish:        v.GetCanPublish(),
		CanPublishData:    v.GetCanPublishData(),
		CanSubscribe:      v.GetCanSubscribe(),
		CanPublishSources: v.GetCanPublishSources(),
		CanUpdateMetadata: v.GetCanUpdateOwnMetadata(),
		Hidden:            v.Hidden,
		Recorder:          v.Recorder,
		Agent:             v.Agent,
	}
	return pp
}

func (v *VideoGrant) Clone() *VideoGrant {
	if v == nil {
		return nil
	}

	clone := *v

	if v.CanPublish != nil {
		canPublish := *v.CanPublish
		clone.CanPublish = &canPublish
	}

	if v.CanSubscribe != nil {
		canSubscribe := *v.CanSubscribe
		clone.CanSubscribe = &canSubscribe
	}

	if v.CanPublishData != nil {
		canPublishData := *v.CanPublishData
		clone.CanPublishData = &canPublishData
	}

	if v.CanPublishSources != nil {
		clone.CanPublishSources = make([]string, len(v.CanPublishSources))
		copy(clone.CanPublishSources, v.CanPublishSources)
	}

	if v.CanUpdateOwnMetadata != nil {
		canUpdateOwnMetadata := *v.CanUpdateOwnMetadata
		clone.CanUpdateOwnMetadata = &canUpdateOwnMetadata
	}

	return &clone
}

func sourceToString(source livekit.TrackSource) string {
	return strings.ToLower(source.String())
}

func sourceToProto(sourceStr string) livekit.TrackSource {
	switch sourceStr {
	case "camera":
		return livekit.TrackSource_CAMERA
	case "microphone":
		return livekit.TrackSource_MICROPHONE
	case "screen_share":
		return livekit.TrackSource_SCREEN_SHARE
	case "screen_share_audio":
		return livekit.TrackSource_SCREEN_SHARE_AUDIO
	default:
		return livekit.TrackSource_UNKNOWN
	}
}

func kindFromProto(source livekit.ParticipantInfo_Kind) string {
	return strings.ToLower(source.String())
}

func kindToProto(sourceStr string) livekit.ParticipantInfo_Kind {
	switch sourceStr {
	case "", "standard":
		return livekit.ParticipantInfo_STANDARD
	case "ingress":
		return livekit.ParticipantInfo_INGRESS
	case "egress":
		return livekit.ParticipantInfo_EGRESS
	case "sip":
		return livekit.ParticipantInfo_SIP
	case "agent":
		return livekit.ParticipantInfo_AGENT
	default:
		return livekit.ParticipantInfo_STANDARD
	}
}
