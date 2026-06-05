import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ICONS = ['📷','💍','🎭','🎂','🏢','📦','🌅','🎪','🎨','🎬','🏆','⭐','🌸','🎵','🎗️','👨‍👩‍👧'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({
    icon: '📷', title: '', price: '', maxPrice: '', duration: '', desc: '', active: true,
  });

  useEffect(() => {
    api.get('/services/all')
      .then(r => setServices(r.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm({ icon: '📷', title: '', price: '', maxPrice: '', duration: '', desc: '', active: true });
    setShowForm(true);
  };

  const openEdit = s => {
    setEditing(s._id);
    setForm({ icon: s.icon, title: s.title, price: s.price, maxPrice: s.maxPrice || '', duration: s.duration || '', desc: s.desc || '', active: s.active });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.price) { toast.error('Title and starting price are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), maxPrice: Number(form.maxPrice) || 0 };
      if (editing) {
        const res = await api.put(`/services/${editing}`, payload);
        setServices(prev => prev.map(s => s._id === editing ? res.data : s));
        toast.success('Service updated!');
      } else {
        const res = await api.post('/services', payload);
        setServices(prev => [...prev, res.data]);
        toast.success('Service added!');
      }
      setShowForm(false);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const toggleActive = async s => {
    try {
      const res = await api.put(`/services/${s._id}`, { ...s, active: !s.active });
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
      {/* Header */}
      <div className="admin-services-header">
        <div>
          <div className="admin-page-title">Services Management</div>
          <div className="admin-page-sub">Manage photography packages, prices and add new events.</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service / Event</button>
      </div>

      {/* Grid */}
      <div className="admin-services-grid">
        {services.map(s => (
          <div key={s._id} className={`service-card${s.active ? '' : ' is-hidden'}`}>

            {/* Status badge */}
            <span className={`service-status-badge ${s.active ? 'active' : 'hidden'}`}>
              {s.active ? 'Active' : 'Hidden'}
            </span>

            {/* Icon */}
            <div className="service-icon">{s.icon}</div>

            {/* Title */}
            <div className="service-title">{s.title}</div>

            {/* Price */}
            <div className="service-price">
              ₹{Number(s.price).toLocaleString('en-IN')}
              {s.maxPrice > 0 && ` – ₹${Number(s.maxPrice).toLocaleString('en-IN')}`}
            </div>

            {/* Duration */}
            {s.duration && (
              <div className="service-duration">⏱ {s.duration}</div>
            )}

            {/* Desc */}
            {s.desc && (
              <p className="service-desc">{s.desc}</p>
            )}

            {/* Actions */}
            <div className="service-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>
                ✏️ Edit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(s)}>
                {s.active ? '🙈 Hide' : '👁 Show'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteService(s._id)}>
                🗑
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">📷</div>
            <h3>No services yet</h3>
            <p>Click "+ Add Service / Event" to get started.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editing ? '✏️ Edit Service' : '✨ Add New Service / Event'}
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            {/* Icon picker */}
            <div className="form-group">
              <label className="form-label">Choose Icon</label>
              <div className="icon-picker">
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    className={`icon-option${form.icon === ic ? ' selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    title={ic}
                  >
                    {ic}
                  </button>
                ))}
              </div>
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