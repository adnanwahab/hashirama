{ config, pkgs, ... }:
{

  
  imports = [ ./hardware-configuration.nix
              ./init.nix
            ];
  

  # Enable Hyprland and Wayland
  #services.xserver.enable = false; # Disable X11
  #services.wayland.enable = true;
  #services.hyprland.enable = true;

  # Enable some basic services

}
