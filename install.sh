#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${HOME}/.local/share/consult-user-sketch"
REPO_URL="https://github.com/doublej/ConsultUserSketch.git"

info()  { printf '\033[1;34m==>\033[0m %s\n' "$1"; }
error() { printf '\033[1;31merror:\033[0m %s\n' "$1" >&2; exit 1; }

check_prereq() {
  command -v "$1" >/dev/null 2>&1 || error "$1 is required but not found. Install it first."
}

info "Checking prerequisites..."
check_prereq swift
check_prereq bun
check_prereq node
check_prereq git

if [ -d "$INSTALL_DIR/.git" ]; then
  info "Updating existing installation..."
  git -C "$INSTALL_DIR" pull --ff-only
else
  info "Cloning ConsultUserSketch..."
  mkdir -p "$(dirname "$INSTALL_DIR")"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

info "Building Swift CLI (release)..."
cd "$INSTALL_DIR/sketch-cli"
swift build -c release

info "Installing MCP server dependencies..."
cd "$INSTALL_DIR/mcp-server"
bun install

info "Compiling TypeScript..."
bun run tsc

info "Done! Add this to your MCP configuration:"
cat <<EOF

{
  "mcpServers": {
    "consult-user-sketch": {
      "command": "node",
      "args": ["${INSTALL_DIR}/mcp-server/dist/index.js"]
    }
  }
}
EOF
