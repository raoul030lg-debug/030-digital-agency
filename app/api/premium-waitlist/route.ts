import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WAITLIST_FILE = path.join(
  process.cwd(),
  "data",
  "premium-waitlist.json",
);

type Entry = { email: string; timestamp: string };

async function readEntries(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(WAITLIST_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persistEntry(entry: Entry): Promise<"file" | "log"> {
  try {
    const entries = await readEntries();
    if (entries.some((e) => e.email === entry.email)) {
      return "file";
    }
    entries.push(entry);
    await fs.mkdir(path.dirname(WAITLIST_FILE), { recursive: true });
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");
    return "file";
  } catch {
    console.info(
      `[premium-waitlist] ${entry.timestamp} ${entry.email}`,
    );
    return "log";
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim().toLowerCase()
      : "";

  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eingeben." },
      { status: 400 },
    );
  }

  await persistEntry({ email, timestamp: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
