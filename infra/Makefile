.PHONY: all dashboard homelab perception

all: cleanup dashboard homelab perception

dashboard:
	cd services/dashboard && bun run dev &

homelab:
	cd services/homelab-status-page && air src/*.go &

homelab-styles:
	cd services/homelab-status-page && bun run style &

perception:
	cd services/perception && echo "shit" &


cleanup:
	# Kill processes running on the specified ports
	lsof -ti :1337 :8000 :3000 |  sudo xargs -r kill -9 || true
	 pgrep -f 'bun' | sudo xargs -r kill -9 || true
		# Optionally, you can also kill processes by name (like 'bun' or 'air') if necessary
		# pkill -f 'bun run dev' || true
		# pkill -f 'air src/*.go' || true
		# pkill -f 'echo "shit"' || true
		# Wait a few seconds to ensure ports are released
		sleep 2
