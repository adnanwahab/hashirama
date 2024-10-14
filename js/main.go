package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	lksdk "github.com/livekit/server-sdk-go"
	// "flag"
	// "fmt"
	// "os"
	// "os/signal"
	// "strings"
	// "syscall"
	// "time"
	// lksdk "github.com/livekit/server-sdk-go/v2"
)

// var (
// 	host, apiKey, apiSecret, roomName, identity string
// )

// func init() {
// 	flag.StringVar(&host, "host", "", "livekit server host")
// 	flag.StringVar(&apiKey, "api-key", "", "livekit api key")
// 	flag.StringVar(&apiSecret, "api-secret", "", "livekit api secret")
// 	flag.StringVar(&roomName, "room-name", "", "room name")
// 	flag.StringVar(&identity, "identity", "", "participant identity")
// }

func main() {

	PublishRobotStream()
}

func PublishRobotStream() {
	apiKey := "APILeUVtb79wzmW"
	apiSecret := "suWBOvr1tqLDRlNvrDZxpERwl5b02sJ9ZNPEQHw1mnN"
	host := "wss://omnissiah-university-kmuz0plz.livekit.cloud"
	roomName := "my-room"
	identity := "livekit-sender"
	fmt.Println("invalid arguments.")
	// flag.Parse()
	// if host == "" || apiKey == "" || apiSecret == "" || roomName == "" || identity == "" {
	// 	fmt.Println("invalid arguments.")
	// 	return
	// }
	room, err := lksdk.ConnectToRoom(host, lksdk.ConnectInfo{
		APIKey:              apiKey,
		APISecret:           apiSecret,
		RoomName:            roomName,
		ParticipantIdentity: identity,
	}, &lksdk.RoomCallback{}, lksdk.WithAutoSubscribe(false))
	if err != nil {
		panic(err)
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT)

	files, err := os.ReadDir("./")
	if err != nil {
		panic(err)
	}
	fmt.Println(files)
	for _, file := range files {
		fmt.Println("playing bounne yay 1 ")

		if file.IsDir() {
			continue
		} else if !strings.HasSuffix(file.Name(), ".h264") && !strings.HasSuffix(file.Name(), ".ivf") && !strings.HasSuffix(file.Name(), ".ogg") && !strings.HasSuffix(file.Name(), ".mp4") {
			continue
		}
		fmt.Println("playing bounne yay 2")

		frameDuration := 33 * time.Millisecond
		if strings.HasSuffix(file.Name(), ".ogg") {
			frameDuration = 20 * time.Millisecond
		}
		// Add any specific handling for .mp4 if needed
		fmt.Println("playing bounne yay 3")
		track, err := lksdk.NewLocalFileTrack(file.Name(),
			lksdk.ReaderTrackWithFrameDuration(frameDuration),
			lksdk.ReaderTrackWithOnWriteComplete(func() { fmt.Println("track finished") }),
		)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("playing bounne yay  4", track)

		if _, err = room.LocalParticipant.PublishTrack(track, &lksdk.TrackPublicationOptions{
			VideoWidth:  640,
			VideoHeight: 480,
			Name:        file.Name(),
		}); err != nil {
			panic(err)
		}

	}

	<-sigChan
	//room.Disconnect()
}

//send to primagen or all twitch coders
//make coding a social sport -> like video games -> annotate your video stream -> see how you make ai smarter
//that is the new meta

//meta = 3 things
// analyze your replays + find fatal flaw + jaedong/bisu/etc -> find techniques -> across 5 games practice 1 or 2 -
// understand shifts *
// 80% of best people dont care about meta or theory-crafting at all - keep it simple - do good action - have fun

//you dont understand things - you just get used to them - by trying shit out + compiling it and executing it and visualzing the results and optimizing it

//be silent protagonist - all worst mistakes came from inner-"noise" - translating to words
//isntead use pictures + quotes -> extend = label + give context /label/ higher order

//contributor 5 open soruce (start with docs - )
//what projects get traction = best documented - docs

//publish track from iphone -> sample.ts does
//save it
//publish new track -> use shader to change on client
//app reads both tracks

//use echo server to make coro w/ saver + publisher
//2 tracks 1 with current + 1 with computer vision mask on video
