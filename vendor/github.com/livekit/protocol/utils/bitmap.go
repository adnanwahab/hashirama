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

import "math/bits"

type bitmapNumber interface {
	uint16 | uint32 | uint64
}

type Bitmap[T bitmapNumber] struct {
	bits []uint64
}

func NewBitmap[T bitmapNumber](size int) *Bitmap[T] {
	return &Bitmap[T]{
		bits: make([]uint64, 1<<bits.Len64(uint64(size+63)/64)),
	}
}

func (b *Bitmap[T]) Set(val T) {
	b.SetRange(val, val)
}

func (b *Bitmap[T]) SetRange(min, max T) {
	if max < min {
		return
	}

	sm, ls, rs, lo, ro := b.getSlotsAndOffsets(min, max)
	if ls == rs {
		b.bits[ls&sm] |= (((1 << (ro - lo + 1)) - 1) << lo)
	} else {
		b.bits[ls&sm] |= ^((1 << lo) - 1)
		for i := ls + 1; i < rs; i++ {
			b.bits[i&sm] = ^uint64(0)
		}
		b.bits[rs&sm] |= (1 << (ro + 1)) - 1
	}
}

func (b *Bitmap[T]) Clear(val T) {
	b.ClearRange(val, val)
}

func (b *Bitmap[T]) ClearRange(min, max T) {
	if max < min {
		return
	}

	sm, ls, rs, lo, ro := b.getSlotsAndOffsets(min, max)
	if ls == rs {
		b.bits[ls&sm] &= ^(((1 << (ro - lo + 1)) - 1) << lo)
	} else {
		b.bits[ls&sm] &= ^uint64(0) >> (64 - lo)
		for i := ls + 1; i < rs; i++ {
			b.bits[i&sm] = 0
		}
		b.bits[rs&sm] &= ^uint64(0) << (ro + 1)
	}
}

func (b *Bitmap[T]) IsSet(val T) bool {
	sm := len(b.bits) - 1 // slot mask
	s := int(val >> 6)    // slot
	o := int(val & 0x3f)  // offset
	return b.bits[s&sm]&(1<<o) != 0
}

func (b *Bitmap[T]) getSlotsAndOffsets(min, max T) (sm int, ls int, rs int, lo int, ro int) {
	sm = len(b.bits) - 1 // slot mask

	ls = int(min >> 6) // left slot
	rs = int(max >> 6) // right slot

	if rs-ls > len(b.bits) {
		rs = ls + len(b.bits)
		return
	}

	lo = int(min & 0x3f) // left offset
	ro = int(max & 0x3f) // right offset
	return
}
