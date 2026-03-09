const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    template: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    // Personal
    name:          { type: String, trim: true, default: '' },
    gender:        { type: String, default: 'Male' },
    dob:           { type: String, default: '' },
    age:           { type: String, default: '' },
    height:        { type: String, default: '' },
    complexion:    { type: String, default: '' },
    bloodGroup:    { type: String, default: '' },
    religion:      { type: String, default: '' },
    caste:         { type: String, default: '' },
    motherTongue:  { type: String, default: '' },
    maritalStatus: { type: String, default: 'Never Married' },
    nationality:   { type: String, default: 'Indian' },
    about:         { type: String, default: '' },

    // Education
    education:   { type: String, default: '' },
    college:     { type: String, default: '' },
    profession:  { type: String, default: '' },
    company:     { type: String, default: '' },
    income:      { type: String, default: '' },
    hideIncome:  { type: Boolean, default: false },

    // Family
    fatherName:        { type: String, default: '' },
    fatherOccupation:  { type: String, default: '' },
    motherName:        { type: String, default: '' },
    motherOccupation:  { type: String, default: '' },
    siblings:          { type: String, default: '' },
    familyType:        { type: String, default: 'Nuclear' },
    familyStatus:      { type: String, default: 'Middle Class' },
    nativePlace:       { type: String, default: '' },

    // Horoscope
    rashi:      { type: String, default: '' },
    nakshatra:  { type: String, default: '' },
    gothra:     { type: String, default: '' },
    manglik:    { type: String, default: 'No' },
    birthTime:  { type: String, default: '' },
    birthPlace: { type: String, default: '' },

    // Contact
    contactEmail: { type: String, default: '' },
    phone:        { type: String, default: '' },
    address:      { type: String, default: '' },
    city:         { type: String, default: '' },
    state:        { type: String, default: '' },
    hideContact:  { type: Boolean, default: false },

    // Media
    photo: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Biodata', biodataSchema);
