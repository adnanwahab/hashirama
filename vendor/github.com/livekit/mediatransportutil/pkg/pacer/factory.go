package pacer

import (
	"fmt"
	"time"

	"github.com/livekit/protocol/logger"
)

type PacerType int

const (
	PassThroughPacer PacerType = iota
	NoQueuePacer
	LeakyBucketPacer
)

type pacerFactoryParams struct {
	SendInterval time.Duration
	Bitrate      int
	MaxLatency   time.Duration
	PacerType    PacerType
	Logger       logger.Logger
}

var defaultPacerParams = pacerFactoryParams{
	SendInterval: 5 * time.Millisecond,
	Bitrate:      5000000,
	MaxLatency:   2 * time.Second,
}

type PacerFactoryOpt func(params *pacerFactoryParams)

func WithSendInterval(sendInterval time.Duration) PacerFactoryOpt {
	return func(params *pacerFactoryParams) {
		params.SendInterval = sendInterval
	}
}

func WithBitrate(bitrate int) PacerFactoryOpt {
	return func(params *pacerFactoryParams) {
		params.Bitrate = bitrate
	}
}

func WithMaxLatency(maxLatency time.Duration) PacerFactoryOpt {
	return func(params *pacerFactoryParams) {
		params.MaxLatency = maxLatency
	}
}

func Withlogger(logger logger.Logger) PacerFactoryOpt {
	return func(params *pacerFactoryParams) {
		params.Logger = logger
	}
}

type PacerFactory struct {
	params *pacerFactoryParams
}

func NewPacerFactory(pacerType PacerType, opts ...PacerFactoryOpt) Factory {
	params := defaultPacerParams
	params.PacerType = pacerType
	params.Logger = logger.GetLogger()
	for _, o := range opts {
		o(&params)
	}
	return &PacerFactory{
		params: &params,
	}
}

func (f *PacerFactory) NewPacer() (Pacer, error) {
	switch f.params.PacerType {
	case PassThroughPacer:
		return NewPassThrough(f.params.Logger), nil
	case NoQueuePacer:
		return NewNoQueue(f.params.Logger), nil
	case LeakyBucketPacer:
		return NewPacerLeakyBucket(f.params.SendInterval, f.params.Bitrate, f.params.MaxLatency, f.params.Logger), nil
	default:
		return nil, fmt.Errorf("unknown pacer type: %v", f.params.PacerType)
	}
}
