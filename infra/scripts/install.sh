
set -e



#!/bin/bash

# Idempotent Jetson Orin X2 setup script
# Usage: wget hashirama.blog/bootstraph.sh && bash bootstraph.sh

# --- Helper Functions ---
# Function to check if a command exists
# Function to print section headers
print_header() {
    echo "====================================="
    echo "$1"
    echo "====================================="
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}#!/bin/bash

 Update and upgrade the system
print_header "Updating and upgrading the system"
sudo apt update && sudo apt upgrade -y

# Install basic dependencies
print_header "Installing basic dependencies"
sudo apt in

install_1password_cli() {
  echo "Installing 1Password CLI..."
  #ARCH="<choose between 386/amd64/arm/arm64>" && \
  # learn jetson container
  ARCH="arm64" && \
  wget "https://cache.agilebits.com/dist/1P/op2/pkg/v2.30.0/op_linux_${ARCH}_v2.30.0.zip" -O op.zip && \
  unzip -d op op.zip && \
  sudo mv op/op /usr/local/bin/ && \
  rm -r op.zip op && \
  sudo groupadd -f onepassword-cli && \
  sudo chgrp onepassword-cli /usr/local/bin/op && \
  sudo chmod g+s /usr/local/bin/op
  #https://developer.1password.com/docs/cli/get-started/
}


install_zig() {
  sudo add-apt-repository ppa:george-edison55/zig
  sudo apt update
  sudo apt install zig
}


install_ros() {
  echo "Installing ROS Noetic..."
  # Add ROS repository and keys
  sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
  sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
  sudo apt update
  sudo apt install -y ros-noetic-desktop-full
  # Set up environment variables
  echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
  source ~/.bashrc
}

# Function to install dependencies
install_dependencies() {
  echo "Installing dependencies..."
  sudo apt update
  sudo apt install -y build-essential cmake git python3-pip python3-venv
  sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool
}

# Function to install hardware drivers (e.g., Dynamixel SDK)
install_dynamixel_sdk() {
  echo "Installing Dynamixel SDK..."
  git clone https://github.com/ROBOTIS-GIT/DynamixelSDK.git ~/DynamixelSDK
  cd ~/DynamixelSDK/c++/build
  cmake ..
  make
  sudo make install
}

# Function to install Bun.sh
install_bun() {
  echo "Installing Bun.sh..."
  curl -fsSL https://bun.sh/install | bash
}

# Function to install the latest Go
install_golang() {
  echo "Installing latest Go..."
  wget https://golang.org/dl/go1.17.5.linux-arm64.tar.gz
  sudo tar -C /usr/local -xzf go1.17.5.linux-arm64.tar.gz
  echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
  source ~/.bashrc
}

# Function to install Micromamba
install_micromamba() {
  echo "Installing Micromamba..."
  curl micro.mamba.pm/install.sh | bash
}

# Function to set up the SAM2 environment
setup_sam2_environment() {
  echo "Setting up SAM2 environment..."
  # Add commands to create and configure the 'homelab' environment
  echo "Setting up SAM2 environmentTDOD"

}

# Function to clone homelab_status_page
clone_homelab_status_page() {
  echo "Cloning homelab_status_page..."
  git clone https://github.com/adnanwahab/homelab_status_page
}

# Function to set up Jetson containers
setup_jetson_containers() {
  echo "Setting up Jetson containers..."
  git clone https://github.com/dusty-nv/jetson-containers
  cd jetson-containers
  # Add commands to install dependencies for whisper_trt, ollama, 3D Diffusion Policy, ZED, JupyterLab
}
 

#stall -y build-essential cmake git python3-pip python3-venv curl wget

# Install ROS Noetic
install_ros() {
    print_header "Installing ROS Noetic"
    sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
    sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
    sudo apt update
    sudo apt install -y ros-noetic-desktop-full
    echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
    source ~/.bashrc
    sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
    sudo rosdep init
    rosdep update
}

# Install Rust Desk
install_rust_desk() {
    print_header "Installing Rust Desk"
    wget https://github.com/rustdesk/rustdesk/releases/download/1.1.9/rustdesk-1.1.9.deb
    sudo apt install -y ./rustdesk-1.1.9.deb
    rm rustdesk-1.1.9.deb
}

# Install Bun
install_bun() {
    print_header "Installing Bun"
    curl -fsSL https://bun.sh/install | bash
}

# Install Go
install_go() {
    print_header "Installing Go"
    wget https://golang.org/dl/go1.17.linux-arm64.tar.gz
    sudo tar -C /usr/local -xzf go1.17.linux-arm64.tar.gz
    echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
    source ~/.bashrc
    rm go1.17.linux-arm64.tar.gz
}

