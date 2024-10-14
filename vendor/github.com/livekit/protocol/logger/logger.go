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

package logger

import (
	"strings"
	"sync"
	"time"

	"github.com/go-logr/logr"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	discardLogger        = logr.Discard()
	defaultLogger Logger = LogRLogger(discardLogger)
	pkgLogger     Logger = LogRLogger(discardLogger)
)

// InitFromConfig initializes a Zap-based logger
func InitFromConfig(conf *Config, name string) {
	l, err := NewZapLogger(conf)
	if err == nil {
		SetLogger(l, name)
	}
}

// GetLogger returns the logger that was set with SetLogger with an extra depth of 1
func GetLogger() Logger {
	return defaultLogger
}

// SetLogger lets you use a custom logger. Pass in a logr.Logger with default depth
func SetLogger(l Logger, name string) {
	defaultLogger = l.WithCallDepth(1).WithName(name)
	// pkg wrapper needs to drop two levels of depth
	pkgLogger = l.WithCallDepth(2).WithName(name)
}

func Debugw(msg string, keysAndValues ...interface{}) {
	pkgLogger.Debugw(msg, keysAndValues...)
}

func Infow(msg string, keysAndValues ...interface{}) {
	pkgLogger.Infow(msg, keysAndValues...)
}

func Warnw(msg string, err error, keysAndValues ...interface{}) {
	pkgLogger.Warnw(msg, err, keysAndValues...)
}

func Errorw(msg string, err error, keysAndValues ...interface{}) {
	pkgLogger.Errorw(msg, err, keysAndValues...)
}

func ParseZapLevel(level string) zapcore.Level {
	lvl := zapcore.InfoLevel
	if level != "" {
		_ = lvl.UnmarshalText([]byte(level))
	}
	return lvl
}

type Logger interface {
	Debugw(msg string, keysAndValues ...interface{})
	Infow(msg string, keysAndValues ...interface{})
	Warnw(msg string, err error, keysAndValues ...interface{})
	Errorw(msg string, err error, keysAndValues ...interface{})
	WithValues(keysAndValues ...interface{}) Logger
	WithName(name string) Logger
	// WithComponent creates a new logger with name as "<name>.<component>", and uses a log level as specified
	WithComponent(component string) Logger
	WithCallDepth(depth int) Logger
	WithItemSampler() Logger
	// WithoutSampler returns the original logger without sampling
	WithoutSampler() Logger
	WithDeferredValues() (Logger, DeferredFieldResolver)
}

type sharedConfig struct {
	level           zap.AtomicLevel
	mu              sync.Mutex
	componentLevels map[string]zap.AtomicLevel
	config          *Config
}

func newSharedConfig(conf *Config) *sharedConfig {
	sc := &sharedConfig{
		level:           zap.NewAtomicLevelAt(ParseZapLevel(conf.Level)),
		config:          conf,
		componentLevels: make(map[string]zap.AtomicLevel),
	}
	conf.AddUpdateObserver(sc.onConfigUpdate)
	_ = sc.onConfigUpdate(conf)
	return sc
}

func (c *sharedConfig) onConfigUpdate(conf *Config) error {
	// update log levels
	c.level.SetLevel(ParseZapLevel(conf.Level))

	// we have to update alla existing component levels
	c.mu.Lock()
	c.config = conf
	for component, atomicLevel := range c.componentLevels {
		effectiveLevel := c.level.Level()
		parts := strings.Split(component, ".")
	confSearch:
		for len(parts) > 0 {
			search := strings.Join(parts, ".")
			if compLevel, ok := conf.ComponentLevels[search]; ok {
				effectiveLevel = ParseZapLevel(compLevel)
				break confSearch
			}
			parts = parts[:len(parts)-1]
		}
		atomicLevel.SetLevel(effectiveLevel)
	}
	c.mu.Unlock()
	return nil
}

// ensure we have an atomic level in the map representing the full component path
// this makes it possible to update the log level after the fact
func (c *sharedConfig) setEffectiveLevel(component string) zap.AtomicLevel {
	c.mu.Lock()
	defer c.mu.Unlock()
	if compLevel, ok := c.componentLevels[component]; ok {
		return compLevel
	}

	// search up the hierarchy to find the first level that is set
	atomicLevel := zap.NewAtomicLevelAt(c.level.Level())
	c.componentLevels[component] = atomicLevel
	parts := strings.Split(component, ".")
	for len(parts) > 0 {
		search := strings.Join(parts, ".")
		if compLevel, ok := c.config.ComponentLevels[search]; ok {
			atomicLevel.SetLevel(ParseZapLevel(compLevel))
			return atomicLevel
		}
		parts = parts[:len(parts)-1]
	}
	return atomicLevel
}

