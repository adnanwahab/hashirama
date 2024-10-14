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

package livekit

type TrackID string
type ParticipantID string
type ParticipantIdentity string
type ParticipantName string
type RoomID string
type RoomName string
type ConnectionID string
type NodeID string
type ParticipantKey string

type stringTypes interface {
	ParticipantID | RoomID | TrackID | ParticipantIdentity | ParticipantName | RoomName | ConnectionID | NodeID | ParticipantKey
}

func IDsAsStrings[T stringTypes](ids []T) []string {
	strs := make([]string, 0, len(ids))
	for _, id := range ids {
		strs = append(strs, string(id))
	}
	return strs
}

func StringsAsIDs[T stringTypes](ids []string) []T {
	asID := make([]T, 0, len(ids))
	for _, id := range ids {
		asID = append(asID, T(id))
	}

	return asID
}

type Guid interface {
	TrackID | ParticipantID | RoomID
}

type GuidBlock [9]byte
