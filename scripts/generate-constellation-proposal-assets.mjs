import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(repoRoot, 'demo-build', 'Proposal_Assets');

const PAGE_W = 612;
const PAGE_H = 792;
const BLUE = rgb(0.216, 0.502, 0.933);
const NAVY = rgb(0.043, 0.227, 0.459);
const INK = rgb(0.059, 0.09, 0.165);
const SLATE = rgb(0.278, 0.333, 0.412);
const MUTED = rgb(0.392, 0.455, 0.545);
const LINE = rgb(0.843, 0.89, 0.957);
const PALE = rgb(0.965, 0.98, 1);
const GREEN = rgb(0.082, 0.502, 0.239);
const WHITE = rgb(1, 1, 1);

let fonts;

function hexRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function textWidth(text, font, size) {
  return font.widthOfTextAtSize(String(text), size);
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, font, size) <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(page, text, x, y, maxWidth, options = {}) {
  const size = options.size || 10;
  const font = options.font || fonts.regular;
  const color = options.color || SLATE;
  const lineHeight = options.lineHeight || size * 1.35;
  const lines = wrapText(text, font, size, maxWidth);
  lines.forEach((line, idx) => {
    page.drawText(line, { x, y: y - idx * lineHeight, size, font, color });
  });
  return y - lines.length * lineHeight;
}

function drawRule(page, x, y, w, color = LINE) {
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 1, color });
}

function drawConstellation(page, x, y, scale = 1, color = WHITE) {
  const pts = [
    [0, 0],
    [32, 15],
    [58, -4],
    [92, 13],
  ].map(([px, py]) => [x + px * scale, y + py * scale]);
  for (let i = 0; i < pts.length - 1; i += 1) {
    page.drawLine({
      start: { x: pts[i][0], y: pts[i][1] },
      end: { x: pts[i + 1][0], y: pts[i + 1][1] },
      thickness: 1.3 * scale,
      color,
      opacity: 0.75,
    });
  }
  pts.forEach(([cx, cy], idx) => {
    page.drawCircle({ x: cx, y: cy, size: idx === 0 || idx === 3 ? 3.6 * scale : 3 * scale, color, opacity: 0.95 });
  });
}

function drawBrandLockup(page, x, y, options = {}) {
  const light = options.light;
  const color = light ? WHITE : INK;
  const accent = light ? hexRgb('#bfdbfe') : BLUE;
  drawConstellation(page, x, y + 34, 1.05, accent);
  page.drawText('Constellation', { x, y: y - 2, size: 26, font: fonts.bold, color });
  page.drawText('STRATEGIC ACCOUNT OS', {
    x,
    y: y - 20,
    size: 9.5,
    font: fonts.bold,
    color: accent,
    characterSpacing: 1.8,
  });
}

function drawHeader(page, title) {
  page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 92, color: NAVY });
  page.drawRectangle({ x: 380, y: PAGE_H - 92, width: 232, height: 92, color: BLUE, opacity: 0.9 });
  page.drawRectangle({ x: 344, y: PAGE_H - 92, width: 80, height: 92, color: NAVY });
  page.drawSvgPath('M344 700 L424 792 L380 792 L300 700 Z', { color: NAVY });
  drawConstellation(page, 448, PAGE_H - 48, 1.25, hexRgb('#dbeafe'));
  page.drawText(title, { x: 54, y: PAGE_H - 58, size: 27, font: fonts.bold, color: WHITE });
}

function drawFooter(page, section = 'Constellation CRM | Strategic Account OS') {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 36, color: PALE });
  page.drawLine({ start: { x: 0, y: 36 }, end: { x: PAGE_W, y: 36 }, thickness: 2, color: BLUE });
  page.drawText(section, { x: 72, y: 14, size: 7.5, font: fonts.regular, color: MUTED });
}

function drawInteriorShell(page, eyebrow, title) {
  drawHeader(page, '');
  drawBrandLockup(page, 72, PAGE_H - 72, { light: true });
  page.drawText(eyebrow.toUpperCase(), { x: 72, y: 642, size: 9.5, font: fonts.bold, color: BLUE });
  page.drawText(title, { x: 72, y: 605, size: 32, font: fonts.bold, color: INK });
  drawRule(page, 72, 582, 468);
  drawFooter(page);
}

