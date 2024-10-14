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
	"reflect"
	"sort"
	"strings"
	"sync"

	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v3"
	"github.com/thoas/go-funk"
	"google.golang.org/protobuf/proto"

	"github.com/livekit/mediatransportutil/pkg/pacer"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
)

// -----------------------------------------------

type SimulateScenario int

const (
	SimulateSignalReconnect SimulateScenario = iota
	SimulateForceTCP
	SimulateForceTLS
	SimulateSpeakerUpdate
	SimulateMigration
	SimulateServerLeave
	SimulateNodeFailure
)

// -----------------------------------------------

const (
	SimulateSpeakerUpdateInterval = 5
)

type TrackPubCallback func(track Track, pub TrackPublication, participant *RemoteParticipant)
type PubCallback func(pub TrackPublication, participant *RemoteParticipant)

type ParticipantKind int

const (
	ParticipantStandard = ParticipantKind(livekit.ParticipantInfo_STANDARD)
	ParticipantIngress  = ParticipantKind(livekit.ParticipantInfo_INGRESS)
	ParticipantEgress   = ParticipantKind(livekit.ParticipantInfo_EGRESS)
	ParticipantSIP      = ParticipantKind(livekit.ParticipantInfo_SIP)
	ParticipantAgent    = ParticipantKind(livekit.ParticipantInfo_AGENT)
)

type ConnectInfo struct {
	APIKey              string
	APISecret           string
	RoomName            string
	ParticipantName     string
	ParticipantIdentity string
	ParticipantKind     ParticipantKind
	ParticipantMetadata string
}

type ConnectParams struct {
	AutoSubscribe bool
	Reconnect     bool
	Callback      *RoomCallback

	RetransmitBufferSize uint16

	Pacer pacer.Factory
}

type ConnectOption func(*ConnectParams)

func WithAutoSubscribe(val bool) ConnectOption {
	return func(p *ConnectParams) {
		p.AutoSubscribe = val
	}
}

// Retransmit buffer size to reponse to nack request,
// must be one of: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
func WithRetransmitBufferSize(val uint16) ConnectOption {
	return func(p *ConnectParams) {
		p.RetransmitBufferSize = val
	}
}

func WithPacer(pacer pacer.Factory) ConnectOption {
	return func(p *ConnectParams) {
		p.Pacer = pacer
	}
}

type PLIWriter func(webrtc.SSRC)

type Room struct {
	engine           *RTCEngine
	sid              string
	name             string
	LocalParticipant *LocalParticipant
	callback         *RoomCallback

	participants   map[string]*RemoteParticipant
	metadata       string
	activeSpeakers []Participant
	serverInfo     *livekit.ServerInfo

	lock sync.RWMutex
}

// CreateRoom can be used to update callbacks before calling Join
func CreateRoom(callback *RoomCallback) *Room {
	engine := NewRTCEngine()
	r := &Room{
		engine:       engine,
		participants: make(map[string]*RemoteParticipant),
		callback:     NewRoomCallback(),
	}
	r.callback.Merge(callback)
	r.LocalParticipant = newLocalParticipant(engine, r.callback)

	// callbacks from engine
	engine.OnMediaTrack = r.handleMediaTrack
	engine.OnDisconnected = r.handleDisconnect
	engine.OnParticipantUpdate = r.handleParticipantUpdate
	engine.OnActiveSpeakersChanged = r.handleActiveSpeakerChange
	engine.OnSpeakersChanged = r.handleSpeakersChange
	engine.OnDataReceived = r.handleDataReceived
	engine.OnConnectionQuality = r.handleConnectionQualityUpdate
	engine.OnRoomUpdate = r.handleRoomUpdate
	engine.OnRestarting = r.handleRestarting
	engine.OnRestarted = r.handleRestarted
	engine.OnResuming = r.handleResuming
	engine.OnResumed = r.handleResumed
	engine.client.OnLocalTrackUnpublished = r.handleLocalTrackUnpublished
	engine.client.OnTrackRemoteMuted = r.handleTrackRemoteMuted

	return r
}

