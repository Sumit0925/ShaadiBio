import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setTemplate } from '../../features/biodata/biodataSlice';
import { Input, Select, Textarea, Toggle } from '../../components/ui/FormFields';
import {
  RELIGIONS, CASTES, RASHIS, NAKSHATRAS, BLOOD_GROUPS,
  HEIGHTS, COMPLEXIONS, MARITAL_STATUS, FAMILY_TYPES, FAMILY_STATUS,
  MANGLIK, GENDERS, INDIAN_STATES, INCOME_RANGES, EDUCATION_LEVELS, MOTHER_TONGUES
} from '../../utils/constants';
import { calculateAge } from '../../utils/helpers';
import { TEMPLATE_META } from '../../templates';

function useBioField() {
  const dispatch = useDispatch();
  const formData = useSelector(s => s.biodata.formData);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(setField({ field: name, value: type === 'checkbox' ? checked : value }));
  };
  return { formData, handleChange, dispatch };
}

export function PersonalForm({ errors = {} }) {
  const { formData, handleChange, dispatch } = useBioField();
  const castesForReligion = CASTES[formData.religion] || CASTES.default;

  const handleDobChange = (e) => {
    const dob = e.target.value;
    dispatch(setField({ field: 'dob', value: dob }));
    dispatch(setField({ field: 'age', value: calculateAge(dob) }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name *" name="name" value={formData.name} onChange={handleChange}
          placeholder="Enter full name" error={errors.name} />
        <Select label="Gender *" name="gender" value={formData.gender} onChange={handleChange}
          options={GENDERS} placeholder="Select gender" error={errors.gender} />
        <Input label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleDobChange} error={errors.dob} />
        <Input label="Age (auto-calculated)" name="age" value={formData.age} readOnly
          className="bg-gray-50 cursor-default" placeholder="Auto from DOB" />
        <Select label="Height" name="height" value={formData.height} onChange={handleChange}
          options={HEIGHTS} placeholder="Select height" />
        <Select label="Complexion" name="complexion" value={formData.complexion} onChange={handleChange}
          options={COMPLEXIONS} placeholder="Select complexion" />
        <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
          options={BLOOD_GROUPS} placeholder="Select" />
        <Select label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
          options={MARITAL_STATUS} placeholder="Select status" />
        <Select label="Religion *" name="religion" value={formData.religion} onChange={handleChange}
          options={RELIGIONS} placeholder="Select religion" error={errors.religion} />
        <Select label="Caste" name="caste" value={formData.caste} onChange={handleChange}
          options={castesForReligion} placeholder="Select caste" />
        <Select label="Mother Tongue" name="motherTongue" value={formData.motherTongue} onChange={handleChange}
          options={MOTHER_TONGUES} placeholder="Select language" />
        <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange}
          placeholder="Indian" />
      </div>
      <Textarea label="About Me" name="about" value={formData.about} onChange={handleChange}
        placeholder="Write a brief introduction about yourself..." rows={4} />
    </div>
  );
}

export function EducationForm({ errors = {} }) {
  const { formData, handleChange } = useBioField();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Highest Education" name="education" value={formData.education} onChange={handleChange}
          options={EDUCATION_LEVELS} placeholder="Select qualification" />
        <Input label="College / University" name="college" value={formData.college} onChange={handleChange}
          placeholder="Enter institution name" />
        <Input label="Profession / Designation" name="profession" value={formData.profession} onChange={handleChange}
          placeholder="e.g. Software Engineer" />
        <Input label="Company / Organization" name="company" value={formData.company} onChange={handleChange}
          placeholder="Enter company name" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <Select label="Annual Income" name="income" value={formData.income} onChange={handleChange}
            options={INCOME_RANGES} placeholder="Select range" />
        </div>
        <div className="pb-0.5">
          <Toggle
            label="Hide income in biodata"
            name="hideIncome"
            checked={formData.hideIncome}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export function FamilyForm({ errors = {} }) {
  const { formData, handleChange } = useBioField();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Father's Full Name" name="fatherName" value={formData.fatherName} onChange={handleChange}
          placeholder="Enter father's name" />
        <Input label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange}
          placeholder="e.g. Retired Teacher" />
        <Input label="Mother's Full Name" name="motherName" value={formData.motherName} onChange={handleChange}
          placeholder="Enter mother's name" />
        <Input label="Mother's Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange}
          placeholder="e.g. Homemaker" />
        <Input label="Siblings" name="siblings" value={formData.siblings} onChange={handleChange}
          placeholder="e.g. 1 Brother, 1 Sister" />
        <Input label="Native Place" name="nativePlace" value={formData.nativePlace} onChange={handleChange}
          placeholder="e.g. Pune, Maharashtra" />
        <Select label="Family Type" name="familyType" value={formData.familyType} onChange={handleChange}
          options={FAMILY_TYPES} placeholder="Select type" />
        <Select label="Family Status" name="familyStatus" value={formData.familyStatus} onChange={handleChange}
          options={FAMILY_STATUS} placeholder="Select status" />
      </div>
    </div>
  );
}

