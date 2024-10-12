{
  description = "homelab-status-page";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";

    gomod2nix = {
      url = "github:tweag/gomod2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  # outputs = { self, nixpkgs, deploy-rs, gomod2nix, utils }
  outputs = { self, nixpkgs, gomod2nix, utils }:
    let
      # Generate a user-friendly version number.
      version = builtins.substring 0 8 self.lastModifiedDate;

      # System types to support.
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];

      # Helper function to generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;

      # Nixpkgs instantiated for supported system types.
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      # Provide some binary packages for selected system types.
      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          # System default package for 'nix build'. This makes sense if the
          # flake provides only one package or there is a clear "main"
          # package.
          default = pkgs.buildGoModule {
            pname = "go-hello";
            inherit version;
            # In 'nix develop', we don't need a copy of the source tree
            # in the Nix store.
            src = /home/adnan/hashirama/services/homelab-status-page/.;

            # This hash locks the dependencies of this package. It is
            # necessary because of how Go requires network access to resolve
            # VCS. See https://www.tweag.io/blog/2021-03-04-gomod2nix/ for
            # details. Normally one can build with a fake sha256 and rely on native Go
            # mechanisms to tell you what the hash should be or determine what
            # it should be "out-of-band" with other tooling (eg. gomod2nix).
            # To begin with it is recommended to set this, but one must
            # remember to bump this hash when your dependencies change.
            #vendorSha256 = pkgs.lib.fakeSha256;

            #vendorHash = "sha256-pQpattmS9VmO3ZIQUFn66az8GSmB4IvYhTTCFn6SUmo=";
            vendorHash = null;
          };

          devShell = pkgs.mkShell {
            packages = with pkgs; [
              curl
              git
              gopls
              gotools
              go_1_22
              yarn
            ];
          };
        }
      );


    };
}
