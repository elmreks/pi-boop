#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PI_AGENT_DIR="${HOME}/.pi/agent"
EXTENSIONS_DIR="${PI_AGENT_DIR}/extensions"
PACKS_DIR="${PI_AGENT_DIR}/pi-boop-packs"

SOURCE_EXTENSION="${REPO_ROOT}/extensions/pi-boop.ts"
SOURCE_PACK_DIR="${REPO_ROOT}/pack/r2d2_pack"
TARGET_EXTENSION="${EXTENSIONS_DIR}/pi-boop.ts"
TARGET_PACK_DIR="${PACKS_DIR}/r2d2_pack"

if [[ ! -f "${SOURCE_EXTENSION}" ]]; then
  echo "Missing source extension: ${SOURCE_EXTENSION}" >&2
  exit 1
fi

if [[ ! -d "${SOURCE_PACK_DIR}" ]]; then
  echo "Missing source pack dir: ${SOURCE_PACK_DIR}" >&2
  exit 1
fi

mkdir -p "${EXTENSIONS_DIR}" "${PACKS_DIR}"

install_extension() {
  rm -f "${TARGET_EXTENSION}"
  cp "${SOURCE_EXTENSION}" "${TARGET_EXTENSION}"
  echo "Installed extension: ${TARGET_EXTENSION}"
}

install_pack() {
  rm -rf "${TARGET_PACK_DIR}"

  if command -v rsync >/dev/null 2>&1; then
    mkdir -p "${TARGET_PACK_DIR}"
    rsync -a --delete "${SOURCE_PACK_DIR}/" "${TARGET_PACK_DIR}/"
  else
    cp -R "${SOURCE_PACK_DIR}" "${TARGET_PACK_DIR}"
  fi

  echo "Installed pack: ${TARGET_PACK_DIR}"
}

install_extension
install_pack

echo
echo "Install complete. Runtime now uses copied files, not repo symlinks."
echo "Installed paths:"
echo "  ${TARGET_EXTENSION}"
echo "  ${TARGET_PACK_DIR}"
echo
echo "Next step in pi: /reload"