// ConnectToRoom creates and joins the room
func ConnectToRoom(url string, info ConnectInfo, callback *RoomCallback, opts ...ConnectOption) (*Room, error) {
	room := CreateRoom(callback)
	err := room.Join(url, info, opts...)
	if err != nil {
		return nil, err
	}
	return room, nil
}

// ConnectToRoomWithToken creates and joins the room
func ConnectToRoomWithToken(url, token string, callback *RoomCallback, opts ...ConnectOption) (*Room, error) {
	room := CreateRoom(callback)
	err := room.JoinWithToken(url, token, opts...)
	if err != nil {
		return nil, err
	}
	return room, nil
}

func (r *Room) Name() string {
	r.lock.RLock()
	defer r.lock.RUnlock()
	return r.name
}

func (r *Room) SID() string {
	r.lock.RLock()
	defer r.lock.RUnlock()
	return r.sid
}

// Join - joins the room as with default permissions
func (r *Room) Join(url string, info ConnectInfo, opts ...ConnectOption) error {
	var params ConnectParams
	for _, opt := range opts {
		opt(&params)
	}

	if params.Callback != nil {
		r.callback.Merge(params.Callback)
	}

	// generate token
	at := auth.NewAccessToken(info.APIKey, info.APISecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     info.RoomName,
	}
	at.AddGrant(grant).
		SetIdentity(info.ParticipantIdentity).
		SetMetadata(info.ParticipantMetadata).
		SetName(info.ParticipantName).
		SetKind(livekit.ParticipantInfo_Kind(info.ParticipantKind))

	token, err := at.ToJWT()
	if err != nil {
		return err
	}

	return r.JoinWithToken(url, token, opts...)
}

// JoinWithToken - customize participant options by generating your own token
func (r *Room) JoinWithToken(url, token string, opts ...ConnectOption) error {
	params := &ConnectParams{
		AutoSubscribe: true,
	}
	for _, opt := range opts {
		opt(params)
	}

	joinRes, err := r.engine.Join(url, token, params)
	if err != nil {
		return err
	}

	r.lock.Lock()
	r.name = joinRes.Room.Name
	r.sid = joinRes.Room.Sid
	r.metadata = joinRes.Room.Metadata
	r.serverInfo = joinRes.ServerInfo
	r.lock.Unlock()

	r.LocalParticipant.updateInfo(joinRes.Participant)

	for _, pi := range joinRes.OtherParticipants {
		r.addRemoteParticipant(pi, true)
	}

	return nil
}

func (r *Room) Disconnect() {
	_ = r.engine.client.SendLeave()
	r.engine.Close()

	r.LocalParticipant.closeTracks()
}

func (r *Room) GetParticipant(sid string) *RemoteParticipant {
	r.lock.RLock()
	defer r.lock.RUnlock()

	return r.participants[sid]
}

func (r *Room) GetParticipants() []*RemoteParticipant {
	r.lock.RLock()
	defer r.lock.RUnlock()

	var participants []*RemoteParticipant
	for _, rp := range r.participants {
		participants = append(participants, rp)
	}
	return participants
}

func (r *Room) ActiveSpeakers() []Participant {
	r.lock.RLock()
	defer r.lock.RUnlock()
	return r.activeSpeakers
}

func (r *Room) Metadata() string {
	r.lock.RLock()
	defer r.lock.RUnlock()
	return r.metadata
}

func (r *Room) ServerInfo() *livekit.ServerInfo {
	r.lock.RLock()
	defer r.lock.RUnlock()
	return proto.Clone(r.serverInfo).(*livekit.ServerInfo)
}

