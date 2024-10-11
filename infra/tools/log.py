import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        filename = os.path.basename(event.src_path)
        print(f"File {filename} has been modified")
        self.tail_file(event.src_path)

    def tail_file(self, filepath):
        subprocess.run(['tail', '-n', '5', filepath])

def monitor_logs():
    log_files = [
        '/var/log/homelab-status-page.log',
        '/var/log/homelab-status-page.error.log',
        '/var/log/caddy/caddy.log'
    ]

    observer = Observer()
    event_handler = LogHandler()

    for log_file in log_files:
        if os.path.exists(log_file):
            observer.schedule(event_handler, path=os.path.dirname(log_file), recursive=False)
        else:
            print(f"Warning: {log_file} does not exist.")

    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    monitor_logs()
