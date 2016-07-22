package utils

import(
     "encoding/json"
     "io"
)


// Decode a JSON representation and fill the provided struct. Non fitting values are discarded.
func DecodeJSON(body io.Reader, _struct interface{}) error {
	decoder := json.NewDecoder(body)
	decoder.UseNumber()
	err := decoder.Decode(_struct)
	return err
}

// Encode a struct to a JSON representation.
func EncodeJSON(_struct interface{}) ([]byte, error) {
	encoded, err := json.Marshal(_struct)
	return encoded, err
}