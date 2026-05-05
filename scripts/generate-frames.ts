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
    name: "01_atelier",
    prompt:
      "Cinematic architectural photograph of an empty modern Berlin design studio at golden hour, large industrial windows with warm sunlight streaming in, off-white walls, polished concrete floor, single wooden workbench, minimalist scandinavian aesthetic, photorealistic 4k, soft natural light, depth of field, no people, professional architecture photography, warm beige tones",
  },
  {
    name: "02_workspace",
    prompt:
      "Cinematic architectural photograph of a clean modern workspace, MacBook with website wireframes on screen, single lime green plant on desk, warm sunlight from large window, off-white walls, polished concrete, minimalist scandinavian aesthetic, photorealistic 4k, soft natural light, shallow depth of field, no people, professional product photography, warm beige tones",
  },
  {
    name: "03_smartphone",
    prompt:
      "Cinematic close-up of a single smartphone laying flat on a light wooden surface, screen displaying a beautiful modern website for a craftsman business with lime green accents, warm afternoon sunlight casting soft shadows, minimalist composition, photorealistic 4k, professional product photography, depth of field, off-white background, scandinavian aesthetic",
  },
  {
    name: "04_multiple",
    prompt:
      "Cinematic top-down photograph of four smartphones arranged in a clean grid on a light wooden surface, each displaying a different professional craftsman website (painter, electrician, roofer, carpenter) with subtle lime green accents, warm natural sunlight, minimalist composition, photorealistic 4k, professional product photography, off-white background, scandinavian aesthetic",
  },
  {
    name: "05_window",
    prompt:
      "Cinematic architectural photograph looking out of large studio window onto Berlin street at golden hour, soft sunlight, modern minimalist interior in foreground with single lime green plant on windowsill, off-white walls, polished concrete, photorealistic 4k, warm tones, depth of field, no people, professional architecture photography",
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
