package main

import (
    "fmt"
    //"log"
    "os"

    "github.com/labstack/echo/v4"
)

func main() {
    binaryName := os.Args[0]
    fmt.Println("Binary name:", binaryName)

    e := echo.New()

    // Setup routes
    setupRoutes(e)

    // Setup static files
    e.Static("/static", "static")
    e.Static("/assets", "static")

    // Setup error handler
    e.HTTPErrorHandler = customHTTPErrorHandler


	// sudo pkill 1337 lol
    // Start server
    e.Logger.Fatal(e.Start("0.0.0.0:1337"))
}

