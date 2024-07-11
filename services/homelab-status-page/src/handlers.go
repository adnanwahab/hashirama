package main

import (
    "fmt"
    "net/http"
    "os"
	"path"


	"github.com/a-h/templ"


    "github.com/labstack/echo/v4"
	"path/filepath"

	"strings"
    //"github.com/kkdai/youtube/v2"
)

func setupRoutes(e *echo.Echo) {
	fmt.Printf("wtf setup routes\n")

    e.POST("/video-to-pdf", handleConvertVideoToPDF)
    e.GET("/agents", handleAgents)
    e.POST("/add-agent", handleAddAgent)
    e.GET("/download_apm.el", handleDownloadApmEl)

    // Setup dynamic routes
    setupDynamicRoutes(e)

    e.GET("/form", renderTemplate("form"))
    e.GET("/", renderTemplate("index"))
    e.GET("/api/themes", handleThemes)
    e.POST("/beep", beep)



	
}

func handleConvertVideoToPDF(c echo.Context) error {
    // Implementation
    return nil
}

func handleAgents(c echo.Context) error {
    return c.JSON(http.StatusOK, agents)
}

func handleAddAgent(c echo.Context) error {
    agent := new(Agent)
    if err := c.Bind(agent); err != nil {
        return err
    }

    agents = append(agents, *agent)
    return c.JSON(http.StatusCreated, agents)
}

func handleDownloadApmEl(c echo.Context) error {
    dat, err := os.ReadFile("/home/adnan/.config/Dot-files-main/doom/+apm.el")

	// actually send this URL TO firefox on the downlaod place and have it use native Messaging like this
	//
	// wget  /home/adnan/.config/Dot-files-main/doom/+apm.el
	// mv apm.el ~/.config/doom/???
	// exactly - universal constructor 
    if err != nil {
        return err
    }
    return c.String(http.StatusOK, string(dat))
}

func handleThemes(c echo.Context) error {
    return c.HTML(http.StatusOK, renderThemes())
}

func beep(c echo.Context) error {
    // Implementation
    return nil
}

func renderTemplate(templateName string) echo.HandlerFunc {
    // Implementation
    return func(c echo.Context) error {
        // Your implementation here
		fmt.Printf("templateName", templateName)

		if templateName == "/index" {
			templateName = "index.temp"
		}
		rootPath := os.ExpandEnv("$HOME/hashirama/services/homelab-status-page/views/")
		fmt.Printf("Received route on /%s\n", templateName)
		name := path.Join(rootPath, templateName + ".html")
		fmt.Printf("ROUTING TO %s\n", name)
		b, err := os.ReadFile(name) // just pass the file name
		if err != nil {
			fmt.Printf("oh shit dog %s\n", err)
			return err
		}
		c.Response().Header().Set("Content-Type", "text/html")

		buf := templ.GetBuffer()
		defer templ.ReleaseBuffer(buf)


		parsedURL, err := url.parse(templateName)

		if err != nil {
			fmt.Println("Error parsing Url: ", err )
				return err
		}

		baseOfTemplate := path.Base(parsedURL.Path)


		t := views.headerComponent(string(b), baseOfTemplate, "Description text")

		if err = t.Render(c.Request().Context(), buf); err != nil {
			fmt.Println("Error rendering template ", err)
			return err
		}
		
		return c.HTML(http.StatusOK, buf.String())
    }
}
func trimMyDick(filePath string) string {
	baseName := filepath.Base(filePath)
    fileName := strings.TrimSuffix(baseName, filepath.Ext(baseName))
	return fileName
}


func this_is_shit(e *echo.Echo, baseDirectory string, prefix string ) {
	expandMyPuss := os.ExpandEnv(baseDirectory)
	allMyRoutes, err := filepath.Glob(expandMyPuss)
	//fmt.Println("adding route for", allMyRoutes,  baseDirectory, expandMyPuss, len(allMyRoutes), trimMyDick(allMyRoutes[0]))
	//e.GET("/tools", renderTemplate("form"))
	if err != nil {return }
	for i := 0; i < len(allMyRoutes); i++ {
		filePath := string(allMyRoutes[i])
		if filePath == "/" {continue}
		trimmed := prefix + trimMyDick(filePath)
		fmt.Println("adding route for", trimmed)
		e.GET(trimmed, renderTemplate(trimmed))
    }
}

func setupDynamicRoutes(e *echo.Echo) {
    // Implementation for setting up dynamic routes
	this_is_shit(e, "$HOME/hashirama/services/homelab-status-page/views/*.html", "")
	this_is_shit(e, "$HOME/hashirama/services/homelab-status-page/views/tools/*.html", "tools/")

}
