package mageutil

import (
	"fmt"
	"os"
	"os/exec"
	"path"
	"path/filepath"
)

func CloneRepo(org, name string, basePath string, branch string) error {
	targetDir := path.Join(basePath, name)
	if _, err := os.Stat(targetDir); !os.IsNotExist(err) {
		fmt.Printf("%s already exists, updating\n", name)
		// ignore errors as there could be local changes that cause update to fail
		_ = UpdateRepo(name, basePath, branch)
		return nil
	}
	fmt.Println("cloning", name)

	cmd := exec.Command("git", "clone", fmt.Sprintf("https://github.com/%s/%s", org, name))
	cmd.Dir = basePath
	ConnectStd(cmd)
	return cmd.Run()
}

func UpdateRepo(name string, basePath string, branch string) error {
	targetDir := path.Join(basePath, name)
	if _, err := os.Stat(targetDir); os.IsNotExist(err) {
		return err
	}
	fmt.Println("updating", name)
	checkout := exec.Command("git", "checkout", branch)
	checkout.Dir = filepath.Join(basePath, name)
	ConnectStd(checkout)
	checkout.Run()
	cmd := exec.Command("git", "pull")
	cmd.Dir = filepath.Join(basePath, name)
	ConnectStd(cmd)
	return cmd.Run()
}
