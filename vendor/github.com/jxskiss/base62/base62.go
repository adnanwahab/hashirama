package base62

import (
	"math/bits"
	"reflect"
	"strconv"
	"unsafe"
)

const (
	base        = 62
	compactMask = 0x1E // 00011110
	mask5bits   = 0x1F // 00011111
	mask6bits   = 0x3F // 00111111
)

// An Encoding is a radix 62 encoding/decoding scheme, defined by a
// 62-character alphabet.
type Encoding struct {
	encode    [base]byte
	decodeMap [256]byte
}

// NewEncoding returns a new Encoding defined by the given alphabet,
// which must be a 62-byte string that does not contain CR / LF ('\r', '\n').
func NewEncoding(encoder string) *Encoding {
	if len(encoder) != base {
		panic("encoding alphabet is not 62-bytes long")
	}
	for i := 0; i < len(encoder); i++ {
		if encoder[i] == '\n' || encoder[i] == '\r' {
			panic("encoding alphabet contains newline character")
		}
	}

	e := new(Encoding)
	copy(e.encode[:], encoder)
	for i := 0; i < len(e.decodeMap); i++ {
		e.decodeMap[i] = 0xFF
	}
	for i := 0; i < len(encoder); i++ {
		e.decodeMap[encoder[i]] = byte(i)
	}
	return e
}

// Encode encodes src using the encoding enc, returns the encoded bytes.
func (enc *Encoding) Encode(src []byte) []byte {
	return enc._encodeV2(src)
}

// _encodeV1 is obsolete, it is here to make sure that the new
// implementation is compatible with the old one.
//
// We don't want to break the programs which use this package.
func (enc *Encoding) _encodeV1(src []byte) []byte {
	if len(src) == 0 {
		return []byte{}
	}
	dst := make([]byte, 0, len(src)*9/5)
	encoder := newEncoder(src)
	return encoder.encode(dst, enc.encode[:])
}

func (enc *Encoding) _encodeV2(src []byte) []byte {
	if len(src) == 0 {
		return []byte{}
	}
	dst := make([]byte, 0, len(src)*9/5)
	encoder := newEncoder(src)
	return encoder.encodeV2(dst, enc.encode[:])
}

// EncodeToString returns a base62 string representation of src.
func (enc *Encoding) EncodeToString(src []byte) string {
	ret := enc.Encode(src)
	return b2s(ret)
}

// EncodeToBuf encodes src using the encoding enc, appending the encoded
// bytes to dst. If dst has not enough capacity, it copies dst and returns
// the extended buffer.
func (enc *Encoding) EncodeToBuf(dst []byte, src []byte) []byte {
	if len(src) == 0 {
		return []byte{}
	}
	encoder := newEncoder(src)
	return encoder.encodeV2(dst, enc.encode[:])
}

type encoder struct {
	src []byte
	pos int
}

func newEncoder(src []byte) *encoder {
	return &encoder{
		src: src,
		pos: len(src) * 8,
	}
}

func (enc *encoder) next() (byte, bool) {
	var i, pos int
	var j, blen byte
	pos = enc.pos - 6
	if pos <= 0 {
		pos = 0
		blen = byte(enc.pos)
	} else {
		i = pos / 8
		j = byte(pos % 8)
		blen = byte((i+1)*8 - pos)
		if blen > 6 {
			blen = 6
		}
	}
	shift := 8 - j - blen
	b := enc.src[i] >> shift & (1<<blen - 1)

	if blen < 6 && pos > 0 {
		blen1 := 6 - blen
		b = b<<blen1 | enc.src[i+1]>>(8-blen1)
	}
	if b&compactMask == compactMask {
		if pos > 0 || b > mask5bits {
			pos++
		}
		b &= mask5bits
	}
	enc.pos = pos

	return b, pos > 0
}

func (enc *encoder) encode(dst []byte, encTable []byte) []byte {
	x, hasMore := enc.next()
	for {
		dst = append(dst, encTable[x])
		if !hasMore {
			break
		}
		x, hasMore = enc.next()
	}
	return dst
}