function drawCard(page, x, y, w, h, options = {}) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: options.fill || WHITE,
    borderColor: options.border || LINE,
    borderWidth: options.borderWidth == null ? 1 : options.borderWidth,
  });
  if (options.accentTop) page.drawRectangle({ x, y: y + h - 6, width: w, height: 6, color: options.accentTop });
  if (options.accentLeft) page.drawRectangle({ x, y, width: 6, height: h, color: options.accentLeft });
}

function drawPill(page, label, x, y, w, color = BLUE) {
  page.drawRectangle({ x, y, width: w, height: 22, color, borderColor: color, borderWidth: 1 });
  const tw = textWidth(label, fonts.bold, 8);
  page.drawText(label.toUpperCase(), { x: x + (w - tw) / 2, y: y + 7, size: 8, font: fonts.bold, color: WHITE, characterSpacing: 0.7 });
}

function drawMetric(page, x, y, value, label, accent = BLUE) {
  page.drawRectangle({ x, y, width: 132, height: 74, color: WHITE, borderColor: LINE, borderWidth: 1 });
  page.drawRectangle({ x, y: y + 69, width: 132, height: 5, color: accent });
  page.drawText(value, { x: x + 14, y: y + 36, size: 19, font: fonts.bold, color: INK });
  drawWrapped(page, label, x + 14, y + 18, 100, { size: 8.5, font: fonts.bold, color: MUTED, lineHeight: 10 });
}

async function newDoc() {
  const doc = await PDFDocument.create();
  fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    oblique: await doc.embedFont(StandardFonts.HelveticaOblique),
  };
  return doc;
}

async function savePdf(filename, draw) {
  const doc = await newDoc();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  draw(page, doc);
  const bytes = await doc.save({ useObjectStreams: false });
  await writeFile(path.join(assetsDir, filename), bytes);
}

async function saveTitlePage() {
  await savePdf('01_Title_Page.pdf', (page) => {
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: hexRgb('#f8fbff') });
    page.drawRectangle({ x: 306, y: 0, width: 306, height: PAGE_H, color: NAVY });
    page.drawSvgPath('M306 0 L612 0 L612 792 L366 792 Z', { color: BLUE, opacity: 0.95 });
    page.drawSvgPath('M0 0 L245 0 L366 792 L0 792 Z', { color: WHITE, opacity: 0.98 });
    page.drawSvgPath('M250 0 L366 792 L382 792 L266 0 Z', { color: hexRgb('#dbeafe'), opacity: 0.55 });
    const pts = [[384, 666], [432, 628], [502, 648], [544, 590], [512, 518], [560, 464], [496, 404], [508, 322], [428, 294], [396, 216], [312, 226], [254, 168]];
    for (let i = 0; i < pts.length - 1; i += 1) {
      page.drawLine({ start: { x: pts[i][0], y: pts[i][1] }, end: { x: pts[i + 1][0], y: pts[i + 1][1] }, thickness: 1, color: hexRgb('#bfdbfe'), opacity: 0.5 });
    }
    [[0, 2], [2, 6], [4, 8], [5, 11], [1, 7]].forEach(([a, b]) => {
      page.drawLine({ start: { x: pts[a][0], y: pts[a][1] }, end: { x: pts[b][0], y: pts[b][1] }, thickness: 1, color: hexRgb('#bfdbfe'), opacity: 0.28 });
    });
    pts.forEach(([x, y], i) => page.drawCircle({ x, y, size: i % 3 === 0 ? 4.2 : 3.4, color: WHITE, opacity: 0.9 }));
    drawBrandLockup(page, 58, 668);
    page.drawText('ENTERPRISE CRM PROPOSAL', { x: 58, y: 476, size: 14, font: fonts.bold, color: BLUE, characterSpacing: 1.6 });
    page.drawText('Turn account strategy', { x: 58, y: 430, size: 34, font: fonts.bold, color: INK });
    page.drawText('into coordinated action.', { x: 58, y: 388, size: 34, font: fonts.bold, color: INK });
    page.drawRectangle({ x: 58, y: 336, width: 255, height: 1, color: LINE });
    page.drawText('Command Center  |  Cognito  |  Proposal Studio  |  IRR', { x: 58, y: 312, size: 11, font: fonts.bold, color: MUTED });
    page.drawRectangle({ x: 334, y: 82, width: 214, height: 92, color: NAVY, opacity: 0.62 });
    page.drawText('Stark Logistics', { x: 356, y: 140, size: 22, font: fonts.bold, color: WHITE });
    page.drawText('SAOS-ENTERPRISE-PILOT', { x: 356, y: 113, size: 13, font: fonts.bold, color: WHITE });
    page.drawText('Presented by: Alex Rivera', { x: 356, y: 92, size: 9.5, font: fonts.regular, color: hexRgb('#dbeafe') });
  });
}

