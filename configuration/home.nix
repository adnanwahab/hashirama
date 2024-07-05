{ config, pkgs, ... }:

{
  # Home Manager needs a bit of information about you and the paths it should
  # manage.
  home.username = "adnan";
  home.homeDirectory = "/home/adnan";

  # This value determines the Home Manager release that your configuration is
  # compatible with. This helps avoid breakage when a new Home Manager release
  # introduces backwards incompatible changes.
  #
  # You should not change this value, even if you update Home Manager. If you do
  # want to update the value, then make sure to first check the Home Manager
  # release notes.
  home.stateVersion = "24.05"; # Please read the comment before changing.

  # The home.packages option allows you to install Nix packages into your
  # environment.
  targets.genericLinux.enable = true;
  home.packages =  with pkgs; [
    # pkgs.syncthing
    # dunst
    # libnotify
    # wezterm
    # alacritty
    # nodejs_20
    # discord
    # firefox
    # neovim
    # kitty
    # swww
    # rofi
    # flameshot
    # mako
    # discord
    # curl
    # bashmount
    # xfce.thunar
    # networkmanagerapplet
    # catppuccin-papirus-folders
    # neofetch
    # ranger
    # feh
    # waybar
    # cmus
    # grim
    # zip
    # ripgrep
    # fd
    # unzip
    # cava
    # git
    # pavucontrol
    # multimarkdown
    # shellcheck
    # vlc
    # ffmpeg
    # waybar
    # swww
    # rofi-wayland
    # wofi
    # bemenu
    # fuzzel
    # tofi

    # pkgs.nix-prefetch-git
    # isync notmuch notmuch-apply msmtp msmtp-enqueue afew
    # pkgs.jq
    # pkgs.valgrind pkgs.kcachegrind pkgs.graphviz
    # pkgs.unstable.ardour
    # pkgs.simplescreenrecorder pkgs.ffcast pkgs.xorg.xwininfo ## screencasts
    # sit
    # pkgs.mmark pkgs.xml2rfc
    # #pkgs.binutils-unwrapped
    # #pkgs.sikulix
    # pkgs.unstable.inkscape
    # inkscapeIsometric
    # pkgs.unstable.astroid
    # pkgs.unstable.nodePackages.tiddlywiki
    # pkgs.unstable.brave
    # pkgs.google-play-music-desktop-player
    # pkgs.unstable.cmake
    # pkgs.unstable.framac pkgs.unstable.why3 pkgs.unstable.alt-ergo
    # pkgs.python3 # for YCM
    # adapta-gtk-theme
    # libreoffice
    # coreutils
    # #kdenlive frei0r ffmpeg-full
    # mdcat xclip
    # i3blocks i3status mako wofi grim waybar redshift-wlr
    # obs-studio
    # pkgs.unzip
    # pkgs.wget
    # pkgs.gnupg
    # pkgs.wpa_supplicant_gui
    # pkgs.blackbox pkgs.keybase pkgs.keybase-gui
    # pkgs.udisks
    # pkgs.mc
    # pkgs.rlwrap
    # pkgs.xorg.xdpyinfo # awesome/foggy seems to want it
    # pkgs.vlc
    # pkgs.shutter # Screenshots
    # pkgs.zathura # document viewer
    # pkgs.htop
    # pkgs.bc
    # pkgs.ncdu # Disk space usage analyzer
    # pkgs.ripgrep # rg, fast grepper
    # pkgs.rtv # Reddit
    # pkgs.unstable.dropbox
    # pkgs.zeal
    # pkgs.atom
    # #pkgs.vscode
    # pkgs.unstable.idea.idea-ultimate pkgs.jdk
    # pkgs.gradle
    # pkgs.tdesktop # Telegram
    # #(pkgs.zoom-us.overrideAttrs (super: {
    # #  postInstall = ''
    # #    ${super.postInstall}
    # #    wrapProgram $out/bin/zoom-us --set LIBGL_ALWAYS_SOFTWARE 1
    # #  '';
    # #}))
    # zoom-us
    # pkgs.unstable.slack
    # #pkgs.skypeforlinux
    # pkgs.chromium pkgs.firefox pkgs.google-chrome
    # pkgs.termite pkgs.tmux
    # pkgs.translate-shell
    # pkgs.xss-lock
    # pkgs.ansifilter # used to strip ANSI out in awesome extensions
    # #pkgs.zim # desktop wiki
    # pkgs.whois
    # pkgs.youtube-dl
    # pkgs.gimp pkgs.imagemagick
    # pkgs.gcc
    # (pkgs.rustChannels.stable.rust.override { extensions = ["rust-src"]; })
    # pkgs.rustracer
    # #pkgs.tla-plus.full
    # pkgs.ghc pkgs.cabal-install pkgs.stack
    # pkgs.haskellPackages.idris
    # pkgs.unstable.ponyc
    # pkgs.pandoc pkgs.texlive.combined.scheme-tetex
    # pkgs.funnelweb
    # pkgs.plantuml
    # pkgs.vagrant
    # pkgs.gdb
    # pkgs.gnumake
    # pkgs.gpxsee
    # pkgs.clips
    # pkgs.mosh
    # # discord
    # thunderbird


    # pkgs.sassc
    # pkgs.cinnamon.nemo-fileroller
    # pkgs.conky
    # pkgs.xfce.xfce4-settings
    # pkgs.adw-gtk3
    # pkgs.brillo
    # pkgs.p7zip
    # pkgs.cinnamon.nemo-with-extensions
    # pkgs.protontricks
    # pkgs.cinnamon.nemo
    # pkgs.gnome.zenity
    # pkgs.xfce.thunar
    # pkgs.xfce.thunar-archive-plugin
    # pkgs.nwg-look
    # pkgs.gnome.gnome-boxes
    # pkgs.vinegar
    # pkgs.xarchive
    # pkgs.xarchiver
    # pkgs.pavucontrol
    # pkgs.libsForQt5.dolphin
    # libsForQt5.qtstyleplugin-kvantum # Hyprland?
    # pkgs.hyprpaper # Very Hyprland
    # pkgs.pywal # Hyprland
    # pkgs.lxappearance # Hyprland
    # pkgs.pamixer # Hyprland
    # pkgs.wofi # Hyprland
    # pkgs.kitty # Hyprland
    # pkgs.waybar # Hyprland
    # pkgs.gnome.gnome-disk-utility
    # pkgs.networkmanagerapplet
    # pkgs.gnome.gnome-software
    # pkgs.vim
    # pkgs.flameshot # Hyprland
    # pkgs.gnome.gnome-tweaks

    # pkgs.python311Packages.pip
    # pkgs.alacritty # Hyprland
    # pkgs.cliphist # Hyprland
    # pkgs.zathura # Hyprland
    # pkgs.rofi-wayland #Hyprland
    # pkgs.dunst # Hyprland
    # pkgs.swaylock-effects # Hyprland
    # pkgs.ungoogled-chromium
    # pkgs.neofetch
    # pkgs.pridefetch
    # pkgs.fastfetch
    # pkgs.micro
    # pkgs.steamtinkerlaunch
    # pkgs.heroic
    # pkgs.lutris
    # pkgs.obs-studio
    # pkgs.gedit
    # pkgs.emacs
    # pkgs.gnome.gnome-terminal
    # pkgs.git
    # pkgs.cmake
    # pkgs.meson
    # pkgs.vim-full
    # pkgs.gnumake
    # pkgs.starship
    # pkgs.gamemode
    # pkgs.eww # Hyprland
    # pkgs.mangohud
    # pkgs.gradience
    # pkgs.latte-dock
    # pkgs.python3

    # # Adds the 'hello' command to your environment. It prints a friendly
    # # "Hello, world!" when run.
    # pkgs.hello

    # # It is sometimes useful to fine-tune packages, for example, by applying
    # # overrides. You can do that directly here, just don't forget the
    # # parentheses. Maybe you want to install Nerd Fonts with a limited number of
    # # fonts?
    # (pkgs.nerdfonts.override { fonts = [ "FantasqueSansMono" ]; })

    # You can also create simple shell scripts directly inside your
    # configuration. For example, this adds a command 'my-hello' to your
    # environment:
    # (pkgs.writeShellScriptBin "my-hello" ''
    #   echo "Hello, ${config.home.username}!"
    # '')

    # # Adds the 'hello' command to your environment. It prints a friendly
    # # "Hello, world!" when run.
    # pkgs.hello

    # # It is sometimes useful to fine-tune packages, for example, by applying
    # # overrides. You can do that directly here, just don't forget the
    # # parentheses. Maybe you want to install Nerd Fonts with a limited number of
    # # fonts?
    # (pkgs.nerdfonts.override { fonts = [ "FantasqueSansMono" ]; })

    # # You can also create simple shell scripts directly inside your
    # # configuration. For example, this adds a command 'my-hello' to your
    # # environment:
    # (pkgs.writeShellScriptBin "my-hello" ''
    #   echo "Hello, ${config.home.username}!"
    # '')
    #
  ];

  # Home Manager is pretty good at managing dotfiles. The primary way to manage
  # plain files is through 'home.file'.
  home.file = {
    # # Building this configuration will create a copy of 'dotfiles/screenrc' in
    # # the Nix store. Activating the configuration will then make '~/.screenrc' a
    # # symlink to the Nix store copy.
    # ".screenrc".source = dotfiles/screenrc;

    # # You can also set the file content immediately.
    # ".gradle/gradle.properties".text = ''
    #   org.gradle.console=verbose
    #   org.gradle.daemon.idletimeout=3600000
    # '';
  };

  # Home Manager can also manage your environment variables through
  # 'home.sessionVariables'. These will be explicitly sourced when using a
  # shell provided by Home Manager. If you don't want to manage your shell
  # through Home Manager then you have to manually source 'hm-session-vars.sh'
  # located at either
  #
  #  ~/.nix-profile/etc/profile.d/hm-session-vars.sh
  #
  # or
  #
  #  ~/.local/state/nix/profiles/profile/etc/profile.d/hm-session-vars.sh
  #
  # or
  #
  #  /etc/profiles/per-user/adnan/etc/profile.d/hm-session-vars.sh
  #
  home.sessionVariables = {
    # EDITOR = "emacs";
  };

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;

  services = {
    syncthing = {
      enable = true;
      user = "adnan";
      dataDir = "/home/adnan/Documents";    # Default folder for new synced folders
      configDir = "/home/adnan/Documents/.config/syncthing";   # Folder for Syncthing's settings and keys
    };
  };

}
