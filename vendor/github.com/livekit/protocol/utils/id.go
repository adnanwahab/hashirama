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

package utils

import (
	"crypto/sha1"
	"fmt"
	"os"

	"github.com/jxskiss/base62"
	"github.com/lithammer/shortuuid/v4"

	"github.com/livekit/protocol/livekit"
)

const GuidSize = 12

const (
	RoomPrefix            = "RM_"
	NodePrefix            = "ND_"
	ParticipantPrefix     = "PA_"
	TrackPrefix           = "TR_"
	APIKeyPrefix          = "API"
	EgressPrefix          = "EG_"
	IngressPrefix         = "IN_"
	SIPTrunkPrefix        = "ST_"
	SIPDispatchRulePrefix = "SDR_"
	RPCPrefix             = "RPC_"
	WHIPResourcePrefix    = "WH_"
	RTMPResourcePrefix    = "RT_"
	URLResourcePrefix     = "UR_"
)

func NewGuid(prefix string) string {
	return prefix + shortuuid.New()[:GuidSize]
}

// Creates a hashed ID from a unique string
func HashedID(id string) string {
	h := sha1.New()
	h.Write([]byte(id))
	val := h.Sum(nil)

	return base62.EncodeToString(val)
}

func LocalNodeID() (string, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%s", NodePrefix, HashedID(hostname)[:8]), nil
}

var b62Index = newB62Index()
var b62Chars = []byte(shortuuid.DefaultAlphabet)

func newB62Index() [256]byte {
	var index [256]byte
	for i := 0; i < len(b62Chars); i++ {
		index[b62Chars[i]] = byte(i)
	}
	return index
}

func guidPrefix[T livekit.Guid]() string {
	var id T
	switch any(id).(type) {
	case livekit.TrackID:
		return TrackPrefix
	case livekit.ParticipantID:
		return ParticipantPrefix
	case livekit.RoomID:
		return RoomPrefix
	default:
		panic("unreachable")
	}
}

func MarshalGuid[T livekit.Guid](id T) livekit.GuidBlock {
	var b livekit.GuidBlock
	idb := []byte(id)[len(id)-GuidSize:]
	for i := 0; i < 3; i++ {
		j := i * 3
		k := i * 4
		b[j] = b62Index[idb[k]]<<2 | b62Index[idb[k+1]]>>4
		b[j+1] = b62Index[idb[k+1]]<<4 | b62Index[idb[k+2]]>>2
		b[j+2] = b62Index[idb[k+2]]<<6 | b62Index[idb[k+3]]
	}
	return b
}

func UnmarshalGuid[T livekit.Guid](b livekit.GuidBlock) T {
	prefix := guidPrefix[T]()
	id := make([]byte, len(prefix)+GuidSize)
	copy(id, []byte(prefix))
	idb := id[len(prefix):]
	for i := 0; i < 3; i++ {
		j := i * 3
		k := i * 4
		idb[k] = b62Chars[b[j]>>2]
		idb[k+1] = b62Chars[(b[j]&3)<<4|b[j+1]>>4]
		idb[k+2] = b62Chars[(b[j+1]&15)<<2|b[j+2]>>6]
		idb[k+3] = b62Chars[b[j+2]&63]
	}
	return T(id)
}
