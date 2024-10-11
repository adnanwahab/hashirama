#!/bin/bash
# "llama-backend": 7095,
# "cgi-backend": 7096,
#"flow-backend": 7097,
# "robotics-odyssey-demo": 7998,
# "main.go": 7999,

# caddy port 80
# "air": 8001,
# "jupyter": 8888
# Start Node.js services
pm2 start js/llama-backend.js --name "server1"
pm2 start js/cgi-backend.js --name "server2"
pm2 start js/robotics-odyssey-demo.ts --name "server3"
# pm2 start js/server4.js --name "server4"
# pm2 start server5.js --name "server5"

# Start Go server
#nohup go run main.go > go_server.log 2>&1 &
# switch to air later
air

# Start Jupyter Notebook
#nohup jupyter notebook --no-browser --port=8888 > jupyter.log 2>&1 &


# to stop them -    pm2 stop all
