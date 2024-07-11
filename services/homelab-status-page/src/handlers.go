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
	"html/template"

	"net/url"
	//"hashirama/services/homelab-status-page/views"
    //"github.com/kkdai/youtube/v2"
)

func renderThemes() string {
    tmpl := `
    {{range $index, $theme := .}}
        <h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-700">{{.Name}}</h3>
        <ul class="space-y-2">
            {{range $toolIndex, $tool := .Tools}}
                <li>
                    <a href="/tools/{{$tool}}" class="pl-16 hover:text-indigo-500 transition-colors">
                        {{add $toolIndex 1}}. {{$tool}}
                    </a>
                </li>
            {{end}}
        </ul>
    {{end}}
    `

    funcMap := template.FuncMap{
        "add": func(a, b int) int {
            return a + b
        },
    }

    t, err := template.New("themes").Funcs(funcMap).Parse(tmpl)
    if err != nil {
        return err.Error()
    }

    var result strings.Builder
    err = t.Execute(&result, themes)
    if err != nil {
        return err.Error()
    }

    return result.String()
}


func download_kyubii(c echo.Context) error {

	// firefox-ext
	// web-ext reload??
	// firefox - send command 
	// dat, err := os.ReadFile("/home/adnan/hashirama/services/firefox-ext/web-ext-artifacts/kyubii-1.0.zip")
	// if err != nil {
	// 	fmt.Println("wtf man", err)
	// 	return ""
	// }
	//
	fmt.Printf("DOWNLOAD KYUBI\n")
	 c.File("/home/adnan/hashirama/services/firefox-ext/web-ext-artifacts/kyubii-1.0.zip")
	return nil
	//c.Binary(http.StatusOK, dat)
}


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

	e.GET("/api/download_kyubii", download_kyubii)
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


		parsedURL, err := url.Parse(templateName)

		if err != nil {
			fmt.Println("Error parsing Url: ", err )
				return err
		}

		baseOfTemplate := path.Base(parsedURL.Path)
		description := "Generative, autonomous creatures inhabit a viscous liquid. Their survival depends on their ability to move, which is determined by their DNA as they evolve through the generations. Locomotion is determined by interactions between body segments."
		t := headerComponent(string(b), baseOfTemplate, description)

		if err = t.Render(c.Request().Context(), buf); err != nil {
			fmt.Println("Error rendering template ", err)
			return err
		}

		return c.HTML(http.StatusOK, buf.String())
    }
}
func trimFilename(filePath string) string {
	return strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath))
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
		trimmed := prefix + trimFilename(filePath)
		fmt.Println("adding route for", trimmed)
		e.GET(trimmed, renderTemplate(trimmed))
    }
}

func setupDynamicRoutes(e *echo.Echo) {
    // Implementation for setting up dynamic routes
	this_is_shit(e, "$HOME/hashirama/services/homelab-status-page/views/*.html", "")
	this_is_shit(e, "$HOME/hashirama/services/homelab-status-page/views/tools/*.html", "tools/")

}
