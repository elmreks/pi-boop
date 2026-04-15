#!/usr/bin/env bash
set -euo pipefail

PI_AGENT_DIR="${HOME}/.pi/agent"
TARGET_EXTENSION="${PI_AGENT_DIR}/extensions/pi-boop.ts"
TARGET_PACK_DIR="${PI_AGENT_DIR}/pi-boop-packs/r2d2_pack"

rm -rf "${TARGET_EXTENSION}" "${TARGET_PACK_DIR}"

echo "Removed runtime files:"
echo "  ${TARGET_EXTENSION}"
echo "  ${TARGET_PACK_DIR}"
echo
echo "Next step in pi: /reload"
