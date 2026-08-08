type LeadEmailInput = {
  name: string;
  email: string;
  service: string;
  message: string;
  receivedAt?: Date;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatReceivedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(date);
}

export function buildLeadEmail({
  name,
  email,
  service,
  message,
  receivedAt = new Date(),
}: LeadEmailInput) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const when = escapeHtml(formatReceivedAt(receivedAt));
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${service} inquiry`)}`;

  const text = [
    "New lead — Mrdigital Bee",
    "",
    `Received: ${formatReceivedAt(receivedAt)} (Dubai)`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${service}`,
    "",
    "Message:",
    message,
    "",
    "—",
    "Reply directly to this email to contact the lead.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New lead — Mrdigital Bee</title>
  </head>
  <body style="margin:0;padding:0;background:#efefef;font-family:Arial,Helvetica,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efefef;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e4;">
            <tr>
              <td style="background:#111111;padding:22px 28px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#a3a3a3;">Mrdigital Bee</p>
                <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;font-weight:700;color:#ffffff;">New project inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#6b6b6b;">
                  A new lead came through the website contact form.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e4;">
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;width:120px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8a8a8a;background:#fafafa;">Name</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;font-size:15px;font-weight:600;color:#111111;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;width:120px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8a8a8a;background:#fafafa;">Email</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;font-size:15px;color:#111111;">
                      <a href="mailto:${safeEmail}" style="color:#111111;text-decoration:underline;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;width:120px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8a8a8a;background:#fafafa;">Service</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e4e4e4;font-size:15px;font-weight:600;color:#111111;">${safeService}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;width:120px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8a8a8a;background:#fafafa;">Received</td>
                    <td style="padding:14px 16px;font-size:14px;color:#111111;">${when} (Dubai)</td>
                  </tr>
                </table>

                <p style="margin:24px 0 8px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8a8a8a;">Message</p>
                <div style="padding:16px;background:#fafafa;border:1px solid #e4e4e4;font-size:15px;line-height:1.6;color:#111111;">
                  ${safeMessage}
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                  <tr>
                    <td style="background:#111111;">
                      <a href="${mailto}" style="display:inline-block;padding:12px 20px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Reply to lead
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 22px;border-top:1px solid #e4e4e4;font-size:12px;line-height:1.5;color:#8a8a8a;">
                Replying to this email will go directly to the lead (${safeEmail}).
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}
