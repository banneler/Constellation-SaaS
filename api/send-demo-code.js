const nodemailer = require('nodemailer');

const DEMO_CODE = 'C0nste11ation';
const FROM_EMAIL = process.env.GMAIL_USER || 'demo@constellation-crm.com';
const LEAD_TO_EMAIL = process.env.CONTACT_TO || process.env.DEMO_LEAD_TO || 'support@constellation-crm.com';
const LOGO_URL = 'https://www.constellation-crm.com/assets/constellation-logo-full.svg';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const DEMO_LOGIN_URL = `https://www.constellation-crm.com/demo-build/index.html?code=${encodeURIComponent(DEMO_CODE)}`;

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value, max = 200) {
  return String(value || '').trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProspectEmailHtml(name) {
  const greeting = name ? `Hi ${escapeHtml(name.split(/\s+/)[0])},` : 'Hi,';
  return `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#ffffff;">
            <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 14px;margin-bottom:18px;">
              <img src="${LOGO_URL}" width="168" alt="Constellation CRM" style="display:block;width:168px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
            </div>
            <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;color:#bfdbfe;font-weight:700;">Constellation CRM</div>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;">Your demo access code</h1>
          </div>
          <div style="padding:32px;">
            <p style="font-size:16px;line-height:1.6;color:#334155;margin:0 0 12px;">${greeting}</p>
            <p style="font-size:16px;line-height:1.6;color:#334155;margin:0 0 22px;">Use this temporary password to enter the Constellation interactive demo.</p>
            <div style="text-align:center;margin:28px 0;">
              <div style="display:block;width:100%;box-sizing:border-box;padding:14px 12px;border-radius:14px;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;font-family:Menlo,Consolas,Monaco,'Courier New',monospace;font-size:22px;font-weight:800;letter-spacing:0.01em;line-height:1.2;text-align:center;white-space:nowrap;word-break:keep-all;overflow-wrap:normal;">${DEMO_CODE}</div>
              <a href="${DEMO_LOGIN_URL}" style="display:block;margin-top:16px;padding:13px 18px;border-radius:999px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;text-align:center;">Open demo login with code</a>
            </div>
          </div>
        </div>
      </div>
    `;
}

function buildLeadEmailHtml({ name, email }) {
  const emailLink = `<a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo access lead</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;">
  <div style="margin:0;padding:24px 14px;background:#f8fafc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:28px 26px;">
          <img src="${LOGO_URL}" width="156" alt="Constellation CRM" style="display:block;width:156px;max-width:55%;height:auto;border:0;outline:none;margin:0 0 18px;">
          <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;font-weight:700;margin:0 0 6px;">Demo access lead</div>
          <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:#0f172a;font-weight:700;">Someone requested the demo password</h1>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#64748b;">A prospect asked for temporary demo access from the website gate.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border-top:1px solid #eef2f7;">
            <tr>
              <td style="padding:11px 0;border-bottom:1px solid #eef2f7;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td width="38%" style="font-size:13px;line-height:1.4;color:#64748b;vertical-align:top;padding-right:12px;">Name</td>
                    <td style="font-size:14px;line-height:1.45;color:#0f172a;font-weight:600;vertical-align:top;">${escapeHtml(name)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:11px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td width="38%" style="font-size:13px;line-height:1.4;color:#64748b;vertical-align:top;padding-right:12px;">Email</td>
                    <td style="font-size:14px;line-height:1.45;color:#0f172a;font-weight:600;vertical-align:top;">${emailLink}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div style="margin:18px 0 0;padding:12px 14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;font-size:13px;line-height:1.5;">
            Temporary password emailed to prospect: <strong style="font-family:Menlo,Consolas,Monaco,'Courier New',monospace;">${DEMO_CODE}</strong>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = clean(req.body?.name, 120);
  const email = clean(req.body?.email, 254).toLowerCase();

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email sender is not configured' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: FROM_EMAIL,
      pass: GMAIL_APP_PASSWORD
    }
  });

  const firstName = name.split(/\s+/)[0];

  await transporter.sendMail({
    from: `"Constellation Demo" <${FROM_EMAIL}>`,
    to: email,
    subject: 'Your Constellation demo access code',
    html: buildProspectEmailHtml(name),
    text: `${firstName ? `Hi ${firstName},\n\n` : ''}Your Constellation temporary demo password is: ${DEMO_CODE}\n\nOpen the demo: ${DEMO_LOGIN_URL}`
  });

  try {
    await transporter.sendMail({
      from: `"Constellation Demo" <${FROM_EMAIL}>`,
      to: LEAD_TO_EMAIL,
      replyTo: email,
      subject: `Demo access lead: ${name}`,
      html: buildLeadEmailHtml({ name, email }),
      text: `Demo access lead\n\nName: ${name}\nEmail: ${email}\nTemporary password sent: ${DEMO_CODE}`
    });
  } catch (leadError) {
    console.error('[send-demo-code] lead notification failed:', leadError);
    // Prospect email already succeeded; do not fail the request.
  }

  return res.status(200).json({ ok: true });
};