type ZapLogger struct {
	zap *zap.SugaredLogger
	// store original logger without sampling to avoid multiple samplers
	unsampled *zap.SugaredLogger
	component string
	// use a nested field as pointer so that all loggers share the same sharedConfig
	sharedConfig   *sharedConfig
	level          zap.AtomicLevel
	SampleDuration time.Duration
	SampleInitial  int
	SampleInterval int
}

func NewZapLogger(conf *Config) (*ZapLogger, error) {
	sc := newSharedConfig(conf)
	zl := &ZapLogger{
		sharedConfig:   sc,
		level:          sc.level,
		SampleDuration: time.Duration(conf.ItemSampleSeconds) * time.Second,
		SampleInitial:  conf.ItemSampleInitial,
		SampleInterval: conf.ItemSampleInterval,
	}
	zapConfig := zap.Config{
		// set to the lowest level since we are doing our own filtering in `isEnabled`
		Level:            zap.NewAtomicLevelAt(zapcore.DebugLevel),
		Development:      false,
		Encoding:         "console",
		EncoderConfig:    zap.NewDevelopmentEncoderConfig(),
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
	}
	if conf.JSON {
		zapConfig.Encoding = "json"
		zapConfig.EncoderConfig = zap.NewProductionEncoderConfig()
	}
	l, err := zapConfig.Build()
	if err != nil {
		return nil, err
	}
	zl.unsampled = l.Sugar()

	if conf.Sample {
		// use a sampling logger for the main logger
		samplingConf := &zap.SamplingConfig{
			Initial:    conf.SampleInitial,
			Thereafter: conf.SampleInterval,
		}
		// sane defaults
		if samplingConf.Initial == 0 {
			samplingConf.Initial = 20
		}
		if samplingConf.Thereafter == 0 {
			samplingConf.Thereafter = 100
		}
		zl.zap = l.WithOptions(zap.WrapCore(func(core zapcore.Core) zapcore.Core {
			return zapcore.NewSamplerWithOptions(
				core,
				time.Second,
				samplingConf.Initial,
				samplingConf.Thereafter,
			)
		})).Sugar()
	} else {
		zl.zap = zl.unsampled
	}
	return zl, nil
}

func (l *ZapLogger) WithFieldSampler(config FieldSamplerConfig) *ZapLogger {
	dup := *l
	dup.zap = l.zap.WithOptions(zap.WrapCore(func(core zapcore.Core) zapcore.Core {
		return NewFieldSampler(core, config)
	}))
	return &dup
}

func (l *ZapLogger) ToZap() *zap.SugaredLogger {
	return l.zap
}

func (l *ZapLogger) Debugw(msg string, keysAndValues ...interface{}) {
	if !l.isEnabled(zapcore.DebugLevel) {
		return
	}
	l.zap.Debugw(msg, keysAndValues...)
}

func (l *ZapLogger) Infow(msg string, keysAndValues ...interface{}) {
	if !l.isEnabled(zapcore.InfoLevel) {
		return
	}
	l.zap.Infow(msg, keysAndValues...)
}

func (l *ZapLogger) Warnw(msg string, err error, keysAndValues ...interface{}) {
	if !l.isEnabled(zapcore.WarnLevel) {
		return
	}
	if err != nil {
		keysAndValues = append(keysAndValues, "error", err)
	}
	l.zap.Warnw(msg, keysAndValues...)
}

func (l *ZapLogger) Errorw(msg string, err error, keysAndValues ...interface{}) {
	if !l.isEnabled(zapcore.ErrorLevel) {
		return
	}
	if err != nil {
		keysAndValues = append(keysAndValues, "error", err)
	}
	l.zap.Errorw(msg, keysAndValues...)
}

func (l *ZapLogger) WithValues(keysAndValues ...interface{}) Logger {
	dup := *l
	dup.zap = l.zap.With(keysAndValues...)
	// mirror unsampled logger too
	if l.unsampled == l.zap {
		dup.unsampled = dup.zap
	} else {
		dup.unsampled = l.unsampled.With(keysAndValues...)
	}
	return &dup
}

