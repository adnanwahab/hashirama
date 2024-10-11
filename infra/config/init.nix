{ config, lib, pkgs, ... }:

{
  networking.hostName = "nixos-vm";
  time.timeZone = "UTC";
  services.openssh.enable = true;
  networking.firewall.enable = false;
  users.users.adnan = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" ];
    initialPassword = "sicp.123";
  };

  environment.systemPackages = [
    pkgs.emacs
    # pkgs.jellyfin
    # pkgs.jellyfin-web
    # pkgs.jellyfin-ffmpeg
  ];
  services.jellyfin = {
    enable = true;
    openFirewall = true;
  };

    services.prometheus = {
    enable = true;
    port = 9001;
  };
    services.nfs.server.enable = true;
  # Add firewall exception for VirtualBox provider
  networking.firewall.extraCommands = ''
    ip46tables -I INPUT 1 -i vboxnet+ -p tcp -m tcp --dport 2049 -j ACCEPT
  '';

  # Add firewall exception for libvirt provider when using NFSv4
  networking.firewall.interfaces."virbr1" = {
    allowedTCPPorts = [ 2049 ];
    allowedUDPPorts = [ 2049 ];
  };

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  services.xserver.enable = true;
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;
  system.stateVersion = "23.11";



programs._1password = { enable = true; };

# Enables the 1Password desktop app
programs._1password-gui = {
enable = true;
# this makes system auth etc. work properly
  polkitPolicyOwners = [ "adnan" ];
}
