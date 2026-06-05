import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FALLBACK_FRAMES = [
  { _id:'1',  size:'4×6',   material:'Matte',   price:299  },
  { _id:'2',  size:'4×6',   material:'Glossy',  price:449  },
  { _id:'3',  size:'5×7',   material:'Matte',   price:499  },
  { _id:'4',  size:'5×7',   material:'Glossy',  price:649  },
  { _id:'5',  size:'5×7',   material:'Canvas',  price:899  },
  { _id:'6',  size:'8×10',  material:'Matte',   price:799  },
  { _id:'7',  size:'8×10',  material:'Canvas',  price:1299 },
  { _id:'8',  size:'8×10',  material:'Acrylic', price:1799 },
  { _id:'9',  size:'12×16', material:'Canvas',  price:2199 },
  { _id:'10', size:'12×16', material:'Acrylic', price:2999 },
  { _id:'11', size:'16×20', material:'Canvas',  price:3499 },
  { _id:'12', size:'24×36', material:'Canvas',  price:5999 },
];

export default function Frames() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [frames, setFrames]             = useState(FALLBACK_FRAMES);
  const [selectedFrame, setSelectedFrame] = useState(FALLBACK_FRAMES[0]);
  const [qty, setQty]                   = useState(1);
  const [form, setForm]                 = useState({ name: '', phone: '', address: '' });
  const [waNumber, setWaNumber]         = useState('919345760278');
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    api.get('/frames').then(r => { if (r.data.length > 0) { setFrames(r.data); setSelectedFrame(r.data[0]); } }).catch(() => {});
    api.get('/settings').then(r => { if (r.data?.whatsappNumber) setWaNumber(r.data.whatsappNumber); }).catch(() => {});
  }, []);

  const total  = (selectedFrame?.price || 0) * qty;
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/register', { state: { redirectTo: '/frames' } });
      return;
    }
    if (!form.name || !form.phone) { toast.error('Please enter your name and phone'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('clientName', form.name); fd.append('clientPhone', form.phone);
      fd.append('clientAddress', form.address); fd.append('service', 'Frame Order');
      fd.append('orderType', 'frame'); fd.append('amount', total);
      fd.append('notes', `Size: ${selectedFrame.size}" | Material: ${selectedFrame.material} | Qty: ${qty} | Total: ₹${total.toLocaleString('en-IN')}`);
      const fi = document.getElementById('frame-photo');
      if (fi?.files[0]) fd.append('referenceImage', fi.files[0]);
      const res = await api.post('/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Order saved! Opening WhatsApp…');
      const msg = encodeURIComponent(`🖼️ *GLE Studio – Frame Order*\nName: ${form.name}\nPhone: ${form.phone}\nSize: ${selectedFrame.size}"\nMaterial: ${selectedFrame.material}\nQty: ${qty}\nTotal: ₹${total.toLocaleString('en-IN')}\nAddress: ${form.address || 'Not provided'}\n🆔 Order ID: ${res.data.order._id}`);
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    } catch {
      toast.error('Could not save, opening WhatsApp directly');
      const msg = encodeURIComponent(`🖼️ *GLE Studio – Frame Order*\nName: ${form.name}\nPhone: ${form.phone}\nSize: ${selectedFrame.size}"\nMaterial: ${selectedFrame.material}\nQty: ${qty}\nTotal: ₹${total.toLocaleString('en-IN')}`);
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="page-hero">
        <span className="section-tag">Frames & Prints</span>
        <h1>Print Your <em style={{ color: 'var(--gold3)' }}>Memories</em></h1>
        <p>Archival-quality prints crafted to last generations. Choose your size and material.</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* frames-layout — CSS handles responsive (2-col → 1-col) */}
          <div className="frames-layout">

            {/* Left: Frame selection */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Select Your Frame</h3>
              {/* frame-options-grid — responsive 3→2→2 cols */}
              <div className="frame-options-grid">
                {frames.map(f => (
                  <div key={f._id} className={`frame-option${selectedFrame?._id === f._id ? ' selected' : ''}`} onClick={() => setSelectedFrame(f)}>
                    <div className="size">{f.size}"</div>
                    <div className="material">{f.material}</div>
                    <div className="price">₹{f.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div className="card-flat" style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Material Guide</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { m: 'Matte',   desc: 'Soft, no-glare finish. Perfect for portraits and home display.' },
                    { m: 'Glossy',  desc: 'Vivid, high-contrast finish. Great for landscape & event shots.' },
                    { m: 'Canvas',  desc: 'Textured wrap print with gallery-style aesthetic.' },
                    { m: 'Acrylic', desc: 'Crystal-clear, high-gloss glass. Modern premium look.' },
                  ].map(m => (
                    <div key={m.m} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span className="badge badge-gold" style={{ flexShrink: 0 }}>{m.m}</span>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text3)', margin: 0 }}>{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div>
              <div className="form-section">
                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Your Order Summary</h3>
                <div className="frame-summary">
                  <div className="frame-summary-row"><span>Size</span><strong>{selectedFrame?.size}"</strong></div>
                  <div className="frame-summary-row"><span>Material</span><strong>{selectedFrame?.material}</strong></div>
                  <div className="frame-summary-row">
                    <span>Quantity</span>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                      <span className="qty-val">{qty}</span>
                      <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                    </div>
                  </div>
                  <div className="frame-summary-row"><span>Price each</span><span>₹{selectedFrame?.price?.toLocaleString('en-IN')}</span></div>
                  <div className="frame-summary-row total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                </div>

                {!user ? (
                  <div className="guest-order-notice">
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>🔐 Sign in to place your order</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text3)' }}>An account is required to track your frame order.</p>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/register', { state: { redirectTo: '/frames' } })}>Create Account →</button>
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/login', { state: { redirectTo: '/frames' } })}>Sign In</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input className="form-control" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Your Photo</label>
                      <input id="frame-photo" type="file" className="form-control" accept="image/*" style={{ padding: '0.4rem' }} />
                      <p className="form-hint">We'll use this for your print. Max 10MB.</p>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Delivery Address</label>
                      <textarea className="form-control" name="address" rows={3} placeholder="Full delivery address..." value={form.address} onChange={handle} />
                    </div>
                    <button className="btn btn-primary btn-full btn-lg" onClick={placeOrder} disabled={loading}>
                      {loading ? 'Saving order...' : '📱 Place Order via WhatsApp'}
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
                      Free delivery within Dharmapuri. 3–5 days for other locations.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}