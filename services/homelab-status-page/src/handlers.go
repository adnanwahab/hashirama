
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
    "log"
	"github.com/gorilla/websocket"
	///"github.com/pion/webrtc/v3"
)
var rootPath = os.ExpandEnv("$HOME/hashirama/services/homelab-status-page/views/")

// func handle_webrtc() {
// 	// Initialize ZED camera
// 	camera, err := zed.Create(zed.ID_ZED2i)
// 	if err != nil {
// 		log.Fatal("Failed to create ZED camera:", err)
// 	}
// 	defer camera.Close()

	// Set ZED camera parameters
	// params := zed.NewInitParameters()
// 	params.SetDepthMode(zed.DEPTH_MODE_NONE)
// 	params.SetCoordinateUnits(zed.UNIT_MILLIMETER)
// 	params.SetCoordinateSystem(zed.COORDINATE_SYSTEM_IMAGE)

// 	// Open the camera
// 	err = camera.Open(params)
// 	if err != nil {
// 		log.Fatal("Failed to open ZED camera:", err)
// 	}

// 	// Configure WebRTC
// 	config := webrtc.Configuration{
// 		ICEServers: []webrtc.ICEServer{
// 			{
// 				URLs: []string{"stun:stun.l.google.com:19302"},
// 			},
// 		},
// 	}

// 	// Create a new RTCPeerConnection
// 	peerConnection, err := webrtc.NewPeerConnection(config)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer peerConnection.Close()

// 	// Create a video track
// 	videoTrack, err := webrtc.NewTrackLocalStaticSample(webrtc.RTPCodecCapability{MimeType: "video/h264"}, "video", "pion")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// Add the track to the peer connection
// 	_, err = peerConnection.AddTrack(videoTrack)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// Set the handler for ICE connection state
// 	peerConnection.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
// 		fmt.Printf("ICE Connection State has changed: %s\n", connectionState.String())
// 	})

// 	// Start capturing and streaming
// 	go func() {
// 		for {
// 			// Grab a new frame from the ZED camera
// 			if camera.Grab(zed.NewRuntimeParameters()) == nil {
// 				// Retrieve the left image
// 				image, err := camera.RetrieveImage(zed.VIEW_LEFT)
// 				if err != nil {
// 					log.Println("Failed to retrieve image:", err)
// 					continue
// 				}

// 				// TODO: Encode the image to H264
// 				// This step depends on your preferred H264 encoding library
// 				encodedFrame := encodeToH264(image)

// 				// Write the encoded frame to the video track
// 				err = videoTrack.WriteSample(media.Sample{Data: encodedFrame, Duration: time.Second / 30})
// 				if err != nil {
// 					log.Println("Failed to write sample:", err)
// 				}
// 			}
// 		}
// 	}()

// 	// Wait forever
// 	select {}
// }

// func encodeToH264(image *zed.Mat) []byte {
// 	// TODO: Implement H264 encoding
// 	// This function should take the ZED image and return H264 encoded data
// 	// You might use a library like x264 or OpenH264 for this
// 	return []byte{}
// }


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

type Agent struct {
    Name string `json:"name" form:"name"`
    Type string `json:"type" form:"type"`
}

type Theme struct {
    Name  string
    Tools []string
}

var agents []Agent


var avatars = map[string][]string{
		"Neural Network Plumbing":{"https://files.oaiusercontent.com/file-PeqnTG5NGsLDRMNCxmipWC20?se=2124-05-06T10%3A22%3A42Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D316758dd-54a8-4864-aa60-58b9bf5663a5.png&sig=Y7Wo1VW4PUU6CLQZw%2BPKNiQkcI1yp0QrIxO1sx3soQg%3D"},
		"DoomEmacs and Devops":{"https://files.oaiusercontent.com/file-soCSJ2n0ySryDfgySffuOBIf?se=2124-05-06T09%3A51%3A23Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D3b0cb232-0805-4851-b34a-1c2e6c04430c.png&sig=mro7QVJHH3S7IlnwmnMTRgQrSl%2BYy9s2uwPFkM9f7Og%3D"},
		"NixOS Guide":{"https://files.oaiusercontent.com/file-KMabO7iGoP0sAGTu7rDNH3Ju?se=2124-05-06T03%3A54%3A45Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D4999a3ed-211f-41ca-a6b6-1ce0bddda99e.png&sig=Y%2BxB2//UkVTHr3t7yopFHei9duv3cOB%2BaxKkXeUEjRo%3D"},
		"Golang, Networking, and Unix Fundamentals":{ "https://lh3.googleusercontent.com/a-/AOh14GjRgSbI8yMMWfTagyCfu2C1YlqG-7n9aJ_46C7kgQ=s96-c"},
		"404": {"https://pbs.twimg.com/profile_images/1486033940301426711/HoYf1hzR_400x400.jpg"},
	}