func (r *Room) addRemoteParticipant(pi *livekit.ParticipantInfo, updateExisting bool) *RemoteParticipant {
	r.lock.Lock()
	rp, ok := r.participants[pi.Sid]
	if ok {
		if updateExisting {
			rp.updateInfo(pi)
		}
		r.lock.Unlock()
		return rp
	}

	rp = newRemoteParticipant(pi, r.callback, r.engine.client, func(ssrc webrtc.SSRC) {
		pli := []rtcp.Packet{
			&rtcp.PictureLossIndication{SenderSSRC: uint32(ssrc), MediaSSRC: uint32(ssrc)},
		}
		_ = r.engine.subscriber.pc.WriteRTCP(pli)
	})
	r.participants[pi.Sid] = rp
	r.lock.Unlock()

	return rp
}

func (r *Room) handleMediaTrack(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
	// ensure we have the participant
	participantID, trackID := unpackStreamID(track.StreamID())
	if trackID == "" {
		trackID = track.ID()
	}

	rp := r.addRemoteParticipant(&livekit.ParticipantInfo{
		Sid: participantID,
	}, false)
	rp.addSubscribedMediaTrack(track, trackID, receiver)
}

func (r *Room) handleDisconnect() {
	r.callback.OnDisconnected()
	r.engine.Close()
}

func (r *Room) handleRestarting() {
	r.callback.OnReconnecting()

	for _, rp := range r.GetParticipants() {
		r.handleParticipantDisconnect(rp)
	}
}

func (r *Room) handleRestarted(joinRes *livekit.JoinResponse) {
	r.lock.Lock()
	r.name = joinRes.Room.Name
	r.sid = joinRes.Room.Sid
	r.metadata = joinRes.Room.Metadata
	r.lock.Unlock()

	r.LocalParticipant.updateInfo(joinRes.Participant)

	r.handleParticipantUpdate(joinRes.OtherParticipants)

	r.LocalParticipant.republishTracks()

	r.callback.OnReconnected()
}

func (r *Room) handleResuming() {
	r.callback.OnReconnecting()
}

func (r *Room) handleResumed() {
	r.callback.OnReconnected()
	r.sendSyncState()
}

func (r *Room) handleDataReceived(userPacket *livekit.UserPacket) {
	if userPacket.ParticipantSid == r.LocalParticipant.SID() {
		// if sent by itself, do not handle data
		return
	}
	p := r.GetParticipant(userPacket.ParticipantSid)
	if p != nil {
		p.Callback.OnDataReceived(userPacket.Payload, p)
	}
	r.callback.OnDataReceived(userPacket.Payload, p)
}

func (r *Room) handleParticipantUpdate(participants []*livekit.ParticipantInfo) {
	for _, pi := range participants {
		if pi.Sid == r.LocalParticipant.SID() || pi.Identity == r.LocalParticipant.Identity() {
			r.LocalParticipant.updateInfo(pi)
			continue
		}

		rp := r.GetParticipant(pi.Sid)
		isNew := rp == nil

		if pi.State == livekit.ParticipantInfo_DISCONNECTED {
			// remove
			if rp != nil {
				r.handleParticipantDisconnect(rp)
			}
		} else if isNew {
			rp = r.addRemoteParticipant(pi, true)
			go r.callback.OnParticipantConnected(rp)
		} else {
			rp.updateInfo(pi)
		}
	}
}

func (r *Room) handleParticipantDisconnect(p *RemoteParticipant) {
	r.lock.Lock()
	delete(r.participants, p.SID())
	r.lock.Unlock()

	p.unpublishAllTracks()
	go r.callback.OnParticipantDisconnected(p)
}

func (r *Room) handleActiveSpeakerChange(speakers []*livekit.SpeakerInfo) {
	var activeSpeakers []Participant
	seenSids := make(map[string]bool)
	localSID := r.LocalParticipant.SID()
	for _, s := range speakers {
		seenSids[s.Sid] = true
		if s.Sid == localSID {
			r.LocalParticipant.setAudioLevel(s.Level)
			r.LocalParticipant.setIsSpeaking(true)
			activeSpeakers = append(activeSpeakers, r.LocalParticipant)
		} else {
			p := r.GetParticipant(s.Sid)
			if p == nil {
				continue
			}
			p.setAudioLevel(s.Level)
			p.setIsSpeaking(true)
			activeSpeakers = append(activeSpeakers, p)
		}
	}

	if !seenSids[localSID] {
		r.LocalParticipant.setAudioLevel(0)
	}
	for _, rp := range r.GetParticipants() {
		if !seenSids[rp.SID()] {
			rp.setAudioLevel(0)
			rp.setIsSpeaking(false)
		}
	}
	r.lock.Lock()
	r.activeSpeakers = activeSpeakers
	r.lock.Unlock()
	go r.callback.OnActiveSpeakersChanged(activeSpeakers)
}

