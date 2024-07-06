package main
import (
	"encoding/json"
	"errors"
	"io/fs"
	"runtime"
	"net"
	"os"
	"path"
	"time"
	"golang.org/x/net/websocket"
	"bytes"
	"io"
	"context"
	"fmt"
	"strings"
	"html/template"
	"path/filepath"
	"github.com/labstack/echo/v4"
	"net/http"
	"github.com/kkdai/youtube/v2"
	"github.com/a-h/templ"
	"os/exec"
	"github.com/ollama/ollama/api"
	"log"
	"sync"
	//1. webrtc
	//2. mediapipe / tensorflow-go
	//3. playwright
	//4. htmx - net/http
	//5. turso, litefs, pg, duckdb, redis, etc/d, leveldb rockdb?
	//6. 
)

type Post struct {
	Date    time.Time
	Title   string
	Content string
}


type Agent struct {
	Name string `json:"name" form:"name"`
	Type string `json:"type" form:"type"`
}

type Template struct {
	templates *template.Template
}


var agents []Agent


func websocket_handler(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Write
			err := websocket.Message.Send(ws, "Hello, Client!")
			if err != nil {
				c.Logger().Error(err)
			}

			// Read
			msg := ""
			err = websocket.Message.Receive(ws, &msg)
			if err != nil {
				c.Logger().Error(err)
			}
			fmt.Printf("%s\n", msg)
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}

func go2node () {
	print("sghit")
	//https://github.com/mdirkse/i3ipc-go
	//https://pkg.go.dev/plugin@go1.22.4
	// https://go.dev/blog/gob
	// cmd := exec.Command("node", "child.js")
	// cmd.Stdout = os.Stdout
	// cmd.Stderr = os.Stderr

	// channel, err := go2node.ExecNode(cmd)
	// 	if err != nil {
	// 	panic(err)
	// }
	// defer cmd.Process.Kill() //same as await? or defer close(channel)
	// channel.Write(&go2node.NodeMessage{
	// 	Message: []byte(`{"hello": "node"}`),
	// })

	// // Golang will output: {"hello":"golang"}
	// msg, err := channel.Read()
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println(string(msg.Message))

	// // Wait node child process exit
	// cmd.Process.Wait()
	// https://github.com/zealic/go2node/blob/6eb98c52fa4b9cb7bab0f550db04eebac66ff113/ipc/channel.go#L25
}





func reader() {
    pipePath := "/tmp/my_named_pipe"

    // Open the named pipe for reading
    pipe, err := os.OpenFile(pipePath, os.O_RDONLY, os.ModeNamedPipe)
    if err != nil {
        fmt.Println("Error opening pipe:", err)
        return
    }
    defer pipe.Close()

    buffer := make([]byte, 1024)
    n, err := pipe.Read(buffer)
    if err != nil {
        fmt.Println("Error reading from pipe:", err)
        return
    }

    fmt.Println("Message read from pipe:", string(buffer[:n]))
}
func writer() {
    pipePath := "/tmp/my_named_pipe"

    // Open the named pipe for writing
    pipe, err := os.OpenFile(pipePath, os.O_WRONLY, os.ModeNamedPipe)
    if err != nil {
        fmt.Println("Error opening pipe:", err)
        return
    }
    defer pipe.Close()

    message := "Hello from the writer!"
    _, err = pipe.Write([]byte(message))
    if err != nil {
        fmt.Println("Error writing to pipe:", err)
        return
    }

    fmt.Println("Message written to pipe")
}
//mkfifo /tmp/my_named_pipe

