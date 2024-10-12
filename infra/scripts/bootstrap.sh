# run this on jetson to install hashirama platform

#sudo apt-get install -y nvidia-container-toolkit
git clone --depth 1 https://github.com/doomemacs/doomemacs ~/.config/emacs
~/.config/emacs/bin/doom install
#sudo apt-get install -y nvidia-container-toolkit
sudo ln -s /home/adnan/hashirama/infra/caddy/Caddyfile /etc/caddy/Caddyfile
#immich



#etc


#tailscale

#nix ??


#mkdir unreal
# wget ->
# unzip
#


# bootstraps a server like tailscale, ollama, etc
#
#
#



curl -fsSL https://ollama.com/install.sh | sh

curl -fsSL https://tailscale.com/install.sh | sh


# docker pull ollama/ollama
# docker run -it --gpus all ollama/ollama
