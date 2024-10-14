package mageutil

import (
	"context"
	"os"
	"os/exec"
	"strings"
)

func Command(ctx context.Context, command string) *exec.Cmd {
	cmd := create(ctx, command)
	ConnectStd(cmd)
	return cmd
}

func CommandDir(ctx context.Context, dir, command string) *exec.Cmd {
	cmd := create(ctx, command)
	cmd.Dir = dir
	ConnectStd(cmd)
	return cmd
}

func Run(ctx context.Context, commands ...string) error {
	for _, command := range commands {
		if err := Command(ctx, command).Run(); err != nil {
			return err
		}
	}
	return nil
}

func RunDir(ctx context.Context, dir string, commands ...string) error {
	for _, command := range commands {
		if err := CommandDir(ctx, dir, command).Run(); err != nil {
			return err
		}
	}
	return nil
}

func Out(ctx context.Context, command string) ([]byte, error) {
	cmd := create(ctx, command)
	return cmd.Output()
}

func OutDir(ctx context.Context, dir, command string) ([]byte, error) {
	cmd := create(ctx, command)
	cmd.Dir = dir
	return cmd.Output()
}

func Pipe(first, second string) error {
	ctx := context.Background()
	c1 := create(ctx, first)

	c1.Stderr = os.Stderr
	p, err := c1.StdoutPipe()
	if err != nil {
		return err
	}

	c2 := create(ctx, second)
	c2.Stdin = p
	c2.Stdout = os.Stdout
	c2.Stderr = os.Stderr

	if err = c1.Start(); err != nil {
		return err
	}
	if err = c2.Start(); err != nil {
		return err
	}
	if err = c1.Wait(); err != nil {
		return err
	}
	if err = c2.Wait(); err != nil {
		return err
	}
	return nil
}

func ConnectStd(cmd *exec.Cmd) {
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
}

func create(ctx context.Context, command string) *exec.Cmd {
	args := make([]string, 0)
	a := strings.Split(command, `"`)
	for i, arg := range a {
		if i%2 == 0 {
			trimmed := strings.TrimSpace(arg)
			if len(trimmed) > 0 {
				args = append(args, strings.Split(trimmed, ` `)...)
			}
		} else {
			args = append(args, arg)
		}
	}
	return exec.CommandContext(ctx, args[0], args[1:]...)
}
