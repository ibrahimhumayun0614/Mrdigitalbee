import nodemailer from "nodemailer";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? "info@mrdigitalbee.com";
const SERVICES = new Set([
  "Website Development",
  "Website Maintenance",
  "CRM / Dashboard",
  "Logo Design",
  "Other",
]);

const MAX_BODY_BYTES = 20_480;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5_000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
};

type RateEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateEntry>();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stripHeaderSafe(value: string) {
  return value.replace(/[\r\n\u0000]+/g, " ").replace(/\s+/g, " ").trim();
}

function getClientIp(request: Request) {
  // Prefer platform-set IP headers. Do not trust the first X-Forwarded-For
  // hop — clients can prepend spoofed values.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelIp) return vercelIp.split(",")[0]?.trim() || vercelIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    // Rightmost value is typically the one added by the trusted proxy.
    const trusted = parts.at(-1);
    if (trusted) return trusted;
  }

  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

function pruneRateLimitStore() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore) {
    if (now >= entry.resetAt) rateLimitStore.delete(ip);
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const requestOrigin = new URL(request.url).origin;
  if (origin === requestOrigin) return true;

  const extras = (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return extras.includes(origin);
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }

    pruneRateLimitStore();
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }

    let body: ContactBody;
    try {
      body = JSON.parse(rawBody) as ContactBody;
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const nameRaw = isNonEmptyString(body.name) ? body.name.trim() : "";
    const emailRaw = isNonEmptyString(body.email) ? body.email.trim() : "";
    const serviceRaw = isNonEmptyString(body.service) ? body.service.trim() : "";
    const messageRaw = isNonEmptyString(body.message) ? body.message.trim() : "";

    if (!nameRaw || !emailRaw || !serviceRaw || !messageRaw) {
      return Response.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (
      nameRaw.length > MAX_NAME ||
      emailRaw.length > MAX_EMAIL ||
      messageRaw.length > MAX_MESSAGE
    ) {
      return Response.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 },
      );
    }

    const name = stripHeaderSafe(nameRaw);
    const email = stripHeaderSafe(emailRaw);
    const service = stripHeaderSafe(serviceRaw);
    const message = messageRaw;

    if (!name || !email || !service || !message) {
      return Response.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!SERVICES.has(service)) {
      return Response.json(
        { error: "Please select a valid service." },
        { status: 400 },
      );
    }

    const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
    const port = Number(process.env.SMTP_PORT ?? "465");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return Response.json(
        { error: "Could not send your message. Please try again." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const from =
      process.env.CONTACT_FROM_EMAIL ?? `Mrdigital Bee <${user}>`;

    await transporter.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New inquiry: ${service} — ${name}`,
      text: [
        "New contact form submission from Mrdigital Bee",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 12px;">New contact form submission</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin: 0 0 16px;"><strong>Service:</strong> ${escapeHtml(service)}</p>
          <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
