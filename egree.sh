curl -X POST <your-host>/twirp/livekit.RoomService/CreateRoom \
	-H "Authorization: Bearer <token-with-roomCreate>" \
	-H 'Content-Type: application/json' \
	--data-binary @- << EOF
{
  "name": "my-room",
  "egress": {
    "tracks": {
      "filepath": "/local/path/{room_name}-{publisher_identity}-{time}"
      // Removed S3 configuration
    }
  }
}
EOF