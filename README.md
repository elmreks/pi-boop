# pi-boop

A native [pi](https://www.npmjs.com/package/@mariozechner/pi-coding-agent) extension for playful sound notifications.

It started as a learning project inspired by peon-ping, but it's being rebuilt in a pi-native way: pi events in, boops out.

## What it does

`pi-boop` loads an OpenPeon/CESP-style sound pack from disk and plays sounds for pi lifecycle events.

Current behavior:

- `session_start` → `session.start`
- `agent_end` → `task.complete`
- tool errors → `task.error`

It also includes manual commands for testing, previewing, and toggling sounds.

## Current commands

- `/boop-test <category>` — play a sound from a category
- `/boop-demo` — preview every category in sequence
- `/boop-toggle` — enable/disable boops
- `/boop-status` — show current boop status

Examples:

```text
/boop-test task.complete
/boop-test session.start
/boop-demo
/boop-toggle
/boop-status
```

## Pack setup

The repo now contains the canonical pack assets:

- `pack/r2d2_pack/openpeon.json`
- `pack/r2d2_pack/sounds/*.mp3`

At runtime, pi reads the installed pack from:

- `~/.pi/agent/pi-boop-packs/r2d2_pack`

That installed pack uses the upstream OpenPeon/CESP manifest format:

- `openpeon.json`
- `sounds/*.mp3`

## Install / local dev setup

Use installer to copy repo files into pi runtime:

```bash
./scripts/install.sh
```

Installer creates runtime targets if needed, then copies files to:

- `extensions/pi-boop.ts` → `~/.pi/agent/extensions/pi-boop.ts`
- `pack/r2d2_pack` → `~/.pi/agent/pi-boop-packs/r2d2_pack`

Copy mode is only mode right now. Pi runtime does not depend on repo path after install.

Then reload pi:

```text
/reload
```

## Dev workflow

Repo is source of truth. Runtime files are installed artifacts.

1. Edit `extensions/pi-boop.ts` and/or files under `pack/r2d2_pack`
2. Run `./scripts/install.sh`
3. Run `/reload` in pi
4. Test with `/boop-test task.complete`, `/boop-test task.error`, or `/boop-demo`
5. Commit repo changes

Do not edit runtime files in `~/.pi/agent/...` directly. Installer replaces them on next run.

## Project structure

```text
pi-boop/
  README.md
  extensions/
    pi-boop.ts
  pack/
    r2d2_pack/
      openpeon.json
      sounds/
  scripts/
    install.sh
```

Live pi runtime targets:

- installed extension: `~/.pi/agent/extensions/pi-boop.ts`
- installed pack: `~/.pi/agent/pi-boop-packs/r2d2_pack`

## Notes

This is pi-native rebuild project, not direct port of peon-ping.

Sound packs still use upstream OpenPeon/CESP manifest format, so `openpeon.json` inside pack directories is expected.

## Uninstall

Optional cleanup:

```bash
./scripts/uninstall.sh
```

That removes only:

- `~/.pi/agent/extensions/pi-boop.ts`
- `~/.pi/agent/pi-boop-packs/r2d2_pack`

## Roadmap

Near-term ideas:

- configurable pack selection
- persisted enable/disable state
- more event mappings like `task.acknowledge` and `resource.limit`
- richer pack management
- optional overlays / popups

## Credit

Inspired by:

- peon-ping
- OpenPeon / CESP sound pack format
