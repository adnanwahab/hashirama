package utils

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/labstack/echo"
	_ "github.com/mattn/go-sqlite3"
)

func ReverseProxy(port int) echo.HandlerFunc {
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

// A simple utility function
func PrintHello() {
	fmt.Println("Hello from utils!")
}
