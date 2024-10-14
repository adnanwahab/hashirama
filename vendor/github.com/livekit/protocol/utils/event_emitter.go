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
	"container/list"
	"sync"

	"golang.org/x/exp/maps"

	"github.com/livekit/protocol/logger"
)

const defaultQueueSize = 16

type EventEmitterParams struct {
	QueueSize int
	Logger    logger.Logger
}

func DefaultEventEmitterParams() EventEmitterParams {
	return EventEmitterParams{
		QueueSize: defaultQueueSize,
		Logger:    logger.GetLogger(),
	}
}

type EventEmitter[K comparable, V any] struct {
	params    EventEmitterParams
	mu        sync.RWMutex
	observers map[K]*EventObserverList[V]
}

func NewEventEmitter[K comparable, V any](params EventEmitterParams) *EventEmitter[K, V] {
	return &EventEmitter[K, V]{
		params:    params,
		observers: map[K]*EventObserverList[V]{},
	}
}

func NewDefaultEventEmitter[K comparable, V any]() *EventEmitter[K, V] {
	return NewEventEmitter[K, V](DefaultEventEmitterParams())
}

func (e *EventEmitter[K, V]) Emit(k K, v V) {
	e.mu.RLock()
	l, ok := e.observers[k]
	e.mu.RUnlock()
	if !ok {
		return
	}

	l.Emit(v)
}

func (e *EventEmitter[K, V]) Observe(k K) *EventObserver[V] {
	e.mu.Lock()
	l, ok := e.observers[k]
	if !ok {
		l = NewEventObserverList[V](e.params)
		e.observers[k] = l
	}
	o := l.Observe()
	e.mu.Unlock()

	o.stop = append(o.stop, func() { e.cleanUpObserverList(k) })

	return o
}

func (e *EventEmitter[K, V]) ObservedKeys() []K {
	e.mu.Lock()
	defer e.mu.Unlock()
	return maps.Keys(e.observers)
}

func (e *EventEmitter[K, V]) cleanUpObserverList(k K) {
	e.mu.Lock()
	defer e.mu.Unlock()

	l, ok := e.observers[k]
	if ok && l.Len() == 0 {
		delete(e.observers, k)
	}
}

type EventObserverList[V any] struct {
	params    EventEmitterParams
	mu        sync.RWMutex
	observers *list.List
}

func NewEventObserverList[V any](params EventEmitterParams) *EventObserverList[V] {
	return &EventObserverList[V]{
		params:    params,
		observers: list.New(),
	}
}

func NewDefaultEventObserverList[V any]() *EventObserverList[V] {
	return NewEventObserverList[V](DefaultEventEmitterParams())
}

func (l *EventObserverList[V]) Len() int {
	l.mu.RLock()
	defer l.mu.RUnlock()
	return l.observers.Len()
}

func (l *EventObserverList[V]) Observe() *EventObserver[V] {
	o := &EventObserver[V]{
		logger: l.params.Logger,
		ch:     make(chan V, l.params.QueueSize),
	}

	l.mu.Lock()
	le := l.observers.PushBack(o)
	l.mu.Unlock()

	o.stop = append(o.stop, func() { l.stopObserving(le) })

	return o
}

func (l *EventObserverList[V]) Emit(v V) {
	l.mu.RLock()
	defer l.mu.RUnlock()
	for le := l.observers.Front(); le != nil; le = le.Next() {
		le.Value.(*EventObserver[V]).emit(v)
	}
}

func (l *EventObserverList[V]) stopObserving(le *list.Element) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.observers.Remove(le)
}

type EventObserver[V any] struct {
	logger logger.Logger
	stop   []func()
	ch     chan V
}

func NewEventObserver[V any](stopFunc func()) (*EventObserver[V], func(v V)) {
	o := &EventObserver[V]{
		logger: logger.GetLogger(),
		stop:   []func(){stopFunc},
		ch:     make(chan V, defaultQueueSize),
	}
	return o, o.emit
}

func (o *EventObserver[V]) emit(v V) {
	select {
	case o.ch <- v:
	default:
		o.logger.Warnw("could not add event to observer queue", nil)
	}
}

func (o *EventObserver[V]) Stop() {
	for _, stop := range o.stop {
		stop()
	}
}

func (o *EventObserver[V]) Events() <-chan V {
	return o.ch
}