func server() {
    socketPath := "/tmp/unix_domain_socket"

    // Remove any existing socket file
    if err := os.RemoveAll(socketPath); err != nil {
        panic(err)
    }

    // Listen on the Unix domain socket
    // listener, err := net.Listen("unix", socketPath)
    // if err != nil {
    //     panic(err)
    // }
    // defer listener.Close()

    // fmt.Println("Server is listening on", socketPath)

    // for {
    //     conn, err := listener.Accept()
    //     if err != nil {
    //         panic(err)
    //     }

    //     //go handleConnection(conn)
    // }
}
func client() {
    socketPath := "/tmp/unix_domain_socket"

    conn, err := net.Dial("unix", socketPath)
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    message := "Hello, server!"
    _, err = conn.Write([]byte(message))
    if err != nil {
        panic(err)
    }

    buffer := make([]byte, 1024)
    n, err := conn.Read(buffer)
    if err != nil {
        panic(err)
    }

    fmt.Println("Received reply:", string(buffer[:n]))
}


// DB is a database backed by a JSON file.
type DB[T any] struct {
	// Data is the contents of the database.
	Data *T

	path string
}

// Open opens the database at path, creating it with a zero value if
// necessary.
//
func AtomicWriteFile(filename string, data []byte, perm os.FileMode) (err error) {
	fi, err := os.Stat(filename)
	if err == nil && !fi.Mode().IsRegular() {
		return fmt.Errorf("%s already exists and is not a regular file", filename)
	}
	f, err := os.CreateTemp(filepath.Dir(filename), filepath.Base(filename)+".tmp")
	if err != nil {
		return err
	}
	tmpName := f.Name()
	defer func() {
		if err != nil {
			f.Close()
			os.Remove(tmpName)
		}
	}()
	if _, err := f.Write(data); err != nil {
		return err
	}
	if runtime.GOOS != "windows" {
		if err := f.Chmod(perm); err != nil {
			return err
		}
	}
	if err := f.Sync(); err != nil {
		return err
	}
	if err := f.Close(); err != nil {
		return err
	}
	return os.Rename(tmpName, filename)
}
func Open[T any](path string) (*DB[T], error) {
	bs, err := os.ReadFile(path)
	if errors.Is(err, fs.ErrNotExist) {
		return &DB[T]{
			Data: new(T),
			path: path,
		}, nil
	} else if err != nil {
		return nil, err
	}

	var val T
	if err := json.Unmarshal(bs, &val); err != nil {
		return nil, err
	}

	return &DB[T]{
		Data: &val,
		path: path,
	}, nil
}

// Save writes db.Data back to disk.
func (db *DB[T]) Save() error {
	bs, err := json.Marshal(db.Data)
	if err != nil {
		return err
	}

	return AtomicWriteFile(db.path, bs, 0600)
}
func archive () {
	//https://github.com/tailscale/tailscale
	// if _, err := io.Copy(os.Stdout, res.Body); err != nil {
	// 	log.Fatal(err)
	// }
	if true {return }
	time.Sleep(1)
	cmd := exec.Command("tr", "a-z", "A-Z")
	cmd.Stdin = strings.NewReader("some input")
	var out strings.Builder
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("in all caps: %q\n", out.String())
	// Create a key to identify the shared memory segment
    //key := 1234

    // Create the shared memory segment with a size of 4096 bytes
    // shmid, err := syscall.Shmget(key, 4096, 0666|syscall.IPC_CREAT)
    // if err != nil {
    //     fmt.Println("Error creating shared memory segment:", err)
    //     os.Exit(1)
    // }

    // // Attach to the shared memory segment
    // data, err := syscall.Shmat(shmid, nil, 0)
    // if err != nil {
    //     fmt.Println("Error attaching to shared memory segment:", err)
    //     os.Exit(1)
    // }

    // // Write a string to the shared memory segment
    // message := "Hello, World!"
    // copy(data, []byte(message))

    // // Detach from the shared memory segment
    // err = syscall.Shmdt(data)
    // if err != nil {
    //     fmt.Println("Error detaching from shared memory segment:", err)
    //     os.Exit(1)
    // }

    // // Display the message read from the shared memory segment
    // fmt.Println("Message read from shared memory segment:", string(data))
	// 	// Set up channel on which to send signal notifications.
	// // We must use a buffered channel or risk missing the signal
	// // if we're not ready to receive when the signal is sent.
	// c := make(chan os.Signal, 1)

	// // Passing no signals to Notify means that
	// // all signals will be sent to the channel.
	// signal.Notify(c)

	// // Block until any signal is received.
	// s := <-c
	// fmt.Println("Got signal:", s)
    // shmid, err := syscall.ShmOpen("/myshm", os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0666)
    // if err != nil {
    //     fmt.Println(err)
    //     return
    // }

    // // Map the shared memory segment to the process's address space
    // shmptr, err := syscall.Mmap(int(shmid), 0, SHMSIZE, syscall.PROT_READ|syscall.PROT_WRITE, syscall.MAP_SHARED)
    // if err != nil {
    //     fmt.Println(err)
    //     return
    // }

    // // Write to the shared memory segment
    // message := []byte("Hello from process 1!")
    // copy(shmptr, message)

    // // Unmap the shared memory segment
    // err = syscall.Munmap(shmptr)
    // if err != nil {
    //     fmt.Println(err)
    //     return
    // }

    // // Close the shared memory segment
    // err = syscall.Close(int(shmid))
    // if err != nil {
    //     fmt.Println(err)
    //     return
    // }
}
//https://www.recallmemory.io/
// https://github.com/Mintplex-Labs/anything-llm



