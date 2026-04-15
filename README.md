# pi-boop

A native [pi](https://www.npmjs.com/package/@mariozechner/pi-coding-agent) extension for playful sound notifications.

It started as a learning project inspired by peon-ping, but it's being rebuilt in a pi-native way: pi events in, boops out.

## What it does

`pi-boop` loads an OpenPeon/CESP-style sound pack from disk and plays sounds for pi lifecycle events.

Current behavior:

- `session_start` → `session.start`
- `agent_end` → `task.complete`
- tool errors → `task.error`

It also includes manual commands for testing and toggling sounds.

## Current commands

- `/boop-test <category>` — play a sound from a category
- `/boop-toggle` — enable/disable boops
- `/boop-status` — show current boop status

Examples:

```text
/boop-test task.complete
/boop-test session.start
/boop-toggle
/boop-status
```

## Current pack setup

Right now the extension is pointed at:

- `~/.pi/agent/pi-boop-packs/r2d2_pack`

That pack uses the upstream OpenPeon/CESP manifest format:

- `openpeon.json`
- `sounds/*.mp3`

## Install / local dev setup

### 1. Put the extension where you want to develop it

This repo uses:

- source: `~/_dev/pi-boop/extensions/pi-boop.ts`

### 2. Symlink it into pi

```bash
ln -sfn ~/_dev/pi-boop/extensions/pi-boop.ts ~/.pi/agent/extensions/pi-boop.ts
```

### 3. Install a pack

Current pack location:

```bash
~/.pi/agent/pi-boop-packs/r2d2_pack
```

### 4. Reload pi

Inside pi:

```text
/reload
```

## Dev workflow

1. Edit `extensions/pi-boop.ts`
2. Run `/reload` in pi
3. Test with `/boop-test task.complete`
4. Commit the weirdness

## Project structure

```text
pi-boop/
  README.md
  extensions/
    pi-boop.ts
```

Live pi wiring:

- active extension symlink: `~/.pi/agent/extensions/pi-boop.ts`
- current pack: `~/.pi/agent/pi-boop-packs/r2d2_pack`

## Notes

This is a pi-native rebuild project, not a direct port of peon-ping.

Sound packs currently use the upstream OpenPeon/CESP manifest format, so you'll still see an `openpeon.json` file inside pack directories. That's part of the pack standard, not leftover project naming.

## Roadmap

Near-term ideas:

- configurable pack path
- persisted enable/disable state
- more event mappings like `task.acknowledge` and `resource.limit`
- richer pack selection
- optional overlays / popups

## Credit

Inspired by:

- peon-ping
- OpenPeon / CESP sound pack format
