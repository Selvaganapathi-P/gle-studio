import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { icon: '💍', title: 'Wedding Photography', desc: 'Full-day cinematic coverage of your special day.', price: 'From ₹45,000', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
  { icon: '🎭', title: 'Portrait Sessions',   desc: 'Individual, couple & family portraits.',          price: 'From ₹8,000',  img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80' },
  { icon: '🎉', title: 'Events Coverage',     desc: 'Birthdays, baby showers & corporate events.',    price: 'From ₹15,000', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80' },
  { icon: '📸', title: 'Commercial Shoots',   desc: 'Product, branding & editorial photography.',     price: 'From ₹20,000', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
];

const FEATURED_GALLERY = [
  { id: 1, title: 'Golden Hour Wedding',  url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80' },
  { id: 2, title: 'Studio Portrait',      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80' },
  { id: 3, title: 'Birthday Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80' },
  { id: 4, title: 'Product Photography',  url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: 5, title: 'Wedding Couple',       url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=500&q=80' },
  { id: 6, title: 'Fashion Portrait',     url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80' },
  { id: 7, title: 'Corporate Event',      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80' },
  { id: 8, title: 'Brand Campaign',       url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80' },
];

const TESTIMONIALS = [
  { name: 'Priya & Arjun Sharma', role: 'Wedding, 2024',      text: 'GLE Studio captured our wedding beyond imagination. Every frame feels like a painting — emotional, timeless, and absolutely breathtaking.', stars: 5 },
  { name: 'Ravi Krishnamurthy',   role: 'CEO, Velvet Brands', text: 'The commercial shoot exceeded all expectations. Professional, creative, and the images drove real results for our brand.',                    stars: 5 },
  { name: 'Meena & Suresh Iyer', role: 'Baby Shower Session', text: "Our photos are treasures we'll keep forever. The team was so warm and patient — a truly magical experience from start to finish.",            stars: 5 },
];

const SAFE_FALLBACK = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&q=80';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content">
            <div className="hero-tag">✦ Award-Winning Photography Studio</div>
            <h1>Every Frame Tells<br />Your <em>Story</em></h1>
            <p className="hero-sub">
              Luxury wedding, portrait, and commercial photography — capturing life's most luminous moments with cinematic precision in Dharmapuri.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/booking')}>Book a Session</button>
              <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)' }} onClick={() => navigate('/gallery')}>View Gallery</button>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-num">500+</div><div className="hero-stat-label">Happy Clients</div></div>
              <div><div className="hero-stat-num">7+</div><div className="hero-stat-label">Years Experience</div></div>
              <div><div className="hero-stat-num">50K+</div><div className="hero-stat-label">Photos Delivered</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-3">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Photography <em>Services</em></h2>
            <div className="divider center" />
            <p className="section-sub" style={{ margin: '0 auto' }}>From intimate portraits to grand celebrations — we craft images that resonate across a lifetime.</p>
          </div>
          <div className="grid-4 mt-4">
            {SERVICES.map(s => (
              <div key={s.title} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate('/services')}>
                <img src={s.img} alt={s.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.currentTarget.src = SAFE_FALLBACK; e.currentTarget.onerror = null; }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text3)', marginBottom: '0.6rem' }}>{s.desc}</p>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.88rem' }}>{s.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-outline" onClick={() => navigate('/services')}>View All Services →</button>
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY */}
      <section className="section-pad section-alt">
        <div className="container">
          <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Portfolio</span>
              <h2 className="section-title">Featured <em>Gallery</em></h2>
              <div className="divider" />
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/gallery')}>View All Photos →</button>
          </div>
          <div className="home-gallery-grid">
            {FEATURED_GALLERY.map(photo => (
              <div key={photo.id} className="home-gallery-cell" onClick={() => navigate('/gallery')}>
                <img src={photo.url} alt={photo.title} loading="lazy"
                  onError={e => { e.currentTarget.src = SAFE_FALLBACK; e.currentTarget.onerror = null; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-3">
            <span className="section-tag">Why GLE Studio</span>
            <h2 className="section-title">The <em>GLE Difference</em></h2>
            <div className="divider center" />
          </div>
          <div className="grid-4">
            {[
              { icon: '🏆', title: 'Award Winning',  desc: 'Recognised by regional photography associations for excellence in wedding and portrait photography.' },
              { icon: '⚡', title: 'Fast Delivery',   desc: '100+ edited high-res images delivered within 7 days. Rush delivery available for commercial shoots.' },
              { icon: '🎨', title: 'Custom Editing',  desc: 'Each photo is individually colour-graded and retouched to match your preferred aesthetic.' },
              { icon: '🤝', title: 'Personal Touch',  desc: "We take time to understand your vision before every shoot, ensuring results you'll love." },
            ].map(w => (
              <div key={w.title} className="card-flat" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{w.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{w.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad section-alt">
        <div className="container">
          <div className="text-center mb-3">
            <span className="section-tag">Client Stories</span>
            <h2 className="section-title">What Our <em>Clients Say</em></h2>
            <div className="divider center" />
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial">
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section-pad" style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)' }}>
        <div className="container">
          {/* ← home-cta-grid replaces hardcoded inline grid */}
          <div className="home-cta-grid">
            <div>
              <span className="section-tag">Get In Touch</span>
              <h2 className="section-title" style={{ color: 'white' }}>Ready to Create <em>Magic Together?</em></h2>
              <div className="divider" />
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div><div className="contact-label">Studio Location</div><div className="contact-value" style={{ color: 'rgba(255,255,255,0.8)' }}>Golden legacy events, Tirupattur, TN 635901</div></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div><div className="contact-label">Phone / WhatsApp</div><div className="contact-value" style={{ color: 'rgba(255,255,255,0.8)' }}>+91 6382748663</div></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div><div className="contact-label">Studio Hours</div><div className="contact-value" style={{ color: 'rgba(255,255,255,0.8)' }}>Monday – Saturday: 9 AM to 7 PM</div></div>
              </div>
            </div>
            <div className="form-section">
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Quick Enquiry</h3>
              <QuickEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function QuickEnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: 'Wedding Photography', message: '' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const send = () => {
    if (!form.name || !form.phone) { alert('Please enter name and phone'); return; }
    const msg = encodeURIComponent(`Hi GLE Studio! I'd like to enquire about ${form.service}.\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`);
    window.open(`https://wa.me/916382748663?text=${msg}`, '_blank');
  };
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-control" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handle} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Interested In</label>
        <select className="form-control" name="service" value={form.service} onChange={handle}>
          <option>Wedding Photography</option>
          <option>Portrait Session</option>
          <option>Events Coverage</option>
          <option>Commercial Shoot</option>
          <option>Frames & Prints</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea className="form-control" name="message" rows={3} placeholder="Tell us about your vision..." value={form.message} onChange={handle} />
      </div>
      <button className="btn-wa btn-full" onClick={send}>📱 Send via WhatsApp</button>
    </>
  );
}