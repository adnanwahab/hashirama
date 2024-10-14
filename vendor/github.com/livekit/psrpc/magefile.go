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

//go:build mage
// +build mage

package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"

	"github.com/livekit/mageutil"
)

var Default = Test

func Install() error {
	return mageutil.Run(context.Background(), "go install ./protoc-gen-psrpc")
}

func Proto() error {
	fmt.Println("generating protobuf")

	protoc, err := mageutil.GetToolPath("protoc")
	if err != nil {
		return err
	}
	protocGoPath, err := mageutil.GetToolPath("protoc-gen-go")
	if err != nil {
		return err
	}

	protos := []struct {
		importPath, outputPath, filename string
	}{
		{"./internal", "internal", "internal.proto"},
		{"./protoc-gen-psrpc/options", "protoc-gen-psrpc/options", "options.proto"},
		{"./testutils", "testutils", "testutils.proto"},
	}
	for _, p := range protos {
		cmd := exec.Command(protoc,
			"--go_out", p.outputPath,
			"--go_opt=paths=source_relative",
			"--plugin=go="+protocGoPath,
			"-I="+p.importPath,
			p.filename,
		)
		mageutil.ConnectStd(cmd)
		if err = cmd.Run(); err != nil {
			return err
		}
	}

	return nil
}

func Generate() error {
	ctx := context.Background()

	err := mageutil.Run(ctx, "go install ./protoc-gen-psrpc")
	if err != nil {
		return err
	}

	base := "./internal/test"
	dirs, err := os.ReadDir(base)
	if err != nil {
		return err
	}
	for _, dir := range dirs {
		if dir.IsDir() {
			err = mageutil.RunDir(ctx, fmt.Sprintf("%s/%s", base, dir.Name()), "go generate .")
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func Test() error {
	return mageutil.Run(context.Background(), "go test -count=1 -v . ./internal/test")
}

func TestAll() error {
	if err := Generate(); err != nil {
		return err
	}
	return mageutil.Run(context.Background(), "go test -count=1 ./...")
}
