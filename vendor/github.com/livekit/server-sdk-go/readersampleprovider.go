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
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v3"
	"github.com/pion/webrtc/v3/pkg/media"
	"github.com/pion/webrtc/v3/pkg/media/h264reader"
	"github.com/pion/webrtc/v3/pkg/media/ivfreader"
	"github.com/pion/webrtc/v3/pkg/media/oggreader"
)

const (
	// defaults to 30 fps
	defaultH264FrameDuration = 33 * time.Millisecond
	defaultOpusFrameDuration = 20 * time.Millisecond
)

// ReaderSampleProvider provides samples by reading from an io.ReadCloser implementation
type ReaderSampleProvider struct {
	// Configuration
	Mime            string
	FrameDuration   time.Duration
	OnWriteComplete func()
	AudioLevel      uint8
	trackOpts       []LocalTrackOptions

	// Allow various types of ingress
	reader io.ReadCloser

	// for vp8/vp9
	ivfReader     *ivfreader.IVFReader
	ivfTimebase   float64
	lastTimestamp uint64

	// for h264
	h264reader *h264reader.H264Reader

	// for ogg
	oggReader   *oggreader.OggReader
	lastGranule uint64
}

type ReaderSampleProviderOption func(*ReaderSampleProvider)

func ReaderTrackWithMime(mime string) func(provider *ReaderSampleProvider) {
	return func(provider *ReaderSampleProvider) {
		provider.Mime = mime
	}
}

func ReaderTrackWithFrameDuration(duration time.Duration) func(provider *ReaderSampleProvider) {
	return func(provider *ReaderSampleProvider) {
		provider.FrameDuration = duration
	}
}

func ReaderTrackWithOnWriteComplete(f func()) func(provider *ReaderSampleProvider) {
	return func(provider *ReaderSampleProvider) {
		provider.OnWriteComplete = f
	}
}

func ReaderTrackWithRTCPHandler(f func(rtcp.Packet)) func(provider *ReaderSampleProvider) {
	return func(provider *ReaderSampleProvider) {
		provider.trackOpts = append(provider.trackOpts, WithRTCPHandler(f))
	}
}

func ReaderTrackWithSampleOptions(opts ...LocalTrackOptions) func(provider *ReaderSampleProvider) {
	return func(provider *ReaderSampleProvider) {
		provider.trackOpts = append(provider.trackOpts, opts...)
	}
}

// NewLocalFileTrack creates an *os.File reader for NewLocalReaderTrack
func NewLocalFileTrack(file string, options ...ReaderSampleProviderOption) (*LocalTrack, error) {
	// File health check
	var err error
	if _, err = os.Stat(file); err != nil {
		return nil, err
	}

	// Open the file
	fp, err := os.Open(file)
	if err != nil {
		return nil, err
	}

	// Determine mime type from extension
	var mime string
	switch filepath.Ext(file) {
	case ".h264":
		mime = webrtc.MimeTypeH264
	case ".ivf":
		buf := make([]byte, 3)
		_, err = fp.ReadAt(buf, 8)
		if err != nil {
			return nil, err
		}
		switch string(buf) {
		case "VP8":
			mime = webrtc.MimeTypeVP8
		case "VP9":
			mime = webrtc.MimeTypeVP9
		default:
			_ = fp.Close()
			return nil, ErrCannotDetermineMime
		}
		_, _ = fp.Seek(0, 0)
	case ".ogg":
		mime = webrtc.MimeTypeOpus
	default:
		_ = fp.Close()
		return nil, ErrCannotDetermineMime
	}

	track, err := NewLocalReaderTrack(fp, mime, options...)
	if err != nil {
		_ = fp.Close()
		return nil, err
	}
	return track, nil
}