export function HoroscopeForm({ errors = {} }) {
  const { formData, handleChange } = useBioField();
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        ⭐ All horoscope fields are optional. Leave blank if not applicable.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Rashi (Moon Sign)" name="rashi" value={formData.rashi} onChange={handleChange}
          options={RASHIS} placeholder="Select rashi" />
        <Select label="Nakshatra (Birth Star)" name="nakshatra" value={formData.nakshatra} onChange={handleChange}
          options={NAKSHATRAS} placeholder="Select nakshatra" />
        <Input label="Gothra" name="gothra" value={formData.gothra} onChange={handleChange}
          placeholder="Enter gothra" />
        <Select label="Manglik Status" name="manglik" value={formData.manglik} onChange={handleChange}
          options={MANGLIK} placeholder="Select status" />
        <Input label="Birth Time" name="birthTime" type="time" value={formData.birthTime} onChange={handleChange} />
        <Input label="Birth Place" name="birthPlace" value={formData.birthPlace} onChange={handleChange}
          placeholder="City of birth" />
      </div>
    </div>
  );
}

export function ContactForm({ errors = {} }) {
  const { formData, handleChange } = useBioField();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Email Address" name="contactEmail" type="email" value={formData.contactEmail}
          onChange={handleChange} placeholder="email@example.com" error={errors.contactEmail} />
        <Input label="Phone Number" name="phone" type="tel" value={formData.phone}
          onChange={handleChange} placeholder="+91 99999 99999" error={errors.phone} />
        <Input label="City" name="city" value={formData.city} onChange={handleChange}
          placeholder="Enter city" />
        <Select label="State" name="state" value={formData.state} onChange={handleChange}
          options={INDIAN_STATES} placeholder="Select state" />
        <div className="sm:col-span-2">
          <Textarea label="Address" name="address" value={formData.address} onChange={handleChange}
            placeholder="Enter full address (optional)" rows={2} />
        </div>
      </div>
      <Toggle
        label="Hide contact details in biodata"
        name="hideContact"
        checked={formData.hideContact}
        onChange={handleChange}
      />
    </div>
  );
}

export function PhotoUpload() {
  const dispatch = useDispatch();
  const formData = useSelector(s => s.biodata.formData);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch(setField({ field: 'photo', value: ev.target.result }));
      dispatch(setField({ field: '_photoFile', value: file }));
    };
    reader.readAsDataURL(file);
  };

  const photoSrc = formData.photo
    ? (formData.photo.startsWith('data:') || formData.photo.startsWith('http')
      ? formData.photo
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${formData.photo.replace(/^\//, '')}`)
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-gold-400 overflow-hidden hover:border-gold-600 transition-colors group bg-cream-100"
      >
        {photoSrc ? (
          <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gold-500 group-hover:text-gold-700">
            <span className="text-xl">📷</span>
            <span className="text-xs mt-1 font-medium">Photo</span>
          </div>
        )}
      </button>
      {photoSrc && (
        <button
          type="button"
          onClick={() => { dispatch(setField({ field: 'photo', value: '' })); dispatch(setField({ field: '_photoFile', value: null })); }}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      )}
      <p className="text-xs text-gray-400">Max 5MB</p>
    </div>
  );
}

export function TemplateSwitcher() {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(s => s.biodata.formData.template);

  return (
    <div className="flex gap-2">
      {Object.values(TEMPLATE_META).map((tmpl) => (
        <button
          key={tmpl.id}
          type="button"
          onClick={() => dispatch(setTemplate(tmpl.id))}
          className={`flex-1 rounded-xl border-2 p-2 sm:p-3 text-left transition-all duration-200 cursor-pointer
            ${currentTemplate === tmpl.id
              ? 'border-gold-500 bg-cream-100 shadow-warm'
              : 'border-gray-200 bg-white hover:border-gold-300 hover:bg-cream-50'
            }`}
        >
          <div className="flex gap-1.5 mb-1.5">
            {tmpl.colors.map((c, i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ background: c }} />
            ))}
          </div>
          <div className="text-xs font-bold text-gray-800">{tmpl.name}</div>
          <div className="text-xs text-gray-500 leading-tight hidden sm:block">{tmpl.desc}</div>
        </button>
      ))}
    </div>
  );
}
