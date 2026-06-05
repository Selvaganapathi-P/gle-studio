import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function statusClass(s) {
  if (s === 'Pending')     return 'badge-pending';
  if (s === 'Confirmed')   return 'badge-confirmed';
  if (s === 'In Progress') return 'badge-progress';
  if (s === 'Delivered')   return 'badge-delivered';
  return 'badge-gold';
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [waNumber, setWaNumber] = useState('919345760278');

  useEffect(() => {
    // Load user's orders
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load WhatsApp number from settings
    api.get('/settings')
      .then(r => { if (r.data?.whatsappNumber) setWaNumber(r.data.whatsappNumber); })
      .catch(() => {});
  }, []);

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <section className="section-pad">
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div className="profile-avatar">{initials}</div>
          <div>
            <span className="section-tag">My Account</span>
            <h2 className="section-title" style={{ margin: 0 }}>Welcome, <em>{user?.name?.split(' ')[0]}</em></h2>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>Edit Profile</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/booking')}>+ New Booking</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {orders.filter(o => o.status === 'Pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--info)' }}>
              {orders.filter(o => o.status === 'Confirmed').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)' }}>My Orders</h3>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📷</div>
            <h3>No bookings yet</h3>
            <p>Book your first photography session today!</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/booking')}>Book a Session</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map(order => (
              <div key={order._id} className="order-card" onClick={() => setSelected(order)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div className="order-service">{order.service}</div>
                    <div className="order-meta">
                      <span>📅 {order.preferredDate || 'Date TBD'}</span>
                      {order.venue  && <span>📍 {order.venue}</span>}
                      {order.amount > 0 && <span>💰 ₹{order.amount.toLocaleString('en-IN')}</span>}
                    </div>
                  </div>
                  <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                </div>
                {order.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    "{order.notes.slice(0, 80)}{order.notes.length > 80 ? '…' : ''}"
                  </p>
                )}
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text3)' }}>
                  Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selected && (
          <div className="modal-backdrop" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Order Details</div>
                <button className="modal-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 600 }}>{selected.service}</span>
                <span className={`badge ${statusClass(selected.status)}`}>{selected.status}</span>
              </div>
              <table style={{ width: '100%', fontSize: '0.88rem' }}>
                <tbody>
                  {[
                    ['Order ID',       `#${selected._id.slice(-8).toUpperCase()}`],
                    ['Client',         selected.clientName],
                    ['Phone',          selected.clientPhone],
                    ['Preferred Date', selected.preferredDate || 'TBD'],
                    ['Venue',          selected.venue  || '—'],
                    ['Budget',         selected.budget || '—'],
                    ['Amount',         selected.amount > 0 ? `₹${selected.amount.toLocaleString('en-IN')}` : 'To be confirmed'],
                    ['Status',         selected.status],
                    ['Submitted',      new Date(selected.createdAt).toLocaleDateString('en-IN')],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ color: 'var(--text3)', padding: '0.45rem 0', fontWeight: 500, width: '40%' }}>{k}</td>
                      <td style={{ color: 'var(--dark)', padding: '0.45rem 0', fontWeight: 500 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selected.notes && (
                <div className="card-flat" style={{ marginTop: '1rem', padding: '0.75rem 1rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text2)', fontStyle: 'italic' }}>"{selected.notes}"</p>
                </div>
              )}
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                <button className="btn-wa btn-sm" onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}>
                  📱 Contact Studio
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm]       = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <section className="section-pad">
      <div className="container-sm" style={{ maxWidth: 580 }}>
        <span className="section-tag">Account Settings</span>
        <h2 className="section-title">My <em>Profile</em></h2>
        <div className="divider"></div>

        <div className="form-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="profile-avatar">{initials}</div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{user?.email}</p>
              <span className="badge badge-gold" style={{ marginTop: '0.35rem' }}>Client Member</span>
            </div>
          </div>

          {success && <div className="alert alert-success">✓ Profile updated successfully!</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" name="email" type="email" value={form.email} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" rows={3} value={form.address} onChange={handle} placeholder="Your address..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;