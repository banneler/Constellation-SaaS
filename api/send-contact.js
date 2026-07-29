const nodemailer = require('nodemailer');

const FROM_EMAIL = process.env.GMAIL_USER || 'support@constellation-crm.com';
const TO_EMAIL = process.env.CONTACT_TO || FROM_EMAIL;
const LOGO_URL = 'https://www.constellation-crm.com/assets/constellation-logo-full.svg';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

const TEAM_SIZES = new Set(['1-10', '10-20', '20+']);
const INDUSTRIES = new Set([
  'Technology / SaaS',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Professional Services',
  'Media & Entertainment',
  'Retail & Consumer',
  'Telecom & Communications',
  'Energy & Utilities',
  'Other'
]);
const TIMELINES = new Set(['Exploring', 'This quarter', 'ASAP']);

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fieldRow(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;" class="field-row">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:700;margin:0 0 4px;" class="field-label">${escapeHtml(label)}</div>
        <div style="font-size:15px;line-height:1.45;color:#0f172a;font-weight:600;" class="field-value">${value}</div>
      </td>
    </tr>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = clean(req.body?.name, 120);
  const email = clean(req.body?.email, 180);
  const company = clean(req.body?.company, 160);
  const role = clean(req.body?.role, 120);
  const teamSize = clean(req.body?.teamSize, 20);
  const industry = clean(req.body?.industry, 80);
  const timeline = clean(req.body?.timeline, 40);
  const message = clean(req.body?.message, 4000);
  const interest = clean(req.body?.interest || 'general', 40);
  const source = clean(req.body?.source || 'website', 80);

  if (!name || !isValidEmail(email) || !message) {
    return res.status(400).json({ error: 'Name, valid email, and message are required' });
  }

  if (!TEAM_SIZES.has(teamSize)) {
    return res.status(400).json({ error: 'Valid sales team size is required' });
  }

  if (!INDUSTRIES.has(industry)) {
    return res.status(400).json({ error: 'Valid industry is required' });
  }

  if (timeline && !TIMELINES.has(timeline)) {
    return res.status(400).json({ error: 'Invalid timeline value' });
  }

  if (!GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email sender is not configured' });
  }

  const interestLabel = interest === 'get-started' ? 'Get Started' : 'Contact Us';
  const timelineLabel = timeline || 'Not sure yet';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: FROM_EMAIL,
      pass: GMAIL_APP_PASSWORD
    }
  });

  const emailLink = `<a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a>`;

  try {
    await transporter.sendMail({
      from: `"Constellation Website" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `${interestLabel}: ${name}${company ? ` (${company})` : ''} · ${teamSize} · ${industry}`,
      text: [
        `Interest: ${interestLabel}`,
        `Source: ${source}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || '—'}`,
        `Role: ${role || '—'}`,
        `Sales team size: ${teamSize}`,
        `Industry: ${industry}`,
        `Timeline: ${timelineLabel}`,
        '',
        message
      ].join('\n'),
      html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(interestLabel)} inquiry</title>
  <style>
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #020617 !important; }
      .email-card { background-color: #0f172a !important; border-color: #1e293b !important; }
      .email-body { background-color: #0f172a !important; }
      .field-row { border-bottom-color: #1e293b !important; }
      .field-label { color: #94a3b8 !important; }
      .field-value { color: #f8fafc !important; }
      .message-box { background-color: #020617 !important; border-color: #334155 !important; color: #e2e8f0 !important; }
      .header-kicker { color: #bfdbfe !important; }
      .header-title { color: #ffffff !important; }
      .logo-pill { background-color: #ffffff !important; }
    }
    [data-ogsc] .header-title,
    [data-ogsb] .header-title { color: #ffffff !important; }
    [data-ogsc] .header-kicker,
    [data-ogsb] .header-kicker { color: #bfdbfe !important; }
    [data-ogsc] .field-value,
    [data-ogsb] .field-value { color: #f8fafc !important; }
    [data-ogsc] .field-label,
    [data-ogsb] .field-label { color: #94a3b8 !important; }
    [data-ogsc] .message-box,
    [data-ogsb] .message-box { background-color: #020617 !important; border-color: #334155 !important; color: #e2e8f0 !important; }
    [data-ogsc] .logo-pill,
    [data-ogsb] .logo-pill { background-color: #ffffff !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
  <div class="email-bg" style="margin:0;padding:28px 16px;background:#f1f5f9;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td class="email-card" bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td bgcolor="#0f172a" style="padding:26px 28px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%);">
                <div class="logo-pill" style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 14px;margin:0 0 18px;">
                  <img src="${LOGO_URL}" width="168" height="36" alt="Constellation CRM" style="display:block;width:168px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
                </div>
                <div class="header-kicker" style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#bfdbfe;font-weight:700;mso-color-alt:#bfdbfe;">Website inquiry</div>
                <h1 class="header-title" style="margin:8px 0 0;font-size:24px;line-height:1.25;color:#ffffff;font-weight:800;mso-color-alt:#ffffff;">${escapeHtml(interestLabel)}</h1>
              </td>
            </tr>
            <tr>
              <td class="email-body" bgcolor="#ffffff" style="padding:8px 28px 26px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  ${fieldRow('Name', escapeHtml(name))}
                  ${fieldRow('Email', emailLink)}
                  ${fieldRow('Company', escapeHtml(company || '—'))}
                  ${fieldRow('Role', escapeHtml(role || '—'))}
                  ${fieldRow('Sales team size', escapeHtml(teamSize))}
                  ${fieldRow('Industry', escapeHtml(industry))}
                  ${fieldRow('Timeline', escapeHtml(timelineLabel))}
                  ${fieldRow('Source', escapeHtml(source))}
                </table>
                <div style="margin:22px 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:700;" class="field-label">Message</div>
                <div class="message-box" style="padding:14px 16px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;color:#0f172a;white-space:pre-wrap;line-height:1.55;font-size:15px;">${escapeHtml(message)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
    });
  } catch (error) {
    console.error('send-contact failed', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }

  return res.status(200).json({ ok: true });
};
