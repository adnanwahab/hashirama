# run this on jetson to install hashirama platform

#sudo apt-get install -y nvidia-container-toolkit
#git clone --depth 1 https://github.com/doomemacs/doomemacs ~/.config/emacs
###~/.config/emacs/bin/doom install
#sudo apt-get install -y nvidia-container-toolkit
#sudo ln -s /home/adnan/hashirama/infra/caddy/Caddyfile /etc/caddy/Caddyfile
#immich

# sudo apt update
# sudo apt install docker.io
# sudo systemctl start docker
# sudo systemctl enable docker
# sudo usermod -aG docker $USER


#Update Docker's daemon.json to set the default runtime to nvidia
if [ -f /etc/docker/daemon.json ]; then
    sudo jq '. + {"runtimes": {"nvidia": {"path": "nvidia-container-runtime", "runtimeArgs": []}}, "default-runtime": "nvidia"}' /etc/docker/daemon.json | sudo tee /etc/docker/daemon.json.tmp
    sudo mv /etc/docker/daemon.json.tmp /etc/docker/daemon.json
else
    echo '{"runtimes": {"nvidia": {"path": "nvidia-container-runtime", "runtimeArgs": []}}, "default-runtime": "nvidia"}' | sudo tee /etc/docker/daemon.json
fi


# Add data-root configuration to Docker's daemon.json
if [ -f /etc/docker/daemon.json ]; then
    sudo jq '. + {"data-root": "/mnt/docker"}' /etc/docker/daemon.json | sudo tee /etc/docker/daemon.json.tmp
    sudo mv /etc/docker/daemon.json.tmp /etc/docker/daemon.json
else
    echo '{"data-root": "/mnt/docker"}' | sudo tee /etc/docker/daemon.json
fi


# Restart Docker to apply changes

git clone https://github.com/dusty-nv/jetson-containers

sudo systemctl restart docker


bash jetson-containers/install.sh
CUDA_VERSION=12.4 jetson-containers build transformers


jetson-containers run $(autotag l4t-pytorch)

#sudo docker run --runtime nvidia -it --rm --network=host dustynv/l4t-pytorch:r36.2.0

#etc


               total        used        free      shared  buff/cache   available
Mem:           7.4Gi       2.4Gi       1.8Gi        97Mi       3.2Gi       4.7Gi
Swap:           19Gi          0B        19Gi
adnan@jetson-orin:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/mmcblk0p1  233G   41G  183G  19% /
tmpfs           3.8G   39M  3.7G   2% /dev/shm
tmpfs           1.5G   27M  1.5G   2% /run
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           763M  140K  762M   1% /run/user/1000
adnan@jetson-orin:~$ jetson-containers run $(autotag whisper_trt)
Namespace(packages=['whisper_trt'], prefer=['local', 'registry', 'build'], disable=[''], user='dustynv', output='/tmp/autotag', quiet=False, verbose=False)
-- L4T_VERSION=36.3.0  JETPACK_VERSION=6.0  CUDA_VERSION=12.2
-- Finding compatible container image for ['whisper_trt']

Found compatible container dustynv/whisper_trt:r36.3.0 (2024-05-28, 6.7GB) - would you like to pull it? [Y/n] y
dustynv/whisper_trt:r36.3.0
V4L2_DEVICES:  --device /dev/video0  --device /dev/video1 
csi_indexes: 
^Cmodprobe: FATAL: Module v4l2loopback not found.
xhost:  unable to open display "localhost:11.0"
+ docker run --runtime nvidia -it --rm --network host --shm-size=8g --volume /tmp/argus_socket:/tmp/argus_socket --volume /etc/enctune.conf:/etc/enctune.conf --volume /etc/nv_tegra_release:/etc/nv_tegra_release --volume /tmp/nv_jetson_model:/tmp/nv_jetson_model --volume /var/run/dbus:/var/run/dbus --volume /var/run/avahi-daemon/socket:/var/run/avahi-daemon/socket --volume /var/run/docker.sock:/var/run/docker.sock --volume /home/adnan/jetson-containers/data:/data --device /dev/snd --device /dev/bus/usb -e DISPLAY=localhost:11.0 -v /tmp/.X11-unix/:/tmp/.X11-unix -v /tmp/.docker.xauth:/tmp/.docker.xauth -e XAUTHORITY=/tmp/.docker.xauth --device /dev/video0 --device /dev/video1 --device /dev/i2c-0 --device /dev/i2c-1 --device /dev/i2c-2 --device /dev/i2c-4 --device /dev/i2c-5 --device /dev/i2c-7 --device /dev/i2c-9 --name my_jetson_container_whisper_trt_r36.3.0_20241014_064951 dustynv/whisper_trt:r36.3.0
docker: unknown server OS: .
See 'docker run --help'.
+ set +x
#tailscale

