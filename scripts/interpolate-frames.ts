import { fal } from "@fal-ai/client";
import { execSync } from "node:child_process";
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

const SOURCE_DIR = path.join(ROOT, "public/frames-source");
const OUT_DIR = path.join(ROOT, "public/sequence");
const TMP_DIR = path.join(ROOT, ".tmp/interpolate");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const KEYFRAME_NAMES = [
  "01_atelier",
  "02_workspace",
  "03_smartphone",
  "04_multiple",
  "05_window",
];

const FRAMES_PER_SEGMENT = 20;
const FPS = 4;
const WIDTH = 1280;
const HEIGHT = 720;
const QUALITY = 4;

const TRANSITION_PROMPT =
  "smooth cinematic camera movement, slow elegant transition, warm natural lighting, architectural photography style";

function uploadToFal(filePath: string): Promise<string> {
  const blob = new Blob([new Uint8Array(fs.readFileSync(filePath))], {
    type: "image/jpeg",
  });
  return fal.storage.upload(blob as unknown as File);
}

async function generateSegment(
  startName: string,
  endName: string,
  segmentIdx: number,
): Promise<string> {
  const startPath = path.join(SOURCE_DIR, `${startName}.jpg`);
  const endPath = path.join(SOURCE_DIR, `${endName}.jpg`);
  if (!fs.existsSync(startPath)) throw new Error(`Missing ${startPath}`);
  if (!fs.existsSync(endPath)) throw new Error(`Missing ${endPath}`);

  const videoPath = path.join(TMP_DIR, `segment_${segmentIdx + 1}.mp4`);
  if (fs.existsSync(videoPath) && !process.argv.includes("--force")) {
    console.log(`  ↷ segment_${segmentIdx + 1}.mp4 cached, skipping Kling call`);
    return videoPath;
  }

  console.log(`  · uploading ${startName}.jpg + ${endName}.jpg…`);
  const [startUrl, endUrl] = await Promise.all([
    uploadToFal(startPath),
    uploadToFal(endPath),
  ]);

  console.log(`  · Kling Video v1.6 Pro (5s)…`);
  const result = await fal.subscribe("fal-ai/kling-video/v1.6/pro/image-to-video", {
    input: {
      prompt: TRANSITION_PROMPT,
      image_url: startUrl,
      tail_image_url: endUrl,
      duration: "5",
      aspect_ratio: "16:9",
      cfg_scale: 0.5,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoUrl = (result.data as any).video?.url;
  if (!videoUrl) throw new Error(`No video URL in segment ${segmentIdx + 1}`);

  const response = await fetch(videoUrl);
  if (!response.ok) throw new Error(`Video download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(videoPath, buffer);
  console.log(`  ✓ segment_${segmentIdx + 1}.mp4 saved (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
  return videoPath;
}

function extractFrames(videoPath: string, startFrameIdx: number) {
  const filter = `fps=${FPS},scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`;
  const outPattern = path.join(OUT_DIR, `frame_%04d.jpg`);
  const cmd = [
    "ffmpeg",
    "-y",
    "-loglevel", "error",
    "-i", JSON.stringify(videoPath),
    "-vf", JSON.stringify(filter),
    "-frames:v", String(FRAMES_PER_SEGMENT),
    "-start_number", String(startFrameIdx),
    "-q:v", String(QUALITY),
    JSON.stringify(outPattern),
  ].join(" ");
  console.log(`  · ffmpeg → frame_${String(startFrameIdx).padStart(4, "0")}…frame_${String(startFrameIdx + FRAMES_PER_SEGMENT - 1).padStart(4, "0")}`);
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  for (const name of KEYFRAME_NAMES) {
    if (!fs.existsSync(path.join(SOURCE_DIR, `${name}.jpg`))) {
      console.error(`Missing keyframe: ${name}.jpg in ${SOURCE_DIR}`);
      process.exit(1);
    }
  }

  const totalFrames = (KEYFRAME_NAMES.length - 1) * FRAMES_PER_SEGMENT;
  console.log(
    `Interpolating ${KEYFRAME_NAMES.length - 1} segments × ${FRAMES_PER_SEGMENT} frames = ${totalFrames} frames @ ${WIDTH}x${HEIGHT}\n`,
  );

  for (let i = 0; i < KEYFRAME_NAMES.length - 1; i++) {
    const startName = KEYFRAME_NAMES[i];
    const endName = KEYFRAME_NAMES[i + 1];
    const startFrameIdx = i * FRAMES_PER_SEGMENT + 1;
    console.log(`\nSegment ${i + 1}/${KEYFRAME_NAMES.length - 1}: ${startName} → ${endName}`);
    const videoPath = await generateSegment(startName, endName, i);
    extractFrames(videoPath, startFrameIdx);
  }

  console.log(`\nCleaning up temp videos…`);
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }

  const written = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"));
  const totalBytes = written.reduce(
    (sum, f) => sum + fs.statSync(path.join(OUT_DIR, f)).size,
    0,
  );
  console.log(
    `\nDone. ${written.length} frames in ${OUT_DIR} (${(totalBytes / 1024 / 1024).toFixed(1)} MB total)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
