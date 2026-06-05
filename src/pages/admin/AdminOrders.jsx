import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function statusClass(s) {
  if (s === 'Pending')     return 'badge-pending';
  if (s === 'Confirmed')   return 'badge-confirmed';
  if (s === 'In Progress') return 'badge-progress';
  if (s === 'Delivered')   return 'badge-delivered';
  return 'badge-gold';
}

export default function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [amount, setAmount]     = useState('');

  useEffect(() => {
    const load = () => {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      api.get(`/orders?${params}`)
        .then(r => setOrders(r.data.orders || []))
        .catch(() => toast.error('Failed to load orders'))
        .finally(() => setLoading(false));
    };
    load();
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const updateAmount = async (id) => {
    if (!amount) return;
    try {
      await api.patch(`/orders/${id}/status`, { amount: Number(amount) });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, amount: Number(amount) } : o));
      setSelected(s => ({ ...s, amount: Number(amount) }));
      toast.success('Amount updated');
      setAmount('');
    } catch { toast.error('Update failed'); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      setSelected(null);
      toast.success('Order deleted successfully');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = orders.filter(o =>
    !search ||
    o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    o.service?.toLowerCase().includes(search.toLowerCase()) ||
    o.clientPhone?.includes(search)
  );

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <>
      <div className="admin-page-title">All Orders</div>
      <div className="admin-page-sub">Manage and track all studio bookings.</div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-control"
          placeholder="Search client, service, phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        {['', 'Pending', 'Confirmed', 'In Progress', 'Delivered'].map(s => (
          <button key={s} className={`filter-btn${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                    No orders found
                  </td>
                </tr>
              ) : filtered.map(o => (
                <tr key={o._id}>
                  <td
                    style={{ fontWeight: 600, color: 'var(--dark)', cursor: 'pointer' }}
                    onClick={() => { setSelected(o); setAmount(o.amount || ''); }}
                  >
                    {o.clientName}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{o.clientPhone}</td>
                  <td style={{ fontSize: '0.82rem', maxWidth: 160 }}>{o.service}</td>
                  <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{o.preferredDate || '—'}</td>
                  <td style={{ fontWeight: 600 }}>
                    {o.amount > 0 ? `₹${o.amount.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setSelected(o); setAmount(o.amount || ''); }}
                      >
                        View
                      </button>
                      <select
                        className="form-control"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', cursor: 'pointer' }}
                        value={o.status}
                        onChange={e => updateStatus(o._id, e.target.value)}
                      >
                        {['Pending', 'Confirmed', 'In Progress', 'Delivered'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOrder(o._id)}
                        title="Delete order"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Order — {selected.clientName}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p className="form-label" style={{ marginBottom: '0.75rem' }}>Client Info</p>
                {[
                  ['Name',    selected.clientName],
                  ['Phone',   selected.clientPhone],
                  ['Email',   selected.clientEmail    || '—'],
                  ['Address', selected.clientAddress  || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text3)', minWidth: 70 }}>{k}:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="form-label" style={{ marginBottom: '0.75rem' }}>Booking Info</p>
                {[
                  ['Service',   selected.service],
                  ['Date',      selected.preferredDate || '—'],
                  ['Venue',     selected.venue         || '—'],
                  ['Budget',    selected.budget        || '—'],
                  ['Order ID',  `#${selected._id.slice(-8).toUpperCase()}`],
                  ['Submitted', new Date(selected.createdAt).toLocaleDateString('en-IN')],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text3)', minWidth: 70 }}>{k}:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {selected.notes && (
              <div className="card-flat" style={{ margin: '1rem 0', padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', fontStyle: 'italic' }}>
                  Notes: "{selected.notes}"
                </p>
              </div>
            )}

            {selected.referenceImage && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="form-label">Reference Image</p>
                <img
                  src={getImageUrl(selected.referenceImage)}
                  alt="Reference"
                  style={{ maxHeight: 200, borderRadius: 8, border: '1px solid var(--bg3)', marginTop: '0.5rem', display: 'block' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p className="form-label">Update Status</p>
                <select
                  className="form-control"
                  value={selected.status}
                  onChange={e => updateStatus(selected._id, e.target.value)}
                >
                  {['Pending', 'Confirmed', 'In Progress', 'Delivered'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="form-label">Set Amount (₹)</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="e.g. 45000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => updateAmount(selected._id)}>
                    Set
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-wa btn-sm"
                onClick={() => window.open(`https://wa.me/${selected.clientPhone?.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                📱 WhatsApp Client
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteOrder(selected._id)}
              >
                🗑 Delete Order
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}