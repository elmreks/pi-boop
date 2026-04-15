# pi-boop

A native pi extension for playful sound notifications inspired by peon-ping.

## Current features

- Load an OpenPeon/CESP-style pack from disk
- Play sounds by category with `/boop-test <category>`
- Event-driven sounds for:
  - `session.start`
  - `task.complete`
  - `task.error`
- Commands:
  - `/boop-test`
  - `/boop-toggle`
  - `/boop-status`

## Dev layout

- Source: `extensions/pi-boop.ts`
- Active pi symlink: `~/.pi/agent/extensions/pi-boop.ts`
- Current pack: `~/.pi/agent/pi-boop-packs/r2d2_pack`

## Dev workflow

1. Edit `extensions/pi-boop.ts`
2. In pi, run `/reload`
3. Test with `/boop-test task.complete`

## Notes

This is a pi-native rebuild project, not a direct port of peon-ping.
