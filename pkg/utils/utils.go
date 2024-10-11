package utils

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

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

func HandleObservableServer(c echo.Context) error {
	code, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}

	var codeData map[string]string
	if err := json.Unmarshal(code, &codeData); err != nil {
		return err
	}
	typeCode := codeData["runtime"]
	filename := codeData["filename"]
	jsCode := codeData["code"]
	//fmt.Println(typeCode, filename, jsCode)
	response, err := runJS(typeCode, jsCode, filename)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response)
	}

	return c.JSON(http.StatusOK, response)
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

func InitDB() {
	var err error
	if _, err = os.Stat("./data/newsletter.db"); os.IsNotExist(err) {
		file, err := os.Create("./data/newsletter.db")
		if err != nil {
			log.Fatal(err)
		}
		file.Close()
	}

	db, err = sql.Open("sqlite3", "./data/newsletter.db")
	if err != nil {
		log.Fatal(err)
	}

	// Create the table if it doesn't exist
	query := `
	CREATE TABLE IF NOT EXISTS subscriptions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE
	);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
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

func ResverseProxy(port int) echo.HandlerFunc {
	// parlay "dynamciagaly - "to 8 buns ?
	return func(c echo.Context) error {
		targetURL := "http://localhost:8009" + c.Request().URL.Path
		targetURL = strings.Replace(targetURL, "llama-backend/", "", 1) // Replace "llama-backend/" with ""

		fmt.Printf("Proxying request to: %s\n", targetURL)

		resp, err := http.Get(targetURL)
		if err != nil {
			fmt.Printf("Error proxying request: %v\n", err)
			return c.String(http.StatusInternalServerError, fmt.Sprintf("Error proxying request: %v", err))
		}
		defer resp.Body.Close()

		fmt.Printf("Received response with status: %d\n", resp.StatusCode)

		// Copy the response headers
		for key, values := range resp.Header {
			for _, value := range values {
				c.Response().Header().Add(key, value)
			}
		}

		// Set the status code and write the response body
		c.Response().WriteHeader(resp.StatusCode)
		_, err = io.Copy(c.Response().Writer, resp.Body)
		if err != nil {
			fmt.Printf("Error writing response: %v\n", err)
			return c.String(http.StatusInternalServerError, fmt.Sprintf("Error writing response: %v", err))
		}

		return nil
	}
}

func PreRender(route string, parsedTemplates *template.Template) {
	outputFile, err := os.Create("docs/" + route)
	if err != nil {
		log.Fatalf("Error creating output file: %v", err)
	}
	defer outputFile.Close()

	// Render the homepage template
	err = parsedTemplates.ExecuteTemplate(outputFile, route, nil)
	if err != nil {
		log.Fatalf("Error rendering template: %v", err)
	}
}

func RenderMarkdown(filePath string) (string, error) {
	//send a request to llama-server.js
	return "", nil
}

func SetupRoutes() echo.HandlerFunc {
	rootPath := "./views/"
	baseDirectory := rootPath + "**/*.html"
	expandMyPuss := os.ExpandEnv(baseDirectory)
	allMyRoutes, err := filepath.Glob(expandMyPuss)
	fmt.Println("allMyRoutes", allMyRoutes)

	if err != nil {
		return nil
	}
	setupdynamic := func(c echo.Context) error {
		for i := 0; i < len(allMyRoutes); i++ {
			filePath := string(allMyRoutes[i])
			if filePath == "/" {
				continue
			}
			//fmt.Println("filePath", filePath)
			if c.Request().URL.Path == "/"+filePath {
				trimmed := filePath
				return c.Render(http.StatusOK, trimmed+".html", nil)
			}
			//fmt.Println("adding route for", trimmed)
			//c.GET(trimmed, renderTemplate(trimmed))
		}

		baseDirectory = rootPath + "**/*.md"
		expandMyPuss = os.ExpandEnv(baseDirectory)
		allMyRoutes, err = filepath.Glob(expandMyPuss)
		if err != nil {
			return err
		}
		for i := 0; i < len(allMyRoutes); i++ {
			filePath := string(allMyRoutes[i])
			if filePath == "/" {
				continue
			}
			trimmed := strings.ToLower(strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath)))
			//fmt.Println("trimmed", trimmed)
			requested_route := strings.ToLower(c.Request().URL.Path)
			if requested_route == "/"+trimmed {
				html, err := RenderMarkdown(filePath)
				if err != nil {
					if os.IsNotExist(err) {
						return c.String(http.StatusNotFound, fmt.Sprintf("Blog post not found: %s", c.Param("*")))
					}
					errMsg := fmt.Sprintf("Error reading or rendering blog post: %v", err)
					fmt.Println(errMsg)
					return c.String(http.StatusInternalServerError, errMsg)
				}

				fmt.Println("Rendering blog post! !! !  ", trimmed)
				return c.Render(http.StatusOK, "blog-container.html", map[string]interface{}{"html": html})
			}
		}
		errorResponse := PrintError(c)

		return c.JSON(http.StatusNotFound, errorResponse)
	}
	return setupdynamic
}

func PrintError(c echo.Context) map[string]interface{} {
	//take an error as agurment
	//llm-rendering
	// llama on whole repo
	// If we've reached this point, no route was found
	errorResponse := map[string]interface{}{
		"error":   "Not Found",
		"message": "The requested resource could not be found",
		"details": map[string]interface{}{
			"requestedPath": c.Request().URL.Path,
			"method":        c.Request().Method,
			"timestamp":     time.Now().Format(time.RFC3339),
			"userAgent":     c.Request().UserAgent(),
			"remoteIP":      c.RealIP(),
			"possibleReasons": []string{
				"The page or resource doesn't exist",
				"The URL might be misspelled",
				"The resource might have been moved or deleted",
			},
			"suggestedActions": []string{
				"Check the URL for typos",
				"Try navigating to the homepage",
				"Use the search function if available",
				"Contact support if you believe this is an error",
			},
		},
	}
	return errorResponse
}

// A simple utility function
func PrintHello() {
	fmt.Println("Hello from utils!")
}

// utils = infinite - gen them + call from 50 line scripts - helper pattern
