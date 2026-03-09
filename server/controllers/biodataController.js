const Biodata = require('../models/Biodata');
const path = require('path');
const fs = require('fs');

// POST /api/biodata
const create = async (req, res, next) => {
  try {
    const biodata = await Biodata.create({ ...req.body, userId: req.user._id });
    res.status(201).json(biodata);
  } catch (err) {
    next(err);
  }
};

// GET /api/biodata
const getAll = async (req, res, next) => {
  try {
    const biodatas = await Biodata.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(biodatas);
  } catch (err) {
    next(err);
  }
};

// GET /api/biodata/:id
const getById = async (req, res, next) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) {
      return res.status(404).json({ success: false, message: 'Biodata not found' });
    }
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json(biodata);
  } catch (err) {
    next(err);
  }
};

// PUT /api/biodata/:id
const update = async (req, res, next) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) {
      return res.status(404).json({ success: false, message: 'Biodata not found' });
    }
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Remove protected fields from update payload
    const { _id, userId, createdAt, updatedAt, __v, ...updates } = req.body;

    const updated = await Biodata.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/biodata/:id
const remove = async (req, res, next) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) {
      return res.status(404).json({ success: false, message: 'Biodata not found' });
    }
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Delete associated photo if exists
    if (biodata.photo) {
      const photoPath = path.join(__dirname, '../../', biodata.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Biodata.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Biodata deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/biodata/:id/photo
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo file provided' });
    }

    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) {
      return res.status(404).json({ success: false, message: 'Biodata not found' });
    }
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Delete old photo if exists
    if (biodata.photo) {
      const oldPath = path.join(__dirname, '../../', biodata.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const updated = await Biodata.findByIdAndUpdate(
      req.params.id,
      { photo: photoUrl },
      { new: true }
    );

    res.json({ success: true, photo: updated.photo });
  } catch (err) {
    next(err);
  }
};

// GET /api/biodata/:id/pdf
const exportPDF = async (req, res, next) => {
  try {
    const biodata = await Biodata.findById(req.params.id).lean();
    if (!biodata) {
      return res.status(404).json({ success: false, message: 'Biodata not found' });
    }
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Generate simple HTML PDF response
    // In production you'd use Puppeteer here
    const html = generateBiodataHTML(biodata);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="biodata-${biodata.name || 'export'}.html"`);
    res.send(html);
  } catch (err) {
    next(err);
  }
};

const generateBiodataHTML = (data) => {
  const age = data.dob ? (() => {
    const today = new Date();
    const birth = new Date(data.dob);
    let a = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) a--;
    return a;
  })() : data.age;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Biodata - ${data.name || 'Export'}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b0f0f, #8b1a1a); color: white; padding: 20px; text-align: center; }
    .section-title { background: linear-gradient(90deg, #8b1a1a, #c8873a); color: white; padding: 5px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 12px 0 6px; }
    .row { display: flex; padding: 4px 8px; border-bottom: 1px solid #f0e0c8; }
    .label { font-weight: bold; color: #8b1a1a; min-width: 140px; font-size: 12px; }
    .value { color: #2d1a00; font-size: 12px; }
    .footer { background: #8b1a1a; color: #ffd580; text-align: center; padding: 8px; font-size: 11px; margin-top: 16px; }
    @media print { @page { margin: 0.5in; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:11px;letter-spacing:0.3em;color:#ffd580;">॥ श्री गणेशाय नमः ॥</div>
    <h1 style="margin:8px 0 4px;font-size:22px;">${data.name || 'Biodata'}</h1>
    ${data.profession ? `<div style="color:#ffd580;font-size:13px;">${data.profession}</div>` : ''}
  </div>
  <div class="section-title">Personal Information</div>
  ${row('Full Name', data.name)}${row('Date of Birth', data.dob)}${row('Age', age ? age + ' Years' : '')}
  ${row('Height', data.height)}${row('Religion', data.religion)}${row('Caste', data.caste)}
  ${row('Marital Status', data.maritalStatus)}${row('Nationality', data.nationality)}
  <div class="section-title">Education & Profession</div>
  ${row('Education', data.education)}${row('College', data.college)}
  ${row('Profession', data.profession)}${row('Company', data.company)}
  ${!data.hideIncome ? row('Income', data.income) : ''}
  <div class="section-title">Family Details</div>
  ${row("Father's Name", data.fatherName)}${row("Father's Occ.", data.fatherOccupation)}
  ${row("Mother's Name", data.motherName)}${row("Mother's Occ.", data.motherOccupation)}
  ${row('Siblings', data.siblings)}${row('Family Type', data.familyType)}${row('Native Place', data.nativePlace)}
  ${!data.hideContact ? `<div class="section-title">Contact</div>${row('Mobile', data.phone)}${row('Email', data.contactEmail)}${row('City', data.city)}` : ''}
  ${data.about ? `<div class="section-title">About Me</div><div style="padding:8px;font-size:12px;color:#2d1a00;font-style:italic;">"${data.about}"</div>` : ''}
  <div class="footer">Generated with ShaadiBio</div>
</body>
</html>`;
};

const row = (label, value) => {
  if (!value) return '';
  return `<div class="row"><span class="label">${label}:</span><span class="value">${value}</span></div>`;
};

module.exports = { create, getAll, getById, update, remove, uploadPhoto, exportPDF };
