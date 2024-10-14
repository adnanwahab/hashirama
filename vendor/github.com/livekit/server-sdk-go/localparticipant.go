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
	"sort"
	"time"

	"github.com/pion/webrtc/v3"
	"google.golang.org/protobuf/proto"

	"github.com/livekit/protocol/livekit"
)

const (
	trackPublishTimeout = 10 * time.Second
)

type LocalParticipant struct {
	baseParticipant
	engine *RTCEngine
}

func newLocalParticipant(engine *RTCEngine, roomcallback *RoomCallback) *LocalParticipant {
	return &LocalParticipant{
		baseParticipant: *newBaseParticipant(roomcallback),
		engine:          engine,
	}
}

func (p *LocalParticipant) PublishTrack(track webrtc.TrackLocal, opts *TrackPublicationOptions) (*LocalTrackPublication, error) {
	if opts == nil {
		opts = &TrackPublicationOptions{}
	}
	kind := KindFromRTPType(track.Kind())
	// default sources, since clients generally look for camera/mic
	if opts.Source == livekit.TrackSource_UNKNOWN {
		if kind == TrackKindVideo {
			opts.Source = livekit.TrackSource_CAMERA
		} else if kind == TrackKindAudio {
			opts.Source = livekit.TrackSource_MICROPHONE
		}
	}

	pub := NewLocalTrackPublication(kind, track, *opts, p.engine.client)
	pub.onMuteChanged = p.onTrackMuted

	req := &livekit.AddTrackRequest{
		Cid:        track.ID(),
		Name:       opts.Name,
		Source:     opts.Source,
		Type:       kind.ProtoType(),
		Width:      uint32(opts.VideoWidth),
		Height:     uint32(opts.VideoHeight),
		DisableDtx: opts.DisableDTX,
		Stereo:     opts.Stereo,
	}
	if kind == TrackKindVideo {
		// single layer
		req.Layers = []*livekit.VideoLayer{
			{
				Quality: livekit.VideoQuality_HIGH,
				Width:   uint32(opts.VideoWidth),
				Height:  uint32(opts.VideoHeight),
			},
		}
	}
	err := p.engine.client.SendRequest(&livekit.SignalRequest{
		Message: &livekit.SignalRequest_AddTrack{
			AddTrack: req,
		},
	})
	if err != nil {
		return nil, err
	}

	pubChan := p.engine.TrackPublishedChan()
	var pubRes *livekit.TrackPublishedResponse

	select {
	case pubRes = <-pubChan:
		break
	case <-time.After(trackPublishTimeout):
		return nil, ErrTrackPublishTimeout
	}

	// add transceivers
	transceiver, err := p.engine.publisher.PeerConnection().AddTransceiverFromTrack(track, webrtc.RTPTransceiverInit{
		Direction: webrtc.RTPTransceiverDirectionSendonly,
	})
	if err != nil {
		return nil, err
	}

	// LocalTrack will consume rtcp packets so we don't need to consume again
	_, isSampleTrack := track.(*LocalTrack)
	pub.setSender(transceiver.Sender(), !isSampleTrack)

	pub.updateInfo(pubRes.Track)
	p.addPublication(pub)

	p.engine.publisher.Negotiate()

	logger.Infow("published track", "name", opts.Name, "source", opts.Source.String())

	return pub, nil
}