async function saveLetterhead() {
  await savePdf('Constellation_Blank_Letterhead.pdf', (page) => {
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: WHITE });
    drawHeader(page, '');
    drawConstellation(page, 446, PAGE_H - 48, 1.25, hexRgb('#dbeafe'));
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 36, color: PALE });
    page.drawLine({ start: { x: 0, y: 36 }, end: { x: PAGE_W, y: 36 }, thickness: 2, color: BLUE });
    page.drawText('Constellation CRM | Strategic Account OS', { x: 72, y: 14, size: 7.5, font: fonts.regular, color: MUTED });
  });
}

async function saveCoversAndModules() {
  await savePdf('02_Constellation_CRM_Cover_Page.pdf', (page) => {
    drawInteriorShell(page, 'Executive Proposal Narrative', 'Constellation CRM');
    page.drawText('Strategic Account OS for enterprise revenue teams', { x: 72, y: 540, size: 18, font: fonts.bold, color: INK });
    drawWrapped(page, 'Constellation turns CRM from a passive activity record into a guided operating system for account strategy, signal-driven execution, proposal generation, and leadership inspection.', 72, 512, 430, { size: 12, font: fonts.regular, color: SLATE, lineHeight: 17 });
    drawMetric(page, 72, 400, 'Plan', 'Shared account strategy connected to CRM context');
    drawMetric(page, 224, 400, 'Act', 'Campaigns, sequences, and tasks from live signals');
    drawMetric(page, 376, 400, 'Package', 'Customer-ready proposals, pricing, ROI, and proof');
    drawCard(page, 72, 262, 468, 96, { fill: PALE, border: LINE, accentLeft: BLUE });
    page.drawText('Proposal focus for Stark Logistics', { x: 96, y: 326, size: 15, font: fonts.bold, color: INK });
    drawWrapped(page, 'Activate a focused strategic account pilot that gives leaders operating visibility, helps account owners respond to market triggers, and packages the commercial story into credible customer-ready materials.', 96, 302, 392, { size: 10.5, color: SLATE, lineHeight: 15 });
    drawPill(page, 'Command Center', 92, 210, 112);
    drawPill(page, 'Cognito', 220, 210, 84, GREEN);
    drawPill(page, 'Proposal Studio', 320, 210, 126);
  });

  await savePdf('03_Constellation_Platform_Overview.pdf', (page) => {
    drawInteriorShell(page, 'Constellation CRM', 'Platform Overview');
    drawWrapped(page, 'Constellation connects account planning, signal intelligence, seller action, and proposal packaging in one operating workflow.', 72, 540, 455, { size: 14, font: fonts.bold, color: INK, lineHeight: 19 });
    const cards = [
      ['PLAN', 'Account OS', 'Account plans, relationship maps, white space, competitive context, and next moves stay connected to CRM data.'],
      ['ACT', 'Guided Plays', 'Signals, campaigns, sequences, and seller tasks convert account strategy into coordinated action.'],
      ['PACKAGE', 'Proposal Studio', 'Approved narrative, pricing, references, ROI, and implementation context become customer-ready modules.'],
    ];
    cards.forEach(([label, title, body], i) => {
      const x = 72 + i * 156;
      drawCard(page, x, 382, 132, 118, { fill: hexRgb('#f8fafc'), accentTop: BLUE });
      page.drawText(label, { x: x + 14, y: 460, size: 8, font: fonts.bold, color: BLUE });
      page.drawText(title, { x: x + 14, y: 430, size: 17, font: fonts.bold, color: INK });
      drawWrapped(page, body, x + 14, 400, 104, { size: 8.5, color: SLATE, lineHeight: 11.5 });
    });
    page.drawText('Why it matters', { x: 72, y: 330, size: 19, font: fonts.bold, color: INK });
    const reasons = [
      ['Less context chasing', 'Plans, notes, decks, CRM records, and AI prompts stop living in separate motions.'],
      ['Faster signal response', 'Market changes become visible triggers for timely account owner action.'],
      ['Cleaner leadership visibility', 'Executives see whether strategic account work is moving pipeline.'],
      ['Reusable proposal assets', 'The account strategy carries through to customer-facing documents.'],
    ];
    reasons.forEach(([title, body], i) => {
      const y = 286 - i * 48;
      page.drawCircle({ x: 84, y: y + 10, size: 4, color: BLUE });
      page.drawText(title, { x: 104, y: y + 12, size: 11, font: fonts.bold, color: INK });
      drawWrapped(page, body, 104, y - 4, 390, { size: 9.2, color: SLATE, lineHeight: 12.5 });
    });
  });

  await savePdf('04_Constellation_Command_Center.pdf', (page) => {
    drawInteriorShell(page, 'Leadership Operating View', 'Command Center');
    drawWrapped(page, 'The Command Center gives executives, managers, and account owners a live view of account health, pursuit progress, and the work that needs attention.', 72, 540, 450, { size: 13.5, font: fonts.bold, color: INK, lineHeight: 19 });
    const items = [
      ['Priority accounts', 'Surface named accounts, open pursuits, recent movement, and owner actions.'],
      ['Pipeline accountability', 'Tie stage movement, committed revenue, proposal readiness, and next meetings to real account context.'],
      ['Coaching moments', 'Spot stale work, missing stakeholders, neglected signals, and executive support needs before a deal stalls.'],
      ['Operating rhythm', 'Replace static forecast notes with a repeatable weekly account review workspace.'],
    ];
    items.forEach(([title, body], i) => {
      const y = 426 - i * 82;
      drawCard(page, 72, y, 468, 58, { fill: hexRgb('#f6f8fc'), border: hexRgb('#edf2f7'), accentLeft: BLUE });
      page.drawText(title, { x: 96, y: y + 35, size: 13.2, font: fonts.bold, color: INK });
      drawWrapped(page, body, 96, y + 17, 380, { size: 9.4, color: SLATE, lineHeight: 12 });
    });
    drawMetric(page, 72, 88, '4', 'Executive operating views');
    drawMetric(page, 224, 88, '1', 'Shared revenue motion');
    drawMetric(page, 376, 88, 'Weekly', 'Account inspection rhythm');
  });

  await savePdf('05_Constellation_Cognito.pdf', (page) => {
    drawInteriorShell(page, 'Timely Account Action', 'Cognito Signal Intelligence');
    drawWrapped(page, 'Cognito monitors account and market context, then helps the revenue team turn external change into internal action.', 72, 540, 455, { size: 13.5, font: fonts.bold, color: INK, lineHeight: 19 });
    const cards = [
      ['DETECT', 'Signals that matter', 'Expansion news, executive changes, initiative launches, renewal windows, competitive motion, and account-risk moments.', BLUE],
      ['ACTIVATE', 'Workflow-ready context', 'Signals feed account plans, campaigns, sequence steps, tasks, and proposal narratives while the moment is fresh.', GREEN],
    ];
    cards.forEach(([label, title, body, color], i) => {
      const x = 72 + i * 248;
      drawCard(page, x, 400, 220, 116, { fill: hexRgb('#f8fafc'), accentTop: color });
      page.drawText(label, { x: x + 18, y: 478, size: 8.5, font: fonts.bold, color });
      page.drawText(title, { x: x + 18, y: 448, size: 18, font: fonts.bold, color: INK });
      drawWrapped(page, body, x + 18, 417, 175, { size: 9, color: SLATE, lineHeight: 12 });
    });
    page.drawText('Demo storyline', { x: 72, y: 330, size: 18, font: fonts.bold, color: INK });
    const story = [
      'Cognito identifies a logistics expansion trigger.',
      'The account owner updates the pursuit thesis and target stakeholders.',
      'Campaigns and Sequences coordinate outreach to the buying committee.',
      'Proposal Studio packages the resulting strategy, pricing, proof, and implementation plan.',
    ];
    story.forEach((line, i) => {
      const y = 286 - i * 42;
      page.drawCircle({ x: 83, y: y + 6, size: 4, color: BLUE });
      drawWrapped(page, line, 104, y + 10, 390, { size: 10.2, color: SLATE, lineHeight: 13 });
    });
  });

  await savePdf('06_Constellation_Proposal_Studio.pdf', (page) => {
    drawInteriorShell(page, 'Customer-Ready Assets', 'Proposal Studio');
    drawWrapped(page, 'Proposal Studio converts account strategy into polished proposal content without rebuilding the narrative from scratch.', 72, 540, 455, { size: 13.5, font: fonts.bold, color: INK, lineHeight: 19 });
    const rows = [
      ['Module library', 'Reusable PDF modules for executive narrative, product proof points, implementation plans, and customer references.'],
      ['Dynamic pricing', 'CRM-export imports, pricing options, terms, quote language, and customer-ready commercial tables.'],
      ['Impact & ROI', 'Before-and-after business impact packaged directly into the generated proposal.'],
      ['Proofing loop', 'Save specs, attach for review, reload, and preserve local demo behavior without server-only state.'],
    ];
    rows.forEach(([title, body], i) => {
      const y = 434 - i * 76;
      drawCard(page, 72, y, 468, 52, { fill: i % 2 ? WHITE : hexRgb('#fbfdff'), border: LINE });
      page.drawText(title, { x: 94, y: y + 31, size: 12.5, font: fonts.bold, color: BLUE });
      drawWrapped(page, body, 230, y + 32, 270, { size: 9.1, color: SLATE, lineHeight: 12 });
    });
    drawCard(page, 72, 96, 468, 78, { fill: NAVY, border: NAVY });
    page.drawText('Outcome', { x: 96, y: 140, size: 9, font: fonts.bold, color: hexRgb('#bfdbfe'), characterSpacing: 1 });
    drawWrapped(page, 'A more credible proposal motion: strategy, commercials, ROI, references, and implementation plan arrive as one branded enterprise document.', 96, 122, 390, { size: 12, font: fonts.bold, color: WHITE, lineHeight: 16 });
  });

  await savePdf('07_Constellation_Pilot_Plan.pdf', (page) => {
    drawInteriorShell(page, 'Recommended Rollout', 'Pilot Success Plan');
    drawWrapped(page, 'A focused Constellation pilot can prove strategic account execution value without overloading the field team.', 72, 540, 455, { size: 13.5, font: fonts.bold, color: INK, lineHeight: 19 });
    const steps = [
      ['Activate accounts', 'Import target accounts, contacts, stages, current pursuits, and priority tasks.'],
      ['Configure operating views', 'Set Command Center filters for leadership, managers, and account owners.'],
      ['Launch signal plays', 'Enable Cognito triggers and connect them to campaigns, sequences, and next steps.'],
      ['Generate proposals', 'Use real stock modules, pricing, references, and impact analysis for customer-ready output.'],
      ['Review outcomes', 'Measure adoption, signal response speed, proposal cycle time, and strategic pipeline movement.'],
    ];
    page.drawLine({ start: { x: 92, y: 442 }, end: { x: 92, y: 132 }, thickness: 1.2, color: LINE });
    steps.forEach(([title, body], i) => {
      const y = 438 - i * 72;
      page.drawCircle({ x: 92, y, size: 13, color: BLUE });
      page.drawText(String(i + 1), { x: i === 0 ? 89 : 88, y: y - 4, size: 9, font: fonts.bold, color: WHITE });
      page.drawText(title, { x: 122, y: y + 6, size: 12, font: fonts.bold, color: INK });
      drawWrapped(page, body, 122, y - 14, 360, { size: 9.1, color: SLATE, lineHeight: 12 });
    });
    drawCard(page, 72, 76, 468, 40, { fill: PALE, border: LINE });
    page.drawText('Success criteria: adoption, response speed, proposal cycle time, and strategic pipeline movement.', { x: 92, y: 92, size: 9.5, font: fonts.bold, color: SLATE });
  });
}

function titleSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792">
  <defs>
    <linearGradient id="panel" x1="306" y1="0" x2="612" y2="792" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3880ee"/><stop offset="1" stop-color="#0b3a75"/></linearGradient>
  </defs>
  <rect width="612" height="792" fill="#f8fbff"/>
  <rect x="306" width="306" height="792" fill="#0b3a75"/>
  <path d="M306 0h306v792H366z" fill="url(#panel)"/>
  <path d="M0 0h245l121 792H0z" fill="#fff" opacity=".98"/>
  <path d="M250 0l116 792h16L266 0z" fill="#dbeafe" opacity=".55"/>
  <g fill="none" stroke="#bfdbfe" stroke-width="1.2" opacity=".5">
    <path d="M384 126l48 38 70-20 42 58-32 72 48 54-64 60 12 82-80 28-32 78-84-10-58 58"/>
    <path d="M384 126l112 262-242 236M502 144l-6 244 12 82M432 164l64 224-100 188"/>
  </g>
  <g fill="#fff" opacity=".92">
    <circle cx="384" cy="126" r="4.2"/><circle cx="432" cy="164" r="3.4"/><circle cx="502" cy="144" r="3.4"/><circle cx="544" cy="202" r="4.2"/><circle cx="512" cy="274" r="3.4"/><circle cx="560" cy="328" r="4.2"/><circle cx="496" cy="388" r="3.4"/><circle cx="508" cy="470" r="3.4"/><circle cx="428" cy="498" r="4.2"/><circle cx="396" cy="576" r="3.4"/><circle cx="312" cy="566" r="3.4"/><circle cx="254" cy="624" r="4.2"/>
  </g>
  <g transform="translate(58 82)">
    <path d="M0 34l34 15 61-17 42 18" fill="none" stroke="#3880ee" stroke-width="2"/>
    <circle cx="0" cy="34" r="4" fill="#3880ee"/><circle cx="34" cy="49" r="3.2" fill="#3880ee"/><circle cx="95" cy="32" r="3.2" fill="#3880ee"/><circle cx="137" cy="50" r="4" fill="#3880ee"/>
    <text x="0" y="88" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#0f172a">Constellation</text>
    <text x="0" y="112" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="#3880ee">STRATEGIC ACCOUNT OS</text>
  </g>
  <g transform="translate(58 316)">
    <text x="0" y="0" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#3880ee">ENTERPRISE CRM PROPOSAL</text>
    <text x="0" y="46" font-family="Helvetica, Arial, sans-serif" font-size="36" font-weight="800" fill="#0f172a">Turn account strategy</text>
    <text x="0" y="90" font-family="Helvetica, Arial, sans-serif" font-size="36" font-weight="800" fill="#0f172a">into coordinated action.</text>
    <line x1="0" y1="130" x2="255" y2="130" stroke="#d7e4f5"/>
    <text x="0" y="158" font-family="Helvetica, Arial, sans-serif" font-size="12.5" font-weight="700" fill="#475569">Command Center  |  Cognito  |  Proposal Studio  |  IRR</text>
  </g>
