import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBiodata, deleteBiodata } from '../features/biodata/biodataSlice';
import { Loader, EmptyState, PageHeader } from '../components/shared';
import Button from '../components/ui/Button';
import { Modal, Alert } from '../components/ui/FormFields';

function BiodataCard({ biodata, onDelete }) {
  const navigate = useNavigate();
  const id = biodata._id || biodata.id;
  const templateColors = {
    1: { bg: 'bg-crimson-gradient', label: 'Traditional', text: 'text-white' },
    2: { bg: 'bg-navy-gradient', label: 'Modern', text: 'text-white' },
  };
  const tmpl = templateColors[biodata.template] || templateColors[1];

  return (
    <div className="card card-hover overflow-hidden">
      {/* Card header */}
      <div className={`${tmpl.bg} px-4 py-3 flex items-center justify-between`}>
        <div>
          <div className={`font-display font-semibold text-base ${tmpl.text}`}>
            {biodata.name || 'Unnamed Biodata'}
          </div>
          <div className={`text-xs opacity-75 ${tmpl.text} mt-0.5`}>{tmpl.label} Template</div>
        </div>
        {biodata.photo && (
          <img
            src={biodata.photo.startsWith('data:') || biodata.photo.startsWith('http')
              ? biodata.photo
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${biodata.photo.replace(/^\//, '')}`}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
          />
        )}
      </div>

      {/* Card body */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          {biodata.age && <div><span className="text-gray-400">Age:</span> {biodata.age} yrs</div>}
          {biodata.profession && <div><span className="text-gray-400">Work:</span> {biodata.profession}</div>}
          {biodata.religion && <div><span className="text-gray-400">Religion:</span> {biodata.religion}</div>}
          {biodata.city && <div><span className="text-gray-400">City:</span> {biodata.city}</div>}
        </div>
        {biodata.updatedAt && (
          <div className="text-xs text-gray-400 mt-2">
            Updated {new Date(biodata.updatedAt).toLocaleDateString('en-IN')}
          </div>
        )}
      </div>

      {/* Card actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate(`/preview/${id}`)}>
          👁 Preview
        </Button>
        <Button size="sm" variant="secondary" onClick={() => navigate(`/edit/${id}`)}>
          ✏️ Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(biodata)}>
          🗑️
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { savedList, loading, error } = useSelector(s => s.biodata);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchAllBiodata());
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await dispatch(deleteBiodata(deleteTarget._id || deleteTarget.id));
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  if (loading) return <Loader text="Loading your biodatas..." />;

  return (
    <div className="min-h-screen bg-cream-50">
      <PageHeader
        title="My Biodatas"
        subtitle={`${savedList.length} biodata${savedList.length !== 1 ? 's' : ''} saved`}
      >
        <Link to="/create" className="btn btn-primary btn-md">
          + Create New
        </Link>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && <Alert type="error" className="mb-4">{error}</Alert>}

        {savedList.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No biodatas yet"
            description="Create your first professional marriage biodata in minutes."
            action={
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Your First Biodata →
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedList.map(bd => (
              <BiodataCard
                key={bd._id || bd.id}
                biodata={bd}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Biodata">
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.name || 'this biodata'}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" loading={deleteLoading} onClick={handleDeleteConfirm} fullWidth>
            Yes, Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} fullWidth>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
