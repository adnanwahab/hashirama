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
	parsedTemplates, err := templates.ParseGlob(filepath.Join("views_/**/*.html"))
	fmt.Println(parsedTemplates)
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}
	e.Renderer = &TemplateHandler{
		templates: parsedTemplates,
	}

	// Call setupDynamicRoutes to dynamically add routes
	// if err := setupDynamicRoutes(e); err != nil {
	// 	log.Fatalf("Error setting up dynamic routes: %v", err)
	// }
<<<<<<< HEAD
=======
	e.GET("/", func(c echo.Context) error {
		return c.Render(http.StatusOK, "blog.html", nil)
	})
	e.GET("/robotics-university", func(c echo.Context) error {
		return c.Render(http.StatusOK, "robotics-odyssey.html", nil)
	})

	e.GET("/robotiics-odyssey", func(c echo.Context) error {
		return c.Render(http.StatusOK, "robotics-odyssey.html", nil)
	})
>>>>>>> 7caba74 (cool)

	// Define routes dynamically
	routes := []string{"/pub", "/cgi-tools", "/office-hours", "/signup", "/llama-tools"}
	for _, route := range routes {
		e.GET(route, func(c echo.Context) error {
			return c.Render(http.StatusOK, strings.TrimPrefix(route, "/"), nil)
		})
	}

	// PreRender("blog.html")
	// PreRender("robotics-odyssey.html")
	// e.GET("/", func(c echo.Context) error {
	// 	return c.Render(http.StatusOK, "blog.html", nil)
	// })
}

// SSR with a golang supervisor -
// serve the HTML but dont use GOLANG templates much -
//slurm + voltage park
// dont render in go - renderin observable - supervisor
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

func PreRender(route string) {
	funcMap := template.FuncMap{}
	templates := template.New("").Funcs(funcMap)
	parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}

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
	fmt.Println("PreRendered", route)
}

//gamify robots - like mario - non pedantic like fake achivements -

//connect research to industry

// name 10 companies that had phd founders
//llms let anyone get a phd -self taught - poke into the knowledge

// purpose of homelab -> run a go process -> ___ catch erorrs -> handle them for users. anduril-lattice 