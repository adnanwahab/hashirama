package utils

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
	"github.com/labstack/echo"
	_ "github.com/mattn/go-sqlite3"
)

func DummyFunction() string {
	return "Hello from utils package"
}

func WatchFiles(dirToWatch string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				log.Printf("Event: %s %s\n", event.Op, event.Name)
				if event.Op&fsnotify.Write == fsnotify.Write {
					log.Println("Modified file:", event.Name)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("Error:", err)
			}
		}
	}()

	err = watcher.Add(dirToWatch)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Watching directory: %s\n", dirToWatch)
	<-done
}

func ExecPythonCode(c echo.Context) error {
	code, _ := io.ReadAll(c.Request().Body)
	// Convert the code from JSON string to a Python code string
	var codeData map[string]string
	err := json.Unmarshal(code, &codeData)
	if err != nil {
		return err
	}

	pythonCode := codeData["code"]
	fmt.Println("pythonCode", pythonCode)
	// Execute Python code
	cmd := exec.Command("python3", "-c", pythonCode)
	//out, err := cmd.Output()

	out, err := cmd.CombinedOutput()
	if err != nil {
		return c.String(http.StatusOK, string(out))
	}
	return c.String(http.StatusOK, string(out))
}

func runJS(runtime, jscode, filename string) (map[string]string, error) {
	filePath := ""
	fmt.Println("jscode", jscode)

	if jscode != "" {
		filePath = filepath.Join("../deno-webgpu/hello-triangle/", filename)

		if err := ioutil.WriteFile(filePath, []byte(jscode), 0644); err != nil {
			return map[string]string{"error": "Failed to write to temporary file"}, err
		}
	} else {

		filePath = "../deno-webgpu/cube/mod.ts"

	}

	var cmd *exec.Cmd
	fmt.Println("filePath", filePath)
	switch runtime {
	case "bun":
		cmd = exec.Command("bun", "run", filePath)
	case "deno":
		cmd = exec.Command("deno", "run", "--allow-all", filePath)
	default:
		return map[string]string{"error": "Unsupported runtime specified"}, fmt.Errorf("unsupported runtime: %s", runtime)
	}

	fileOutput, err := cmd.CombinedOutput()
	fmt.Println("fileOutput", fileOutput, err)
	if err != nil {
		return map[string]string{"error": "Failed to run the code", "detail": err.Error(), "output": string(fileOutput)}, err
	}

	return map[string]string{"fileOutput": string(fileOutput)}, nil
}

// Save a new subscription to the database
func SaveSubscription(email string) error {
	query := `INSERT INTO subscriptions (email) VALUES (?)`
	_, err := db.Exec(query, email)
	return err
}

func GetTableNames() ([]string, error) {
	query := `SELECT name FROM sqlite_master WHERE type='table';`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return nil, err
		}
		tables = append(tables, tableName)
	}

	return tables, nil
}

// Fetch all rows from a given table
func GetTableData(tableName string) ([][]string, []string, error) {
	query := fmt.Sprintf(`SELECT * FROM %s;`, tableName)
	rows, err := db.Query(query)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		return nil, nil, err
	}

	// Prepare a slice to hold the column values
	values := make([]sql.RawBytes, len(columns))
	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	// Fetch rows
	var data [][]string
	for rows.Next() {
		err = rows.Scan(scanArgs...)
		if err != nil {
			return nil, nil, err
		}

		row := make([]string, len(columns))
		for i, col := range values {
			if col == nil {
				row[i] = "NULL"
			} else {
				row[i] = string(col)
			}
		}
		data = append(data, row)
	}

	return data, columns, nil
}

func createLogTable(db *sql.DB) {
	query := `
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        level TEXT,
        message TEXT
    );
    `
	if _, err := db.Exec(query); err != nil {
		log.Fatalf("Failed to create logs table: %v", err)
	}
}

var db *sql.DB
