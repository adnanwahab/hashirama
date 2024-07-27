package main

import (
    "fmt"
    //"log"
    "os"

    "github.com/labstack/echo/v4"

    "log"
	"net/http"
    "errors"
	//"github.com/labstack/echo-contrib/echoprometheus"
<<<<<<< HEAD
	"github.com/labstack/echo/v4/middleware"
=======
	//"github.com/labstack/echo/v4/middleware"
	//
	//
	
>>>>>>> 585f7c3 (col)


)

func echoLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		req := c.Request()
		res := c.Response()

		fmt.Println("--- New Request ---")
		fmt.Printf("Method: %s\n", req.Method)
		fmt.Printf("URL: %s\n", req.URL)
		fmt.Printf("Headers: %v\n", req.Header)
		fmt.Printf("RemoteAddr: %s\n", req.RemoteAddr)

		err := next(c)

		fmt.Printf("Status: %d\n", res.Status)
		fmt.Println("--- End Request ---")

		return err
	}
}
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
    	 e.Use(middleware.Logger())
    	// e.Use(echoprometheus.NewMiddleware("myapp")) // adds middleware to gather metrics
	//e.GET("/metrics", echoprometheus.NewHandler())
	//e.Use(echoLogger)


	// sudo pkill 1337 lol
    // Start server
    //E.LOGGER.Fatal(e.Start("0.0.0.0:1337"))
 // adds route to serve gathered metrics
e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})

    if err := e.Start(":1337"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
