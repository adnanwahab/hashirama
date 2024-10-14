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
	"time"

	"golang.org/x/exp/constraints"
)

type Numeric interface {
	constraints.Signed | constraints.Unsigned | time.Duration
}

func Max[T Numeric](vs ...T) T {
	return Least(func(a, b T) bool { return a > b }, vs...)
}

func Min[T Numeric](vs ...T) T {
	return Least(func(a, b T) bool { return a < b }, vs...)
}

func Most[T Numeric](less func(a, b T) bool, vs ...T) T {
	return Least(func(a, b T) bool { return !less(a, b) }, vs...)
}

func Least[T Numeric](less func(a, b T) bool, vs ...T) T {
	if len(vs) == 0 {
		return 0
	}
	v := vs[0]
	for i := 1; i < len(vs); i++ {
		if less(vs[i], v) {
			v = vs[i]
		}
	}
	return v
}
