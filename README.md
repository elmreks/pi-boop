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

Use the installer to wire the repo into pi:

```bash
./scripts/install.sh
```

By default it creates symlinks for:

- `extensions/pi-boop.ts` → `~/.pi/agent/extensions/pi-boop.ts`
- `pack/r2d2_pack` → `~/.pi/agent/pi-boop-packs/r2d2_pack`

If you want a one-time copy instead of symlinks:

```bash
./scripts/install.sh --copy
```

Then reload pi:

```text
/reload
```

## Dev workflow

1. Edit `extensions/pi-boop.ts` and/or `pack/r2d2_pack/openpeon.json`
2. Run `./scripts/install.sh`
3. Run `/reload` in pi
4. Test with `/boop-test task.complete` or `/boop-demo`
5. Commit the weirdness

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

Live pi wiring:

- active extension install target: `~/.pi/agent/extensions/pi-boop.ts`
- active pack install target: `~/.pi/agent/pi-boop-packs/r2d2_pack`

## Notes

This is a pi-native rebuild project, not a direct port of peon-ping.

Sound packs currently use the upstream OpenPeon/CESP manifest format, so you'll still see an `openpeon.json` file inside pack directories. That's part of the pack standard, not leftover project naming.

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
