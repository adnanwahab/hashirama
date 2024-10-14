# Core

Things I wish were built in.

## Fuse

A thread-safe one-way switch, used for permanent state changes.

```go
type Server struct {
    msgs chan *Message
    shutdown core.Fuse
}

func NewServer() *Server {
    return &Server{
        shutdown: core.NewFuse()	
    }
}

func (s *Server) Run() {
    for {
        select {
        case msg := <-s.msgs:
            s.Process(msg)
        case <-s.shutdown.Watch():
            return
        }   
    }
}

func (s *Server) DoSomething() {
    if s.shutdown.IsBroken() {
        return errors.New("server closed")
    }
    ...
}

func (s *Server) Shutdown() {
    s.shutdown.Break()
}
```

## Throttle

Golang function throttler.  
Similar to debounce, but the first call will execute immediately.  
Subsequent calls will always have a minimum duration between executions.

```go
func main() {
    throttle := core.NewThrottle(time.Millisecond * 250)
    
    for i := 0; i < 10; i++ {
        if i == 0 {
            throttle(func() { fmt.Println("hello") })
        } else {
            throttle(func() { fmt.Println("world") })
        }
        time.Sleep(time.Millisecond * 10)
    }
}
```

Output:

```
hello (immediately)
world (after 250 ms)
```

## QueueWorker

Execute functions in order of submission.

```go
func main() {
    w := core.NewQueueWorker(QueueWorkerParams{QueueSize: 10})
	w.Submit(func() {
		time.Sleep(time.Second)
		fmt.Printf("hello ")
	})
	w.Submit(func() {
		fmt.Println("world!")	
	})
}
```

Output:

```
hello world!
```

## QueuePool

A pool for QueueWorker management, organized by keys. Different worker keys will run in parallel.

```go
func main() {
    p := core.NewQueuePool(QueueWorkerParams{QueueSize: 10})
	p.Submit("worker1", func() {
		time.Sleep(time.Second)
		fmt.Printf(" world")
	})
	p.Submit("worker2", func() {
		fmt.Printf("hello")
	})
	p.Submit("worker1", func() {
		fmt.Println("!")
	})
}
```

Output:

```
hello world!
```
