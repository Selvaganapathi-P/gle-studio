import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DEFAULT_IMAGES = {
  'Wedding Photography':     'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'Portrait Sessions':        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  'Birthday & Baby Shower':   'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  'Corporate Events':         'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  'Commercial & Product':     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'Pre-Wedding / Engagement': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
};

const BLANK_FORM = {
  title: '', price: '', maxPrice: '', duration: '', desc: '', active: true,
  imageFile: null, imagePreview: '',
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(BLANK_FORM);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get('/services/all')
      .then(r => setServices(r.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(BLANK_FORM);
    setShowForm(true);
  };

  const openEdit = s => {
    setEditing(s._id);
    setForm({
      title: s.title, price: s.price, maxPrice: s.maxPrice || '',
      duration: s.duration || '', desc: s.desc || '', active: s.active,
      imageFile: null,
      imagePreview: s.imageUrl || DEFAULT_IMAGES[s.title] || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.price) { toast.error('Title and starting price are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',    form.title);
      fd.append('price',    form.price);
      fd.append('maxPrice', form.maxPrice || 0);
      fd.append('duration', form.duration);
      fd.append('desc',     form.desc);
      fd.append('active',   form.active);
      if (form.imageFile) fd.append('serviceImage', form.imageFile);

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editing) {
        const res = await api.put(`/services/${editing}`, fd, cfg);
        setServices(prev => prev.map(s => s._id === editing ? res.data : s));
        toast.success('Service updated!');
      } else {
        const res = await api.post('/services', fd, cfg);
        setServices(prev => [...prev, res.data]);
        toast.success('Service added!');
      }
      setShowForm(false);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const toggleActive = async s => {
    try {
      const fd = new FormData();
      fd.append('title',    s.title);
      fd.append('price',    s.price);
      fd.append('maxPrice', s.maxPrice || 0);
      fd.append('duration', s.duration || '');
      fd.append('desc',     s.desc || '');
      fd.append('active',   String(!s.active));
      const res = await api.put(`/services/${s._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setServices(prev => prev.map(x => x._id === s._id ? res.data : x));
      toast.success(s.active ? 'Service hidden from public' : 'Service visible to public');
    } catch { toast.error('Update failed'); }
  };

  const deleteService = async id => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success('Service deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <>
      <div className="admin-services-header">
        <div>
          <div className="admin-page-title">Services Management</div>
          <div className="admin-page-sub">Manage photography packages, prices and add new events.</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service / Event</button>
      </div>

      <div className="admin-services-grid">
        {services.map(s => {
          const imgSrc = s.imageUrl || DEFAULT_IMAGES[s.title] || null;
          return (
            <div key={s._id} className={`service-card${s.active ? '' : ' is-hidden'}`}>
              <span className={`service-status-badge ${s.active ? 'active' : 'hidden'}`}>
                {s.active ? 'Active' : 'Hidden'}
              </span>

              {/* Service image */}
              <div className="service-image-wrap">
                {imgSrc
                  ? <img src={imgSrc} alt={s.title} className="service-img" />
                  : <div className="service-img-placeholder">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                }
              </div>

              <div className="service-title">{s.title}</div>

              <div className="service-price">
                ₹{Number(s.price).toLocaleString('en-IN')}
                {s.maxPrice > 0 && ` – ₹${Number(s.maxPrice).toLocaleString('en-IN')}`}
              </div>

              {s.duration && <div className="service-duration">⏱ {s.duration}</div>}
              {s.desc     && <p className="service-desc">{s.desc}</p>}

              <div className="service-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(s)}>
                  {s.active ? '🙈 Hide' : '👁 Show'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteService(s._id)}>🗑</button>
              </div>
            </div>
          );
        })}

        {services.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">📷</div>
            <h3>No services yet</h3>
            <p>Click "+ Add Service / Event" to get started.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editing ? '✏️ Edit Service' : '✨ Add New Service / Event'}
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            {/* Image upload */}
            <div className="form-group">
              <label className="form-label">Service Image</label>
              <div className="service-img-upload-area" onClick={() => fileRef.current?.click()}>
                {form.imagePreview
                  ? <img src={form.imagePreview} alt="preview" className="service-img-upload-preview" />
                  : <div className="service-img-upload-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Click to upload image</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>JPG, PNG up to 10 MB</span>
                    </div>
                }
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImage}
              />
              {form.imagePreview && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}
                  onClick={() => { setForm(f => ({ ...f, imageFile: null, imagePreview: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Service / Event Name *</label>
              <input className="form-control" name="title" value={form.title} onChange={handle}
                placeholder="e.g. Festival Photography, Naming Ceremony..." />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="desc" rows={2} value={form.desc} onChange={handle}
                placeholder="Short description of this service..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Starting Price (₹) *</label>
                <input className="form-control" name="price" type="number" value={form.price} onChange={handle} placeholder="e.g. 15000" />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Price (₹)</label>
                <input className="form-control" name="maxPrice" type="number" value={form.maxPrice} onChange={handle} placeholder="e.g. 35000" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <select className="form-control" name="duration" value={form.duration} onChange={handle}>
                <option value="">Select duration</option>
                {['1 Hour','2 Hours','3 Hours','4 Hours','Half Day','Full Day','2 Days','Custom'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={saving}>
                {saving ? 'Saving...' : editing ? '✅ Update Service' : '✨ Add Service'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