var pinned = []string{
		"Neural Network",
                "DoomEmacs and Devops",
                "NixOs Guide",
				"Golang Networking",
				"Explore GPTs",
	}

	var yesterday = []string{
  "Set Up Desktop Remotely",
  "New chat",
  "Travel to Bali",
  "Firefox Extension Name: \"ArcAI Edge\"",
  "Remote GPU Docker Setup",
  "petabyte to Terabyte Conversion",
	}

		var more_than_7 = []string{
  "Set Up Desktop Remotely",
  "New chat",
  "Firefox Extension Name: \"ArcAI Edge\"",
  "Remote GPU Docker Setup",
  "Petabyte to Terabyte Conversion",
		}

	var list_of_lists = [][]string{pinned,  yesterday, more_than_7}
var list_of_names = []string{"Pinned", "Today", "Yesterday"}


var themes = []Theme{
    {
        Name:  "Creative AI",
        Tools: []string{"linux-intelligence", "apm.el", "kyubii"},
    },
    {
        Name:  "Robotics + ML",
        Tools: []string{"multiplayer-command-and-control", "continuous-eval", "simulation-pixel-streaming", "auto-labeling"},
    },
    {
        Name:  "Domain Knowledge / Expertise",
        Tools: []string{"agent-playground", "dating-photos", "robot-doctor"},
    },
}




// Keep the struct definitions as they are
type BlogPost struct {
    Title string
    URL   string
    Date  string
}


// Update the HTML template
var tmpl = `

`

