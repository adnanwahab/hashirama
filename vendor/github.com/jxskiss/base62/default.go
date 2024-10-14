package base62

const encodeStd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

// StdEncoding is the default base62 encoding using alphabet [A-Za-z0-9].
var StdEncoding = NewEncoding(encodeStd)

// Encode encodes src using StdEncoding, returns the encoded bytes.
func Encode(src []byte) []byte {
	return StdEncoding.Encode(src)
}

// EncodeToString returns a base62 string representation of src
// using StdEncoding.
func EncodeToString(src []byte) string {
	return StdEncoding.EncodeToString(src)
}

// EncodeToBuf encodes src using StdEncoding, appending the encoded
// bytes to dst. If dst has not enough capacity, it copies dst and returns
// the extended buffer.
func EncodeToBuf(dst []byte, src []byte) []byte {
	return StdEncoding.EncodeToBuf(dst, src)
}

// Decode decodes src using StdEncoding, returns the decoded bytes.
//
// If src contains invalid base62 data, it will return nil and CorruptInputError.
func Decode(src []byte) ([]byte, error) {
	return StdEncoding.Decode(src)
}

// DecodeString returns the bytes represented by the base62 string src
// using StdEncoding.
func DecodeString(src string) ([]byte, error) {
	return StdEncoding.DecodeString(src)
}

// DecodeToBuf decodes src using StdEncoding, appending the decoded
// bytes to dst. If dst has not enough capacity, it copies dst and returns
// the extended buffer.
//
// If src contains invalid base62 data, it will return nil and CorruptInputError.
func DecodeToBuf(dst []byte, src []byte) ([]byte, error) {
	return StdEncoding.DecodeToBuf(dst, src)
}

// FormatInt encodes an integer num to base62 using StdEncoding.
func FormatInt(num int64) []byte {
	return StdEncoding.FormatInt(num)
}

// FormatUint encodes an unsigned integer num to base62 using StdEncoding.
func FormatUint(num uint64) []byte {
	return StdEncoding.FormatUint(num)
}

// AppendInt appends the base62 representation of the integer num
// using StdEncoding, to dst and returns the extended buffer.
func AppendInt(dst []byte, num int64) []byte {
	return StdEncoding.AppendInt(dst, num)
}

// AppendUint appends the base62 representation of the unsigned integer num
// using StdEncoding, to dst and returns the extended buffer.
func AppendUint(dst []byte, num uint64) []byte {
	return StdEncoding.AppendUint(dst, num)
}

// ParseInt returns an integer from its base62 representation
// using StdEncoding.
//
// If src contains invalid base62 data, it returns 0 and CorruptInputError.
func ParseInt(src []byte) (int64, error) {
	return StdEncoding.ParseInt(src)
}

// ParseUint returns an unsigned integer from its base62 representation
// using StdEncoding.
//
// If src contains invalid base62 data, it returns 0 and CorruptInputError.
func ParseUint(src []byte) (uint64, error) {
	return StdEncoding.ParseUint(src)
}