// PublishSimulcastTrack publishes up to three layers to the server
func (p *LocalParticipant) PublishSimulcastTrack(tracks []*LocalTrack, opts *TrackPublicationOptions) (*LocalTrackPublication, error) {
	if len(tracks) == 0 {
		return nil, nil
	}

	for _, track := range tracks {
		if track.Kind() != webrtc.RTPCodecTypeVideo {
			return nil, ErrUnsupportedSimulcastKind
		}
		if track.videoLayer == nil || track.RID() == "" {
			return nil, ErrInvalidSimulcastTrack
		}
	}

	// tracks should be low to high
	sort.Slice(tracks, func(i, j int) bool {
		return tracks[i].videoLayer.Width < tracks[j].videoLayer.Width
	})

	if opts == nil {
		opts = &TrackPublicationOptions{}
	}
	// default sources, since clients generally look for camera/mic
	if opts.Source == livekit.TrackSource_UNKNOWN {
		opts.Source = livekit.TrackSource_CAMERA
	}

	mainTrack := tracks[len(tracks)-1]

	pub := NewLocalTrackPublication(KindFromRTPType(mainTrack.Kind()), nil, *opts, p.engine.client)
	pub.onMuteChanged = p.onTrackMuted

	var layers []*livekit.VideoLayer
	for _, st := range tracks {
		layers = append(layers, st.videoLayer)
	}
	err := p.engine.client.SendRequest(&livekit.SignalRequest{
		Message: &livekit.SignalRequest_AddTrack{
			AddTrack: &livekit.AddTrackRequest{
				Cid:    mainTrack.ID(),
				Name:   opts.Name,
				Source: opts.Source,
				Type:   pub.Kind().ProtoType(),
				Width:  mainTrack.videoLayer.Width,
				Height: mainTrack.videoLayer.Height,
				Layers: layers,
			},
		},
	})
	if err != nil {
		return nil, err
	}

	pubChan := p.engine.TrackPublishedChan()
	var pubRes *livekit.TrackPublishedResponse

	select {
	case pubRes = <-pubChan:
		break
	case <-time.After(trackPublishTimeout):
		return nil, ErrTrackPublishTimeout
	}

	// add transceivers
	publishPC := p.engine.publisher.PeerConnection()
	var transceiver *webrtc.RTPTransceiver
	var sender *webrtc.RTPSender
	for idx, st := range tracks {
		if idx == 0 {
			transceiver, err = publishPC.AddTransceiverFromTrack(st, webrtc.RTPTransceiverInit{
				Direction: webrtc.RTPTransceiverDirectionSendonly,
			})
			if err != nil {
				return nil, err
			}
			sender = transceiver.Sender()
			pub.setSender(sender, false)
		} else {
			if err = sender.AddEncoding(st); err != nil {
				return nil, err
			}
		}
		pub.addSimulcastTrack(st)
		st.SetTransceiver(transceiver)
	}

	pub.updateInfo(pubRes.Track)
	p.addPublication(pub)

	p.engine.publisher.Negotiate()

	logger.Infow("published simulcast track", "name", opts.Name, "source", opts.Source.String())

	return pub, nil
}

func (p *LocalParticipant) republishTracks() {
	var localPubs []*LocalTrackPublication
	p.tracks.Range(func(key, value interface{}) bool {
		track := value.(*LocalTrackPublication)

		if track.Track() != nil || len(track.simulcastTracks) > 0 {
			localPubs = append(localPubs, track)
		}
		p.tracks.Delete(key)
		return true
	})

	for _, pub := range localPubs {
		opt := pub.PublicationOptions()
		if len(pub.simulcastTracks) > 0 {
			var tracks []*LocalTrack
			for _, st := range pub.simulcastTracks {
				tracks = append(tracks, st)
			}
			p.PublishSimulcastTrack(tracks, &opt)
		} else if track := pub.TrackLocal(); track != nil {
			p.PublishTrack(track, &opt)
		} else {
			logger.Warnw("could not republish track as no track local found", nil, "track", pub.SID())
		}
	}
}

func (p *LocalParticipant) closeTracks() {
	var localPubs []*LocalTrackPublication
	p.tracks.Range(func(_, value interface{}) bool {
		track := value.(*LocalTrackPublication)
		if track.Track() != nil || len(track.simulcastTracks) > 0 {
			localPubs = append(localPubs, track)
		}
		return true
	})

	for _, pub := range localPubs {
		pub.CloseTrack()
	}
}

