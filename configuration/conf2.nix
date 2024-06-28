{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  # Basic settings
  networking.hostName = "nixos-vm";
  time.timeZone = "UTC";

  # Enable Hyprland and Wayland
  services.xserver.enable = false; # Disable X11
  services.wayland.enable = true;
  services.hyprland.enable = true;

  # Enable SDDM (Simple Desktop Display Manager)
  services.displayManager.sddm.enable = true;

  # Enable some basic services
  services.openssh.enable = true;
  networking.firewall.enable = false;

  # Allow users to use sudo
  users.users.yourusername = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" ];
  };

  # Specify your username here
  users.users.yourusername.initialPassword = "yourpassword";
}