func (r *Room) handleSpeakersChange(speakerUpdates []*livekit.SpeakerInfo) {
	speakerMap := make(map[string]Participant)
	for _, p := range r.ActiveSpeakers() {
		speakerMap[p.SID()] = p
	}
	for _, info := range speakerUpdates {
		var participant Participant
		if info.Sid == r.LocalParticipant.SID() {
			participant = r.LocalParticipant
		} else {
			participant = r.GetParticipant(info.Sid)
		}
		if reflect.ValueOf(participant).IsNil() {
			continue
		}

		participant.setAudioLevel(info.Level)
		participant.setIsSpeaking(info.Active)

		if info.Active {
			speakerMap[info.Sid] = participant
		} else {
			delete(speakerMap, info.Sid)
		}
	}

	activeSpeakers := funk.Values(speakerMap).([]Participant)
	sort.Slice(activeSpeakers, func(i, j int) bool {
		return activeSpeakers[i].AudioLevel() > activeSpeakers[j].AudioLevel()
	})
	r.lock.Lock()
	r.activeSpeakers = activeSpeakers
	r.lock.Unlock()
	go r.callback.OnActiveSpeakersChanged(activeSpeakers)
}

func (r *Room) handleConnectionQualityUpdate(updates []*livekit.ConnectionQualityInfo) {
	for _, update := range updates {
		if update.ParticipantSid == r.LocalParticipant.SID() {
			r.LocalParticipant.setConnectionQualityInfo(update)
		} else {
			p := r.GetParticipant(update.ParticipantSid)
			if p != nil {
				p.setConnectionQualityInfo(update)
			} else {
				logger.Debugw("could not find participant", "sid", update.ParticipantSid,
					"localParticipant", r.LocalParticipant.SID())
			}
		}
	}
}

func (r *Room) handleRoomUpdate(room *livekit.Room) {
	if r.Metadata() == room.Metadata {
		return
	}
	r.lock.Lock()
	r.metadata = room.Metadata
	r.lock.Unlock()
	go r.callback.OnRoomMetadataChanged(room.Metadata)
}

func (r *Room) handleTrackRemoteMuted(msg *livekit.MuteTrackRequest) {
	for _, pub := range r.LocalParticipant.Tracks() {
		if pub.SID() == msg.Sid {
			localPub := pub.(*LocalTrackPublication)
			// TODO: pause sending data because it'll be dropped by SFU
			localPub.setMuted(msg.Muted, true)
		}
	}
}

func (r *Room) handleLocalTrackUnpublished(msg *livekit.TrackUnpublishedResponse) {
	err := r.LocalParticipant.UnpublishTrack(msg.TrackSid)
	if err != nil {
		logger.Errorw("could not unpublish track", err, "trackID", msg.TrackSid)
	}
}