func tryStream() {
	client, err := api.ClientFromEnvironment()
	if err != nil {
		log.Fatal(err)
		ctx := context.Background()

		req := &api.PullRequest{
			Model: "mistral",
		}
		progressFunc := func(resp api.ProgressResponse) error {
			fmt.Printf("Progress: status=%v, total=%v, completed=%v\n", resp.Status, resp.Total, resp.Completed)
			return nil
		}

		err = client.Pull(ctx, req, progressFunc)
		if err != nil {
			log.Fatal(err)
		}

	}

	if err != nil {
		log.Fatal(err)
	}

	// By default, GenerateRequest is streaming.
	req := &api.GenerateRequest{
		Model:  "gemma",
		Prompt: "how many planets are there?",
	}

	ctx := context.Background()
	respFunc := func(resp api.GenerateResponse) error {
		// Only print the response here; GenerateResponse has a number of other
		// interesting fields you want to examine.

		// In streaming mode, responses are partial so we call fmt.Print (and not
		// Println) in order to avoid spurious newlines being introduced. The
		// model will insert its own newlines if it wants.
		fmt.Print(resp.Response)
		return nil
	}

	err = client.Generate(ctx, req, respFunc)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println()
}



func tryLLM() {

	if len(os.Args) <= 1 {
		log.Fatal("usage: <image name>")
	}

	imgData, err := os.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}

	client, err := api.ClientFromEnvironment()
	if err != nil {
		log.Fatal(err)
	}

	req := &api.GenerateRequest{
		Model:  "llava",
		Prompt: "describe this image",
		Images: []api.ImageData{imgData},
	}

	ctx := context.Background()
	respFunc := func(resp api.GenerateResponse) error {
		// In streaming mode, responses are partial so we call fmt.Print (and not
		// Println) in order to avoid spurious newlines being introduced. The
		// model will insert its own newlines if it wants.
		fmt.Print(resp.Response)
		return nil
	}

	err = client.Generate(ctx, req, respFunc)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println()
}

func Unsafe(html string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		_, err = io.WriteString(w, html)
		return
	})
}

func renderTemplate(templateName string) echo.HandlerFunc {
	// sweaters := Inventory{"wool",
	// 	"17"}
	return func(c echo.Context) error {
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
			return nil
		}
		str := string(b) // convert content to a 'string'
		//content := Unsafe(str)
		c.Response().Header().Set("Content-Type", "text/html")
		//headerComponent("fuck").Render(context.Background(), os.Stdout)
		//

		//func ToGoHTML(ctx context.Context, c Component) (s template.HTML, err error)
		//fmt.Printf("oh shit dog %s%s\n", str, templateName)
		return headerComponent(str, templateName, "wow that is so cool").Render(context.Background(), c.Response().Writer)
		// var buf bytes.Buffer

		// err = headerComponent(str).Render(context.Background(), &buf)
		// _, err = buf.WriteTo(c.Response().Writer)


		// return err
		//return
	}
}


