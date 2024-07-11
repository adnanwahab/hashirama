package main

import (
	"encoding/json"
	"fmt"

	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

func getNumber (  ) {

	fmt.Printf("Error starting script %s: %s\n", "shit", "lol")
	//params := &twilioApi.CreateCallParams{}
	//params.SetTo(to)
	//params.SetFrom(from)
	//params.SetUrl("http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient")

	//resp, err := client.Api.CreateCall(params)
	// if err != nil {
	// 	fmt.Println(err.Error())
	// } else {
	// 	fmt.Println("Call Status: " + *resp.Status)
	// 	fmt.Println("Call Sid: " + *resp.Sid)
	// 	fmt.Println("Call Direction: " + *resp.Direction)
	// }
}

func Execute() {
	lol := [8]string{
		"+1 507 593 7320",
			"+1 336 415 4566",
			"+1 240 392 6453",
			"+1 240 392 6394",
			"+1 914 768 4561",
			"+1 844 459 0226",
			"+1 254 845 7901",
			"+1 734 245 2492",
	}
	accountSid := "AC2b32d9d1876821a30732371113290d3f"
	authToken := "8501ea320dd5855d14dd348852a3b57a"

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

		//#params := &twilioApi.CreateIncomingPhoneNumberParams{}
	//params.SetPhoneNumber(phoneNumber)


	params := &twilioApi.CreateMessageParams{}
	params.SetTo("+17136773669")
	params.SetFrom(lol[0])
	params.SetBody("Hello from Go!")

	resp, err := client.Api.CreateMessage(params)
	if err != nil {
		fmt.Println("Error sending SMS message: " + err.Error())
	} else {
		response, _ := json.Marshal(*resp)
		fmt.Println("Response: " + string(response))
	}
}


//https://github.com/twilio/twilio-python/blob/2b659e27a287f2e3fbb6e964314be8bd7f009232/twilio/rest/messaging/v1/tollfree_verification.py#L26
//
// https://github.com/twilio/twilio-python/blob/2b659e27a287f2e3fbb6e964314be8bd7f009232/CHANGES.md?plain=1#L274
