package mageutil

import (
	"encoding/json"
	"fmt"
	"go/build"
	"os"
	"os/exec"
	"path/filepath"
)

func InstallTools(tools map[string]string, force bool) error {
	for url, version := range tools {
		if err := InstallTool(url, version, force); err != nil {
			return err
		}
	}
	return nil
}

func InstallTool(url, version string, force bool) error {
	name := filepath.Base(url)
	if !force {
		_, err := GetToolPath(name)
		if err == nil {
			// already installed
			return nil
		}
	}

	fmt.Printf("installing %s %s\n", name, version)
	urlWithVersion := fmt.Sprintf("%s@%s", url, version)
	cmd := exec.Command("go", "install", urlWithVersion)
	ConnectStd(cmd)
	if err := cmd.Run(); err != nil {
		return err
	}

	// check
	_, err := GetToolPath(name)
	return err
}

func GetToolPath(name string) (string, error) {
	if p, err := exec.LookPath(name); err == nil {
		return p, nil
	}
	// check under gopath
	gopath := os.Getenv("GOPATH")
	if gopath == "" {
		gopath = build.Default.GOPATH
	}
	p := filepath.Join(gopath, "bin", name)
	if _, err := os.Stat(p); err != nil {
		return "", err
	}
	return p, nil
}

type packageInfo struct {
	Dir string
}

func GetPkgDir(pkg string) (string, error) {
	cmd := exec.Command("go", "list", "-json", "-m", pkg)
	pkgOut, err := cmd.Output()
	if err != nil {
		return "", err
	}
	pi := packageInfo{}
	if err = json.Unmarshal(pkgOut, &pi); err != nil {
		return "", err
	}
	return pi.Dir, nil
}