func trimMyDick(filePath string) string {
	baseName := filepath.Base(filePath)

    // Remove the file extension
    fileName := strings.TrimSuffix(baseName, filepath.Ext(baseName))
	//fmt.Printf("route\n", filepath.Base(fileName), "\n")
	return fileName
}

func custom_endpont (c echo.Context) error {
	base := filepath.Join(os.ExpandEnv("$HOME/hashirama/services/homelab-status-page/"), "readme.org")
	dat, err := os.ReadFile(base)
	if err != nil {

		fmt.Print("base \n\n\n", err)
		return err
	}
	return c.String(http.StatusOK, string(dat))
}

//https://github.com/danawoodman/go-echo-htmx-templ/blob/main/handlers/render.go
// func ExampleClient(videoID string) (*youtube.Video, io.ReadCloser, *youtube.Format, error) {
//     client := youtube.Client{}

//     video, err := client.GetVideo(videoID)
//     if err != nil {
//         return nil, nil, nil, err
//     }

//     formats := video.Formats.WithAudioChannels() // only get videos with audio
//     stream, _, err := client.GetStream(video, &formats[0])
//     if err != nil {
//         return nil, nil, nil, err
//     }

//     return video, stream, &formats[0], nil
// }
//
func ExampleClient (videoID string) string {
	client := youtube.Client{}

	video, err := client.GetVideo(videoID)
	if err != nil {
		panic(err)
	}

	formats := video.Formats.WithAudioChannels() // only get videos with audio
	stream, _, err := client.GetStream(video, &formats[0])
	if err != nil {
		panic(err)
	}
	defer stream.Close()
	vid_loc := fmt.Sprintf("static/video/%s.mp4", videoID)
	file, err := os.Create(vid_loc)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = io.Copy(file, stream)
	if err != nil {
		panic(err)
	}
	return vid_loc
}

type YM struct {
    URL string `form:"url"`
}

func handleConvertVideoToPDF(c echo.Context) error {
	fmt.Println("error", "reset")
    formData := new(YM)
    if err := c.Bind(formData); err != nil {
		fmt.Println("error", err)
        return err
    }


	fmt.Println("error", "shti")

    youtubeURL := formData.URL
    //video, stream, format, err := ExampleClient(youtubeURL)
    videoLoc := ExampleClient(youtubeURL)
	fmt.Println("finish DL", youtubeURL)
    // Set the headers to serve the video directly
    // c.Response().Header().Set("Content-Type", format.MimeType)
    // c.Response().Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=\"%s.mp4\"", video.Title))

    // // Copy the video stream to the response writer
    // _, err = io.Copy(c.Response().Writer, stream)

	return c.JSON(http.StatusOK, map[string]string{
		"videoUrl": videoLoc,

	})

    return nil
}
//err := filepath.Walk(basePath, func(path string, info os.FileInfo, err error) error {
func fuck() {
	cmd := exec.Command("bash", "~/go/bin/templ generate")
	//watch_files()
	//lsof -sTCP:LISTEN
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf
	err := cmd.Start()
	if err != nil { return }
	fmt.Printf("Output: %s\n", outBuf.String())
    fmt.Printf("Error: %s\n", errBuf.String())
	//exec a binary in go ~/go/bin/templ generate from golang
}

func beep (c echo.Context) error {
	cmd := exec.Command("python", "robot_move.py")
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf
	err := cmd.Start()
	fmt.Printf("Output: %s\n", outBuf.String())
    fmt.Printf("Error: %s\n", errBuf.String())
	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return err
	}
	fmt.Printf("Output: %s\n", "OMG IT WORKS")
	return c.String(http.StatusOK, "done")

}

func handleAgents(c echo.Context) error{
	return c.JSON(http.StatusOK, agents)
}


func handleAddAgent(c echo.Context) error{
	agent := new(Agent)
	if err := c.Bind(agent); err != nil {
		return err
	}
	
	agents = append(agents, *agent)
	return c.JSON(http.StatusCreated, agents)
}