#nix ??


#mkdir unreal
# wget ->
# unzip
#


# bootstraps a server like tailscale, ollama, etc

# docker pull ollama/ollama
# docker run -it --gpus all ollama/ollama



adnan@jetson-orin:~$ docker run --runtime nvidia --rm -it \
    --gpus all \
    --device /dev/video0 \
    --device /dev/video1 \
    dustynv/jupyterlab:r36.2.0
docker: unknown server OS: .
See 'docker run --help'.
adnan@jetson-orin:~$ cd jetson-containers/
adnan@jetson-orin:~/jetson-containers$ docker run --runtime nvidia --rm -it \
    --gpus all \
    --device /dev/video0 \
    --device /dev/video1 \
    dustynv/jupyterlab:r36.2.0
docker: unknown server OS: .
See 'docker run --help'.
adnan@jetson-orin:~/jetson-containers$ docker run --runtime nvidia --rm -it \                                            --gpus all \                                      
    --device /dev/video0 \
    --device /dev/video1 \
    dustynv/jupyterlab:r36.2.0
docker: unknown server OS: .
See 'docker run --help'.
adnan@jetson-orin:~/jetson-containers$ cd
adnan@jetson-orin:~$ bash jetson-containers/install.sh
+++ readlink -f jetson-containers/install.sh
++ dirname /home/adnan/jetson-containers/install.sh
+ ROOT=/home/adnan/jetson-containers
+ INSTALL_PREFIX=/usr/local/bin
+ pip3 --version
pip 22.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)
+ pip3 install -r /home/adnan/jetson-containers/requirements.txt
Defaulting to user installation because normal site-packages is not writeable
Collecting git+https://github.com/Granulate/DockerHub-API.git (from -r /home/adnan/jetson-containers/requirements.txt (line 4))
  Cloning https://github.com/Granulate/DockerHub-API.git to /tmp/pip-req-build-2rwcc1jd
  Running command git clone --filter=blob:none --quiet https://github.com/Granulate/DockerHub-API.git /tmp/pip-req-build-2rwcc1jd
  Resolved https://github.com/Granulate/DockerHub-API.git to commit 27015dbd00c0e0550dd34287db4b70625985edc3
  Preparing metadata (setup.py) ... done
Requirement already satisfied: packaging>=20.0 in /usr/lib/python3/dist-packages (from -r /home/adnan/jetson-containers/requirements.txt (line 1)) (21.3)
Requirement already satisfied: pyyaml>=6 in ./.local/lib/python3.10/site-packages (from -r /home/adnan/jetson-containers/requirements.txt (line 2)) (6.0.2)
Requirement already satisfied: wget in ./.local/lib/python3.10/site-packages (from -r /home/adnan/jetson-containers/requirements.txt (line 3)) (3.2)
Requirement already satisfied: furl in ./.local/lib/python3.10/site-packages (from DockerHub-API==0.5->-r /home/adnan/jetson-containers/requirements.txt (line 4)) (2.1.3)
Requirement already satisfied: requests in /usr/lib/python3/dist-packages (from DockerHub-API==0.5->-r /home/adnan/jetson-containers/requirements.txt (line 4)) (2.25.1)
Requirement already satisfied: six>=1.8.0 in /usr/lib/python3/dist-packages (from furl->DockerHub-API==0.5->-r /home/adnan/jetson-containers/requirements.txt (line 4)) (1.16.0)
Requirement already satisfied: orderedmultidict>=1.0.1 in ./.local/lib/python3.10/site-packages (from furl->DockerHub-API==0.5->-r /home/adnan/jetson-containers/requirements.txt (line 4)) (1.0.1)
+ sudo ln -sf /home/adnan/jetson-containers/autotag /usr/local/bin/autotag
[sudo] password for adnan: 
+ sudo ln -sf /home/adnan/jetson-containers/jetson-containers /usr/local/bin/jetson-containers
adnan@jetson-orin:~$ jetson-containers run $(autotag l4t-pytorch)
Namespace(packages=['l4t-pytorch'], prefer=['local', 'registry', 'build'], disable=[''], user='dustynv', output='/tmp/autotag', quiet=False, verbose=False)
-- L4T_VERSION=36.3.0  JETPACK_VERSION=6.0  CUDA_VERSION=12.2
-- Finding compatible container image for ['l4t-pytorch']