func (enc *encoder) encodeV2(dst []byte, encTable []byte) []byte {
	for enc.pos > 0 {
		size := 6
		b := enc.get6bits()
		if b&compactMask == compactMask {
			if enc.pos > 6 || b > mask5bits {
				size = 5
			}
			b &= mask5bits
		}
		dst = append(dst, encTable[b])
		enc.pos -= size
	}
	return dst
}

func (enc *encoder) get6bits() byte {
	r := enc.pos & 0x7
	i := enc.pos >> 3
	if r == 0 {
		i, r = i-1, 8
	}
	b := enc.src[i] >> (8 - r)
	if r < 6 && i > 0 {
		b |= enc.src[i-1] << r
	}
	return b & mask6bits
}

type CorruptInputError int64

func (e CorruptInputError) Error() string {
	return "illegal base62 data at input byte " + strconv.FormatInt(int64(e), 10)
}

// Decode decodes src using the encoding enc, returns the decoded bytes.
//
// If src contains invalid base62 data, it will return nil and CorruptInputError.
func (enc *Encoding) Decode(src []byte) ([]byte, error) {
	if len(src) == 0 {
		return []byte{}, nil
	}
	dst := make([]byte, len(src)*6/8+1)
	dec := decoder(src)
	idx, err := dec.decode(dst, enc.decodeMap[:])
	if err != nil {
		return nil, err
	}
	return dst[idx:], nil
}

// DecodeString returns the bytes represented by the base62 string src.
func (enc *Encoding) DecodeString(src string) ([]byte, error) {
	b := s2b(src)
	return enc.Decode(b)
}

// DecodeToBuf decodes src using the encoding enc, appending the decoded
// bytes to dst. If dst has not enough capacity, it copies dst and returns
// the extended buffer.
//
// If src contains invalid base62 data, it will return nil and CorruptInputError.
func (enc *Encoding) DecodeToBuf(dst []byte, src []byte) ([]byte, error) {
	if len(src) == 0 {
		return []byte{}, nil
	}
	oldCap, oldLen := cap(dst), len(dst)
	possibleLen := len(src)*6/8 + 1
	if oldCap < oldLen+possibleLen {
		newBuf := make([]byte, oldLen, oldLen+possibleLen)
		copy(newBuf, dst)
		dst = newBuf
	}
	dec := decoder(src)
	idx, err := dec.decode(dst[oldLen:cap(dst)], enc.decodeMap[:])
	if err != nil {
		return nil, err
	}
	if idx != 0 {
		copy(dst[oldLen:cap(dst)], dst[oldLen+idx:cap(dst)])
	}
	dst = dst[:cap(dst)-idx]
	return dst, nil
}

type decoder []byte

func (dec decoder) decode(dst []byte, decTable []byte) (int, error) {
	idx := len(dst)
	pos := byte(0)
	b := 0
	for i, c := range dec {
		x := decTable[c]
		if x == 0xFF {
			return 0, CorruptInputError(i)
		}
		if i == len(dec)-1 {
			b |= int(x) << pos
			pos += byte(bits.Len8(x))
		} else if x&compactMask == compactMask {
			b |= int(x) << pos
			pos += 5
		} else {
			b |= int(x) << pos
			pos += 6
		}
		if pos >= 8 {
			idx--
			dst[idx] = byte(b)
			pos %= 8
			b >>= 8
		}
	}
	if pos > 0 {
		idx--
		dst[idx] = byte(b)
	}
	return idx, nil
}

func b2s(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

func s2b(s string) []byte {
	sh := (*reflect.StringHeader)(unsafe.Pointer(&s))
	bh := &reflect.SliceHeader{
		Data: sh.Data,
		Len:  sh.Len,
		Cap:  sh.Len,
	}
	return *(*[]byte)(unsafe.Pointer(bh))
}