func (r *Room) sendSyncState() {
	if r.engine.subscriber == nil || r.engine.subscriber.pc.RemoteDescription() == nil {
		return
	}

	previousSdp := r.engine.subscriber.pc.LocalDescription()

	var trackSids []string
	sendUnsub := r.engine.connParams.AutoSubscribe
	for _, rp := range r.GetParticipants() {
		for _, t := range rp.Tracks() {
			if t.IsSubscribed() != sendUnsub {
				trackSids = append(trackSids, t.SID())
			}
		}
	}

	var publishedTracks []*livekit.TrackPublishedResponse
	for _, t := range r.LocalParticipant.Tracks() {
		if t.Track() != nil {
			publishedTracks = append(publishedTracks, &livekit.TrackPublishedResponse{
				Cid:   t.Track().ID(),
				Track: t.TrackInfo(),
			})
		}
	}

	var dataChannels []*livekit.DataChannelInfo
	getDCinfo := func(dc *webrtc.DataChannel, target livekit.SignalTarget) {
		if dc != nil && dc.ID() != nil {
			dataChannels = append(dataChannels, &livekit.DataChannelInfo{
				Label:  dc.Label(),
				Id:     uint32(*dc.ID()),
				Target: target,
			})
		}
	}

	getDCinfo(r.engine.GetDataChannel(livekit.DataPacket_RELIABLE), livekit.SignalTarget_PUBLISHER)
	getDCinfo(r.engine.GetDataChannel(livekit.DataPacket_LOSSY), livekit.SignalTarget_PUBLISHER)
	getDCinfo(r.engine.GetDataChannelSub(livekit.DataPacket_RELIABLE), livekit.SignalTarget_SUBSCRIBER)
	getDCinfo(r.engine.GetDataChannelSub(livekit.DataPacket_LOSSY), livekit.SignalTarget_SUBSCRIBER)

	r.engine.client.SendSyncState(&livekit.SyncState{
		Answer: ToProtoSessionDescription(*previousSdp),
		Subscription: &livekit.UpdateSubscription{
			TrackSids: trackSids,
			Subscribe: !sendUnsub,
		},
		PublishTracks: publishedTracks,
		DataChannels:  dataChannels,
	})
}

func (r *Room) Simulate(scenario SimulateScenario) {
	switch scenario {
	case SimulateSignalReconnect:
		r.engine.client.Close()
	case SimulateForceTCP:
		// pion does not support active tcp candidate, skip
	case SimulateForceTLS:
		req := &livekit.SignalRequest{
			Message: &livekit.SignalRequest_Simulate{
				Simulate: &livekit.SimulateScenario{
					Scenario: &livekit.SimulateScenario_SwitchCandidateProtocol{
						SwitchCandidateProtocol: livekit.CandidateProtocol_TLS,
					},
				},
			},
		}
		r.engine.client.SendRequest(req)
		r.engine.client.OnLeave(&livekit.LeaveRequest{CanReconnect: true, Reason: livekit.DisconnectReason_CLIENT_INITIATED})
	case SimulateSpeakerUpdate:
		r.engine.client.SendRequest(&livekit.SignalRequest{
			Message: &livekit.SignalRequest_Simulate{
				Simulate: &livekit.SimulateScenario{
					Scenario: &livekit.SimulateScenario_SpeakerUpdate{
						SpeakerUpdate: SimulateSpeakerUpdateInterval,
					},
				},
			},
		})
	case SimulateMigration:
		r.engine.client.SendRequest(&livekit.SignalRequest{
			Message: &livekit.SignalRequest_Simulate{
				Simulate: &livekit.SimulateScenario{
					Scenario: &livekit.SimulateScenario_Migration{
						Migration: true,
					},
				},
			},
		})
	case SimulateServerLeave:
		r.engine.client.SendRequest(&livekit.SignalRequest{
			Message: &livekit.SignalRequest_Simulate{
				Simulate: &livekit.SimulateScenario{
					Scenario: &livekit.SimulateScenario_ServerLeave{
						ServerLeave: true,
					},
				},
			},
		})
	case SimulateNodeFailure:
		r.engine.client.SendRequest(&livekit.SignalRequest{
			Message: &livekit.SignalRequest_Simulate{
				Simulate: &livekit.SimulateScenario{
					Scenario: &livekit.SimulateScenario_NodeFailure{
						NodeFailure: true,
					},
				},
			},
		})
	}
}

func unpackStreamID(packed string) (participantId string, trackId string) {
	parts := strings.Split(packed, "|")
	if len(parts) > 1 {
		return parts[0], packed[len(parts[0])+1:]
	}
	return packed, ""
}