Found compatible container dustynv/l4t-pytorch:r36.4.0 (2024-09-30, 6.3GB) - would you like to pull it? [Y/n] y
dustynv/l4t-pytorch:r36.4.0
V4L2_DEVICES:  --device /dev/video0  --device /dev/video1 
csi_indexes: 
^Cmodprobe: FATAL: Module v4l2loopback not found.
xhost:  unable to open display "localhost:11.0"
xauth:  file /tmp/.docker.xauth does not exist
+ sudo docker run --runtime nvidia -it --rm --network host --shm-size=8g --volume /tmp/argus_socket:/tmp/argus_socket --volume /etc/enctune.conf:/etc/enctune.conf --volume /etc/nv_tegra_release:/etc/nv_tegra_release --volume /tmp/nv_jetson_model:/tmp/nv_jetson_model --volume /var/run/dbus:/var/run/dbus --volume /var/run/avahi-daemon/socket:/var/run/avahi-daemon/socket --volume /var/run/docker.sock:/var/run/docker.sock --volume /home/adnan/jetson-containers/data:/data --device /dev/snd --device /dev/bus/usb -e DISPLAY=localhost:11.0 -v /tmp/.X11-unix/:/tmp/.X11-unix -v /tmp/.docker.xauth:/tmp/.docker.xauth -e XAUTHORITY=/tmp/.docker.xauth --device /dev/video0 --device /dev/video1 --device /dev/i2c-0 --device /dev/i2c-1 --device /dev/i2c-2 --device /dev/i2c-4 --device /dev/i2c-5 --device /dev/i2c-7 --device /dev/i2c-9 --name my_jetson_container_l4t-pytorch_r36.4.0_20241014_064235 dustynv/l4t-pytorch:r36.4.0
Unable to find image 'dustynv/l4t-pytorch:r36.4.0' locally
^C^C^C
got 3 SIGTERM/SIGINTs, forcefully exiting
+ set +x
adnan@jetson-orin:~$ jetson-containers run $(autotag mamba)
Namespace(packages=['mamba'], prefer=['local', 'registry', 'build'], disable=[''], user='dustynv', output='/tmp/autotag', quiet=False, verbose=False)
-- L4T_VERSION=36.3.0  JETPACK_VERSION=6.0  CUDA_VERSION=12.2
-- Finding compatible container image for ['mamba']

