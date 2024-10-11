package main

import (
	"errors"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v4"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

type TemplateHandler struct {
	templates *template.Template
}

func (t *TemplateHandler) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

// func reverse_proxy() echo.HandlerFunc {
// 	// parlay "dynamciagaly - "to 8 buns ?
// 	return func(c echo.Context) error {
// 		targetURL := "http://localhost:8009" + c.Request().URL.Path
// 		targetURL = strings.Replace(targetURL, "llama-backend/", "", 1) // Replace "llama-backend/" with ""

// 		fmt.Printf("Proxying request to: %s\n", targetURL)

// 		resp, err := http.Get(targetURL)
// 		if err != nil {
// 			fmt.Printf("Error proxying request: %v\n", err)
// 			return c.String(http.StatusInternalServerError, fmt.Sprintf("Error proxying request: %v", err))
// 		}
// 		defer resp.Body.Close()

// 		fmt.Printf("Received response with status: %d\n", resp.StatusCode)

// 		// Copy the response headers
// 		for key, values := range resp.Header {
// 			for _, value := range values {
// 				c.Response().Header().Add(key, value)
// 			}
// 		}

// 		// Set the status code and write the response body
// 		c.Response().WriteHeader(resp.StatusCode)
// 		_, err = io.Copy(c.Response().Writer, resp.Body)
// 		if err != nil {
// 			fmt.Printf("Error writing response: %v\n", err)
// 			return c.String(http.StatusInternalServerError, fmt.Sprintf("Error writing response: %v", err))
// 		}

// 		return nil
// 	}
// }

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

//cgi-backend 8001
//llama-backend 8002
//hardware-tools 8003
//flirt-flow-backend 8004
//odyssey port - 7999,8000 - air
//not getting married till - 32, 47 - 2024- 2039 = 15 years .

func main() {
	e := echo.New()
	e.Debug = true
	funcMap := template.FuncMap{
		"joinStrings": func(items []string) string {
			return strings.Join(items, " ")
		},
	}
	templates := template.New("").Funcs(funcMap)
	parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}

	PreRender("index.html", parsedTemplates)
	PreRender("llama-tools.html", parsedTemplates)
	PreRender("robotics-odyssey.html", parsedTemplates)

	e.Renderer = &TemplateHandler{
		templates: parsedTemplates,
	}

	e.GET("/", func(c echo.Context) error {
		return c.Render(http.StatusOK, "index.html", nil)
	})

	// fileChangeChan := make(chan string)
	// go utils.WatchFiles(".")

	// e.GET("/event-source", func(c echo.Context) error {
	// 	c.Response().Header().Set("Content-Type", "text/event-stream")
	// 	c.Response().Header().Set("Cache-Control", "no-cache")
	// 	c.Response().Header().Set("Connection", "keep-alive")

	// 	utils.WatchFiles(".")

	// 	for {
	// 		select {
	// 		case changedFile := <-fileChangeChan:
	// 			data, _ := json.Marshal(map[string]string{"file": changedFile})
	// 			_, err := fmt.Fprintf(c.Response().Writer, "data: %s\n\n", data)
	// 			if err != nil {
	// 				log.Printf("Error sending event: %v", err)
	// 				return err
	// 			}
	// 		case <-time.After(30 * time.Second):
	// 			// Send a heartbeat to keep the connection alive
	// 			_, err := fmt.Fprintf(c.Response().Writer, "data: heartbeat\n\n")
	// 			if err != nil {
	// 				log.Printf("Error sending heartbeat: %v", err)
	// 				return err
	// 			}
	// 		}
	// 		c.Response().Flush()
	// 	}
	// })
	//e.GET("/bun", reverse_proxy())

	e.GET("/cgi", func(c echo.Context) error {
		return c.Render(http.StatusOK, "cgi.html", nil)
	})
	e.GET("/robotics-odyssey", func(c echo.Context) error {
		return c.Render(http.StatusOK, "robotics-odyssey.html", nil)
	})

	e.GET("/llama-tools", func(c echo.Context) error {
		return c.Render(http.StatusOK, "llama-tools.html", nil)
	})
	e.GET("/llama-backend/*", func(c echo.Context) error {
		targetURL := "http://localhost:8900" + c.Request().URL.Path
		targetURL = strings.Replace(targetURL, "llama-backend/", "", 1) // Replace "llama-backend/" with ""

		//targetURL = strings.Replace(targetURL, "llama-backend/", "", 1)
		fmt.Println(targetURL)

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
	})

	e.GET("/particles", func(c echo.Context) error {
		return c.Render(http.StatusOK, "particles.html", nil)
	})

	e.GET("/_morpharget-particles-magink", func(c echo.Context) error {
		return c.Render(http.StatusOK, "_morpharget-particles-magink.html", nil)
	})

	e.Static("/static", "static")
	e.Static("/data", "data")

	e.GET("/proxy", func(c echo.Context) error {
		return c.String(http.StatusOK, "<div>not yet</div>")
	})

	//nanosaur debuger = 2 cameras -> split frames -> vit -> have embeddings of good attempts ?

	e.GET("/proxy-jupyter/*", func(c echo.Context) error {
		targetURL := "http://localhost:8888" + c.Request().URL.Path
		fmt.Printf("Proxying request to: %s\n", targetURL)

		//targetURL = strings.Replace(targetURL, "llama-backend/", "", 1)
		fmt.Println(targetURL)

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
	})

	e.GET("/test-runner", func(c echo.Context) error {
		return c.HTML(http.StatusOK, "<div>test</div><script type='module' src='/static/js/test-runner.js'></script>")
	})

	e.GET("/api/*", func(c echo.Context) error {
		return c.String(http.StatusOK, "<div>test</div>")
	})

	e.POST("/api/*", func(c echo.Context) error {
		return c.String(http.StatusOK, "<div>test</div>")
	})
	// games like metroid + paper mario - tool assisted -> generate a walk through.

	e.GET("/demo", func(c echo.Context) error {
		idk := c.Request().URL.Query().Get("idk")
		fmt.Println(idk)
		targetURL := "http://localhost:3002" + c.Request().URL.Path
		fmt.Printf("Proxying request to: %s\n", targetURL)

		//targetURL = strings.Replace(targetURL, "llama-backend/", "", 1)
		fmt.Println(targetURL)

		resp, err := http.Get(targetURL + "?idk=" + idk)
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
	})

	// e.GET("/obs-local", reverse_proxy())

	// 	//targetURL = strings.Replace(targetURL, "cgi-backend/", "", 1)

	// 	resp, err := http.Get(targetURL)
	// 	fmt.Println(targetURL)
	// 	if err != nil {
	// 		fmt.Printf("Error proxying request: %v\n", err)
	// 		return c.String(http.StatusInternalServerError, fmt.Sprintf("Error proxying request: %v", err))
	// 	}
	// 	defer resp.Body.Close()

	// 	fmt.Printf("Received response with status: %d\n", resp.StatusCode)

	// 	// Copy the response headers
	// 	for key, values := range resp.Header {
	// 		for _, value := range values {
	// 			c.Response().Header().Add(key, value)
	// 		}
	// 	}

	// 	// Set the status code and write the response body
	// 	c.Response().WriteHeader(resp.StatusCode)
	// 	_, err = io.Copy(c.Response().Writer, resp.Body)
	// 	if err != nil {
	// 		fmt.Printf("Error writing response: %v\n", err)
	// 		return c.String(http.StatusInternalServerError, fmt.Sprintf("Error writing response: %v", err))
	// 	}

	// 	return nil
	// })

	e.GET("/cgi-backend/*", func(c echo.Context) error {
		targetURL := "http://localhost:8002" + c.Request().URL.Path
		fmt.Printf("Proxying request to: %s\n", targetURL)

		//targetURL = strings.Replace(targetURL, "cgi-backend/", "", 1)

		resp, err := http.Get(targetURL)
		fmt.Println(targetURL)
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
	})

	if err := e.Start(":7005"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
