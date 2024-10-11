package utils

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

// Function to set up dynamic routes based on HTML and Markdown files
func setupDynamicRoutes(e *echo.Echo) error {
	// Setup HTML routes
	htmlFiles, err := getFilePaths("views/**/*.html")
	if err != nil {
		return err
	}
	for _, filePath := range htmlFiles {
		trimmed := trimFilename(filePath)
		e.GET("/"+trimmed, func(c echo.Context) error {
			return c.Render(http.StatusOK, trimmed+".html", nil)
		})
	}

	// Add a catch-all route to handle 404 errors
	e.HTTPErrorHandler = notFoundHandler
	return nil
}

// Helper function to get file paths using glob patterns
func getFilePaths(pattern string) ([]string, error) {
	expandedPath := os.ExpandEnv(pattern)
	return filepath.Glob(expandedPath)
}

// Helper function to trim file names
func trimFilename(filePath string) string {
	return strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath))
}

// Not found handler to return a 404 JSON response
func notFoundHandler(err error, c echo.Context) {
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
	c.JSON(http.StatusNotFound, errorResponse)
}

// Example TemplateHandler to render templates
type TemplateHandler struct {
	templates *template.Template
}

func (t *TemplateHandler) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	// Use ExecuteTemplate to render the specific template by name
	return t.templates.ExecuteTemplate(w, name, data)
}

func SetupRendering(e *echo.Echo) {
	// Create new Echo instance
	e.Debug = true
	funcMap := template.FuncMap{}
	templates := template.New("").Funcs(funcMap)
	parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
	fmt.Println(parsedTemplates)
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}
	e.Renderer = &TemplateHandler{
		templates: parsedTemplates,
	}

	// // Call setupDynamicRoutes to dynamically add routes
	// if err := setupDynamicRoutes(e); err != nil {
	// 	log.Fatalf("Error setting up dynamic routes: %v", err)
	// }
	e.GET("/", func(c echo.Context) error {
		return c.Render(http.StatusOK, "robotics-odyssey.html", nil)
	})
	e.GET("/robotics-odyssey", func(c echo.Context) error {
		return c.Render(http.StatusOK, "robotics-odyssey.html", nil)
	})

	e.GET("/pub", func(c echo.Context) error {
		return c.Render(http.StatusOK, "pub.html", nil)
	})
	e.GET("/cgi-tools", func(c echo.Context) error {
		fmt.Println("cgi page", "hi")
		return c.Render(http.StatusOK, "cgi-tools.html", nil)
	})
	e.GET("/office-hours", func(c echo.Context) error {
		fmt.Println("cgi page", "hi")
		return c.Render(http.StatusOK, "office-hours.html", nil)
	})
}

// func getFilePaths(pattern string) ([]string, error) {
// 	expandedPath := os.ExpandEnv(pattern)
// 	return filepath.Glob(expandedPath)
// }

// // Helper function to trim file names
// func trimFilename(filePath string) string {
// 	return strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath))
// }

// func notFoundHandler(err error, c echo.Context) {
// 	errorResponse := map[string]interface{}{
// 		"error": "Not Found",
// 	}
// 	c.JSON(http.StatusNotFound, errorResponse)
// }

// type PageData struct {
// 	IsStoryBook bool
// }

// func GetPageData(filePath string) PageData {
// 	return PageData{}
// }

// func SetupRendering(e *echo.Echo) {
// 	e.Debug = true

// 	// Define template function map and parse templates
// 	funcMap := template.FuncMap{}
// 	templates := template.New("").Funcs(funcMap)
// 	parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
// 	if err != nil {
// 		log.Fatalf("Error parsing templates: %v", err)
// 	}
// 	e.Renderer = &TemplateHandler{
// 		templates: parsedTemplates,
// 	}

// 	// Call setupDynamicRoutes to dynamically add routes
// 	if err := setupDynamicRoutes(e); err != nil {
// 		log.Fatalf("Error setting up dynamic routes: %v", err)
// 	}

// }

// func HandleObservableServer(c echo.Context) error {
// 	code, err := io.ReadAll(c.Request().Body)
// 	if err != nil {
// 		return err
// 	}

// 	var codeData map[string]string
// 	if err := json.Unmarshal(code, &codeData); err != nil {
// 		return err
// 	}
// 	typeCode := codeData["runtime"]
// 	filename := codeData["filename"]
// 	jsCode := codeData["code"]
// 	//fmt.Println(typeCode, filename, jsCode)
// 	response, err := runJS(typeCode, jsCode, filename)
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, response)
// 	}

// 	return c.JSON(http.StatusOK, response)
// }

// func PreRender(route string, parsedTemplates *template.Template) {
// 	outputFile, err := os.Create("docs/" + route)
// 	if err != nil {
// 		log.Fatalf("Error creating output file: %v", err)
// 	}
// 	defer outputFile.Close()

// 	// Render the homepage template
// 	err = parsedTemplates.ExecuteTemplate(outputFile, route, nil)
// 	if err != nil {
// 		log.Fatalf("Error rendering template: %v", err)
// 	}
// }
