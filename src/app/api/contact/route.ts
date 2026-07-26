import nodemailer from "nodemailer";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? "info@mrdigitalbee.com";
const SERVICES = new Set([
  "Website Development",
  "Website Maintenance",
  "CRM / Dashboard",
  "Logo Design",
  "Other",
]);

type ContactBody = {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    const name = isNonEmptyString(body.name) ? body.name.trim() : "";
    const email = isNonEmptyString(body.email) ? body.email.trim() : "";
    const service = isNonEmptyString(body.service) ? body.service.trim() : "";
    const message = isNonEmptyString(body.message) ? body.message.trim() : "";

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
        {
          error:
            "Email is not configured yet. Add SMTP_USER and SMTP_PASS to your environment.",
        },
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
