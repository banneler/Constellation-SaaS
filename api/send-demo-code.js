const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const DEMO_CODE = 'C0nste11ation';
const FROM_EMAIL = process.env.GMAIL_USER || 'demo@constellation-crm.com';
const LEAD_TO_EMAIL = process.env.CONTACT_TO || process.env.DEMO_LEAD_TO || 'support@constellation-crm.com';
const LOGO_URL = 'https://www.constellation-crm.com/assets/constellation-logo-full.svg';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const DEMO_LOGIN_URL = `https://www.constellation-crm.com/demo-build/index.html?code=${encodeURIComponent(DEMO_CODE)}`;

const SALES_SUPABASE_URL = (process.env.SALES_SUPABASE_URL || '').replace(/\/$/, '');
const SALES_SUPABASE_SERVICE_ROLE_KEY = process.env.SALES_SUPABASE_SERVICE_ROLE_KEY || '';
const LEAD_OWNER_USER_ID = process.env.LEAD_OWNER_USER_ID || '';
const DEMO_SOFT_SEQUENCE_NAME = process.env.DEMO_LEAD_SEQUENCE_NAME || 'Demo Follow-up (Soft Touch)';
const DEMO_LEAD_SEQUENCE_ID = Number(process.env.DEMO_LEAD_SEQUENCE_ID || 0);

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

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Unknown', lastName: 'Lead' };
  if (parts.length === 1) return { firstName: parts[0], lastName: 'Lead' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + (Number(days) || 0));
  return next;
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

