import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 },
    );
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim()
      : "";

  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eingeben." },
      { status: 400 },
    );
  }

  console.info(
    `[premium-waitlist] ${new Date().toISOString()} ${email}`,
  );

  return NextResponse.json({ success: true });
}
