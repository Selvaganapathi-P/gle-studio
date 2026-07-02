import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Booking() {
  const { state } = useLocation();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl]         = useState('');
  const [waNumber, setWaNumber]   = useState('919345760278');

  const [form, setForm] = useState({
    clientName:    user?.name  || '',
    clientPhone:   user?.phone || '',
    clientEmail:   user?.email || '',
    clientAddress: '',
    service:       state?.service || 'Wedding Photography',
    preferredDate: '',
    budget:        'Under ₹15,000',
    venue:         '',
    notes:         '',
    amount:        state?.amount || 0,
  });

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data?.whatsappNumber) setWaNumber(r.data.whatsappNumber); }).catch(() => {});
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.clientName || !form.clientPhone) { toast.error('Please fill in name and phone'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const fi = document.getElementById('ref-image');
      if (fi?.files[0]) fd.append('referenceImage', fi.files[0]);
      const res = await api.post('/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setWaUrl(res.data.waUrl);
      setSubmitted(true);
      toast.success('Booking submitted! Redirecting to WhatsApp…');
      setTimeout(() => window.open(res.data.waUrl, '_blank'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <section className="section-pad">
        <div className="container-sm">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>Booking Submitted!</h2>
            <p style={{ color: 'var(--text2)', maxWidth: 440, margin: '0 auto 2rem' }}>
              Thank you! We've received your booking. We'll confirm within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-wa" onClick={() => window.open(waUrl, '_blank')}>📱 Open WhatsApp Chat</button>
              <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>View My Orders</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="page-hero">
        <span className="section-tag">Reservations</span>
        <h1>Book a <em style={{ color: 'var(--gold3)' }}>Session</em></h1>
        <p>Fill in the form below — we'll confirm your booking within 24 hours.</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* booking-layout — CSS handles responsive collapse */}
          <div className="booking-layout">

            {/* Info panel */}
            <div className="booking-info">
              <h3>GLE Studio</h3>
              <p style={{ marginBottom: '1.5rem' }}>Professional photography in Tirupattur & surrounding areas.</p>
              {[
                { icon: '📍', label: 'Location',      value: '42 Golden Lane, Tirupattur, TN 635601' },
                { icon: '📞', label: 'Phone',         value: `+${waNumber}` },
                { icon: '📱', label: 'WhatsApp',      value: `+${waNumber}` },
                { icon: '⏰', label: 'Working Hours', value: 'Mon–Sat: 9AM – 7PM' },
                { icon: '💳', label: 'Payment',       value: 'UPI / Bank Transfer / Cash' },
              ].map(item => (
                <div key={item.label} className="booking-info-item">
                  <div className="booking-info-icon">{item.icon}</div>
                  <div>
                    <div className="booking-info-label">{item.label}</div>
                    <div className="booking-info-value">{item.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1.5rem' }}>
                <button className="btn-wa btn-full" onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}>
                  📱 Chat Directly on WhatsApp
                </button>
              </div>
            </div>

            {/* Booking form */}
            <div className="form-section">
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Booking Details</h3>
              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" name="clientName" placeholder="Your full name" value={form.clientName} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-control" name="clientPhone" placeholder="+91 XXXXX XXXXX" value={form.clientPhone} onChange={handle} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-control" name="clientEmail" type="email" placeholder="your@email.com" value={form.clientEmail} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input className="form-control" name="preferredDate" type="date" value={form.preferredDate} onChange={handle} min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service *</label>
                    <select className="form-control" name="service" value={form.service} onChange={handle}>
                      {['Wedding Photography','Portrait Session','Birthday / Baby Shower','Corporate Event','Commercial Shoot','Pre-Wedding Shoot'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <select className="form-control" name="budget" value={form.budget} onChange={handle}>
                      {['Under ₹15,000','₹15,000 – ₹30,000','₹30,000 – ₹60,000','Above ₹60,000'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                {form.amount > 0 && (
                  <div className="card-flat" style={{ marginBottom: '1rem', padding: '0.75rem 1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
                      💰 Starting price for <strong>{form.service}</strong>:{' '}
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>₹{Number(form.amount).toLocaleString('en-IN')}</span>
                      {' '}— final amount confirmed by studio.
                    </p>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Venue / Location</label>
                  <input className="form-control" name="venue" placeholder="Wedding hall, outdoor location, studio, etc." value={form.venue} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Notes / Requirements</label>
                  <textarea className="form-control" name="notes" rows={4} placeholder="Tell us about your vision, theme, special requests..." value={form.notes} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reference Image (Optional)</label>
                  <input id="ref-image" type="file" className="form-control" accept="image/*" style={{ padding: '0.4rem' }} />
                  <p className="form-hint">Share a reference photo to help us understand your style.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1, minWidth: 180 }}>
                    {loading ? 'Submitting...' : 'Submit Booking →'}
                  </button>
                  <button type="button" className="btn-wa" onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}>
                    📱 WhatsApp Instead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}