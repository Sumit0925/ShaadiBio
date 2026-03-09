import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveBiodata, fetchBiodataById, resetForm, clearSaveStatus, uploadPhoto
} from './biodataSlice';
import {
  PersonalForm, EducationForm, FamilyForm, HoroscopeForm, ContactForm, PhotoUpload, TemplateSwitcher
} from './FormSections';
import { TEMPLATES } from '../../templates';
import { useDebounce } from '../../hooks/useDebounce';
import { validateBiodata } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { Alert, Modal } from '../../components/ui/FormFields';
import { Loader } from '../../components/shared';
import { printBiodata, exportBiodataPDF } from '../../services/pdfService';

const TABS = [
  { key: 'personal', label: '👤 Personal', short: '👤' },
  { key: 'education', label: '🎓 Education', short: '🎓' },
  { key: 'family', label: '👨‍👩‍👧 Family', short: '👨‍👩‍👧' },
  { key: 'horoscope', label: '⭐ Horoscope', short: '⭐' },
  { key: 'contact', label: '📞 Contact', short: '📞' },
];

function TabContent({ tab, errors }) {
  switch (tab) {
    case 'personal': return <PersonalForm errors={errors} />;
    case 'education': return <EducationForm errors={errors} />;
    case 'family': return <FamilyForm errors={errors} />;
    case 'horoscope': return <HoroscopeForm errors={errors} />;
    case 'contact': return <ContactForm errors={errors} />;
    default: return null;
  }
}

export default function CreateBiodata() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { formData, currentId, saveStatus, error, loading } = useSelector(s => s.biodata);
  const isGuest = !user;

  const [tab, setTab] = useState('personal');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false); // Mobile: toggle preview
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const debouncedData = useDebounce(formData, 300);
  const ActiveTemplate = TEMPLATES[debouncedData.template] || TEMPLATES[1];

  // Load existing biodata if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchBiodataById(id));
    } else {
      dispatch(resetForm());
    }
    return () => dispatch(clearSaveStatus());
  }, [id, dispatch]);

  // Auto-clear save success
  useEffect(() => {
    if (saveStatus === 'saved') {
      const t = setTimeout(() => dispatch(clearSaveStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [saveStatus, dispatch]);

  const handleSave = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const errs = validateBiodata(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Switch to tab with first error
      if (errs.name || errs.gender || errs.dob || errs.religion) setTab('personal');
      else if (errs.contactEmail || errs.phone) setTab('contact');
      return;
    }
    setErrors({});
    const savedId = currentId || id;
    const result = await dispatch(saveBiodata({ id: savedId, formData }));
    if (!result.error) {
      // Upload photo if new file selected
      const newId = result.payload?.biodata?._id || result.payload?._id || savedId;
      if (formData._photoFile && newId) {
        await dispatch(uploadPhoto({ id: newId, file: formData._photoFile }));
      }
    }
  };

  const getTemplateId = () => formData.template === 2 ? 'biodata-modern' : 'biodata-traditional';

  // Print button — opens dedicated print window (NOT window.print which prints the whole page)
  const handlePDF = () => {
    setPdfLoading(true);
    setTimeout(() => {
      printBiodata(getTemplateId(), isGuest);
      setPdfLoading(false);
    }, 100);
  };

  // PDF download button — uses html2pdf, respects guest/logged-in watermark logic
  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      await exportBiodataPDF(getTemplateId(), formData.name || 'biodata', isGuest);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading && id) return <Loader text="Loading biodata..." />;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl text-gray-900">
              {id ? 'Edit Biodata' : 'Create Biodata'}
            </h1>
            {!user && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Guest Mode — Login to Save
              </span>
            )}
          </div>
          {/* Mobile preview toggle */}
          <button
            onClick={() => setShowPreview(v => !v)}
            className="lg:hidden btn btn-secondary btn-sm flex items-center gap-1.5"
          >
            {showPreview ? '✏️ Edit' : '👁 Preview'}
          </button>
        </div>
      </div>

      {/* Status banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        {saveStatus === 'saved' && <Alert type="success">✅ Biodata saved successfully!</Alert>}
        {saveStatus === 'error' && error && <Alert type="error" onClose={() => dispatch(clearSaveStatus())}>{error}</Alert>}
        {Object.keys(errors).length > 0 && (
          <Alert type="error">Please fix the highlighted fields before saving.</Alert>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="lg:grid lg:grid-cols-[420px_1fr] lg:gap-6">

          {/* LEFT PANEL — Form */}
          <div className={`${showPreview ? 'hidden' : 'block'} lg:block`}>
            <div className="card p-4 space-y-4">
              {/* Photo + Template row */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <PhotoUpload />
                <div className="flex-1">
                  <p className="field-label mb-2">Template</p>
                  <TemplateSwitcher />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto gap-1 pb-1 -mx-1 px-1 scrollbar-hide">
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`tab-btn shrink-0 ${tab === t.key ? 'active' : ''}`}
                  >
                    <span className="sm:hidden">{t.short}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Form content */}
              <div className="animate-fade-in">
                <TabContent tab={tab} errors={errors} />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                <Button
                  onClick={handleSave}
                  loading={saveStatus === 'saving'}
                  className="flex-1 sm:flex-none"
                >
                  {saveStatus === 'saving' ? 'Saving...' : '💾 Save'}
                </Button>
                <Button variant="secondary" onClick={handlePDF} loading={pdfLoading} className="flex-1 sm:flex-none">
                  🖨️ Print
                </Button>
                <Button variant="navy" onClick={handleExportPDF} loading={pdfLoading} className="flex-1 sm:flex-none">
                  📄 PDF
                </Button>
                {currentId && (
                  <Button variant="ghost" onClick={() => navigate(`/preview/${currentId}`)} className="flex-1 sm:flex-none">
                    🔍 Full Preview
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Live Preview */}
          <div className={`${!showPreview ? 'hidden' : 'block'} lg:block mt-4 lg:mt-0`}>
            <div className="lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
                <span className="text-xs text-gray-400">Updates as you type</span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[320px]">
                  <ActiveTemplate data={debouncedData} showWatermark={isGuest} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: show both panels side by side — but on mobile only one at a time (handled by hidden/block above) */}
      </div>

      {/* Login prompt modal */}
      <Modal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} title="Save Your Biodata">
        <div className="text-center space-y-4">
          <div className="text-4xl">💍</div>
          <p className="text-gray-600">Create a free account to save your biodata and access it anytime.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate('/register')} fullWidth>Create Free Account</Button>
            <Button variant="secondary" onClick={() => navigate('/login')} fullWidth>Login</Button>
          </div>
          <button onClick={() => setShowLoginPrompt(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Continue as guest
          </button>
        </div>
      </Modal>
    </div>
  );
}