function buildLeadEmailHtml({ name, email, crmNote = '' }) {
  const emailLink = `<a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`;
  const crmBlock = crmNote
    ? `<div style="margin:18px 0 0;padding:12px 14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;font-size:13px;line-height:1.5;">${escapeHtml(crmNote)}</div>`
    : '';
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
          ${crmBlock}
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

async function ensureDemoSoftSequence(supabase) {
  if (DEMO_LEAD_SEQUENCE_ID > 0) {
    const { data: steps, error } = await supabase
      .from('sequence_steps')
      .select('id, step_number, delay_days')
      .eq('sequence_id', DEMO_LEAD_SEQUENCE_ID)
      .order('step_number');
    if (error) throw new Error(`Soft sequence lookup failed: ${error.message}`);
    if (!steps?.length) throw new Error(`DEMO_LEAD_SEQUENCE_ID ${DEMO_LEAD_SEQUENCE_ID} has no steps`);
    return { sequenceId: DEMO_LEAD_SEQUENCE_ID, steps, created: false };
  }

  const { data: existing, error: seqLookupError } = await supabase
    .from('sequences')
    .select('id')
    .eq('user_id', LEAD_OWNER_USER_ID)
    .eq('name', DEMO_SOFT_SEQUENCE_NAME)
    .limit(1);
  if (seqLookupError) throw new Error(`Soft sequence lookup failed: ${seqLookupError.message}`);

  let sequenceId = existing?.[0]?.id || null;
  let created = false;

  if (!sequenceId) {
    const { data: createdSeq, error: seqInsertError } = await supabase
      .from('sequences')
      .insert({
        name: DEMO_SOFT_SEQUENCE_NAME,
        description: 'Soft post-demo nurture: thank-you now, light touch-base at ~2 weeks. No hard sell.',
        source: 'Personal',
        user_id: LEAD_OWNER_USER_ID,
        is_abm: false
      })
      .select('id')
      .single();
    if (seqInsertError) throw new Error(`Soft sequence create failed: ${seqInsertError.message}`);
    sequenceId = createdSeq.id;
    created = true;

    const softSteps = [
      {
        sequence_id: sequenceId,
        step_number: 1,
        type: 'Email',
        delay_days: 0,
        subject: 'Thanks for exploring Constellation',
        message: [
          'Hi {{first_name}},',
          '',
          'Thanks for taking a look at the Constellation demo. No rush on anything — if questions come up while you explore, just reply to this email.',
          '',
          'Happy to share a short walkthrough whenever it’s useful.',
          '',
          'Best,',
          'Constellation'
        ].join('\n'),
        user_id: LEAD_OWNER_USER_ID
      },
      {
        sequence_id: sequenceId,
        step_number: 2,
        type: 'Email',
        delay_days: 14,
        subject: 'Quick touch base',
        message: [
          'Hi {{first_name}},',
          '',
          'Just a light check-in from when you tried the Constellation demo a couple of weeks ago.',
          '',
          'If it’s still on your radar, I’m happy to answer questions or set up a brief, no-pressure conversation. If timing isn’t right, no worries at all.',
          '',
          'Best,',
          'Constellation'
        ].join('\n'),
        user_id: LEAD_OWNER_USER_ID
      }
    ];

    const { error: stepsInsertError } = await supabase.from('sequence_steps').insert(softSteps);
    if (stepsInsertError) throw new Error(`Soft sequence steps create failed: ${stepsInsertError.message}`);
  }

  const { data: steps, error: stepsError } = await supabase
    .from('sequence_steps')
    .select('id, step_number, delay_days')
    .eq('sequence_id', sequenceId)
    .order('step_number');
  if (stepsError || !steps?.length) {
    throw new Error(stepsError?.message || 'Soft sequence has no steps');
  }

  return { sequenceId, steps, created };
}

/**
 * Upsert a Sales CRM contact with no account and enroll in the soft demo sequence.
 * Idempotent on email for the lead owner: updates name/notes; enrolls only if not
 * already Active in that soft sequence.
 */
async function upsertDemoLeadInCrm({ name, email }) {
  if (!SALES_SUPABASE_URL || !SALES_SUPABASE_SERVICE_ROLE_KEY || !LEAD_OWNER_USER_ID) {
    return { skipped: true, reason: 'CRM env not configured' };
  }

  const supabase = createClient(SALES_SUPABASE_URL, SALES_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { firstName, lastName } = splitName(name);
  const noteStamp = [
    'Demo access request (interactive demo gate)',
    `Source: demo-build`,
    `Requested at: ${new Date().toISOString()}`,
    '',
    'Contact created without an account for soft follow-up.'
  ].join('\n');

  const { data: contactMatches, error: contactLookupError } = await supabase
    .from('contacts')
    .select('id, account_id, first_name, last_name, email, notes')
    .eq('user_id', LEAD_OWNER_USER_ID)
    .ilike('email', email)
    .limit(1);
  if (contactLookupError) {
    throw new Error(`Contact lookup failed: ${contactLookupError.message}`);
  }

  const existingContact = contactMatches?.[0] || null;
  let contactId = existingContact?.id || null;

  if (existingContact) {
    const mergedNotes = [existingContact.notes, '', '---', noteStamp].filter(Boolean).join('\n').slice(0, 8000);
    const { error: contactUpdateError } = await supabase
      .from('contacts')
      .update({
        first_name: firstName,
        last_name: lastName,
        // Keep any existing account link; never invent one for demo leads.
        notes: mergedNotes,
        last_saved: new Date().toISOString()
      })
      .eq('id', existingContact.id);
    if (contactUpdateError) {
      throw new Error(`Contact update failed: ${contactUpdateError.message}`);
    }
  } else {
    const { data: createdContact, error: contactInsertError } = await supabase
      .from('contacts')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        account_id: null,
        notes: noteStamp,
        user_id: LEAD_OWNER_USER_ID
      })
      .select('id')
      .single();
    if (contactInsertError) {
      throw new Error(`Contact create failed: ${contactInsertError.message}`);
    }
    contactId = createdContact.id;
  }

  const { sequenceId, steps, created: sequenceCreated } = await ensureDemoSoftSequence(supabase);
  const firstStep = steps[0];

  const { data: activeEnrollment, error: enrollmentLookupError } = await supabase
    .from('contact_sequences')
    .select('id, sequence_id, status')
    .eq('contact_id', contactId)
    .eq('sequence_id', sequenceId)
    .eq('status', 'Active')
    .limit(1);
  if (enrollmentLookupError) {
    throw new Error(`Enrollment lookup failed: ${enrollmentLookupError.message}`);
  }

  let enrolled = false;
  let enrollmentSkippedReason = null;
  if (activeEnrollment?.length) {
    enrollmentSkippedReason = 'already_active_soft_sequence';
  } else {
    const { error: enrollError } = await supabase
      .from('contact_sequences')
      .insert({
        contact_id: contactId,
        sequence_id: sequenceId,
        user_id: LEAD_OWNER_USER_ID,
        status: 'Active',
        current_step_number: firstStep.step_number,
        next_step_due_date: addDays(new Date(), firstStep.delay_days).toISOString()
      });
    if (enrollError) {
      throw new Error(`Sequence enroll failed: ${enrollError.message}`);
    }
    enrolled = true;
  }

  return {
    skipped: false,
    existingContact: Boolean(existingContact),
    accountId: existingContact?.account_id || null,
    contactId,
    sequenceId,
    sequenceName: DEMO_SOFT_SEQUENCE_NAME,
    sequenceCreated,
    enrolled,
    enrollmentSkippedReason
  };
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

  let crmResult = { skipped: true, reason: 'not attempted' };
  try {
    crmResult = await upsertDemoLeadInCrm({ name, email });
  } catch (error) {
    console.error('[send-demo-code] CRM sync failed:', error);
    crmResult = { skipped: true, error: error.message };
  }

  const crmNote = crmResult.skipped
    ? `CRM sync: ${crmResult.error || crmResult.reason || 'skipped'}`
    : [
        `CRM contact #${crmResult.contactId}`,
        crmResult.accountId ? `account #${crmResult.accountId}` : 'no account',
        crmResult.enrolled
          ? `Enrolled in ${crmResult.sequenceName} (#${crmResult.sequenceId})`
          : `Sequence: ${crmResult.enrollmentSkippedReason || 'not enrolled'}`,
        crmResult.sequenceCreated ? 'sequence auto-created' : null
      ].filter(Boolean).join(' · ');

  try {
    await transporter.sendMail({
      from: `"Constellation Demo" <${FROM_EMAIL}>`,
      to: LEAD_TO_EMAIL,
      replyTo: email,
      subject: `Demo access lead: ${name}`,
      html: buildLeadEmailHtml({ name, email, crmNote }),
      text: `Demo access lead\n\nName: ${name}\nEmail: ${email}\nTemporary password sent: ${DEMO_CODE}\n${crmNote}`
    });
  } catch (leadError) {
    console.error('[send-demo-code] lead notification failed:', leadError);
    // Prospect email already succeeded; do not fail the request.
  }

  return res.status(200).json({
    ok: true,
    crm: {
      synced: !crmResult.skipped,
      existingContact: Boolean(crmResult.existingContact),
      enrolled: Boolean(crmResult.enrolled),
      sequenceName: crmResult.sequenceName || null
    }
  });
};