</svg>
`;
}

function letterheadSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792">
  <defs><linearGradient id="header" x1="0" y1="0" x2="612" y2="92" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0b3a75"/><stop offset="1" stop-color="#3880ee"/></linearGradient></defs>
  <rect width="612" height="792" fill="#fff"/>
  <rect width="612" height="92" fill="url(#header)"/>
  <path d="M430 0h182v92H362z" fill="#2563eb" opacity=".42"/>
  <path d="M344 92L424 0h-44l-80 92z" fill="#0b3a75"/>
  <g transform="translate(444 32)" fill="none" stroke="#dbeafe" stroke-width="1.35" opacity=".86">
    <path d="M0 18l30-14 34 20 40-18 28 28"/>
    <circle cx="0" cy="18" r="3.2" fill="#fff" stroke="none"/><circle cx="30" cy="4" r="3.2" fill="#fff" stroke="none"/><circle cx="64" cy="24" r="3.2" fill="#fff" stroke="none"/><circle cx="104" cy="6" r="3.2" fill="#fff" stroke="none"/><circle cx="132" cy="34" r="3.2" fill="#fff" stroke="none"/>
  </g>
  <path d="M0 756h612v36H0z" fill="#eff6ff"/>
  <path d="M0 756h612" stroke="#3880ee" stroke-width="3"/>
</svg>
`;
}

async function main() {
  await mkdir(assetsDir, { recursive: true });
  await writeFile(path.join(assetsDir, '01_Title_Page.svg'), titleSvg());
  await writeFile(path.join(assetsDir, 'Constellation_Blank_Letterhead.svg'), letterheadSvg());
  await saveTitlePage();
  await saveLetterhead();
  await saveCoversAndModules();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