// func customHTTPErrorHandler(err error, c echo.Context) {
// 	code := http.StatusInternalServerError
// 	if he, ok := err.(*echo.HTTPError); ok {
// 		code = he.Code
// 	}
// 	if code == http.StatusNotFound {
// 		errorPage, err := os.ReadFile("/home/adnan/hashirama/services/homelab-status-page/views/index.html")
// 		if err = c.HTML(http.StatusNotFound, errorPage); err != nil {
// 			c.Logger().Error(err)
// 		}
// 		return
// 	}
// 	c.Echo().DefaultHTTPErrorHandler(err, c)
//
var (
	errorPageContent []byte
	errorPageOnce    sync.Once
)

func serveErrorPage(c echo.Context, code int) {
	errorPageOnce.Do(func() {
		var err error
		errorPageContent, err = os.ReadFile("/home/adnan/hashirama/services/homelab-status-page/views/index.html")
		if err != nil {
			c.Logger().Errorf("Failed to read error page: %v", err)
			errorPageContent = []byte("404 - Page Not Found")
		}
	})

	c.HTMLBlob(code, errorPageContent)
}

func customHTTPErrorHandler(err error, c echo.Context) {
	code := http.StatusInternalServerError
	message := "Internal Server Error"

	if he, ok := err.(*echo.HTTPError); ok {
		code = he.Code
		message = fmt.Sprintf("%v", he.Message)
	}

	switch code {
	case http.StatusNotFound:
		serveErrorPage(c, code)
	default:
		c.JSON(code, map[string]string{"error": message})
	}

	c.Logger().Error(err)
}

func main() {
	binaryName := os.Args[0]

    // Print the binary name
    fmt.Println("Binary name:", binaryName)
	if false {fuck() }
	if false { tryLLM() }
	if false { tryStream()}
	e := echo.New()
	e.POST("/video-to-pdf", handleConvertVideoToPDF)
	e.GET("/agents", handleAgents)
	e.POST("/add-agent", handleAddAgent)


	e.GET("/download_apm.el", func (c echo.Context) error {

		dat, err := os.ReadFile("/home/adnan/.config/Dot-files-main/doom/+apm.el")
		if err != nil {
			fmt.Printf("err", err)
			return err
		}

		fmt.Printf("downloading apm.el to your ~/.config/doom/autoload/")
		return c.String(http.StatusOK, string(dat))
	})
	shit := os.ExpandEnv("$HOME/hashirama/services/homelab-status-page/views/tools/*.html")
	allMyRoutes, err := filepath.Glob(shit)
	fmt.Println("wtfff", allMyRoutes)

	if err != nil {return }
	for i := 0; i < len(allMyRoutes); i++ {
		filePath := string(allMyRoutes[i])
		if filePath == "/" {continue}
		trimmed := trimMyDick(filePath)
		fmt.Println("wtfff", "tools/"+trimmed)
		e.GET("/tools/" + trimmed, renderTemplate("tools/"+trimmed))
    }

	expandMyPuss := os.ExpandEnv("$HOME/hashirama/services/homelab-status-page/views/*.html")

	allMyRoutes, err = filepath.Glob(expandMyPuss)
	if err != nil {return }
	for i := 0; i < len(allMyRoutes); i++ {
		filePath := string(allMyRoutes[i])
		if filePath == "/" {continue}
		trimmed := trimMyDick(filePath)
		e.GET(trimmed, renderTemplate(trimmed))
    }

	e.GET("/form", renderTemplate("form"))
	e.GET("/", renderTemplate("index"))
	// e.GET("/custom_endpoint", custom_endpont)
	//  e.GET("/ws", websocket_handler)

	e.POST("/beep", beep)

	e.Static("/static", "static")
	e.Static("/assets", "static")

	e.HTTPErrorHandler = customHTTPErrorHandler
	e.Logger.Fatal(e.Start("0.0.0.0:1337"))
}
