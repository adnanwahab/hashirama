package utils




e.Debug = true

// Define template function map and parse templates
funcMap := template.FuncMap{}
templates := template.New("").Funcs(funcMap)
parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
if err != nil {
	log.Fatalf("Error parsing templates: %v", err)
}
e.Renderer = &TemplateHandler{
	templates: parsedTemplates,
}

// Call setupDynamicRoutes to dynamically add routes
if err := setupDynamicRoutes(e); err != nil {
	log.Fatalf("Error setting up dynamic routes: %v", err)
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