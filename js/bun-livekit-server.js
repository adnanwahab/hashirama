import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";
import { serve } from "bun";
const apiKey = "APIXi25c9hddrpj";
const apiSecret = "1HfgfXWoORWUUN5jM0SxUcLjiGa4HqXJPKZKcvyjkNi";
const wsUrl = "wss://omnissiah-university-kmuz0plz.livekit.cloud";

async function connect_to_livekit(options) {
  console.log("options", options);
  //if (!options.identity) throw new Error("requester must have an identity");
  if (!options.identity) {
    options.identity = 'anonymous' + Math.random().toString(36).substring(2, 15);
  }
  const token = new AccessToken(apiKey, apiSecret, {
    identity: options.identity,
  });
  token.addGrant({
    room: "example-room",
    roomJoin: true,
    canPublish: true,
  });
  const jwt = await token.toJwt();

  return { token: jwt, wsUrl };
}

export { connect_to_livekit };
// observable is the mueseum the wizards talked about
// see a canvas - add to it
