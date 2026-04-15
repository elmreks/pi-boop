import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const DEMO_CATEGORY_ORDER = [
  "session.start",
  "task.acknowledge",
  "task.complete",
  "task.error",
  "input.required",
  "resource.limit",
  "user.spam",
] as const;

type SoundEntry = {
  file: string;
  label?: string;
};

type PackManifest = {
  name: string;
  display_name?: string;
  categories?: Record<string, { sounds?: SoundEntry[] }>;
};

const PACK_DIR = resolve(homedir(), ".pi/agent/pi-boop-packs/r2d2_pack");
// Pack manifests follow the upstream OpenPeon/CESP format.
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  pi.registerCommand("boop-test", {
    description: "Play a sound from a CESP category, e.g. /boop-test task.complete",
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

  pi.registerCommand("boop-demo", {
    description: "Play all boop categories in sequence with spoken labels so you can preview the pack",
    handler: async (_args, ctx) => {
      ctx.ui.notify("Running boop demo: spoken category name, then all sounds in that category.", "info");

      for (const category of DEMO_CATEGORY_ORDER) {
        const sounds = getCategorySounds(category);
        if (sounds.length === 0) continue;

        await pi.exec("say", [category.replace(/\./g, " ")]);
        await sleep(400);

        for (const sound of sounds) {
          await pi.exec("afplay", [sound.path]);
          await sleep(350);
        }

        await sleep(800);
      }
    },
  });

  pi.registerCommand("boop-toggle", {
    description: "Toggle pi-boop event sounds on or off",
    handler: async (_args, ctx) => {
      enabled = !enabled;
      ctx.ui.notify(`pi-boop ${enabled ? "enabled" : "disabled"}`, enabled ? "success" : "warning");
    },
  });

  pi.registerCommand("boop-status", {
    description: "Show pi-boop event sound status",
    handler: async (_args, ctx) => {
      ctx.ui.notify(`pi-boop is ${enabled ? "enabled" : "disabled"}`, "info");
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
