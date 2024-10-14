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

package sdp

import (
	"strings"

	"github.com/pion/sdp/v3"
	"github.com/pion/webrtc/v3"
)

func GetMidValue(media *sdp.MediaDescription) string {
	for _, attr := range media.Attributes {
		if attr.Key == sdp.AttrKeyMID {
			return attr.Value
		}
	}
	return ""
}

func ExtractFingerprint(desc *sdp.SessionDescription) (string, string, error) {
	fingerprints := make([]string, 0)

	if fingerprint, haveFingerprint := desc.Attribute("fingerprint"); haveFingerprint {
		fingerprints = append(fingerprints, fingerprint)
	}

	for _, m := range desc.MediaDescriptions {
		if fingerprint, haveFingerprint := m.Attribute("fingerprint"); haveFingerprint {
			fingerprints = append(fingerprints, fingerprint)
		}
	}

	if len(fingerprints) < 1 {
		return "", "", webrtc.ErrSessionDescriptionNoFingerprint
	}

	for _, m := range fingerprints {
		if m != fingerprints[0] {
			return "", "", webrtc.ErrSessionDescriptionConflictingFingerprints
		}
	}

	parts := strings.Split(fingerprints[0], " ")
	if len(parts) != 2 {
		return "", "", webrtc.ErrSessionDescriptionInvalidFingerprint
	}
	return parts[1], parts[0], nil
}

func ExtractDTLSRole(desc *sdp.SessionDescription) webrtc.DTLSRole {
	for _, md := range desc.MediaDescriptions {
		setup, ok := md.Attribute(sdp.AttrKeyConnectionSetup)
		if !ok {
			continue
		}

		if setup == sdp.ConnectionRoleActive.String() {
			return webrtc.DTLSRoleClient
		}

		if setup == sdp.ConnectionRolePassive.String() {
			return webrtc.DTLSRoleServer
		}
	}

	//
	// If 'setup' attribute is not available, use client role
	// as that is the default behaviour of answerers
	//
	// There seems to be some differences in how role is decided.
	// libwebrtc (Chrome) code - (https://source.chromium.org/chromium/chromium/src/+/main:third_party/webrtc/pc/jsep_transport.cc;l=592;drc=369fb686729e7eb20d2bd09717cec14269a399d7)
	// does not mention anything about ICE role when determining
	// DTLS Role.
	//
	// But, ORTC has this - https://github.com/w3c/ortc/issues/167#issuecomment-69409953
	// and pion/webrtc follows that (https://github.com/pion/webrtc/blob/e071a4eded1efd5d9b401bcfc4efacb3a2a5a53c/dtlstransport.go#L269)
	//
	// So if remote is ice-lite, pion will use DTLSRoleServer when answering
	// while browsers pick DTLSRoleClient.
	//
	return webrtc.DTLSRoleClient
}

func ExtractICECredential(desc *sdp.SessionDescription) (string, string, error) {
	remotePwds := []string{}
	remoteUfrags := []string{}

	if ufrag, haveUfrag := desc.Attribute("ice-ufrag"); haveUfrag {
		remoteUfrags = append(remoteUfrags, ufrag)
	}
	if pwd, havePwd := desc.Attribute("ice-pwd"); havePwd {
		remotePwds = append(remotePwds, pwd)
	}

	for _, m := range desc.MediaDescriptions {
		if ufrag, haveUfrag := m.Attribute("ice-ufrag"); haveUfrag {
			remoteUfrags = append(remoteUfrags, ufrag)
		}
		if pwd, havePwd := m.Attribute("ice-pwd"); havePwd {
			remotePwds = append(remotePwds, pwd)
		}
	}

	if len(remoteUfrags) == 0 {
		return "", "", webrtc.ErrSessionDescriptionMissingIceUfrag
	} else if len(remotePwds) == 0 {
		return "", "", webrtc.ErrSessionDescriptionMissingIcePwd
	}

	for _, m := range remoteUfrags {
		if m != remoteUfrags[0] {
			return "", "", webrtc.ErrSessionDescriptionConflictingIceUfrag
		}
	}

	for _, m := range remotePwds {
		if m != remotePwds[0] {
			return "", "", webrtc.ErrSessionDescriptionConflictingIcePwd
		}
	}

	return remoteUfrags[0], remotePwds[0], nil
}

func ExtractStreamID(media *sdp.MediaDescription) (string, bool) {
	var streamID string
	msid, ok := media.Attribute(sdp.AttrKeyMsid)
	if !ok {
		return "", false
	}
	ids := strings.Split(msid, " ")
	if len(ids) < 2 {
		streamID = msid
	} else {
		streamID = ids[1]
	}
	return streamID, true
}
