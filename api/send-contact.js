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

function fieldRow(label, value, isLast = false) {
  const border = isLast ? 'none' : '1px solid #eef2f7';
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:${border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tr>
            <td width="38%" style="font-size:13px;line-height:1.4;color:#64748b;vertical-align:top;padding-right:12px;">${escapeHtml(label)}</td>
            <td style="font-size:14px;line-height:1.45;color:#0f172a;font-weight:600;vertical-align:top;">${value}</td>
          </tr>
        </table>
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

  const emailLink = `<a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`;

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
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(interestLabel)} inquiry</title>
  <style>
    :root { color-scheme: light only; }
    body, table, td, a { -webkit-text-size-adjust: 100%; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;">
  <div style="margin:0;padding:24px 14px;background:#f8fafc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:28px 26px;">
          <img src="${LOGO_URL}" width="156" alt="Constellation CRM" style="display:block;width:156px;max-width:55%;height:auto;border:0;outline:none;margin:0 0 18px;">
          <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;font-weight:700;margin:0 0 6px;">Website inquiry</div>
          <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:#0f172a;font-weight:700;">${escapeHtml(interestLabel)}</h1>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#64748b;">New message from the Constellation website.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border-top:1px solid #eef2f7;">
            ${fieldRow('Name', escapeHtml(name))}
            ${fieldRow('Email', emailLink)}
            ${fieldRow('Company', escapeHtml(company || '—'))}
            ${fieldRow('Role', escapeHtml(role || '—'))}
            ${fieldRow('Team size', escapeHtml(teamSize))}
            ${fieldRow('Industry', escapeHtml(industry))}
            ${fieldRow('Timeline', escapeHtml(timelineLabel))}
            ${fieldRow('Source', escapeHtml(source), true)}
          </table>
          <div style="margin:18px 0 8px;font-size:13px;color:#64748b;">Message</div>
          <div style="padding:14px 15px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;color:#0f172a;white-space:pre-wrap;line-height:1.55;font-size:14px;">${escapeHtml(message)}</div>
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
