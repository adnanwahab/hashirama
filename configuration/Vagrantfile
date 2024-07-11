Vagrant.configure("2") do |config|
  #config.vagrant.plugins = "vagrant-libvirt"
  #config.vm.box = "boxen/nixos-23.11"
    config.vm.box = "griff/nixos-stable-x86_64"
  config.vm.provider "virtualbox" do |v|
    v.gui = true
    v.memory = 1024
    v.cpus = 2
    v.name = "my_vm"
  end

  config.vm.hostname = "hashirama-vm"
  config.vm.disk :disk, size: "50GB", primary: true
  config.vm.synced_folder '.', '/vagrant', disabled: true
  # Disable shared virtualbox mount path (not vboxsf installed on guest)
  #
  config.trigger.before [:up, :destroy, :halt, :package] do |trigger|
    trigger.name = "Finished Message"
    trigger.info = "Machine is up!"
  end
end



# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
#
#Vagrant.configure("2") do |config|
#  config.vm.provision "shell", inline: <<-SHELL
#     echo 'Configuring NixOS...'
#    EOF
#  SHELL

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows
  # host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL

  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.



 #https://github.com/vagrant-libvirt/vagrant-libvirt
  # config.vm.provider :lxc do |lxc|
  #     lxc.customize 'cgroup.memory.limit_in_bytes', '512M'
  # end
# use configuraiton.nix
#  use home.nix


  #config.vm.box = "nixos-23.11"

  # Add the htop package
  # config.vm.provision :nixos,
  #   run: 'always',
  #   expression: {
  #     environment: {
  #       systemPackages: [ :htop ]
  #     }
  #   }
  #   config.vm.provision "docker" do |docker|
  #   docker.pull_images "nginx"
  #   docker.run "nginx", image: "nginx", ports: ["80:80"]
  # end
    # Example: Install wget and curl
    # cat <<EOF >> /etc/nixos/configuration.nix
    # {
    #   environment.systemPackages = with pkgs; [
    #     wget
    #     curl
    #   ];
    # }
    # EOF

    # nixos-rebuild switch

# https://github.com/nix-community/nixbox
# https://github.com/vagrant-libvirt/vagrant-libvirt
#
#https://github.com/hashicorp/vagrant
#https://developer.hashicorp.com/vagrant/docs/vagrantfile/ssh_settings
#qemu-kvm f
#
#
# puppet.
# https://wiki.archlinux.org/title/Kata_Containers
# https://wiki.archlinux.org/title/Kata_Containers
# https://app.vagrantup.com/boxes/search
# http://www.vagrantbox.es/
# https://github.com/chef/bento
# https://app.vagrantup.com/bento
# https://app.terraform.io/puppetlabs
# https://cloud-images.ubuntu.com/vagrant/
# https://github.com/elasticdog/packer-arch
# https://app.vagrantup.com/archlinux/boxes/archlinux
#
# vagrant plugin install vagrant-libvirt
# vagrant up --provider=libvirt
# vagrant plugin install vagrant-lxc
# vagrant hostmanager - vagrant reload l


#Vagrant.configure("2") do |config|

  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.


  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
#end
