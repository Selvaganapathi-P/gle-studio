import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FALLBACK_FRAMES = [
  { _id:'1',  size:'4×6',   material:'Matte',   price:299,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'2',  size:'4×6',   material:'Glossy',  price:449,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'3',  size:'5×7',   material:'Matte',   price:499,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'4',  size:'5×7',   material:'Glossy',  price:649,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'5',  size:'5×7',   material:'Canvas',  price:899,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'6',  size:'8×10',  material:'Matte',   price:799,  offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'7',  size:'8×10',  material:'Canvas',  price:1299, offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'8',  size:'8×10',  material:'Acrylic', price:1799, offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'9',  size:'12×16', material:'Canvas',  price:2199, offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'10', size:'12×16', material:'Acrylic', price:2999, offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'11', size:'16×20', material:'Canvas',  price:3499, offerPercent:0, offerLabel:'', imageUrl:'' },
  { _id:'12', size:'24×36', material:'Canvas',  price:5999, offerPercent:0, offerLabel:'', imageUrl:'' },
];

export default function Frames() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [frames, setFrames]               = useState(FALLBACK_FRAMES);
  const [selectedFrame, setSelectedFrame] = useState(FALLBACK_FRAMES[0]);
  const [qty, setQty]                     = useState(1);
  const [form, setForm]                   = useState({ name: '', phone: '', address: '' });
  const [waNumber, setWaNumber]           = useState('916382748663');
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    api.get('/frames').then(r => {
      if (r.data.length > 0) { setFrames(r.data); setSelectedFrame(r.data[0]); }
    }).catch(() => {});
    api.get('/settings').then(r => {
      if (r.data?.whatsappNumber) setWaNumber(r.data.whatsappNumber);
    }).catch(() => {});
  }, []);

  // ── Price calculation with offer ──────────────────────────
  const offerPercent    = selectedFrame?.offerPercent || 0;
  const originalPrice   = selectedFrame?.price || 0;
  const discountedPrice = offerPercent > 0
    ? Math.round(originalPrice - (originalPrice * offerPercent / 100))
    : originalPrice;
  const total    = discountedPrice * qty;
  const savings  = (originalPrice - discountedPrice) * qty;

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const getFramePrice = (f) => {
    if (!f.offerPercent || f.offerPercent <= 0) return f.price;
    return Math.round(f.price - (f.price * f.offerPercent / 100));
  };

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
      fd.append('clientName',    form.name);
      fd.append('clientPhone',   form.phone);
      fd.append('clientAddress', form.address);
      fd.append('service',       'Frame Order');
      fd.append('orderType',     'frame');
      fd.append('amount',        total);
      fd.append('notes',
        `Size: ${selectedFrame.size}" | Material: ${selectedFrame.material} | Qty: ${qty}` +
        `${offerPercent > 0 ? ` | Offer: ${offerPercent}% OFF` : ''}` +
        ` | Total: ₹${total.toLocaleString('en-IN')}`
      );
      const fi = document.getElementById('frame-photo');
      if (fi?.files[0]) fd.append('referenceImage', fi.files[0]);
      const res = await api.post('/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Order saved! Opening WhatsApp…');
      const msg = encodeURIComponent(
        `🖼️ *GLE Studio – Frame Order*\n` +
        `Name: ${form.name}\n` +
        `Phone: ${form.phone}\n` +
        `Size: ${selectedFrame.size}"\n` +
        `Material: ${selectedFrame.material}\n` +
        `Qty: ${qty}\n` +
        (offerPercent > 0 ? `Offer: ${offerPercent}% OFF${selectedFrame.offerLabel ? ` (${selectedFrame.offerLabel})` : ''}\n` : '') +
        (offerPercent > 0 ? `Original Price: ₹${(originalPrice * qty).toLocaleString('en-IN')}\n` : '') +
        (offerPercent > 0 ? `You Save: ₹${savings.toLocaleString('en-IN')}\n` : '') +
        `Total: ₹${total.toLocaleString('en-IN')}\n` +
        `Address: ${form.address || 'Not provided'}\n` +
        `🆔 Order ID: ${res.data.order._id}`
      );
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    } catch {
      toast.error('Could not save, opening WhatsApp directly');
      const msg = encodeURIComponent(
        `🖼️ *GLE Studio – Frame Order*\n` +
        `Name: ${form.name}\n` +
        `Phone: ${form.phone}\n` +
        `Size: ${selectedFrame.size}"\n` +
        `Material: ${selectedFrame.material}\n` +
        `Qty: ${qty}\n` +
        (offerPercent > 0 ? `Offer: ${offerPercent}% OFF\n` : '') +
        `Total: ₹${total.toLocaleString('en-IN')}`
      );
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="page-hero">
        <span className="section-tag" data-reveal="fade">Frames & Prints</span>
        <h1 data-reveal style={{ '--reveal-delay': '0.08s' }}>Print Your <em style={{ color: 'var(--gold3)' }}>Memories</em></h1>
        <p data-reveal style={{ '--reveal-delay': '0.18s' }}>Archival-quality prints crafted to last generations. Choose your size and material.</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="frames-layout">

            {/* ── Left: Frame selection ── */}
            <div>
              <h3 data-reveal style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Select Your Frame</h3>
              <div className="frame-options-grid">
                {frames.map((f, idx) => {
                  const frameDiscounted = getFramePrice(f);
                  const hasOffer = f.offerPercent > 0;
                  return (
                    <div
                      key={f._id}
                      className={`frame-option${selectedFrame?._id === f._id ? ' selected' : ''}`}
                      style={{ animation: `frameCardReveal 0.45s cubic-bezier(0.22,1,0.36,1) calc(${idx % 6} * 0.06s) both` }}
                      onClick={() => setSelectedFrame(f)}
                    >
                      {/* Frame photo — fixed aspect-ratio container so portrait & landscape look uniform */}
                      {f.imageUrl && (
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '4/3',
                          overflow: 'hidden',
                        }}>
                          <img
                            src={f.imageUrl}
                            alt={`${f.size} ${f.material} frame`}
                            style={{
                              width: '100%', height: '100%',
                              objectFit: 'cover', objectPosition: 'center',
                              display: 'block',
                            }}
                          />
                          {/* Offer badge */}
                          {hasOffer && (
                            <div style={{
                              position: 'absolute', top: 6, left: 6,
                              fontSize: '0.62rem', fontWeight: 800,
                              background: 'var(--danger-bg)', color: 'var(--danger)',
                              borderRadius: '40px', padding: '0.15rem 0.55rem',
                              border: '1px solid #f5c6c6', letterSpacing: '0.04em',
                            }}>
                              {f.offerPercent}% OFF
                            </div>
                          )}
                        </div>
                      )}

                      {/* Offer badge (no image case) */}
                      {!f.imageUrl && hasOffer && (
                        <div style={{
                          fontSize: '0.62rem', fontWeight: 800,
                          background: 'var(--danger-bg)', color: 'var(--danger)',
                          borderRadius: '40px', padding: '0.15rem 0.55rem',
                          marginBottom: '0.3rem', display: 'inline-block',
                          border: '1px solid #f5c6c6', letterSpacing: '0.04em',
                        }}>
                          {f.offerPercent}% OFF
                        </div>
                      )}

                      <div className="size">{f.size}"</div>
                      <div className="material">{f.material}</div>

                      {/* Strikethrough original price */}
                      {hasOffer && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textDecoration: 'line-through', marginTop: '0.2rem' }}>
                          ₹{f.price.toLocaleString('en-IN')}
                        </div>
                      )}

                      {/* Final price */}
                      <div className="price">₹{frameDiscounted.toLocaleString('en-IN')}</div>

                      {/* Offer label */}
                      {hasOffer && f.offerLabel && (
                        <div style={{ fontSize: '0.62rem', color: 'var(--gold)', marginTop: '0.15rem', fontWeight: 600 }}>
                          {f.offerLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Material guide */}
              <div className="card-flat" data-reveal style={{ marginTop: '1.5rem' }}>
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

            {/* ── Right: Order summary ── */}
            <div>
              <div className="form-section" data-reveal="right">
                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Your Order Summary</h3>

                {/* Selected frame preview */}
                {selectedFrame?.imageUrl && (
                  <img
                    src={selectedFrame.imageUrl}
                    alt={`${selectedFrame.size} ${selectedFrame.material} frame`}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1rem' }}
                  />
                )}

                <div className="frame-summary">
                  <div className="frame-summary-row">
                    <span>Size</span>
                    <strong>{selectedFrame?.size}"</strong>
                  </div>
                  <div className="frame-summary-row">
                    <span>Material</span>
                    <strong>{selectedFrame?.material}</strong>
                  </div>
                  <div className="frame-summary-row">
                    <span>Quantity</span>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                      <span className="qty-val">{qty}</span>
                      <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                    </div>
                  </div>

                  {/* Price per item */}
                  <div className="frame-summary-row">
                    <span>Price each</span>
                    <span>
                      {offerPercent > 0 && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text3)', fontSize: '0.82rem', marginRight: '0.5rem' }}>
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: offerPercent > 0 ? 'var(--danger)' : 'var(--dark)' }}>
                        ₹{discountedPrice.toLocaleString('en-IN')}
                      </span>
                    </span>
                  </div>

                  {/* Offer row */}
                  {offerPercent > 0 && (
                    <div className="frame-summary-row" style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>
                        🎉 {selectedFrame?.offerLabel || `${offerPercent}% Offer Applied`}
                      </span>
                      <span>−₹{savings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="frame-summary-row total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Savings highlight */}
                  {offerPercent > 0 && savings > 0 && (
                    <div style={{
                      marginTop: '0.75rem', padding: '0.6rem 0.85rem',
                      background: 'var(--success-bg)', border: '1px solid #b8ddc8',
                      borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                      color: 'var(--success)', fontWeight: 600, textAlign: 'center',
                    }}>
                      🎊 You're saving ₹{savings.toLocaleString('en-IN')} on this order!
                    </div>
                  )}
                </div>

                {/* Auth check */}
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
                      Free delivery within Tirupattur. 3–5 days for other locations.
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