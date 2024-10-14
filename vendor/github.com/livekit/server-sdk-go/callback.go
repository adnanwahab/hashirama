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
	"github.com/pion/webrtc/v3"

	"github.com/livekit/protocol/livekit"
)

type ParticipantCallback struct {
	// for all participants
	OnTrackMuted               func(pub TrackPublication, p Participant)
	OnTrackUnmuted             func(pub TrackPublication, p Participant)
	OnMetadataChanged          func(oldMetadata string, p Participant)
	OnIsSpeakingChanged        func(p Participant)
	OnConnectionQualityChanged func(update *livekit.ConnectionQualityInfo, p Participant)

	// for remote participants
	OnTrackSubscribed         func(track *webrtc.TrackRemote, publication *RemoteTrackPublication, rp *RemoteParticipant)
	OnTrackUnsubscribed       func(track *webrtc.TrackRemote, publication *RemoteTrackPublication, rp *RemoteParticipant)
	OnTrackSubscriptionFailed func(sid string, rp *RemoteParticipant)
	OnTrackPublished          func(publication *RemoteTrackPublication, rp *RemoteParticipant)
	OnTrackUnpublished        func(publication *RemoteTrackPublication, rp *RemoteParticipant)
	OnDataReceived            func(data []byte, rp *RemoteParticipant)
}

func NewParticipantCallback() *ParticipantCallback {
	return &ParticipantCallback{
		OnTrackMuted:               func(pub TrackPublication, p Participant) {},
		OnTrackUnmuted:             func(pub TrackPublication, p Participant) {},
		OnMetadataChanged:          func(oldMetadata string, p Participant) {},
		OnIsSpeakingChanged:        func(p Participant) {},
		OnConnectionQualityChanged: func(update *livekit.ConnectionQualityInfo, p Participant) {},
		OnTrackSubscribed:          func(track *webrtc.TrackRemote, publication *RemoteTrackPublication, rp *RemoteParticipant) {},
		OnTrackUnsubscribed:        func(track *webrtc.TrackRemote, publication *RemoteTrackPublication, rp *RemoteParticipant) {},
		OnTrackSubscriptionFailed:  func(sid string, rp *RemoteParticipant) {},
		OnTrackPublished:           func(publication *RemoteTrackPublication, rp *RemoteParticipant) {},
		OnTrackUnpublished:         func(publication *RemoteTrackPublication, rp *RemoteParticipant) {},
		OnDataReceived:             func(data []byte, rp *RemoteParticipant) {},
	}
}

func (cb *ParticipantCallback) Merge(other *ParticipantCallback) {
	if other.OnTrackMuted != nil {
		cb.OnTrackMuted = other.OnTrackMuted
	}
	if other.OnTrackUnmuted != nil {
		cb.OnTrackUnmuted = other.OnTrackUnmuted
	}
	if other.OnMetadataChanged != nil {
		cb.OnMetadataChanged = other.OnMetadataChanged
	}
	if other.OnIsSpeakingChanged != nil {
		cb.OnIsSpeakingChanged = other.OnIsSpeakingChanged
	}
	if other.OnConnectionQualityChanged != nil {
		cb.OnConnectionQualityChanged = other.OnConnectionQualityChanged
	}
	if other.OnTrackSubscribed != nil {
		cb.OnTrackSubscribed = other.OnTrackSubscribed
	}
	if other.OnTrackUnsubscribed != nil {
		cb.OnTrackUnsubscribed = other.OnTrackUnsubscribed
	}
	if other.OnTrackSubscriptionFailed != nil {
		cb.OnTrackSubscriptionFailed = other.OnTrackSubscriptionFailed
	}
	if other.OnTrackPublished != nil {
		cb.OnTrackPublished = other.OnTrackPublished
	}
	if other.OnTrackUnpublished != nil {
		cb.OnTrackUnpublished = other.OnTrackUnpublished
	}
	if other.OnDataReceived != nil {
		cb.OnDataReceived = other.OnDataReceived
	}
}

type RoomCallback struct {
	OnDisconnected            func()
	OnParticipantConnected    func(*RemoteParticipant)
	OnParticipantDisconnected func(*RemoteParticipant)
	OnActiveSpeakersChanged   func([]Participant)
	OnRoomMetadataChanged     func(metadata string)
	OnReconnecting            func()
	OnReconnected             func()

	// participant events are sent to the room as well
	ParticipantCallback
}

func NewRoomCallback() *RoomCallback {
	pc := NewParticipantCallback()
	return &RoomCallback{
		ParticipantCallback: *pc,

		OnDisconnected:            func() {},
		OnParticipantConnected:    func(participant *RemoteParticipant) {},
		OnParticipantDisconnected: func(participant *RemoteParticipant) {},
		OnActiveSpeakersChanged:   func(participants []Participant) {},
		OnRoomMetadataChanged:     func(metadata string) {},
		OnReconnecting:            func() {},
		OnReconnected:             func() {},
	}
}

func (cb *RoomCallback) Merge(other *RoomCallback) {
	if other == nil {
		return
	}

	if other.OnDisconnected != nil {
		cb.OnDisconnected = other.OnDisconnected
	}
	if other.OnParticipantConnected != nil {
		cb.OnParticipantConnected = other.OnParticipantConnected
	}
	if other.OnParticipantDisconnected != nil {
		cb.OnParticipantDisconnected = other.OnParticipantDisconnected
	}
	if other.OnActiveSpeakersChanged != nil {
		cb.OnActiveSpeakersChanged = other.OnActiveSpeakersChanged
	}
	if other.OnRoomMetadataChanged != nil {
		cb.OnRoomMetadataChanged = other.OnRoomMetadataChanged
	}
	if other.OnReconnecting != nil {
		cb.OnReconnecting = other.OnReconnecting
	}
	if other.OnReconnected != nil {
		cb.OnReconnected = other.OnReconnected
	}

	cb.ParticipantCallback.Merge(&other.ParticipantCallback)
}
