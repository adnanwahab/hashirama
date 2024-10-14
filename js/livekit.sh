url =wss://omnissiah-university-kmuz0plz.livekit.cloud
api=APISd3FVwD2XZpJ
secret=SMrM4pTre5p0OGz5dUOWWIqV6QHiQiYQx24JhQuCrDT

lk room join --identity publisher \
  --publish <path/to/video.ivf> \
  --publish <path/to/audio.ogg> \
  --fps 23.98 \
room_name

ffmpeg -i  day1.mp4 | rtsp://url> \
  -c:v libx264 -bsf:v h264_mp4toannexb -b:v 2M -profile:v baseline -pix_fmt yuv420p \
    -x264-params keyint=120 -max_delay 0 -bf 0 \
    -listen 1 -f h264 unix:/tmp/myvideo.sock \
  -c:a libopus -page_duration 20000 -vn \
  	-listen 1 -f opus unix:/tmp/myaudio.sock


#     lk room join --identity bot \
#   --publish h264:///tmp/myvideo.sock \
#   --publish opus:///tmp/myaudio.sock \
#   <room_name>



#   # Start room composite (recording of room UI)
# lk egress start --type room-composite <path/to/request.json>

# # Start track composite (audio + video)
# lk egress start --type track-composite <path/to/request.json>

# # Start track egress (single audio or video track)
# lk egress start --type track <path/to/request.json>