Found compatible container dustynv/mamba:r36.3.0 (2024-09-07, 6.8GB) - would you like to pull it? [Y/n] ^CTraceback (most recent call last):
  File "/usr/lib/python3.10/runpy.py", line 196, in _run_module_as_main
    return _run_code(code, main_globals, None,
  File "/usr/lib/python3.10/runpy.py", line 86, in _run_code
    exec(code, run_globals)
  File "/home/adnan/jetson-containers/jetson_containers/tag.py", line 58, in <module>
    image = find_container(args.packages[0], prefer_sources=args.prefer, disable_sources=args.disable, user=args.user, quiet=args.quiet)
  File "/home/adnan/jetson-containers/jetson_containers/container.py", line 532, in find_container
    if quiet or query_yes_no(f"\nFound compatible container {img_name} ({img_tag['tag_last_pushed'][:10]}, {img_tag['full_size']/(1024**3):.1f}GB) - would you like to pull it?", default="yes"):
  File "/home/adnan/jetson-containers/jetson_containers/utils.py", line 64, in query_yes_no
    choice = input().lower()
KeyboardInterrupt

adnan@jetson-orin:~$ jetson-containers run $(autotag whisper_trt)
Namespace(packages=['whisper_trt'], prefer=['local', 'registry', 'build'], disable=[''], user='dustynv', output='/tmp/autotag', quiet=False, verbose=False)
-- L4T_VERSION=36.3.0  JETPACK_VERSION=6.0  CUDA_VERSION=12.2
-- Finding compatible container image for ['whisper_trt']

Found compatible container dustynv/whisper_trt:r36.3.0 (2024-05-28, 6.7GB) - would you like to pull it? [Y/n] y
dustynv/whisper_trt:r36.3.0
V4L2_DEVICES:  --device /dev/video0  --device /dev/video1 
csi_indexes: 
^Cmodprobe: FATAL: Module v4l2loopback not found.
xhost:  unable to open display "localhost:11.0"
+ docker run --runtime nvidia -it --rm --network host --shm-size=8g --volume /tmp/argus_socket:/tmp/argus_socket --volume /etc/enctune.conf:/etc/enctune.conf --volume /etc/nv_tegra_release:/etc/nv_tegra_release --volume /tmp/nv_jetson_model:/tmp/nv_jetson_model --volume /var/run/dbus:/var/run/dbus --volume /var/run/avahi-daemon/socket:/var/run/avahi-daemon/socket --volume /var/run/docker.sock:/var/run/docker.sock --volume /home/adnan/jetson-containers/data:/data --device /dev/snd --device /dev/bus/usb -e DISPLAY=localhost:11.0 -v /tmp/.X11-unix/:/tmp/.X11-unix -v /tmp/.docker.xauth:/tmp/.docker.xauth -e XAUTHORITY=/tmp/.docker.xauth --device /dev/video0 --device /dev/video1 --device /dev/i2c-0 --device /dev/i2c-1 --device /dev/i2c-2 --device /dev/i2c-4 --device /dev/i2c-5 --device /dev/i2c-7 --device /dev/i2c-9 --name my_jetson_container_whisper_trt_r36.3.0_20241014_064804 dustynv/whisper_trt:r36.3.0
docker: unknown server OS: .
See 'docker run --help'.
+ set +x
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ jetson-containers run $(autotag whisper_trt)
Namespace(packages=['whisper_trt'], prefer=['local', 'registry', 'build'], disable=[''], user='dustynv', output='/tmp/autotag', quiet=False, verbose=False)
-- L4T_VERSION=36.3.0  JETPACK_VERSION=6.0  CUDA_VERSION=12.2
-- Finding compatible container image for ['whisper_trt']

Found compatible container dustynv/whisper_trt:r36.3.0 (2024-05-28, 6.7GB) - would you like to pull it? [Y/n] y
dustynv/whisper_trt:r36.3.0
V4L2_DEVICES:  --device /dev/video0  --device /dev/video1 
csi_indexes: 
^Cmodprobe: FATAL: Module v4l2loopback not found.
xhost:  unable to open display "localhost:11.0"
+ docker run --runtime nvidia -it --rm --network host --shm-size=8g --volume /tmp/argus_socket:/tmp/argus_socket --volume /etc/enctune.conf:/etc/enctune.conf --volume /etc/nv_tegra_release:/etc/nv_tegra_release --volume /tmp/nv_jetson_model:/tmp/nv_jetson_model --volume /var/run/dbus:/var/run/dbus --volume /var/run/avahi-daemon/socket:/var/run/avahi-daemon/socket --volume /var/run/docker.sock:/var/run/docker.sock --volume /home/adnan/jetson-containers/data:/data --device /dev/snd --device /dev/bus/usb -e DISPLAY=localhost:11.0 -v /tmp/.X11-unix/:/tmp/.X11-unix -v /tmp/.docker.xauth:/tmp/.docker.xauth -e XAUTHORITY=/tmp/.docker.xauth --device /dev/video0 --device /dev/video1 --device /dev/i2c-0 --device /dev/i2c-1 --device /dev/i2c-2 --device /dev/i2c-4 --device /dev/i2c-5 --device /dev/i2c-7 --device /dev/i2c-9 --name my_jetson_container_whisper_trt_r36.3.0_20241014_064955 dustynv/whisper_trt:r36.3.0
docker: unknown server OS: .
See 'docker run --help'.
+ set +x
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ ^C
adnan@jetson-orin:~$ sudo docker run --runtime nvidia -it --rm \
  --network host \
  --device /dev/video0 \
  --device /dev/video1 \
  --ipc=host \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  dustynv/whisper_trt:r36.3.0
Unable to find image 'dustynv/whisper_trt:r36.3.0' locally
r36.3.0: Pulling from dustynv/whisper_trt
d5a2ad729c09: Pull complete 
2e6f5bdc8512: Pull complete 
ffba19198a9f: Pull complete 
2fd295528a0f: Pull complete 
28f84eed4302: Pull complete 
1d2d10eda001: Pull complete 
3e68d1f1f0a2: Pull complete 
d8cd7d9239d7: Pull complete 
411d140a42a6: Pull complete 
32f0b58253b2: Pull complete 
606e0a30f16f: Pull complete 
27e43713db75: Pull complete 
da940ea7ef5f: Pull complete 
a73aa8e537a7: Pull complete 
a46869cf885f: Pull complete 
f7e8de23fbce: Pull complete 
9a61ff882eb4: Pull complete 
219683df4e53: Pull complete 
4cc4de5a4bb4: Pull complete 
85dcbf08d8c9: Pull complete 
1b3010f86120: Pull complete 
36bec6817e9e: Pull complete 
08860d8df3e8: Pull complete 
f217cb840cc4: Pull complete 
9be53b84f2dd: Pull complete 
0005be141cf9: Pull complete 
Digest: sha256:6e79f60b9874872de8df6e962c64b87099e04cfcb48518eecb84460d29a35d68
Status: Downloaded newer image for dustynv/whisper_trt:r36.3.0
root@jetson-orin:/# 