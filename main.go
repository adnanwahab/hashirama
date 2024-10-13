package main

import (
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

var serverPorts = map[string]int{
	"llama-backend":            7095,
	"cgi-backend":              7096,
	"robotics-odyssey-backend": 7998,
	//oddyssey -
	"main.go":       8000,
	"proxy-jupyter": 8888,
}

// delete echo -> stdlib -> 1 route -> talks 1000 bun + 1 py
func main() {
	e := echo.New()

	e.Static("/static", "static")
	e.Static("/data", "data")

	backend := "/robotics-odyssey-backend"
	port := 3003
	route_name := fmt.Sprintf("%s/*", backend)

	fmt.Println("Route Name:", route_name, "Port:", port)

	e.GET(route_name, func(c echo.Context) error {
		route_path := c.Request().URL.Path
		fmt.Println("Received Path:", route_path)

		targetURL := fmt.Sprintf("http://localhost:%d%s", port, route_path)
		fmt.Println("Target URL:", targetURL)

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
	//most likely 1 bun process should serve it -

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

// proxy /* to bun-ui-process
// proxy /api/* to cgi-backend
// proxy /observable/* to observablehq
//keep this to 50 lines - all code basically
//rich-hickey-endpoint (simplificaiton llama)
