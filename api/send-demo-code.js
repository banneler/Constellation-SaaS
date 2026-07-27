const nodemailer = require('nodemailer');

const DEMO_CODE = 'C0nste11ation';
const FROM_EMAIL = process.env.GMAIL_USER || 'projectgalaxyai@gmail.com';
const LOGO_URL = 'https://www.constellation-crm.com/assets/constellation-logo-full.svg';

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.body?.email;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email sender is not configured' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Constellation Demo" <${FROM_EMAIL}>`,
    to: email,
    subject: 'Your Constellation demo access code',
    html: `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#ffffff;">
            <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 14px;margin-bottom:18px;">
              <img src="${LOGO_URL}" width="168" alt="Constellation CRM" style="display:block;width:168px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
            </div>
            <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;color:#bfdbfe;font-weight:700;">Constellation CRM</div>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;">Your demo verification code</h1>
          </div>
          <div style="padding:32px;">
            <p style="font-size:16px;line-height:1.6;color:#334155;margin:0 0 22px;">Use this one-time code to enter the Constellation interactive demo.</p>
            <div style="text-align:center;margin:28px 0;">
              <div style="display:block;width:100%;box-sizing:border-box;padding:14px 12px;border-radius:14px;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;font-family:Menlo,Consolas,Monaco,'Courier New',monospace;font-size:22px;font-weight:800;letter-spacing:0.01em;line-height:1.2;text-align:center;white-space:nowrap;word-break:keep-all;overflow-wrap:normal;">${DEMO_CODE}</div>
              <a href="https://www.constellation-crm.com/demo-build/index.html?code=${encodeURIComponent(DEMO_CODE)}" style="display:block;margin-top:16px;padding:13px 18px;border-radius:999px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;text-align:center;">Open demo login with code</a>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `Your Constellation demo verification code is: ${DEMO_CODE}`
  });

  return res.status(200).json({ ok: true });
};
