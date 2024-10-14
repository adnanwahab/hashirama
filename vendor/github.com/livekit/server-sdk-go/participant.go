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
	"sync"

	"go.uber.org/atomic"
	"google.golang.org/protobuf/proto"

	"github.com/livekit/protocol/livekit"
)

type Participant interface {
	SID() string
	Identity() string
	Name() string
	Kind() livekit.ParticipantInfo_Kind
	IsSpeaking() bool
	AudioLevel() float32
	Tracks() []TrackPublication
	IsCameraEnabled() bool
	IsMicrophoneEnabled() bool
	IsScreenShareEnabled() bool
	Metadata() string
	GetTrack(source livekit.TrackSource) TrackPublication
	Permissions() *livekit.ParticipantPermission

	setAudioLevel(level float32)
	setIsSpeaking(speaking bool)
	setConnectionQualityInfo(info *livekit.ConnectionQualityInfo)
}

type baseParticipant struct {
	sid               string
	identity          string
	name              string
	audioLevel        atomic.Float64
	metadata          string
	isSpeaking        atomic.Bool
	info              *livekit.ParticipantInfo
	connectionQuality *livekit.ConnectionQualityInfo
	lock              sync.RWMutex

	Callback     *ParticipantCallback
	roomCallback *RoomCallback

	audioTracks *sync.Map
	videoTracks *sync.Map
	tracks      *sync.Map
}

func newBaseParticipant(roomCallback *RoomCallback) *baseParticipant {
	p := &baseParticipant{
		audioTracks:  &sync.Map{},
		videoTracks:  &sync.Map{},
		tracks:       &sync.Map{},
		roomCallback: roomCallback,
		Callback:     NewParticipantCallback(),
	}
	// need to initialize
	p.setAudioLevel(0)
	p.setIsSpeaking(false)
	return p
}

func (p *baseParticipant) SID() string {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return p.sid
}

func (p *baseParticipant) Identity() string {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return p.identity
}

func (p *baseParticipant) Name() string {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return p.name
}

func (p *baseParticipant) Kind() livekit.ParticipantInfo_Kind {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return p.info.GetKind()
}

func (p *baseParticipant) Metadata() string {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return p.metadata
}

func (p *baseParticipant) Permissions() *livekit.ParticipantPermission {
	p.lock.RLock()
	defer p.lock.RUnlock()
	perm := p.info.GetPermission()
	if perm != nil {
		return proto.Clone(perm).(*livekit.ParticipantPermission)
	}
	return nil
}

func (p *baseParticipant) IsSpeaking() bool {
	return p.isSpeaking.Load()
}

func (p *baseParticipant) AudioLevel() float32 {
	return float32(p.audioLevel.Load())
}

func (p *baseParticipant) Tracks() []TrackPublication {
	tracks := make([]TrackPublication, 0)
	p.tracks.Range(func(_, value interface{}) bool {
		track := value.(TrackPublication)
		tracks = append(tracks, track)
		return true
	})
	return tracks
}

func (p *baseParticipant) GetTrack(source livekit.TrackSource) TrackPublication {
	var pub TrackPublication
	p.tracks.Range(func(_, value interface{}) bool {
		trackPub := value.(TrackPublication)
		if trackPub.Source() == source {
			pub = trackPub
			return false
		}
		return true
	})
	return pub
}

func (p *baseParticipant) IsCameraEnabled() bool {
	pub := p.GetTrack(livekit.TrackSource_CAMERA)
	return pub != nil && !pub.IsMuted()
}

func (p *baseParticipant) IsMicrophoneEnabled() bool {
	pub := p.GetTrack(livekit.TrackSource_MICROPHONE)
	return pub != nil && !pub.IsMuted()
}

func (p *baseParticipant) IsScreenShareEnabled() bool {
	pub := p.GetTrack(livekit.TrackSource_SCREEN_SHARE)
	return pub != nil && !pub.IsMuted()
}

func (p *baseParticipant) setAudioLevel(level float32) {
	p.audioLevel.Store(float64(level))
}

func (p *baseParticipant) setIsSpeaking(speaking bool) {
	if p.isSpeaking.Swap(speaking) == speaking {
		return
	}
	p.Callback.OnIsSpeakingChanged(p)
	p.roomCallback.OnIsSpeakingChanged(p)
}

func (p *baseParticipant) setConnectionQualityInfo(info *livekit.ConnectionQualityInfo) {
	p.lock.Lock()
	p.connectionQuality = info
	p.lock.Unlock()
	p.Callback.OnConnectionQualityChanged(info, p)
	p.roomCallback.OnConnectionQualityChanged(info, p)
}

func (p *baseParticipant) updateInfo(pi *livekit.ParticipantInfo, participant Participant) bool {
	p.lock.Lock()
	if p.info != nil && p.info.Version > pi.Version {
		// already updated with a later version
		p.lock.Unlock()
		return false
	}
	p.info = pi
	p.identity = pi.Identity
	p.sid = pi.Sid
	p.name = pi.Name
	oldMetadata := p.metadata
	p.metadata = pi.Metadata
	p.lock.Unlock()

	if oldMetadata != p.metadata {
		p.Callback.OnMetadataChanged(oldMetadata, participant)
		p.roomCallback.OnMetadataChanged(oldMetadata, participant)
	}
	return true
}

func (p *baseParticipant) addPublication(publication TrackPublication) {
	sid := publication.SID()
	p.tracks.Store(sid, publication)
	switch publication.Kind() {
	case TrackKindAudio:
		p.audioTracks.Store(sid, publication)
	case TrackKindVideo:
		p.videoTracks.Store(sid, publication)
	}
}

func (p *baseParticipant) getPublication(sid string) TrackPublication {
	p.lock.Lock()
	defer p.lock.Unlock()

	track, ok := p.tracks.Load(sid)
	if !ok {
		return nil
	}
	return track.(TrackPublication)
}
