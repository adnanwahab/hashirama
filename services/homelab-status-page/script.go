package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func parseFile(filename string) (map[int][]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	result := make(map[int][]string)
	var currentKey int

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		if key, err := strconv.Atoi(line); err == nil {
			currentKey = key
			result[currentKey] = []string{}
		} else {
			result[currentKey] = append(result[currentKey], line)
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func saveToJSON(data map[int][]string, filename string) error {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(filename, jsonData, 0644)
}

func moveFiles(data map[int][]string, originalPath string) error {
	for key, values := range data {
		dirPath := filepath.Join(originalPath, strconv.Itoa(key))
		err := os.MkdirAll(dirPath, os.ModePerm)
		if err != nil {
			return err
		}

		for _, value := range values {
			srcPath := filepath.Join(originalPath, value)
			destPath := filepath.Join(dirPath, value)

			fmt.Println(srcPath, destPath)
			err := os.Rename(srcPath, destPath)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func main() {
	filename := "wtf.json"
	data, err := parseFile(filename)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	//fmt.Printf("%+v\n", data)

	outputFile := "output.json"
	err = saveToJSON(data, outputFile)
	if err != nil {
		fmt.Printf("Error saving to JSON: %v\n", err)
		return
	}

	originalPath := "/Users/shelbernstein/Documents/original/"
	err = moveFiles(data, originalPath)
	if err != nil {
		fmt.Printf("Error moving files: %v\n", err)
		return
	}

	fmt.Printf("Successfully parsed input, saved JSON to %s, and moved files\n", outputFile)
}
