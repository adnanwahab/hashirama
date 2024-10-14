package core

import (
	"sync"

	"github.com/gammazero/deque"
)

const DefaultQueueSize = 100

type QueuePool interface {
	Submit(key string, job func())
	Drain()
	Kill()
}

type QueueWorker interface {
	Submit(job func())
	Drain()
	Kill()
}

type QueueWorkerParams struct {
	QueueSize    int
	DropWhenFull bool
	OnDropped    func()
}

type queuePool struct {
	sync.Mutex

	workers map[string]QueueWorker
	params  QueueWorkerParams
	drain   Fuse
	kill    Fuse
}

func NewQueuePool(params QueueWorkerParams) QueuePool {
	if params.QueueSize == 0 {
		params.QueueSize = DefaultQueueSize
	}

	return &queuePool{
		workers: make(map[string]QueueWorker),
		params:  params,
		drain:   NewFuse(),
		kill:    NewFuse(),
	}
}

func (p *queuePool) Submit(key string, job func()) {
	p.Lock()
	if p.kill.IsBroken() {
		p.Unlock()
		return
	}

	w, ok := p.workers[key]
	if !ok {
		w = NewQueueWorker(p.params)
		p.workers[key] = w
	}
	p.Unlock()

	w.Submit(job)
}

func (p *queuePool) Drain() {
	p.drain.Once(func() {
		p.Lock()

		var wg sync.WaitGroup
		for _, w := range p.workers {
			wg.Add(1)
			w := w
			go func() {
				w.Drain()
				wg.Done()
			}()
		}
		wg.Wait()

		p.Unlock()
	})
}

func (p *queuePool) Kill() {
	p.kill.Once(func() {
		p.Lock()
		for _, w := range p.workers {
			w.Kill()
		}
		p.Unlock()
	})
}

type worker struct {
	sync.Mutex
	QueueWorkerParams

	active   bool
	next     chan func()
	deque    *deque.Deque[func()]
	draining Fuse
	done     Fuse
	kill     Fuse
}

func NewQueueWorker(params QueueWorkerParams) QueueWorker {
	if params.QueueSize == 0 {
		params.QueueSize = DefaultQueueSize
	}

	w := &worker{
		QueueWorkerParams: params,
		next:              make(chan func(), 1),
		deque:             deque.New[func()](params.QueueSize),
		draining:          NewFuse(),
		done:              NewFuse(),
		kill:              NewFuse(),
	}
	go w.run()
	return w
}

func (w *worker) run() {
	kill := w.kill.Watch()
	draining := w.draining.Watch()
	for {
		select {
		case <-kill:
			return
		case <-draining:
			w.drain()
			return
		case job := <-w.next:
			if job != nil {
				job()
			}

			w.Lock()
			if w.deque.Len() > 0 {
				w.next <- w.deque.PopFront()
			} else {
				w.active = false
			}
			w.Unlock()
		}
	}
}

func (w *worker) Submit(job func()) {
	w.Lock()
	if w.active {
		if w.DropWhenFull && w.deque.Len() == w.QueueSize {
			if w.OnDropped != nil {
				w.OnDropped()
			}
		} else {
			w.deque.PushBack(job)
		}
	} else {
		w.active = true
		w.next <- job
	}
	w.Unlock()
}

func (w *worker) Drain() {
	w.draining.Break()
	select {
	case <-w.done.Watch():
	case <-w.kill.Watch():
	}
}

func (w *worker) drain() {
	w.Lock()

	select {
	case job := <-w.next:
		if job != nil {
			job()
		}
	default:
	}
	count := w.deque.Len()
	for i := 0; i < count; i++ {
		w.deque.PopFront()()
	}

	w.done.Break()
	w.Unlock()
}

func (w *worker) Kill() {
	w.kill.Break()
}
