#!/bin/bash
set -e
LOG_FILE="log.txt"


command_exists() {
    command -v "$1" >/dev/null 2>&1
}


echo "Script version: 1.0.7"

install_1password_cli() {
    echo "Installing 1Password CLI..."
    ARCH="arm64"
    wget "https://cache.agilebits.com/dist/1P/op2/pkg/v2.30.0/op_linux_${ARCH}_v2.30.0.zip" -O op.zip
    unzip -d op op.zip
    sudo mv op/op /usr/local/bin/
    rm -r op.zip op
    sudo groupadd -f onepassword-cli
    sudo chgrp onepassword-cli /usr/local/bin/op
    sudo chmod g+s /usr/local/bin/op
}

install_dependencies() {
    echo "Installing dependencies..."
    sudo apt update
    sudo apt install -y build-essential cmake git python3-pip python3-venv
    sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool
    sudo apt install -y docker-compose
}

install_dynamixel_sdk() {
    echo "Installing Dynamixel SDK..."
    git clone https://github.com/ROBOTIS-GIT/DynamixelSDK.git ~/DynamixelSDK
    cd ~/DynamixelSDK/c++/build
    cmake ..
    make
    sudo make install
    cd ~
}

install_bun() {
    # if ! command_exists bun; then
    #     echo "Installing Bun..."
    #     curl -fsSL https://bun.sh/install | bash
    # else
    #     echo "Bun already installed."
    # fi
     echo "already installed Bun..."
}

install_golang() {
    if ! command_exists go; then
        echo "Installing GoLang..."
        wget https://go.dev/dl/go1.20.5.linux-arm64.tar.gz
        sudo tar -C /usr/local -xzf go1.20.5.linux-arm64.tar.gz
        rm go1.20.5.linux-arm64.tar.gz
        echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
        source ~/.bashrc
    else
        echo "GoLang already installed."
    fi
}

install_micromamba() {
    if ! command_exists micromamba; then
        echo "Installing Micromamba..."
        curl micro.mamba.pm/install.sh | bash
    else
        echo "Micromamba already installed."
    fi
}

setup_sam2_environment() {
    echo "Setting up SAM2 environment..."
    # Add commands to create and configure the 'homelab' environment
    #echo "Setting up SAM2 environmentTDOD"
}

clone_homelab_status_page() {
    echo "Cloning Homelab Status Page..."
    if [ -d "~/homelab_status_page" ] && [ "$(ls -A ~/homelab_status_page)" ]; then
        echo "Directory ~/homelab_status_page already exists and is not empty. Skipping clone."
    else
        git clone git@github.com:BotParty/homelab_status_page.git ~/homelab_status_page
    fi

}

setup_jetson_containers() {
    echo "Setting up Jetson Containers..."
    git clone https://github.com/dusty-nv/jetson-containers.git ~/jetson-containers
    cd ~/jetson-containers
    sudo docker-compose up -d whisper_trt ollama 3d_diffusion_policy zed jupyterlab
}

install_rustdesk() {
   if ! command_exists rustdesk; then
        echo "Installing RustDesk..."
        # Update the URL with the correct version and architecture
        wget https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.deb
        sudo dpkg -i rustdesk-1.3.1-x86_64.deb
        sudo apt --fix-broken install -y
        rm rustdesk-1.3.1-x86_64.deb
    else
        echo "RustDesk already installed."
    fi
}

install_tailscale() {
    if ! command_exists tailscale; then
        echo "Installing Tailscale..."
        curl -fsSL https://tailscale.com/install.sh | sh
    else
        echo "Tailscale already installed."
    fi
}

install_ncdu() {
    if ! command_exists ncdu; then
        echo "Installing ncdu..."
        sudo apt install -y ncdu
    else
        echo "ncdu already installed."
    fi
}


install_tailscale
install_bun
install_golang
install_micromamba
setup_sam2_environment
clone_homelab_status_page
setup_jetson_containers
install_ncdu
install_dynamixel_sdk
echo "Installation complete. Please reboot your system."


#TODO: 
# better false checking - reinstalling - learn bash basics
# - setup_op
# - install_rustdesk


#main_install 2>&1 | tee -a "$LOG_FILE"
   # install_1password_cli
    # install_rustdesk
    # proxmox


install_zig() {
    zig build-lib -target wasm32-freestanding -dynamic foo.zig
}