// NewLocalReaderTrack uses io.ReadCloser interface to adapt to various ingress types
// - mime: has to be one of webrtc.MimeType... (e.g. webrtc.MimeTypeOpus)
func NewLocalReaderTrack(in io.ReadCloser, mime string, options ...ReaderSampleProviderOption) (*LocalTrack, error) {
	provider := &ReaderSampleProvider{
		Mime:   mime,
		reader: in,
		// default audio level to be fairly loud
		AudioLevel: 15,
	}
	for _, opt := range options {
		opt(provider)
	}

	// check if mime type is supported
	switch provider.Mime {
	case webrtc.MimeTypeH264, webrtc.MimeTypeOpus, webrtc.MimeTypeVP8, webrtc.MimeTypeVP9:
	// allow
	default:
		return nil, ErrUnsupportedFileType
	}

	// Create sample track & bind handler
	track, err := NewLocalTrack(webrtc.RTPCodecCapability{MimeType: provider.Mime}, provider.trackOpts...)
	if err != nil {
		return nil, err
	}
	track.OnBind(func() {
		if err := track.StartWrite(provider, provider.OnWriteComplete); err != nil {
			logger.Errorw("Could not start writing", err)
		}
	})

	return track, nil
}

func (p *ReaderSampleProvider) OnBind() error {
	// If we are not closing on unbind, don't do anything on rebind
	if p.ivfReader != nil || p.h264reader != nil || p.oggReader != nil {
		return nil
	}

	var err error
	switch p.Mime {
	case webrtc.MimeTypeH264:
		p.h264reader, err = h264reader.NewReader(p.reader)
	case webrtc.MimeTypeVP8, webrtc.MimeTypeVP9:
		var ivfHeader *ivfreader.IVFFileHeader
		p.ivfReader, ivfHeader, err = ivfreader.NewWith(p.reader)
		if err == nil {
			p.ivfTimebase = float64(ivfHeader.TimebaseNumerator) / float64(ivfHeader.TimebaseDenominator)
		}
	case webrtc.MimeTypeOpus:
		p.oggReader, _, err = oggreader.NewWith(p.reader)
	default:
		err = ErrUnsupportedFileType
	}
	if err != nil {
		_ = p.reader.Close()
		return err
	}
	return nil
}

func (p *ReaderSampleProvider) OnUnbind() error {
	return nil
}

func (p *ReaderSampleProvider) Close() error {
	if p.reader != nil {
		return p.reader.Close()
	}
	return nil
}

func (p *ReaderSampleProvider) CurrentAudioLevel() uint8 {
	return p.AudioLevel
}

func (p *ReaderSampleProvider) NextSample(ctx context.Context) (media.Sample, error) {
	sample := media.Sample{}
	switch p.Mime {
	case webrtc.MimeTypeH264:
		nal, err := p.h264reader.NextNAL()
		if err != nil {
			return sample, err
		}

		isFrame := false
		switch nal.UnitType {
		case h264reader.NalUnitTypeCodedSliceDataPartitionA,
			h264reader.NalUnitTypeCodedSliceDataPartitionB,
			h264reader.NalUnitTypeCodedSliceDataPartitionC,
			h264reader.NalUnitTypeCodedSliceIdr,
			h264reader.NalUnitTypeCodedSliceNonIdr:
			isFrame = true
		}

		sample.Data = nal.Data
		if !isFrame {
			// return it without duration
			return sample, nil
		}
		sample.Duration = defaultH264FrameDuration
	case webrtc.MimeTypeVP8, webrtc.MimeTypeVP9:
		frame, header, err := p.ivfReader.ParseNextFrame()
		if err != nil {
			return sample, err
		}
		delta := header.Timestamp - p.lastTimestamp
		sample.Data = frame
		sample.Duration = time.Duration(p.ivfTimebase*float64(delta)*1000) * time.Millisecond
		p.lastTimestamp = header.Timestamp
	case webrtc.MimeTypeOpus:
		pageData, pageHeader, err := p.oggReader.ParseNextPage()
		if err != nil {
			return sample, err
		}
		sampleCount := float64(pageHeader.GranulePosition - p.lastGranule)
		p.lastGranule = pageHeader.GranulePosition

		sample.Data = pageData
		sample.Duration = time.Duration((sampleCount/48000)*1000) * time.Millisecond
		if sample.Duration == 0 {
			sample.Duration = defaultOpusFrameDuration
		}
	}

	if p.FrameDuration > 0 {
		sample.Duration = p.FrameDuration
	}
	return sample, nil
}
