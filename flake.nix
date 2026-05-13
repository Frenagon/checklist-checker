{
  description = "Dev environment for nodejs.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          bash
          zsh
          nodejs
          agent-browser
          pnpm
          playwright-driver.browsers
        ];

        shellHook = ''
          export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}

          playwrightNpmVersion=$(node -p "require('@playwright/test/package.json').version" 2>/dev/null)
          nixPlaywrightBaseVersion=$(echo "${pkgs.playwright.version}" | cut -d. -f1,2)
          npmPlaywrightBaseVersion=$(echo "$playwrightNpmVersion" | cut -d. -f1,2)

          echo "❄️ Playwright nix version: ${pkgs.playwright.version}"
          echo "📦 Playwright npm version: $playwrightNpmVersion"

          if [ "$nixPlaywrightBaseVersion" != "$npmPlaywrightBaseVersion" ]; then
              echo "❌ Playwright versions (major, minor) in nix ($nixPlaywrightBaseVersion in devenv.yaml) and npm ($npmPlaywrightBaseVersion in package.json) are not the same! Please adapt the configuration."
          else
              echo "✅ Playwright versions in nix and npm are the same"
          fi

          echo
          env | grep ^PLAYWRIGHT
        '';
      };
    });
}
