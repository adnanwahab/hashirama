package mageutil

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/sync/errgroup"
)

type Group struct {
	*errgroup.Group

	cancel func()
}

func NewGroup(ctx context.Context) (*Group, context.Context) {
	ctx, cancel := context.WithCancel(ctx)
	group, ctx := errgroup.WithContext(ctx)

	return &Group{
		Group:  group,
		cancel: cancel,
	}, ctx
}

func (g *Group) Cancel() {
	g.cancel()
}

func (g *Group) Wait() error {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-sigChan
		g.cancel()
	}()

	return g.Group.Wait()
}