# Install Micromamba
install_micromamba() {
    print_header "Installing Micromamba"
    wget -qO- https://micromamba.snakepit.net/api/micromamba/linux-64/latest | tar -xvj bin/micromamba
    ./bin/micromamba shell init -s bash -p ~/micromamba
    source ~/.bashrc
}

# Install SAM2 dependencies
install_sam2() {
    print_header "Installing SAM2 dependencies"
    git clone https://github.com/facebookresearch/sam2.git
    cd sam2
    micromamba create -n homelab python=3.8
    micromamba activate homelab
    pip install -r requirements.txt
    cd ..
}

# Clone homelab_status_page
clone_homelab_status() {
    print_header "Cloning homelab_status_page"
    git clone https://github.com/adnanwahab/homelab_status_page.git
}

# Install Jetson containers
install_jetson_containers() {
    print_header "Installing Jetson containers"
    git clone https://github.com/dusty-nv/jetson-containers.git
    cd jetson-containers
    ./scripts/docker_build_all.sh --target whisper_trt,ollama,3D_diffusion_policy,zed,jupyterlab
    cd ..
}

# Install Dynamixel SDK
install_dynamixel_sdk() {
    print_header "Installing Dynamixel SDK"
    git clone https://github.com/ROBOTIS-GIT/DynamixelSDK.git ~/DynamixelSDK
    cd ~/DynamixelSDK/c++/build
    cmake ..
    make
    sudo make install
    cd ~
}

