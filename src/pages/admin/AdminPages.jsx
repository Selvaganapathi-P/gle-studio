// ============================================================
// AdminPages.jsx — All admin sub-pages in one file
// ============================================================
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

// ============================================================
// AdminGallery
// ============================================================
export function AdminGallery() {
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cat, setCat]             = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm]           = useState({ title: '', category: 'Wedding', featured: false });
  const [file, setFile]           = useState(null);

  const load = () => {
    const q = cat ? `?category=${cat}` : '';
    api.get(`/gallery${q}`).then(r => setPhotos(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [cat]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('gallery', file);
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('featured', form.featured);
    try {
      const res = await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPhotos(prev => [res.data, ...prev]);
      setForm({ title: '', category: 'Wedding', featured: false });
      setFile(null);
      document.getElementById('gallery-file').value = '';
      toast.success('Photo uploaded!');
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setPhotos(prev => prev.filter(p => p._id !== id));
      toast.success('Photo deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <>
      <div className="admin-page-title">Gallery Management</div>
      <div className="admin-page-sub">Upload and manage studio photos by category.</div>
      <div className="form-section" style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Upload New Photo</h4>
        <form onSubmit={upload}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Photo Title</label>
              <input className="form-control" placeholder="e.g. Wedding Ceremony" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Wedding','Portrait','Events','Commercial'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Image *</label>
              <input id="gallery-file" type="file" className="form-control" accept="image/*" style={{ padding: '0.4rem' }} onChange={e => setFile(e.target.files[0])} required />
              <p className="form-hint">JPEG, PNG, WebP — max 10MB</p>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Feature on homepage</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload Photo'}</button>
        </form>
      </div>
      <div className="gallery-filters">
        {['', 'Wedding', 'Portrait', 'Events', 'Commercial'].map(c => (
          <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c || 'All'}</button>
        ))}
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          {photos.map(p => (
            <div key={p._id} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--bg3)', boxShadow: 'var(--shadow)', position: 'relative' }}>
              <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
              {p.featured && <span className="badge badge-gold" style={{ position: 'absolute', top: 6, left: 6, fontSize: '0.65rem' }}>Featured</span>}
              <div style={{ padding: '0.6rem 0.75rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '0.2rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.title || 'Untitled'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{p.category}</span>
                  <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => deletePhoto(p._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div style={{ gridColumn: '1/-1' }} className="empty-state">
              <div className="empty-state-icon">🖼️</div>
              <h3>No photos yet</h3><p>Upload your first photo above.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ============================================================
// AdminFrames
// ============================================================
export function AdminFrames() {
  const [frames, setFrames]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState({ size: '', material: 'Matte', price: '' });

  useEffect(() => {
    api.get('/frames').then(r => setFrames(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openAdd  = () => { setEditing(null); setForm({ size: '', material: 'Matte', price: '' }); setShowForm(true); };
  const openEdit = f  => { setEditing(f._id); setForm({ size: f.size, material: f.material, price: f.price }); setShowForm(true); };

  const save = async () => {
    if (!form.size || !form.price) { toast.error('Fill in size and price'); return; }
    try {
      if (editing) {
        const res = await api.put(`/frames/${editing}`, { ...form, price: Number(form.price) });
        setFrames(prev => prev.map(f => f._id === editing ? res.data : f));
        toast.success('Frame updated');
      } else {
        const res = await api.post('/frames', { ...form, price: Number(form.price) });
        setFrames(prev => [res.data, ...prev]);
        toast.success('Frame added');
      }
      setShowForm(false);
    } catch { toast.error('Save failed'); }
  };

  const del = async id => {
    if (!window.confirm('Delete this frame option?')) return;
    try { await api.delete(`/frames/${id}`); setFrames(prev => prev.filter(f => f._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div className="admin-page-title">Frames Management</div><div className="admin-page-sub">Manage frame sizes, materials and prices.</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Frame</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table><thead><tr><th>Size</th><th>Material</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {frames.map(f => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 600 }}>{f.size}"</td>
                  <td><span className="badge badge-gold">{f.material}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--gold)' }}>₹{f.price.toLocaleString('en-IN')}</td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(f._id)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Frame' : 'Add Frame'}</div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="form-group"><label className="form-label">Size (e.g. 4×6)</label><input className="form-control" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="4×6" /></div>
            <div className="form-group"><label className="form-label">Material</label>
              <select className="form-control" value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))}>
                {['Matte','Glossy','Canvas','Acrylic'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-control" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="499" /></div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add Frame'}</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// AdminClients
// ============================================================
export function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/users').then(r => setClients(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const initials = name => name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <>
      <div className="admin-page-title">Client Management</div>
      <div className="admin-page-sub">View all registered clients and their order history.</div>
      <input className="form-control" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, marginBottom: '1.25rem' }} />
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table><thead><tr><th>Client</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spend</th><th>Joined</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}>{initials(c.name)}</div>
                    <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{c.name}</span>
                  </div></td>
                  <td style={{ fontSize: '0.85rem' }}>{c.email}</td>
                  <td style={{ fontSize: '0.85rem' }}>{c.phone || '—'}</td>
                  <td><span className="badge badge-gold">{c.orders?.length || 0} orders</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--gold)' }}>₹{(c.orders?.reduce((s, o) => s + (o.amount || 0), 0) || 0).toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>No clients found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ============================================================
// AdminStaff
// ============================================================
const ROLES = ['Lead Photographer','Photographer','Photo Editor','Videographer','Assistant','Manager'];

export function AdminStaff() {
  const [staff, setStaff]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ name: '', role: 'Photographer', phone: '', email: '' });

  const load = () =>
    api.get('/staff').then(r => setStaff(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', role: 'Photographer', phone: '', email: '' });
    setShowForm(true);
  };

  const openEdit = s => {
    setEditing(s._id);
    setForm({ name: s.name, role: s.role, phone: s.phone || '', email: s.email || '' });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name) { toast.error('Enter staff name'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/staff/${editing}`, form);
        setStaff(prev => prev.map(s => s._id === editing ? res.data : s));
        toast.success('Staff updated!');
      } else {
        const res = await api.post('/staff', form);
        setStaff(prev => [...prev, res.data]);
        toast.success('Staff member added!');
      }
      setShowForm(false);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const deleteStaff = async id => {
    if (!window.confirm('Remove this staff member? This cannot be undone.')) return;
    try {
      await api.put(`/staff/${id}`, { active: false });
      setStaff(prev => prev.filter(s => s._id !== id));
      toast.success('Staff member removed');
    } catch { toast.error('Delete failed'); }
  };

  const initials = name => name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'S';

  const roleColor = role => {
    const map = {
      'Lead Photographer': '#b8460b',
      'Photographer':      'var(--gold)',
      'Videographer':      '#0b6cbf',
      'Photo Editor':      '#5b0bbf',
      'Assistant':         '#0b8a4f',
      'Manager':           '#8a0b6c',
    };
    return map[role] || 'var(--gold)';
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <div className="admin-page-title">Staff Management</div>
          <div className="admin-page-sub">Manage your photography team.</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Staff</button>
      </div>
      <div className="admin-services-grid">
        {staff.map(s => (
          <div key={s._id} className="card" style={{ position: 'relative', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
              <div className="profile-avatar" style={{ width: 54, height: 54, fontSize: '1.15rem', flexShrink: 0, border: '2.5px solid var(--gold)', boxShadow: '0 4px 14px rgba(184,146,42,0.2)' }}>
                {initials(s.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.25rem', lineHeight: 1.2 }}>{s.name}</h4>
                <span style={{ display: 'inline-block', padding: '0.18rem 0.65rem', borderRadius: '40px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: `${roleColor(s.role)}18`, color: roleColor(s.role), border: `1px solid ${roleColor(s.role)}40` }}>
                  {s.role}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
              {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.83rem', color: 'var(--text2)' }}><span>📞</span><a href={`tel:${s.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{s.phone}</a></div>}
              {s.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.83rem', color: 'var(--text2)' }}><span>✉️</span><a href={`mailto:${s.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{s.email}</a></div>}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: '1rem' }}>{s.assignedOrders?.length || 0} active orders assigned</div>
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--bg2)', paddingTop: '0.85rem' }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(s)}>✏️ Edit</button>
              {s.phone && <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => window.open(`https://wa.me/91${s.phone.replace(/\D/g,'')}`, '_blank')}>💬 WhatsApp</button>}
              <button className="btn btn-danger btn-sm" style={{ padding: '0.38rem 0.65rem' }} onClick={() => deleteStaff(s._id)} title="Remove staff">🗑</button>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <div style={{ gridColumn: '1/-1' }} className="empty-state">
            <div className="empty-state-icon">🧑‍💼</div>
            <h3>No staff added yet</h3>
            <p>Add your first team member.</p>
          </div>
        )}
      </div>
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing ? '✏️ Edit Staff Member' : '➕ Add Staff Member'}</div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Vijay Prakash" /></div>
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="staff@gle.com" /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={saving}>{saving ? 'Saving...' : editing ? '✅ Update Staff' : '➕ Add Member'}</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// AdminAnalytics
// ============================================================
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function AdminAnalytics() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = MONTHS.map((m, i) => {
    const found = stats?.monthlyRevenue?.find(r => r._id === i + 1);
    return { month: m, revenue: found?.revenue || 0, bookings: found?.count || 0 };
  });

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <>
      <div className="admin-page-title">Revenue Analytics</div>
      <div className="admin-page-sub">Financial overview for GLE Studio — {new Date().getFullYear()}</div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--gold)' }}>{stats?.revenue ? `₹${(stats.revenue/1000).toFixed(0)}K` : '₹0'}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card"><div className="stat-value">{stats?.total || 0}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{stats?.total ? `₹${Math.round((stats.revenue||0)/stats.total).toLocaleString('en-IN')}` : '—'}</div><div className="stat-label">Avg. Order Value</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.thisMonth || 0}</div><div className="stat-label">This Month</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="chart-box">
          <h4>Monthly Revenue (₹)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} tickFormatter={v => v > 0 ? `₹${(v/1000).toFixed(0)}K` : '0'} />
              <Tooltip formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="var(--gold)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4>Monthly Bookings</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', borderRadius: 8 }} />
              <Line type="monotone" dataKey="bookings" stroke="var(--gold)" strokeWidth={2.5} dot={{ fill: 'var(--gold)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {stats?.serviceBreakdown?.length > 0 && (
        <div className="chart-box">
          <h4>Bookings by Service</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            {stats.serviceBreakdown.map(s => {
              const maxCount = Math.max(...stats.serviceBreakdown.map(x => x.count), 1);
              return (
                <div key={s._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text2)', fontWeight: 500 }}>{s._id}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 700 }}>{s.count} bookings {s.revenue > 0 ? `· ₹${s.revenue.toLocaleString('en-IN')}` : ''}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${(s.count/maxCount)*100}%`, background: 'linear-gradient(to right,var(--gold),var(--gold3))', borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// AdminSettings
// ============================================================
export function AdminSettings() {
  const [form, setForm]       = useState({
    studioName: 'GLE Studio', tagline: '', phone: '', whatsappNumber: '',
    email: '', address: '', instagramUrl: '', facebookUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => { setForm(f => ({ ...f, ...r.data })); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([key, val]) => {
        if (!['logo','_id','__v','createdAt','updatedAt'].includes(key)) payload[key] = val || '';
      });
      await api.put('/settings', payload);
      toast.success('✅ Settings saved! Changes are live across the site.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <>
      <div className="admin-page-title">Studio Settings</div>
      <div className="admin-page-sub">Changes here update contact details, WhatsApp number, address across the entire site.</div>
      <form onSubmit={save} style={{ maxWidth: 680 }}>
        <div className="settings-section">
          <div className="settings-section-title">Studio Information</div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Studio Name</label><input className="form-control" name="studioName" value={form.studioName} onChange={handle} /></div>
            <div className="form-group"><label className="form-label">Tagline</label><input className="form-control" name="tagline" value={form.tagline} onChange={handle} placeholder="Capturing Your Golden Moments" /></div>
          </div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-control" name="email" type="email" value={form.email} onChange={handle} placeholder="hello@glestudio.in" /></div>
          <div className="form-group"><label className="form-label">Studio Address</label><textarea className="form-control" name="address" rows={3} value={form.address} onChange={handle} placeholder="Full studio address..." /><p className="form-hint">This address shows in the footer, contact page and booking confirmation.</p></div>
        </div>
        <div className="settings-section">
          <div className="settings-section-title">Contact Numbers</div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Display Phone Number</label><input className="form-control" name="phone" value={form.phone} onChange={handle} placeholder="+91 93457 60278" /><p className="form-hint">Shown in navbar, footer and contact section.</p></div>
            <div className="form-group"><label className="form-label">WhatsApp Number</label><input className="form-control" name="whatsappNumber" value={form.whatsappNumber} onChange={handle} placeholder="919345760278" /><p className="form-hint">Country code without +. All booking & frame orders go here.</p></div>
          </div>
        </div>
        <div className="settings-section">
          <div className="settings-section-title">Social Media</div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Instagram URL</label><input className="form-control" name="instagramUrl" value={form.instagramUrl} onChange={handle} placeholder="https://instagram.com/glestudio" /></div>
            <div className="form-group"><label className="form-label">Facebook URL</label><input className="form-control" name="facebookUrl" value={form.facebookUrl} onChange={handle} placeholder="https://facebook.com/glestudio" /></div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={saving} style={{ marginTop: '0.5rem' }}>
          {saving ? '💾 Saving…' : '💾 Save Settings'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.75rem' }}>
          All changes are immediately applied across the entire site after saving.
        </p>
      </form>
    </>
  );
}

export default AdminGallery;