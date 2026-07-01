import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function statusClass(s) {
  if (s === 'Pending')    return 'badge-pending';
  if (s === 'Confirmed')  return 'badge-confirmed';
  if (s === 'In Progress') return 'badge-progress';
  if (s === 'Delivered')  return 'badge-delivered';
  return 'badge-gold';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiErr,  setApiErr]  = useState('');

  const load = () => {
    setLoading(true);
    setApiErr('');
    Promise.all([
      api.get('/orders/stats'),
      api.get('/orders?limit=6'),
    ]).then(([s, o]) => {
      setStats(s.data);
      setOrders(o.data.orders || []);
      setApiErr('');
    }).catch(err => {
      const msg = err?.response?.data?.message || err?.message || 'Network error — backend may be offline or waking up.';
      setApiErr(msg);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build chart data from monthlyRevenue
  const chartData = MONTHS.map((m, i) => {
    const found = stats?.monthlyRevenue?.find(r => r._id === i + 1);
    return { month: m, revenue: found?.revenue || 0, bookings: found?.count || 0 };
  });

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 320 }}><div className="spinner"></div></div>;

  return (
    <>
      <div>
        <div className="admin-page-title">Dashboard Overview</div>
        <div className="admin-page-sub">Welcome back! Here's your studio at a glance.</div>
      </div>

      {/* API error banner */}
      {apiErr && (
        <div style={{
          background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.30)',
          borderRadius: 'var(--radius)', padding: '0.85rem 1.2rem', marginBottom: '1.5rem',
          color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{ flex: 1 }}>⚠️ <strong>API error:</strong> {apiErr} — Check backend is running & CORS allows this domain.</span>
          <button className="btn btn-ghost btn-sm" onClick={load} style={{ flexShrink: 0, color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.4)' }}>
            ↻ Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total ?? '—'}</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-change up">↑ All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.pending ?? '—'}</div>
          <div className="stat-label">Pending</div>
          <div className="stat-change warn">Needs attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--info)' }}>{stats?.thisMonth ?? '—'}</div>
          <div className="stat-label">This Month</div>
          <div className="stat-change up">↑ New bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>
            {stats?.revenue ? `₹${(stats.revenue / 1000).toFixed(0)}K` : '₹0'}
          </div>
          <div className="stat-label">Revenue (YTD)</div>
          <div className="stat-change up">Confirmed orders</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="chart-box">
          <h4>Monthly Bookings</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', border: '1px solid var(--bg3)', borderRadius: 8 }} />
              <Bar dataKey="bookings" fill="var(--gold)" radius={[4,4,0,0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4>Monthly Revenue (₹)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} tickFormatter={v => v > 0 ? `₹${(v/1000).toFixed(0)}K` : '0'} />
              <Tooltip contentStyle={{ fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', border: '1px solid var(--bg3)', borderRadius: 8 }}
                formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2.5} dot={{ fill: 'var(--gold)', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Breakdown */}
      {stats?.serviceBreakdown?.length > 0 && (
        <div className="chart-box" style={{ marginBottom: '1.5rem' }}>
          <h4>Revenue by Service</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {stats.serviceBreakdown.slice(0,5).map(s => {
              const maxRev = Math.max(...stats.serviceBreakdown.map(x => x.revenue), 1);
              const pct = Math.round((s.revenue / maxRev) * 100);
              return (
                <div key={s._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}>{s._id}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 700 }}>
                      {s.count} orders {s.revenue > 0 ? `· ₹${s.revenue.toLocaleString('en-IN')}` : ''}
                    </span>
                  </div>
                  <div style={{ height: 7, background: 'var(--bg3)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right, var(--gold), var(--gold3))', borderRadius: 4 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="chart-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0 }}>Recent Orders</h4>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}>View All →</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No orders yet</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>
                  <td style={{ fontWeight: 500, color: 'var(--dark)' }}>{o.clientName}</td>
                  <td>{o.service}</td>
                  <td>{o.preferredDate || '—'}</td>
                  <td>{o.amount > 0 ? `₹${o.amount.toLocaleString('en-IN')}` : '—'}</td>
                  <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