# Main installation process
main() {
    install_ros
    install_rust_desk
    install_tailscale
    install_bun
    install_go
    install_micromamba
    install_sam2
    clone_homelab_status
    install_jetson_containers
    install_dynamixel_sdk

    print_header "Installation complete"
    echo "Please reboot your system to ensure all changes take effect."
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- Installation Functions ---

# 1. Install RustDesk (Remote desktop tool)
install_rustdesk() {
    if ! command_exists rustdesk; then
        echo "Installing RustDesk..."
        wget https://github.com/rustdesk/rustdesk/releases/download/1.1.9/rustdesk-1.1.9-x86_64.deb
        sudo dpkg -i rustdesk-1.1.9-x86_64.deb
        sudo apt --fix-broken install -y
        rm rustdesk-1.1.9-x86_64.deb
    else
        echo "RustDesk already installed."
    fi
}

# 2. Install Tailscale (VPN tool)
install_tailscale() {
    if ! command_exists tailscale; then
        echo "Installing Tailscale..."
        curl -fsSL https://tailscale.com/install.sh | sh
    else
        echo "Tailscale already installed."
    fi
}

# 3. Install Bun (JavaScript runtime)
install_bun() {
    if ! command_exists bun; then
        echo "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
    else
        echo "Bun already installed."
    fi
}

# 4. Install latest GoLang
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

# 5. Install Micromamba (lightweight conda alternative)
install_micromamba() {
    if ! command_exists micromamba; then
        echo "Installing Micromamba..."
        curl micro.mamba.pm/install.sh | bash
    else
        echo "Micromamba already installed."
    fi
}

# 6. Install SAM2 from Facebook Research
install_sam2() {
    echo "Cloning SAM2 repository and setting up environment..."
    git clone https://github.com/facebookresearch/sam2.git ~/sam2
    cd ~/sam2
    micromamba create -n homelab python=3.8
    micromamba activate homelab
    pip install -r requirements.txt
}

# 7. Clone Homelab Status Page (no additional setup)
clone_homelab_status_page() {
    echo "Cloning Homelab Status Page..."
    git clone https://github.com/adnanwahab/homelab_status_page ~/homelab_status_page
}

# 8. Clone and set up Jetson Containers
setup_jetson_containers() {
    echo "Setting up Jetson Containers..."
    git clone https://github.com/dusty-nv/jetson-containers.git ~/jetson-containers
    cd ~/jetson-containers
    sudo docker-compose up -d whisper_trt ollama 3d_diffusion_policy zed jupyterlab
}

# 9. Install ROS (Robot Operating System) Noetic
install_ros() {
    if ! command_exists roscore; then
        echo "Installing ROS Noetic..."
        sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
        sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
        sudo apt update
        sudo apt install -y ros-noetic-desktop-full
        echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
        source ~/.bashrc
    else
        echo "ROS Noetic already installed."
    fi
}

# 10. Install ncdu (Disk usage analyzer)
install_ncdu() {
    if ! command_exists ncdu; then
        echo "Installing ncdu..."
        sudo apt install -y ncdu
    else
        echo "ncdu already installed."
    fi
}
# Run the main installation process
#!/bin/bash

# Idempotent Jetson Orin X2 setup script
# Usage: wget hashirama.blog/bootstraph.sh && bash bootstraph.sh

# --- Helper Functions ---
# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- Installation Functions ---

# 1. Install RustDesk (Remote desktop tool)
install_rustdesk() {
    if ! command_exists rustdesk; then
        echo "Installing RustDesk..."
        wget https://github.com/rustdesk/rustdesk/releases/download/1.1.9/rustdesk-1.1.9-x86_64.deb
        sudo dpkg -i rustdesk-1.1.9-x86_64.deb
        sudo apt --fix-broken install -y
        rm rustdesk-1.1.9-x86_64.deb
    else
        echo "RustDesk already installed."
    fi
}

# 2. Install Tailscale (VPN tool)
install_tailscale() {
    if ! command_exists tailscale; then
        echo "Installing Tailscale..."
        curl -fsSL https://tailscale.com/install.sh | sh
    else
        echo "Tailscale already installed."
    fi
}

# 3. Install Bun (JavaScript runtime)
install_bun() {
    if ! command_exists bun; then
        echo "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
    else
        echo "Bun already installed."
    fi
}

# 4. Install latest GoLang
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

# 5. Install Micromamba (lightweight conda alternative)
install_micromamba() {
    if ! command_exists micromamba; then
        echo "Installing Micromamba..."
        curl micro.mamba.pm/install.sh | bash
    else
        echo "Micromamba already installed."
    fi
}

# 6. Install SAM2 from Facebook Research
install_sam2() {
    echo "Cloning SAM2 repository and setting up environment..."
    git clone https://github.com/facebookresearch/sam2.git ~/sam2
    cd ~/sam2
    micromamba create -n homelab python=3.8
    micromamba activate homelab
    pip install -r requirements.txt
}

# 7. Clone Homelab Status Page (no additional setup)
clone_homelab_status_page() {
    echo "Cloning Homelab Status Page..."
    git clone https://github.com/adnanwahab/homelab_status_page ~/homelab_status_page
}

# 8. Clone and set up Jetson Containers
setup_jetson_containers() {
    echo "Setting up Jetson Containers..."
    git clone https://github.com/dusty-nv/jetson-containers.git ~/jetson-containers
    cd ~/jetson-containers
    sudo docker-compose up -d whisper_trt ollama 3d_diffusion_policy zed jupyterlab
}

# 9. Install ROS (Robot Operating System) Noetic
install_ros() {
    if ! command_exists roscore; then
        echo "Installing ROS Noetic..."
        sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
        sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
        sudo apt update
        sudo apt install -y ros-noetic-desktop-full
        echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
        source ~/.bashrc
    else
        echo "ROS Noetic already installed."
    fi
}

# 10. Install ncdu (Disk usage analyzer)
install_ncdu() {
    if ! command_exists ncdu; then
        echo "Installing ncdu..."
        sudo apt install -y ncdu
    else
        echo "ncdu already installed."
    fi
}


install_main_adnan() {
  # --- Execution ---

  # Install everything
  install_1password_cli
  install_rustdesk
  install_tailscale
  install_bun
  install_golang
  install_micromamba
  install_sam2
  clone_homelab_status_page
  setup_jetson_containers
  install_ros
  install_ncdu
}































 
# Main installation function
main_install() {
  install_tailscale
  install_1password_cli
  install_rustdesk
  install_bun
  install_golang
  install_micromamba
  install_zig
  setup_sam2_environment
  clone_homelab_status_page
  setup_jetson_containers
  install_ncdu
  install_ros
  install_golang
  clone_homelab_status_page
  install_micromamba
  install_sam2
}

main 2>&1 | tee -a "$LOG_FILE"

#main
#make_install
#main_install
#mkdir -p ~/backup_configs
#cp ~/.bashrc ~/backup_configs/.bashrc.bak
echo "Installation complete. Please reboot your system."

echo "All installations complete. You may want to reboot your system."



# --- Execution ---

# Alias for restarting the blog
alias restart_blog="go run main.go"
# how to use - wget hashirama.blog/bootstraph.sh && bash bootstraph.sh
alias restart_blog="go run main.go"


#dhh, primagen, iaso, mitchellh, catonmat, 

# trossen - look up all - robotics companies
# https://github.com/mathiasbynens/dotfiles

#boostrap file - running this in a conainter on macos / nixos
# https://github.com/xe
# nix  2025
#https://github.com/ThePrimeagen/.dotfiles
# 1. Mathias Bynens’s Dotfiles

# 	•	Stars: Over 29K stars
# 	•	Link: https://github.com/mathiasbynens/dotfiles
# 	•	Description: This is one of the most well-known dotfiles repositories. It contains Mathias’s macOS and Ubuntu configurations, including his custom Bash, Zsh, and Vim setups.

# 2. Paul Irish’s Dotfiles

# 	•	Stars: Over 7.7K stars
# 	•	Link: https://github.com/paulirish/dotfiles
# 	•	Description: A popular dotfile repo from Paul Irish that features configuration settings for Zsh, Git, and macOS system preferences. It includes useful scripts and aliases for productivity.

# 3. Zach Holman’s Dotfiles

# 	•	Stars: Over 7.5K stars
# 	•	Link: https://github.com/holman/dotfiles
# 	•	Description: This repo offers Zach Holman’s streamlined setup for managing shell environments, including custom configurations for Zsh, Ruby, Git, and macOS settings.

# 4. YADR - Yet Another Dotfile Repo

# 	•	Stars: Over 8K stars
# 	•	Link: https://github.com/skwp/dotfiles
# 	•	Description: A well-packaged dotfile repository featuring an extensive Vim configuration, support for Zsh, tmux, and more. It’s highly customizable and optimized for developers.

# 5. Dries Vints’s Dotfiles

# 	•	Stars: Over 7.6K stars
# 	•	Link: https://github.com/driesvints/dotfiles
# 	•	Description: A simple but effective set of dotfiles used by Dries Vints. The repository focuses on setting up a macOS-based development environment with applications like Homebrew and Zsh.

# 6. Janus - Vim Distribution

# 	•	Stars: Over 7K stars
# 	•	Link: https://github.com/carlhuda/janus
# 	•	Description: A distribution of Vim configurations and plugins aimed at improving usability for both beginner and advanced users. It’s highly popular in the Vim community.

# 7. Nick Nisi’s Dotfiles

# 	•	Stars: Over 3.4K stars
# 	•	Link: https://github.com/nicknisi/dotfiles
# 	•	Description: Nick Nisi’s highly customized setup for Zsh, Vim, tmux, and Git. It includes advanced features like powerline integration, syntax highlighting, and more.

# 8. Cowboy’s Dotfiles

# 	•	Stars: Over 3.9K stars
# 	•	Link: https://github.com/cowboy/dotfiles
# 	•	Description: A robust set of dotfiles for macOS and Linux with an emphasis on cross-platform compatibility. It includes shell, Git, and Vim customizations.

# 9. thoughtbot Dotfiles

# 	•	Stars: Over 7.2K stars
# 	•	Link: https://github.com/thoughtbot/dotfiles
# 	•	Description: A collection of dotfiles used by the thoughtbot development team, featuring configurations for Vim, Zsh, tmux, and macOS productivity scripts.

# 10. Jessie Frazelle’s Dotfiles

# 	•	Stars: Over 6.7K stars
# 	•	Link: https://github.com/jessfraz/dotfiles
# 	•	Description: Jessie Frazelle’s dotfiles are focused on a secure, minimal setup for Bash, Vim, tmux, and Docker, among other tools. It’s designed for developers who value simplicity and efficiency.



#yt
#soundcloud 
# history visualizaiton - ask chatGPT how to aadd this 
# https://macwright.com/

#idnex 100,000 startups -- yc,benchmark, pioneer.app etc - find ones that didnt work - and see if they make sense today.

# https://gregbrockman.com/
# https://www.youtube.com/watch?v=4qQrwoMTPNM
# observable - (firecracker + nix + criu ) (python, js, zig)
# replit---

# he top 5 competitors to Replit, a popular online coding platform, include:

# GitHub Codespaces

# Glitch:

# CodeSandbox: 

# StackBlitz








# idempottent install.script
# dependencies 
# 1. rust desk
# 2. tailscale
# 3. rust desk
# 4. bun.sh
# 5. latest golang
# 6. micromamba - deps
# 7. https://github.com/facebookresearch/sam2 - install deps using a custom environment called - homelab that mirrors their deps
# 8. git clone github.com/adnanwahab/homelab_status_page - clone and do nothing
# 9. https://github.com/dusty-nv/jetson-containers - git clone and install deps for jetson-containers/(whisper\_trt, ollama, 3D Diffusion Policy, ZED, JupyterLab)
# 10. to install jetson - 5 min - run install script
# sudo apt install ncdu
# 10 good tools from 10
# zig - repl - misc tools - 1000

# good exmaples - 
# https://brew.sh/
# https://github.com/nvm-sh/nvm
# Script: https://get.docker.com/
# Miniconda
# Oh My Zsh
# curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# nix - use that manage - hashicorp mitchelH - gen images + virtualization
# dhh + primagen
# deno.land 2.0
# 1pw cli

#https://github.com/dusty-nv/jetson-containers

#https://github.com/anduril/jetpack-nixos
#https://github.com/anduril/mcap-rs



# Jetson Robotics Setup Script for Ubuntu 24.04
# This script installs various tools and libraries for robotics development on Jetson devices

#catonmat + browserify
