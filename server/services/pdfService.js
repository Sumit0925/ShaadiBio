/**
 * PDF Service using Puppeteer (server-side)
 * Install puppeteer: npm install puppeteer
 * This is the server-side version; client-side PDF is handled by the frontend pdfService
 */

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  puppeteer = null;
}

const generatePDF = async (biodataObj) => {
  if (!puppeteer) {
    throw new Error('Puppeteer not installed. Run: npm install puppeteer');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const html = buildHTMLTemplate(biodataObj);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

const buildHTMLTemplate = (data) => {
  // Simplified template — the frontend templates are more fully featured
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #2d1a00; }
    .header { background: linear-gradient(135deg, #6b0f0f, #8b1a1a, #c8873a); color: white; padding: 20px; text-align: center; }
    .section { margin: 12px 0; }
    .section-title { background: linear-gradient(90deg, #8b1a1a, #c8873a); color: white; padding: 5px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
    .row { display: flex; padding: 4px 8px; border-bottom: 1px solid #f5e8d5; font-size: 12px; }
    .label { font-weight: bold; color: #8b1a1a; min-width: 140px; }
    .footer { background: #8b1a1a; color: #ffd580; text-align: center; padding: 8px; font-size: 10px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:11px;letter-spacing:0.3em;color:#ffd580;margin-bottom:8px;">॥ श्री गणेशाय नमः ॥</div>
    <h1 style="font-size:24px;">${data.name || 'Biodata'}</h1>
    ${data.profession ? `<p style="color:#ffd580;font-size:13px;margin-top:4px;">${data.profession}</p>` : ''}
  </div>
  <div style="padding: 12px;">
    <div class="section-title">Personal Information</div>
    <div class="section">
      ${r('Full Name', data.name)}${r('Date of Birth', data.dob)}${r('Height', data.height)}
      ${r('Religion', data.religion)}${r('Caste', data.caste)}${r('Marital Status', data.maritalStatus)}
    </div>
    <div class="section-title">Education & Profession</div>
    <div class="section">
      ${r('Education', data.education)}${r('Profession', data.profession)}
      ${!data.hideIncome ? r('Income', data.income) : ''}
    </div>
    <div class="section-title">Family Details</div>
    <div class="section">
      ${r("Father's Name", data.fatherName)}${r("Mother's Name", data.motherName)}
      ${r('Siblings', data.siblings)}${r('Family Type', data.familyType)}
    </div>
    ${!data.hideContact && (data.phone || data.city) ? `
    <div class="section-title">Contact</div>
    <div class="section">
      ${r('Mobile', data.phone)}${r('Email', data.contactEmail)}${r('City', data.city)}
    </div>` : ''}
  </div>
  <div class="footer">✦ Generated with ShaadiBio ✦</div>
</body>
</html>`;
};

const r = (label, value) => {
  if (!value) return '';
  return `<div class="row"><span class="label">${label}:</span><span>${value}</span></div>`;
};

module.exports = { generatePDF };
