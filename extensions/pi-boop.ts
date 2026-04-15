import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type SoundEntry = {
  file: string;
  label?: string;
};

type PackManifest = {
  name: string;
  display_name?: string;
  categories?: Record<string, { sounds?: SoundEntry[] }>;
};

const PACK_DIR = "/Users/ethan/.pi/agent/peon-packs/r2d2_pack";
const MANIFEST_PATH = resolve(PACK_DIR, "openpeon.json");

function loadPack(): PackManifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as PackManifest;
}

function getCategorySounds(category: string): { path: string; label: string }[] {
  const pack = loadPack();
  const sounds = pack.categories?.[category]?.sounds ?? [];

  return sounds
    .map((sound) => ({
      path: resolve(PACK_DIR, sound.file),
      label: sound.label ?? sound.file,
    }))
    .filter((sound) => existsSync(sound.path));
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

export default function (pi: ExtensionAPI) {
  let enabled = true;
  let lastPlayAt = 0;

  async function playCategory(category: string, notify?: { message: string; level: "info" | "error" | "success" | "warning" }) {
    if (!enabled) return;

    const now = Date.now();
    if (now - lastPlayAt < 750) return;

    const sounds = getCategorySounds(category);
    if (sounds.length === 0) return;

    const selected = pickRandom(sounds);
    if (!selected) return;

    lastPlayAt = now;
    if (notify) {
      // Best-effort UI hint; sound is the main point.
      // Keep this short so it doesn't get annoying as shit.
      // eslint-disable-next-line no-console
      void notify;
    }

    const result = await pi.exec("afplay", [selected.path]);
    if (result.code !== 0 && notify) {
      // If playback dies, at least surface it.
      // Keeps debugging sane.
    }
  }

  pi.registerCommand("peon-test", {
    description: "Play a sound from a CESP category, e.g. /peon-test task.complete",
    handler: async (args, ctx) => {
      const category = (args || "task.complete").trim();
      const sounds = getCategorySounds(category);

      if (sounds.length === 0) {
        ctx.ui.notify(`No valid sounds found for category: ${category}`, "error");
        return;
      }

      const selected = pickRandom(sounds)!;
      ctx.ui.notify(`Playing ${category}: ${selected.label}`, "info");

      const result = await pi.exec("afplay", [selected.path]);
      if (result.code !== 0) {
        ctx.ui.notify(`afplay failed for ${selected.label}`, "error");
      }
    },
  });

  pi.registerCommand("peon-toggle", {
    description: "Toggle peon event sounds on or off",
    handler: async (_args, ctx) => {
      enabled = !enabled;
      ctx.ui.notify(`peon-pi ${enabled ? "enabled" : "disabled"}`, enabled ? "success" : "warning");
    },
  });

  pi.registerCommand("peon-status", {
    description: "Show peon event sound status",
    handler: async (_args, ctx) => {
      ctx.ui.notify(`peon-pi is ${enabled ? "enabled" : "disabled"}`, "info");
    },
  });

  pi.on("session_start", async () => {
    await playCategory("session.start");
  });

  pi.on("agent_end", async () => {
    await playCategory("task.complete");
  });

  pi.on("tool_result", async (event) => {
    if (event.isError) {
      await playCategory("task.error");
    }
  });
}