func (p *LocalParticipant) PublishDataPacket(userPacket *livekit.UserPacket, kind livekit.DataPacket_Kind) error {
	if userPacket == nil {
		return ErrInvalidParameter
	}
	dataPacket := &livekit.DataPacket{
		Kind: kind,
		Value: &livekit.DataPacket_User{
			User: userPacket,
		},
	}
	if err := p.engine.ensurePublisherConnected(true); err != nil {
		return err
	}

	encoded, err := proto.Marshal(dataPacket)
	if err != nil {
		return err
	}

	return p.engine.GetDataChannel(dataPacket.Kind).Send(encoded)
}

func (p *LocalParticipant) PublishData(
	data []byte,
	kind livekit.DataPacket_Kind,
	destinationSids []string,
) error {
	packet := &livekit.UserPacket{
		Payload:         data,
		DestinationSids: destinationSids,
	}

	return p.PublishDataPacket(packet, kind)
}

func (p *LocalParticipant) UnpublishTrack(sid string) error {
	obj, loaded := p.tracks.LoadAndDelete(sid)
	if !loaded {
		return ErrCannotFindTrack
	}
	p.audioTracks.Delete(sid)
	p.videoTracks.Delete(sid)

	pub, ok := obj.(*LocalTrackPublication)
	if !ok {
		return nil
	}

	var err error
	if localTrack, ok := pub.track.(webrtc.TrackLocal); ok {
		for _, sender := range p.engine.publisher.pc.GetSenders() {
			if sender.Track() == localTrack {
				err = p.engine.publisher.pc.RemoveTrack(sender)
				break
			}
		}
		p.engine.publisher.Negotiate()
	}

	pub.CloseTrack()

	return err
}

// GetSubscriberPeerConnection is a power-user API that gives access to the underlying subscriber peer connection
// subscribed tracks are received using this PeerConnection
func (p *LocalParticipant) GetSubscriberPeerConnection() *webrtc.PeerConnection {
	return p.engine.subscriber.PeerConnection()
}

// GetPublisherPeerConnection is a power-user API that gives access to the underlying publisher peer connection
// local tracks are published to server via this PeerConnection
func (p *LocalParticipant) GetPublisherPeerConnection() *webrtc.PeerConnection {
	return p.engine.publisher.PeerConnection()
}

// SetName sets the name of the current participant.
// updates will be performed only if the participant has canUpdateOwnMetadata grant
func (p *LocalParticipant) SetName(name string) {
	_ = p.engine.client.SendUpdateParticipantMetadata(&livekit.UpdateParticipantMetadata{
		Name: name,
	})
}

// SetMetadata sets the metadata of the current participant.
// updates will be performed only if the participant has canUpdateOwnMetadata grant
func (p *LocalParticipant) SetMetadata(metadata string) {
	_ = p.engine.client.SendUpdateParticipantMetadata(&livekit.UpdateParticipantMetadata{
		Metadata: metadata,
	})
}

func (p *LocalParticipant) updateInfo(info *livekit.ParticipantInfo) {
	p.baseParticipant.updateInfo(info, p)

	// detect tracks that have been muted remotely, and apply changes
	for _, ti := range info.Tracks {
		pub := p.getLocalPublication(ti.Sid)
		if pub == nil {
			continue
		}
		if pub.IsMuted() != ti.Muted {
			_ = p.engine.client.SendMuteTrack(pub.SID(), pub.IsMuted())
		}
	}
}

func (p *LocalParticipant) getLocalPublication(sid string) *LocalTrackPublication {
	if pub, ok := p.getPublication(sid).(*LocalTrackPublication); ok {
		return pub
	}
	return nil
}

func (p *LocalParticipant) onTrackMuted(pub *LocalTrackPublication, muted bool) {
	if muted {
		p.Callback.OnTrackMuted(pub, p)
		p.roomCallback.OnTrackMuted(pub, p)
	} else {
		p.Callback.OnTrackUnmuted(pub, p)
		p.roomCallback.OnTrackUnmuted(pub, p)
	}
}