func renderChat() string{


    data := PageData{
        ChatHistory: map[string][]Chat{
			// "Pinned": {},
            // "Today": {},
            // "Yesterday": {},
        },
        UserProfileImage: "https://example.com/profile.jpg",
        UserName: "John Doe",
		ShowTeamWorkSpace: true,
    }


    for _, theme := range themes {
        chats := make([]Chat, len(theme.Tools))
        for i, tool := range theme.Tools {
            chats[i] = Chat{ID: fmt.Sprintf("%d", i+1), Title: tool}
        }
        data.ChatHistory[theme.Name] = chats
    }
	//list_of_names := []string{"FavoriteBlogs", "FavoriteApps", "Cool"}
	// for idx, name := range list_of_names {
	// 	for i, v := range list_of_lists[idx] {
	// 		chatInstance := Chat{ID: fmt.Sprintf("%d", i+1), Title: v}

	// 		if urls, ok := avatars[v]; ok && len(urls) > 0 {
	// 			chatInstance.avatar_url = &urls[0]
	// 		} else {
	// 			chatInstance.avatar_url = &avatars["404"][0]
	// 		}
	// 		fmt.Print("rendering history for ", v)
	// 		data.ChatHistory[name] = append(data.ChatHistory[name], chatInstance)
	// 	}
	// }



	tmpl, shit := os.ReadFile(rootPath + "chat-sidebar.html")
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


func renderContainer() string {
	type PageData struct {
    LatestPosts []BlogPost
    BestPosts   []BlogPost

		Projects   []BlogPost
		Robotics []BlogPost
		Biotech []BlogPost
		Medtech  []BlogPost
		GovTech  []BlogPost
		CreativeAI  []BlogPost
}
// var avatars = map[string][]string{
//     "Neural Network Plumbing":{"https://files.oaiusercontent.com/file-PeqnTG5NGsLDRMNCxmipWC20?se=2124-05-06T10%3A22%3A42Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D316758dd-54a8-4864-aa60-58b9bf5663a5.png&sig=Y7Wo1VW4PUU6CLQZw%2BPKNiQkcI1yp0QrIxO1sx3soQg%3D"},
//     "DoomEmacs and Devops":{"https://files.oaiusercontent.com/file-soCSJ2n0ySryDfgySffuOBIf?se=2124-05-06T09%3A51%3A23Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D3b0cb232-0805-4851-b34a-1c2e6c04430c.png&sig=mro7QVJHH3S7IlnwmnMTRgQrSl%2BYy9s2uwPFkM9f7Og%3D"},
//     "NixOS Guide":{"https://files.oaiusercontent.com/file-KMabO7iGoP0sAGTu7rDNH3Ju?se=2124-05-06T03%3A54%3A45Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D4999a3ed-211f-41ca-a6b6-1ce0bddda99e.png&sig=Y%2BxB2//UkVTHr3t7yopFHei9duv3cOB%2BaxKkXeUEjRo%3D"},
//     "Golang, Networking, and Unix Fundamentals":{ "https://lh3.googleusercontent.com/a-/AOh14GjRgSbI8yMMWfTagyCfu2C1YlqG-7n9aJ_46C7kgQ=s96-c"},
//     "404": {"https://pbs.twimg.com/profile_images/1486033940301426711/HoYf1hzR_400x400.jpg"},
// }

// var pinned = []string{
//     "Neural Network",
//             "DoomEmacs and Devops",
//             "NixOs Guide",
//             "Golang Networking",
//             "Explore GPTs",
// }

// var yesterday = []string{
// "Set Up Desktop Remotely",
// "New chat",
// "Travel to Bali",
// "Firefox Extension Name: \"ArcAI Edge\"",
// "Remote GPU Docker Setup",
// "petabyte to Terabyte Conversion",
// }

//     var more_than_7 = []string{
// "Set Up Desktop Remotely",
// "New chat",
// "Firefox Extension Name: \"ArcAI Edge\"",
// "Remote GPU Docker Setup",
// "Petabyte to Terabyte Conversion",
//     }

// var list_of_lists = [][]string{pinned,  yesterday, more_than_7}
// var list_of_names = []string{"Pinned", "Today", "Yesterday"}


// var themes = []Theme{
// {
//     Name:  "Creative AI",
//     Tools: []string{"linux-intelligence", "apm.el", "kyubii"},
// },
// {
//     Name:  "Robotics + ML",
//     Tools: []string{"multiplayer-command-and-control", "continuous-eval", "simulation-pixel-streaming", "auto-labeling"},
// },
// {
//     Name:  "Domain Knowledge / Expertise",
//     Tools: []string{"agent-playground", "dating-photos", "robot-doctor"},
// },
// }
	//na1.MTBYU0NTL21haWxAYWRuYW53YWhhYi5jb206RBSlfubYqsZSw6yPk9jBchqZBpVg/zGzrFUVGXejbXsu/JG0XBMZ
    // Populate the data
    // ML () , visualization, (networks, storage,
    // https://arxivdigest.org/login)
    data := PageData{
        LatestPosts: []BlogPost{
            {Title: "Tisane: Authoring Statistical Models via Formal Reasoning from Conceptual and Data Relationships", URL: "https://idl.uw.edu/", Date: ""},
            {Title: " Deep Neural Nets: 33 years ago and 33 years from now ", URL: "", Date: "http://karpathy.github.io/"},
            {Title: "harmony of dissonance", URL: "", Date: ""},
        },
        BestPosts: []BlogPost{
            {Title: "Concept Induction: Analyzing Unstructured Text with High-Level Concepts Using LLooM", URL: ""},
            {Title: "Visualizing Urban Accessibility: Investigating Multi-Stakeholder Perspectives through a Map-based Design Probe Study", URL: ""},
        },
        Projects: []BlogPost{
			{Title: "1. apm.el", URL: "/tools/apm.el"},
			{Title: "2. Linux Intelligence", URL: "/tools/linux-intelligence"},
						{Title: "3. agent-playground", URL: "/tools/agent-playground"},
						{Title: "4. Robotics Command Center", URL: "/tools/multiplayer-command-and-control"},
									{Title: "5. admin", URL: "/tools/admin"},
			//{Title: "robot-doctor", URL: "/tools/robot-doctor"},

			//{Title: "kyubii", URL: "/tools/kyubii"},
			//{Title: "dating-photos", URL: "/tools/dating-photos"},
			//{Title: "simulation-pixel-streaming", URL: "/tools/simulation-pixel-streaming"},

			//			{Title: "continuous-eval", URL: "/tools/linux-intelligence"},
			//{Title: "blue-dots", URL: "/tools/blue-dots"},
			//{Title: "git-visualizer", URL: "/tools/git-visualizer"},
			//{Title: "auto-labeling", URL: "/tools/auto-labeling"},
			//{Title: "resume-builder", URL: "/tools/resume-builder"},
			//{Title: "personal-analytics", URL: "/tools/personal-analytics"},
        },

		Robotics: []BlogPost{
            {Title: "Palmer Luckey", URL: ""},
        },
		Biotech: []BlogPost{
            {Title: "Robert Sapolsky", URL: ""},
        },

		Medtech: []BlogPost{
            {Title: "Kapil Gupta", URL: ""},
        },

        GovTech: []BlogPost{
            {Title: "The beauty of the constitution", URL: ""},
        },
        CreativeAI: []BlogPost{
            {Title: "Bret Victor", URL: ""},
        },
    }


		tmpl, shit := os.ReadFile(rootPath + "container.html")
	if shit != nil {
        return shit.Error()
    }

	t, err := template.New("blag-cant").Parse(string(tmpl))
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
     <div class="rounded-lg shadow-md p-6">
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
	this_is_shit(e, rootPath + "*.html", "")
	//this_is_shit(e, rootPath + "/tol*.html", "tools/")
	baseDirectory := rootPath + "tools/*.html"
	prefix := "tools/"
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



var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Be careful with this in production!
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("Received: %s", p)

		// Echo the message back
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}
func handleHero(c echo.Context) error {
	tmpl, shit := os.ReadFile(rootPath + "shit-dont-need.html")
	if shit != nil {
        return shit
    }

	t, err := template.New("chat").Parse(string(tmpl))
    if err != nil {
        return err
    }

	data := []string{"hi", "hit"}

    var result strings.Builder
    err = t.Execute(&result, data)
    if err != nil {
        return err
    }

    c.HTML(http.StatusOK, result.String())
	return nil
}

func setupRoutes(e *echo.Echo) {

	http.HandleFunc("/ws", handleWebSocket)
	fmt.Printf("wtf setup routes\n")
	e.GET("/api/hero", handleHero)
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

	e.GET("/api/container", func (c echo.Context) error { return c.HTML(http.StatusOK, renderContainer()) } )


	e.GET("/api/download_kyubii", download_kyubii)
    e.POST("/beep", beep)






}
