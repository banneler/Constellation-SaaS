const nodemailer = require('nodemailer');

const FROM_EMAIL = process.env.GMAIL_USER || 'support@constellation-crm.com';
const TO_EMAIL = process.env.CONTACT_TO || FROM_EMAIL;
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
      html: `
        <div style="margin:0;padding:28px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <div style="padding:22px 26px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#ffffff;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#bfdbfe;font-weight:700;">Constellation CRM</div>
              <h1 style="margin:8px 0 0;font-size:22px;">${escapeHtml(interestLabel)} inquiry</h1>
            </div>
            <div style="padding:26px;">
              <p style="margin:0 0 10px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p style="margin:0 0 10px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p style="margin:0 0 10px;"><strong>Company:</strong> ${escapeHtml(company || '—')}</p>
              <p style="margin:0 0 10px;"><strong>Role:</strong> ${escapeHtml(role || '—')}</p>
              <p style="margin:0 0 10px;"><strong>Sales team size:</strong> ${escapeHtml(teamSize)}</p>
              <p style="margin:0 0 10px;"><strong>Industry:</strong> ${escapeHtml(industry)}</p>
              <p style="margin:0 0 10px;"><strong>Timeline:</strong> ${escapeHtml(timelineLabel)}</p>
              <p style="margin:0 0 10px;"><strong>Source:</strong> ${escapeHtml(source)}</p>
              <p style="margin:18px 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:700;">Message</p>
              <div style="padding:14px 16px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;white-space:pre-wrap;line-height:1.55;">${escapeHtml(message)}</div>
            </div>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('send-contact failed', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }

  return res.status(200).json({ ok: true });
};
