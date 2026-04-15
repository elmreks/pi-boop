#!/usr/bin/env bash
set -euo pipefail

MODE="symlink"
if [[ "${1:-}" == "--copy" ]]; then
  MODE="copy"
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PI_AGENT_DIR="${HOME}/.pi/agent"
EXTENSIONS_DIR="${PI_AGENT_DIR}/extensions"
PACKS_DIR="${PI_AGENT_DIR}/pi-boop-packs"

mkdir -p "${EXTENSIONS_DIR}" "${PACKS_DIR}"

install_link() {
  local src="$1"
  local dest="$2"

  rm -rf "${dest}"
  ln -sfn "${src}" "${dest}"
  echo "symlinked ${dest} -> ${src}"
}

install_copy() {
  local src="$1"
  local dest="$2"

  rm -rf "${dest}"
  cp -R "${src}" "${dest}"
  echo "copied ${src} -> ${dest}"
}

if [[ "${MODE}" == "copy" ]]; then
  install_copy "${REPO_ROOT}/extensions/pi-boop.ts" "${EXTENSIONS_DIR}/pi-boop.ts"
  install_copy "${REPO_ROOT}/pack/r2d2_pack" "${PACKS_DIR}/r2d2_pack"
else
  install_link "${REPO_ROOT}/extensions/pi-boop.ts" "${EXTENSIONS_DIR}/pi-boop.ts"
  install_link "${REPO_ROOT}/pack/r2d2_pack" "${PACKS_DIR}/r2d2_pack"
fi

echo
echo "Install complete."
echo "Next steps inside pi:"
echo "  /reload"
echo "  /boop-test task.complete"
echo "  /boop-test task.error"
echo "  /boop-demo"
