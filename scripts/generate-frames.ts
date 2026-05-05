import { fal } from "@fal-ai/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = path.join(ROOT, ".env.local");

if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY missing in .env.local");
  process.exit(1);
}

fal.config({ credentials: process.env.FAL_KEY });

const FRAMES_DIR = path.join(ROOT, "public/frames-source");
fs.mkdirSync(FRAMES_DIR, { recursive: true });

type Keyframe = { name: string; prompt: string };

const KEYFRAMES: Keyframe[] = [
  {
    name: "01_window_outside",
    prompt:
      "Cinematic architectural photograph, exterior view through large floor-to-ceiling industrial window of a modern Berlin design studio, golden hour sunlight, off-white interior walls visible inside, polished concrete floor, warm beige tones, photorealistic 4k, professional architecture photography, soft natural light, depth of field, no people, scandinavian aesthetic, minimal composition",
  },
  {
    name: "02_window_inside",
    prompt:
      "Cinematic architectural photograph, interior view from just inside large floor-to-ceiling industrial window of a modern Berlin design studio, golden hour sunlight streaming in casting long shadows, off-white walls, polished concrete floor, single lime green plant on windowsill in foreground, warm beige tones, photorealistic 4k, professional architecture photography, depth of field, no people, scandinavian aesthetic",
  },
  {
    name: "03_studio_wide",
    prompt:
      "Cinematic architectural photograph, wide interior shot of a modern Berlin design studio, large industrial window on the right with golden hour sunlight streaming in, wooden workbench in center with MacBook, single lime green plant, off-white walls, polished concrete floor, warm beige tones, photorealistic 4k, professional architecture photography, depth of field, no people, scandinavian aesthetic, minimal composition",
  },
  {
    name: "04_workspace_closer",
    prompt:
      "Cinematic architectural photograph, medium shot of wooden workbench in modern Berlin design studio, MacBook displaying website wireframes on screen, smartphone next to it, single lime green plant, golden hour sunlight from left, off-white walls in background slightly out of focus, warm beige tones, photorealistic 4k, professional product photography, shallow depth of field, no people, scandinavian aesthetic",
  },
  {
    name: "05_smartphone_macro",
    prompt:
      "Cinematic architectural photograph, extreme close-up of a single smartphone on light wooden surface, screen displaying a beautiful modern minimalist craftsman website with subtle lime green accents, golden hour sunlight casting warm shadow across surface, off-white blurred background, warm beige tones, photorealistic 4k, professional product photography, very shallow depth of field, scandinavian aesthetic, minimal composition",
  },
];

async function generateOne(frame: Keyframe) {
  const outPath = path.join(FRAMES_DIR, `${frame.name}.jpg`);
  if (fs.existsSync(outPath) && !process.argv.includes("--force")) {
    console.log(`  ↷ ${frame.name}.jpg already exists, skipping (--force to regenerate)`);
    return;
  }

  console.log(`→ ${frame.name}…`);
  const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
    input: {
      prompt: frame.prompt,
      aspect_ratio: "16:9",
      num_images: 1,
      output_format: "jpeg",
      safety_tolerance: "2",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = (result.data as any).images?.[0]?.url;
  if (!imageUrl) throw new Error(`No image URL returned for ${frame.name}`);

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Download failed for ${frame.name}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(outPath, buffer);
  console.log(`  ✓ ${frame.name}.jpg saved (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;

  const targets = only ? KEYFRAMES.filter((f) => only.includes(f.name)) : KEYFRAMES;
  if (only && targets.length === 0) {
    console.error(`No matching keyframes for --only=${only.join(",")}`);
    console.error(`Available: ${KEYFRAMES.map((f) => f.name).join(", ")}`);
    process.exit(1);
  }

  console.log(`Generating ${targets.length} keyframe(s) via fal.ai (Flux Pro 1.1 Ultra)…`);
  for (const frame of targets) {
    await generateOne(frame);
  }
  console.log(`\nDone. Files in ${FRAMES_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