func (l *ZapLogger) WithName(name string) Logger {
	dup := *l
	dup.zap = l.zap.Named(name)
	if l.unsampled == l.zap {
		dup.unsampled = dup.zap
	} else {
		dup.unsampled = l.unsampled.Named(name)
	}
	return &dup
}

func (l *ZapLogger) WithComponent(component string) Logger {
	// zap automatically appends .<name> to the logger name
	dup := l.WithName(component).(*ZapLogger)
	if dup.component == "" {
		dup.component = component
	} else {
		dup.component = dup.component + "." + component
	}
	dup.level = dup.sharedConfig.setEffectiveLevel(dup.component)
	return dup
}

func (l *ZapLogger) WithCallDepth(depth int) Logger {
	dup := *l
	dup.zap = l.zap.WithOptions(zap.AddCallerSkip(depth))
	if l.unsampled == l.zap {
		dup.unsampled = dup.zap
	} else {
		dup.unsampled = l.unsampled.WithOptions(zap.AddCallerSkip(depth))
	}
	return &dup
}

func (l *ZapLogger) WithItemSampler() Logger {
	if l.SampleDuration == 0 {
		return l
	}
	dup := *l
	dup.zap = l.unsampled.WithOptions(zap.WrapCore(func(core zapcore.Core) zapcore.Core {
		return zapcore.NewSamplerWithOptions(
			core,
			l.SampleDuration,
			l.SampleInitial,
			l.SampleInterval,
		)
	}))
	return &dup
}

func (l *ZapLogger) WithoutSampler() Logger {
	if l.unsampled == l.zap {
		return l
	}
	dup := *l
	dup.zap = l.unsampled
	return &dup
}

func (l *ZapLogger) WithDeferredValues() (Logger, DeferredFieldResolver) {
	var resolvers []DeferredFieldResolver
	opt := zap.WrapCore(func(core zapcore.Core) zapcore.Core {
		core, resolve := newDeferredValueCore(core)
		resolvers = append(resolvers, resolve)
		return core
	})
	resolve := func(args ...any) {
		for _, r := range resolvers {
			r(args...)
		}
	}

	dup := *l
	dup.zap = l.zap.WithOptions(opt)
	if l.unsampled == l.zap {
		dup.unsampled = dup.zap
	} else {
		dup.unsampled = l.unsampled.WithOptions(opt)
	}
	return &dup, resolve
}

func (l *ZapLogger) isEnabled(level zapcore.Level) bool {
	return level >= l.level.Level()
}

type LogRLogger logr.Logger

func (l LogRLogger) toLogr() logr.Logger {
	if logr.Logger(l).GetSink() == nil {
		return discardLogger
	}
	return logr.Logger(l)
}

func (l LogRLogger) Debugw(msg string, keysAndValues ...interface{}) {
	l.toLogr().V(1).Info(msg, keysAndValues...)
}

func (l LogRLogger) Infow(msg string, keysAndValues ...interface{}) {
	l.toLogr().Info(msg, keysAndValues...)
}

func (l LogRLogger) Warnw(msg string, err error, keysAndValues ...interface{}) {
	if err != nil {
		keysAndValues = append(keysAndValues, "error", err)
	}
	l.toLogr().Info(msg, keysAndValues...)
}

func (l LogRLogger) Errorw(msg string, err error, keysAndValues ...interface{}) {
	l.toLogr().Error(err, msg, keysAndValues...)
}

func (l LogRLogger) WithValues(keysAndValues ...interface{}) Logger {
	return LogRLogger(l.toLogr().WithValues(keysAndValues...))
}

func (l LogRLogger) WithName(name string) Logger {
	return LogRLogger(l.toLogr().WithName(name))
}

func (l LogRLogger) WithComponent(component string) Logger {
	return LogRLogger(l.toLogr().WithName(component))
}

func (l LogRLogger) WithCallDepth(depth int) Logger {
	return LogRLogger(l.toLogr().WithCallDepth(depth))
}

func (l LogRLogger) WithItemSampler() Logger {
	// logr does not support sampling
	return l
}

func (l LogRLogger) WithoutSampler() Logger {
	return l
}

func (l LogRLogger) WithDeferredValues() (Logger, DeferredFieldResolver) {
	return l, func(args ...any) {}
}
