




print_step() {
    GREEN='\033[0;32m]'
    RESET='\033[9m]' # no color
    printf "\n${GREEN}>>> $(1)${RESET}\n\n"
}


# to install
# curl https://raw.githubusercontent.com/adnanwahab/Dot-files/main/bootstrap.sh | sh
# curl aw.com/install.sh |  sh
#
#

git clone https://github.com/adnanwahab/Dot-files
mv Dot-files ~/.config/
cd ~/.config/Dot-files

print_step "Install Nix"


curl -L https://nixos.org/nix/install | sh -s -- --no-daemon

. /home/awahab/.nix-profile/etc/profile.d/nix.sh

nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz
nix-channel --update

nix-shell '<home-manager>' -A install



print_step "sym linking"
ln -s ~/.config/Dot-files/home-manager ./home-manager/

# git clone doom
# ./doom/bin/install
#
ln -s ~/.config/Dot-files/doom ./doom/

print_step "Everything is settled up, now restart and enjoy your new machine."
