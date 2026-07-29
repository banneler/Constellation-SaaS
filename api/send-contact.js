const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const FROM_EMAIL = process.env.GMAIL_USER || 'support@constellation-crm.com';
const TO_EMAIL = process.env.CONTACT_TO || FROM_EMAIL;
const LOGO_URL = 'https://www.constellation-crm.com/assets/constellation-logo-full.svg';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

const SALES_SUPABASE_URL = (process.env.SALES_SUPABASE_URL || '').replace(/\/$/, '');
const SALES_SUPABASE_SERVICE_ROLE_KEY = process.env.SALES_SUPABASE_SERVICE_ROLE_KEY || '';
const LEAD_OWNER_USER_ID = process.env.LEAD_OWNER_USER_ID || '';
const LEAD_SEQUENCE_ID = Number(process.env.LEAD_SEQUENCE_ID || 1);

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

function buildEmailHtml({ interestLabel, name, emailLink, company, role, teamSize, industry, timelineLabel, source, message, critical = false, crmNote = '' }) {
  const kicker = critical ? 'Critical — existing contact' : 'Website inquiry';
  const headline = critical ? `${interestLabel} (already in CRM)` : interestLabel;
  const intro = critical
    ? 'This person already exists in your Sales CRM. Review before you engage.'
    : 'New message from the Constellation website.';
  const banner = critical
    ? `<div style="margin:0 0 16px;padding:10px 12px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:13px;font-weight:700;">Existing CRM contact — do not treat as a brand-new lead.</div>`
    : '';
  const crmBlock = crmNote
    ? `<div style="margin:16px 0 0;padding:12px 14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;font-size:13px;line-height:1.5;">${escapeHtml(crmNote)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(headline)}</title>
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
          ${banner}
          <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${critical ? '#b91c1c' : '#64748b'};font-weight:700;margin:0 0 6px;">${escapeHtml(kicker)}</div>
          <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:#0f172a;font-weight:700;">${escapeHtml(headline)}</h1>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#64748b;">${escapeHtml(intro)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border-top:1px solid #eef2f7;">
            ${fieldRow('Name', escapeHtml(name))}
            ${fieldRow('Email', emailLink)}
            ${fieldRow('Company', escapeHtml(company))}
            ${fieldRow('Role', escapeHtml(role || '—'))}
            ${fieldRow('Team size', escapeHtml(teamSize))}
            ${fieldRow('Industry', escapeHtml(industry))}
            ${fieldRow('Timeline', escapeHtml(timelineLabel))}
            ${fieldRow('Source', escapeHtml(source), true)}
          </table>
          <div style="margin:18px 0 8px;font-size:13px;color:#64748b;">Message</div>
          <div style="padding:14px 15px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;color:#0f172a;white-space:pre-wrap;line-height:1.55;font-size:14px;">${escapeHtml(message)}</div>
          ${crmBlock}
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

async function upsertLeadInCrm(payload) {
  if (!SALES_SUPABASE_URL || !SALES_SUPABASE_SERVICE_ROLE_KEY || !LEAD_OWNER_USER_ID) {
    return { skipped: true, reason: 'CRM env not configured' };
  }

  const supabase = createClient(SALES_SUPABASE_URL, SALES_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { firstName, lastName } = splitName(payload.name);
  const noteStamp = [
    `Website inquiry (${payload.interestLabel})`,
    `Source: ${payload.source}`,
    `Team size: ${payload.teamSize}`,
    `Industry: ${payload.industry}`,
    `Timeline: ${payload.timelineLabel}`,
    '',
    payload.message
  ].join('\n');

  let existingContact = null;
  const { data: contactMatches, error: contactLookupError } = await supabase
    .from('contacts')
    .select('id, account_id, first_name, last_name, email, notes')
    .eq('user_id', LEAD_OWNER_USER_ID)
    .ilike('email', payload.email)
    .limit(1);

  if (contactLookupError) {
    throw new Error(`Contact lookup failed: ${contactLookupError.message}`);
  }
  existingContact = contactMatches?.[0] || null;

  let accountId = existingContact?.account_id || null;
  if (!accountId) {
    const { data: accountMatches, error: accountLookupError } = await supabase
      .from('accounts')
      .select('id, name')
      .eq('user_id', LEAD_OWNER_USER_ID)
      .ilike('name', payload.company)
      .limit(1);
    if (accountLookupError) {
      throw new Error(`Account lookup failed: ${accountLookupError.message}`);
    }
    accountId = accountMatches?.[0]?.id || null;
  }

  if (!accountId) {
    const { data: createdAccount, error: accountInsertError } = await supabase
      .from('accounts')
      .insert({
        name: payload.company,
        industry: payload.industry,
        notes: `Created from website inquiry.\nTeam size: ${payload.teamSize}`,
        user_id: LEAD_OWNER_USER_ID,
        tier: 'Unassigned',
        is_customer: false
      })
      .select('id')
      .single();
    if (accountInsertError) {
      throw new Error(`Account create failed: ${accountInsertError.message}`);
    }
    accountId = createdAccount.id;
  }

  let contactId = existingContact?.id || null;
  if (existingContact) {
    const mergedNotes = [existingContact.notes, '', '---', noteStamp].filter(Boolean).join('\n').slice(0, 8000);
    const { error: contactUpdateError } = await supabase
      .from('contacts')
      .update({
        first_name: firstName,
        last_name: lastName,
        title: payload.role || null,
        account_id: accountId,
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
        email: payload.email,
        title: payload.role || null,
        account_id: accountId,
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

  let enrolled = false;
  let enrollmentSkippedReason = null;
  if (existingContact) {
    enrollmentSkippedReason = 'existing_contact';
  } else {
    const { data: activeEnrollment, error: enrollmentLookupError } = await supabase
      .from('contact_sequences')
      .select('id')
      .eq('contact_id', contactId)
      .eq('status', 'Active')
      .limit(1);
    if (enrollmentLookupError) {
      throw new Error(`Enrollment lookup failed: ${enrollmentLookupError.message}`);
    }
    if (activeEnrollment?.length) {
      enrollmentSkippedReason = 'already_active';
    } else {
      const { data: steps, error: stepsError } = await supabase
        .from('sequence_steps')
        .select('id, step_number, delay_days')
        .eq('sequence_id', LEAD_SEQUENCE_ID)
        .order('step_number');
      if (stepsError || !steps?.length) {
        throw new Error(stepsError?.message || 'Lead sequence has no steps');
      }
      const firstStep = steps[0];
      const { error: enrollError } = await supabase
        .from('contact_sequences')
        .insert({
          contact_id: contactId,
          sequence_id: LEAD_SEQUENCE_ID,
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
  }

  return {
    skipped: false,
    existingContact: Boolean(existingContact),
    accountId,
    contactId,
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
  const email = clean(req.body?.email, 180);
  const company = clean(req.body?.company, 160);
  const role = clean(req.body?.role, 120);
  const teamSize = clean(req.body?.teamSize, 20);
  const industry = clean(req.body?.industry, 80);
  const timeline = clean(req.body?.timeline, 40);
  const message = clean(req.body?.message, 4000);
  const interest = clean(req.body?.interest || 'general', 40);
  const source = clean(req.body?.source || 'website', 80);

  if (!name || !isValidEmail(email) || !company || !message) {
    return res.status(400).json({ error: 'Name, valid email, company, and message are required' });
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

  let crmResult = { skipped: true, reason: 'not attempted' };
  try {
    crmResult = await upsertLeadInCrm({
      name,
      email,
      company,
      role,
      teamSize,
      industry,
      timelineLabel,
      message,
      source,
      interestLabel
    });
  } catch (error) {
    console.error('send-contact CRM sync failed', error);
    crmResult = { skipped: true, error: error.message };
  }

  const critical = crmResult.existingContact === true;
  const crmNote = crmResult.skipped
    ? `CRM sync: ${crmResult.error || crmResult.reason || 'skipped'}`
    : [
        `CRM account #${crmResult.accountId}`,
        `CRM contact #${crmResult.contactId}`,
        crmResult.enrolled ? `Enrolled in Website Lead sequence (#${LEAD_SEQUENCE_ID})` : `Sequence: ${crmResult.enrollmentSkippedReason || 'not enrolled'}`
      ].join(' · ');

  const subject = critical
    ? `CRITICAL — Existing contact: ${name} (${company})`
    : `${interestLabel}: ${name} (${company}) · ${teamSize} · ${industry}`;

  try {
    await transporter.sendMail({
      from: `"Constellation Website" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text: [
        critical ? 'CRITICAL: This contact already exists in your Sales CRM.' : null,
        `Interest: ${interestLabel}`,
        `Source: ${source}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Role: ${role || '—'}`,
        `Sales team size: ${teamSize}`,
        `Industry: ${industry}`,
        `Timeline: ${timelineLabel}`,
        crmNote,
        '',
        message
      ].filter(Boolean).join('\n'),
      html: buildEmailHtml({
        interestLabel,
        name,
        emailLink,
        company,
        role,
        teamSize,
        industry,
        timelineLabel,
        source,
        message,
        critical,
        crmNote
      })
    });
  } catch (error) {
    console.error('send-contact email failed', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }

  return res.status(200).json({
    ok: true,
    critical,
    crm: {
      synced: !crmResult.skipped,
      existingContact: Boolean(crmResult.existingContact),
      enrolled: Boolean(crmResult.enrolled)
    }
  });
};
