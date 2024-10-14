package core

import (
	"sync"
	"sync/atomic"
)

// Fuse is a thread-safe one-way switch, used for permanent state changes.
// Implementation partially borrowed from sync.Once
type Fuse interface {
	// IsBroken returns true if the fuse has been broken
	IsBroken() bool
	// Wire returns a channel which will close once the fuse is broken
	Watch() <-chan struct{}
	// Break breaks the fuse
	Break()
	// Once runs the callback and breaks the fuse
	Once(func())
}

func NewFuse() Fuse {
	return &fuse{
		c: make(chan struct{}),
	}
}

type fuse struct {
	done uint32
	m    sync.Mutex
	c    chan struct{}
}

func (f *fuse) IsBroken() bool {
	select {
	case <-f.c:
		return true
	default:
		return false
	}
}

func (f *fuse) Watch() <-chan struct{} {
	return f.c
}

func (f *fuse) Break() {
	f.Once(nil)
}

func (f *fuse) Once(do func()) {
	if atomic.LoadUint32(&f.done) == 0 {
		f.close(do)
	}
}

func (f *fuse) close(do func()) {
	f.m.Lock()
	defer f.m.Unlock()
	if f.done == 0 {
		defer atomic.StoreUint32(&f.done, 1)
		if do != nil {
			do()
		}
		close(f.c)
	}
}
