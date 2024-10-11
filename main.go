package main

import (
	"errors"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"path/filepath"

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

var serverPorts = map[string]int{
	"llama-backend":      8900,
	"cgi-backend":        8003,
	"flirt-flow-backend": 8004,
	"odyssey":            7999, // Assuming 7999 is one of the ports for odyssey
	"air":                8000, // Assuming 8000 is another port for odyssey
	"proxy-jupyter":      8888,
}

func main() {
	e := echo.New()
	e.Debug = true
	funcMap := template.FuncMap{}
	templates := template.New("").Funcs(funcMap)
	parsedTemplates, err := templates.ParseGlob(filepath.Join("views/**/*.html"))
	// for _, tmpl := range parsedTemplates.Templates() {
	// 	log.Printf("Parsed template: %s", tmpl.Name())
	// }
	e.Renderer = &TemplateHandler{
		templates: parsedTemplates,
	}

	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}
	e.Static("/static", "static")
	e.Static("/data", "data")

	e.GET("/proxy", func(c echo.Context) error { //yt-instant
		return c.String(http.StatusOK, "<div>not yet</div>")
	})

	//e.GET("/*", utils.SetupRoutes)

	e.GET("/cgi-backend/*", func(c echo.Context) error {
		targetURL := fmt.Sprintf("http://localhost:%d%s", serverPorts["cgi-backend"], c.Request().URL.Path[len("/cgi-backend"):])
		resp, err := http.Get(targetURL)
		if err != nil {
			return c.String(http.StatusInternalServerError, fmt.Sprintf("Error proxying request: %v", err))
		}
		defer resp.Body.Close()

		for k, v := range resp.Header {
			c.Response().Header().Set(k, v[0])
		}
		c.Response().WriteHeader(resp.StatusCode)
		_, err = io.Copy(c.Response().Writer, resp.Body)
		return err
	})

	e.GET("/cgi-tools", func(c echo.Context) error {
		return c.Render(http.StatusOK, "cgi-tools.html", nil)
	})

	if err := e.Start(":7999"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
