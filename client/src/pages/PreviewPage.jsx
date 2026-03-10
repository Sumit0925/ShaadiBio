import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBiodataById } from '../features/biodata/biodataSlice';
import { TEMPLATES } from '../templates';
import { Loader } from '../components/shared';
import Button from '../components/ui/Button';
import { printBiodata, exportBiodataPDF } from '../services/pdfService';

export default function PreviewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData, loading } = useSelector(s => s.biodata);
  const { user } = useSelector(s => s.auth);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id) dispatch(fetchBiodataById(id));
  }, [id, user]);

  const ActiveTemplate = TEMPLATES[formData.template] || TEMPLATES[1];
  const templateId = formData.template === 2 ? 'biodata-modern' : 'biodata-traditional';
  const isGuest = !user;

  // FIX: use printBiodata() which opens a dedicated print window
  // NOT window.print() which would print the whole page with navbar etc.
  const handlePrint = () => {
    setPrintLoading(true);
    // Small delay to ensure template is rendered in DOM
    setTimeout(() => {
      printBiodata(templateId, isGuest);
      setPrintLoading(false);
    }, 100);
  };

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await exportBiodataPDF(templateId, formData.name || 'biodata', isGuest);
    } catch (err) {
      console.error('PDF failed:', err);
      alert('PDF download failed. Using print dialog as fallback.\n\nIn the print dialog, select "Save as PDF" as the destination.');
      printBiodata(templateId, isGuest);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <Loader text="Loading preview..." />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-800 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            >
              ← Back
            </button>
            <h2 className="font-display font-semibold text-gray-800 text-sm sm:text-base">
              {formData.name || 'Biodata Preview'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/edit/${id}`} className="btn btn-secondary btn-sm">
              ✏️ <span className="hidden sm:inline">Edit</span>
            </Link>
            <Button size="sm" variant="secondary" onClick={handlePrint} loading={printLoading}>
              🖨️ <span className="hidden sm:inline">Print</span>
            </Button>
            <Button size="sm" variant="navy" onClick={handlePDF} loading={pdfLoading}>
              📄 <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            <ActiveTemplate data={formData} showWatermark={isGuest} />
          </div>
        </div>
      </div>
    </div>
  );
}