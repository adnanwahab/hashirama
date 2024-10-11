package main

import (
	"errors"
	"fmt"
	"homelab/pkg/utils"
	"io"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

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

	e.Static("/static", "static")
	e.Static("/data", "data")
	utils.SetupRendering(e)

	for backend, port := range serverPorts {
		e.GET(fmt.Sprintf("/%s/*", backend), func(c echo.Context) error {
			targetURL := fmt.Sprintf("http://localhost:%d%s", port, c.Request().URL.Path[len(fmt.Sprintf("/%s", backend)):])
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
	}

	if err := e.Start(":7999"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
