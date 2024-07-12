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

type Chat struct {
    ID    string
    Title string
	avatar_url *string
}

type PageData struct {
    ChatHistory map[string][]Chat
    UserProfileImage string
    UserName string
	ShowTeamWorkSpace bool
}

func renderChat() string{

	avatars := map[string][]string{
		"Neural Network Plumbing":{"https://files.oaiusercontent.com/file-PeqnTG5NGsLDRMNCxmipWC20?se=2124-05-06T10%3A22%3A42Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D316758dd-54a8-4864-aa60-58b9bf5663a5.png&sig=Y7Wo1VW4PUU6CLQZw%2BPKNiQkcI1yp0QrIxO1sx3soQg%3D"},
		"DoomEmacs and Devops":{"https://files.oaiusercontent.com/file-soCSJ2n0ySryDfgySffuOBIf?se=2124-05-06T09%3A51%3A23Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D3b0cb232-0805-4851-b34a-1c2e6c04430c.png&sig=mro7QVJHH3S7IlnwmnMTRgQrSl%2BYy9s2uwPFkM9f7Og%3D"},
		"NixOS Guide":{"https://files.oaiusercontent.com/file-KMabO7iGoP0sAGTu7rDNH3Ju?se=2124-05-06T03%3A54%3A45Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D4999a3ed-211f-41ca-a6b6-1ce0bddda99e.png&sig=Y%2BxB2//UkVTHr3t7yopFHei9duv3cOB%2BaxKkXeUEjRo%3D"},
		"Golang, Networking, and Unix Fundamentals":{ "https://lh3.googleusercontent.com/a-/AOh14GjRgSbI8yMMWfTagyCfu2C1YlqG-7n9aJ_46C7kgQ=s96-c"},
		"404": {"https://pbs.twimg.com/profile_images/1486033940301426711/HoYf1hzR_400x400.jpg"},
	}

	pinned := []string{
		"Neural Network",
                "DoomEmacs and Devops",
                "NixOs Guide",
				"Golang Networking",
				"Explore GPTs",
	}
	
	yesterday := []string{
  "Set Up Desktop Remotely",
  "New chat",
  "Texas road network access",
  "Firefox Extension Name: \"ArcAI Edge\"",
  "Remote GPU Docker Setup",
  "petabyte to Terabyte Conversion",
	}

		more_than_7 := []string{
  "Set Up Desktop Remotely",
  "New chat",
  "Firefox Extension Name: \"ArcAI Edge\"",
  "Remote GPU Docker Setup",
  "Petabyte to Terabyte Conversion",
		}

	
    data := PageData{
        ChatHistory: map[string][]Chat{
			"Pinned": {},
            "Today": {},
            "Yesterday": {},
        },
        UserProfileImage: "https://example.com/profile.jpg",
        UserName: "John Doe",
		ShowTeamWorkSpace: true,
    }
	list_of_lists := [][]string{pinned,  yesterday, more_than_7}
	list_of_names := []string{"Pinned", "Today", "Yesterday"}

	
	
	for idx, name := range list_of_names {
		for i, v := range list_of_lists[idx] {
			chatInstance := Chat{ID: fmt.Sprintf("%d", i+1), Title: v}

			if urls, ok := avatars[v]; ok && len(urls) > 0 {
				chatInstance.avatar_url = &urls[0]
			} else {
				chatInstance.avatar_url = &avatars["404"][0]
			}
			fmt.Print("rendering history for ", v, "\n")
			data.ChatHistory[name] = append(data.ChatHistory[name], chatInstance)	
		} 
	}

	tmpl, shit := os.ReadFile("/home/adnan/hashirama/services/homelab-status-page/views/chat-sidebar.html")
	if shit != nil {
        return shit.Error()
    }

	t, err := template.New("chat").Parse(string(tmpl))
    if err != nil {
        return err.Error()
    }

	

    var result strings.Builder
    err = t.Execute(&result, data)
    if err != nil {
        return err.Error()
    }

    return result.String()
}

func renderThemes() string {
    tmpl := `
    {{range $index, $theme := .}}
     <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-semibold mb-4 text-indigo-700">{{.Name}}</h3>
        <ul class="space-y-2">
            {{range $toolIndex, $tool := .Tools}}
                <li hx-get="/tools/{{$tool}}" hx-target="#my-ass"   class="cursor-pointer hover:bg-indigo-50 p-2 rounded transition-colors">
                    <div href="#tools/{{$tool}}" class="pl-16 hover:text-indigo-500 transition-colors">
                        
                    <span class="hover:text-indigo-500">{{add $toolIndex 1}}. {{$tool}}</span>
                    </div>
                </li>
            {{end}}
        </ul>
    </div>
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
	e.GET("/api/chat", handleChat)
	

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

func handleChat(c echo.Context) error {
    return c.HTML(http.StatusOK, renderChat())
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
