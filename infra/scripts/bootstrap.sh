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


# Update Docker's daemon.json to set the default runtime to nvidia
# if [ -f /etc/docker/daemon.json ]; then
#     sudo jq '. + {"runtimes": {"nvidia": {"path": "nvidia-container-runtime", "runtimeArgs": []}}, "default-runtime": "nvidia"}' /etc/docker/daemon.json | sudo tee /etc/docker/daemon.json.tmp
#     sudo mv /etc/docker/daemon.json.tmp /etc/docker/daemon.json
# else
#     echo '{"runtimes": {"nvidia": {"path": "nvidia-container-runtime", "runtimeArgs": []}}, "default-runtime": "nvidia"}' | sudo tee /etc/docker/daemon.json
# fi

# Restart Docker to apply changes

git clone https://github.com/dusty-nv/jetson-containers

sudo systemctl restart docker


bash jetson-containers/install.sh
CUDA_VERSION=12.4 jetson-containers build transformers


jetson-containers run $(autotag l4t-pytorch)

#sudo docker run --runtime nvidia -it --rm --network=host dustynv/l4t-pytorch:r36.2.0

#etc


#tailscale

#nix ??


#mkdir unreal
# wget ->
# unzip
#


# bootstraps a server like tailscale, ollama, etc

# docker pull ollama/ollama
# docker run -it --gpus all ollama/ollama
