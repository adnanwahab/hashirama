// database.go
package main

import (
    "encoding/json"
    "errors"
    //"fmt"
    "io/fs"
    "os"
    //"path/filepath"
    //"runtime"
)

// DB is a database backed by a JSON file.
type DB[T any] struct {
    Data *T
    path string
}

func openDB[T any](path string) (*DB[T], error) {
    bs, err := os.ReadFile(path)
    if errors.Is(err, fs.ErrNotExist) {
        return &DB[T]{
            Data: new(T),
            path: path,
        }, nil
    } else if err != nil {
        return nil, err
    }

    var val T
    if err := json.Unmarshal(bs, &val); err != nil {
        return nil, err
    }

    return &DB[T]{
        Data: &val,
        path: path,
    }, nil
}

func (db *DB[T]) save() error {
    bs, err := json.Marshal(db.Data)
    if err != nil {
        return err
    }

    return atomicWriteFile(db.path, bs, 0600)
}

func atomicWriteFile(filename string, data []byte, perm os.FileMode) (err error) {
    // Implementation
    return nil
}

