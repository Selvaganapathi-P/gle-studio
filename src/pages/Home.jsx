import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import offBg from '../assets/off.png';
import coupleHands from '../assets/couple_hands.jpeg';

// ── Live hero particles ───────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${4 + ((i * 4.1) % 92)}%`,
  size: 2 + (i % 3),
  delay: (i * 0.38) % 6,
  duration: 3.5 + (i % 5) * 0.7,
  drift: ((i % 2 === 0) ? 1 : -1) * (8 + (i * 7) % 28),
  color: i % 3 === 0 ? '#f9a8d4' : i % 3 === 1 ? '#ec4899' : '#fce7f3',
}));

// ── Hero slideshow image pool (cycles every 3 s) ─────────────
const HERO_POOL = [
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=700&q=85',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=85',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=85',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&q=85',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=85',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=85',
];

// ── Animation helpers ─────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease } },
};

const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.6, ease } },
};

const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.6, ease } },
};

const staggerContainer = (delayChildren = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delayChildren, delayChildren: 0.1 } },
});

function Section({ children, className = '', style = {}, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer(0.1)}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Reveal({ children, variant = fadeUp, style = {}, className = '' }) {
  return (
    <motion.div variants={variant} style={style} className={className}>
      {children}
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────

const SERVICES = [
  { icon: '💍', title: 'Wedding Photography', desc: 'Full-day cinematic coverage of your special day.', price: 'From ₹45,000', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
  { icon: '🎭', title: 'Portrait Sessions',   desc: 'Individual, couple & family portraits.',          price: 'From ₹8,000',  img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80' },
  { icon: '🎉', title: 'Events Coverage',     desc: 'Birthdays, baby showers & corporate events.',    price: 'From ₹15,000', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80' },
  { icon: '📸', title: 'Commercial Shoots',   desc: 'Product, branding & editorial photography.',     price: 'From ₹20,000', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=500&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80',
];

const WHY_US = [
  { icon: '🏆', title: 'Award Winning',  desc: 'Recognised by regional photography associations for excellence in wedding and portrait photography.' },
  { icon: '⚡', title: 'Fast Delivery',  desc: '100+ edited high-res images delivered within 7 days. Rush delivery available for commercial shoots.' },
  { icon: '🎨', title: 'Custom Editing', desc: 'Each photo is individually colour-graded and retouched to match your preferred aesthetic.' },
  { icon: '🤝', title: 'Personal Touch', desc: "We take time to understand your vision before every shoot, ensuring results you'll love." },
];

const TESTIMONIALS = [
  { name: 'Anbu & Pavi', role: 'Wedding, 2024',       text: 'GLE Studio captured our wedding beyond imagination. Every frame feels like a painting — emotional, timeless, and absolutely breathtaking.', stars: 5 },
  { name: 'Dinesh',   role: 'CEO, Infinity Web Tech',  text: 'The commercial shoot exceeded all expectations. Professional, creative, and the images drove real results for our brand.',                   stars: 5 },
  { name: 'Mathesh & Nirmala',  role: 'Baby Shower Session', text: "Our photos are treasures we'll keep forever. The team was so warm and patient — a truly magical experience from start to finish.",           stars: 5 },
];

const SAFE_FB = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&q=80';

// ── Component ─────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-img" />
        <div className="hero-overlay" />

        {/* Live gold + violet + cyan particles rising from bottom */}
        <div className="hero-particles">
          {PARTICLES.map(p => (
            <motion.div
              key={p.id}
              className="hero-particle"
              style={{
                left: p.x, bottom: `${8 + (p.id % 15)}%`,
                width: p.size, height: p.size,
                background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              }}
              animate={{
                y:       [0, -(120 + p.id * 6), -(200 + p.id * 8)],
                x:       [0, p.drift * 0.6, p.drift],
                opacity: [0, 0.9, 0.4, 0],
                scale:   [0.5, 1, 0.4],
              }}
              transition={{
                duration: p.duration,
                delay:    p.delay,
                repeat:   Infinity,
                ease:     'easeOut',
              }}
            />
          ))}
        </div>

        {/* Bottom-left pink orb */}
        <motion.div
          style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,168,212,0.30) 0%, transparent 70%)',
            bottom: -160, left: -140, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
          }}
          animate={{ x: [-10, 30, -10], y: [0, -40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Single straight hero image — right side ── */}
        <div className="hero-3d-wrap">
          <motion.div
            className="hero-single-panel"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease }}
          >
            <img
              src={coupleHands}
              alt="Couple hands"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div className="hero-single-overlay" />
          </motion.div>

        </div>

        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content">
            <motion.div
              className="hero-tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              ✦ Award-Winning Photography Studio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -60, skewX: -6 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease }}
            >
              Every Frame Tells<br />Your <em>Story</em>
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38, ease }}
            >
              Luxury wedding, portrait, and commercial photography — capturing life's most luminous moments with cinematic precision in Tirupattur.
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
            >
              <motion.button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/booking')}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Book a Session</span>
              </motion.button>
              <motion.button
                className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.72)', color: '#1a0a0a', border: '1.5px solid rgba(219,39,119,0.35)', backdropFilter: 'blur(8px)' }}
                onClick={() => navigate('/gallery')}
                whileHover={{ scale: 1.05, y: -3, background: 'rgba(255,255,255,0.92)' }}
                whileTap={{ scale: 0.97 }}
              >
                <span>View Gallery</span>
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease }}
            >
              {[['6K+', 'Happy Clients'], ['7+', 'Years Experience'], ['50K+', 'Photos Delivered']].map(([num, label]) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div className="hero-stat-num">{num}</div>
                  <div className="hero-stat-label">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIMITED TIME OFFER BANNER ── */}
      <section className="offer-banner-section">
        <div className="container">
          <motion.div
            className="offer-banner-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(28,20,7,0.82) 0%, rgba(42,28,11,0.75) 45%, rgba(28,19,7,0.82) 100%), url(${offBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Animated background orbs */}
            <div className="offer-orb offer-orb--left" />
            <div className="offer-orb offer-orb--right" />

            {/* Left — discount badge */}
            <div className="offer-discount-wrap">
              <motion.div
                className="offer-percent"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                50<span>%</span>
              </motion.div>
              <div className="offer-off-label">OFF</div>
              <div className="offer-badge">Limited Time</div>
            </div>

            {/* Divider */}
            <div className="offer-divider" />

            {/* Middle — copy */}
            <div className="offer-copy">
              <div className="offer-eyebrow">✦ Exclusive Seasonal Offer</div>
              <h3 className="offer-title">Book Any Session &amp; Save Big</h3>
              <p className="offer-desc">
                Wedding, portrait, or commercial shoot — get <strong>50% off</strong> your session fee
                when you book before slots run out. Premium quality, unbeatable price.
              </p>
              <ul className="offer-perks">
                {['Free pre-shoot consultation', 'High-res edited gallery', 'Same-day preview shots'].map(p => (
                  <li key={p}><span className="offer-perk-dot">✓</span>{p}</li>
                ))}
              </ul>
            </div>

            {/* Right — CTA */}
            <div className="offer-cta-wrap">
              <div className="offer-urgency">
                <span className="offer-urgency-dot" />
                Only a few slots left this month
              </div>
              <motion.button
                className="btn btn-primary btn-lg offer-cta-btn"
                onClick={() => navigate('/booking')}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Claim Offer →</span>
              </motion.button>
              <div className="offer-note">No hidden charges · Cancel anytime</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-pad section-white">
        <div className="container">
          <Section>
            <Reveal>
              <div className="text-center mb-3">
                <span className="section-tag">What We Offer</span>
                <h2 className="section-title">Our Photography <em>Services</em></h2>
                <div className="divider center" />
                <p className="section-sub" style={{ margin: '0 auto' }}>
                  From intimate portraits to grand celebrations — we craft images that resonate across a lifetime.
                </p>
              </div>
            </Reveal>

            <div className="grid-4 mt-4">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => navigate('/services')}
                  whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(212,168,83,0.30)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <motion.img
                      src={s.img} alt={s.title}
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                      onError={e => { e.currentTarget.src = SAFE_FB; e.currentTarget.onerror = null; }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>{s.title}</h4>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text3)', marginBottom: '0.6rem' }}>{s.desc}</p>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.88rem' }}>{s.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <Reveal>
              <div className="text-center mt-4">
                <motion.button
                  className="btn btn-outline"
                  onClick={() => navigate('/services')}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View All Services →
                </motion.button>
              </div>
            </Reveal>
          </Section>
        </div>
      </section>

      {/* ── FEATURED GALLERY ── */}
      <section className="section-pad section-alt">
        <div className="container">
          <Section>
            <Reveal>
              <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="section-tag">Portfolio</span>
                  <h2 className="section-title">Featured <em>Gallery</em></h2>
                  <div className="divider" />
                </div>
                <motion.button
                  className="btn btn-outline"
                  onClick={() => navigate('/gallery')}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View All Photos →
                </motion.button>
              </div>
            </Reveal>

            <div className="home-gallery-grid">
              {GALLERY_IMGS.map((url, i) => (
                <motion.div
                  key={i}
                  className="home-gallery-cell"
                  variants={fadeUp}
                  custom={i}
                  onClick={() => navigate('/gallery')}
                  whileHover={{ scale: 1.04, zIndex: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <img
                    src={url} alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.src = SAFE_FB; e.currentTarget.onerror = null; }}
                  />
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section-pad section-white">
        <div className="container">
          <Section>
            <Reveal>
              <div className="text-center mb-3">
                <span className="section-tag">Why GLE Studio</span>
                <h2 className="section-title">The <em>GLE Difference</em></h2>
                <div className="divider center" />
              </div>
            </Reveal>

            <div className="grid-4">
              {WHY_US.map((w, i) => (
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  className="glass-card"
                  style={{ padding: '1.75rem', textAlign: 'center' }}
                  whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(212,168,83,0.22)' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <motion.div
                    style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}
                    whileHover={{ scale: 1.2, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    {w.icon}
                  </motion.div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{w.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad section-alt">
        <div className="container">
          <Section>
            <Reveal>
              <div className="text-center mb-3">
                <span className="section-tag">Client Stories</span>
                <h2 className="section-title">What Our <em>Clients Say</em></h2>
                <div className="divider center" />
              </div>
            </Reveal>

            <div className="grid-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  className="testimonial"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                >
                  <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── CTA / CONTACT ── */}
      <section className="section-pad" style={{ background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Section>
            <div className="home-cta-grid">
              <Reveal variant={fadeLeft}>
                <span className="section-tag">Get In Touch</span>
                <h2 className="section-title">Ready to Create <em>Magic Together?</em></h2>
                <div className="divider" />
                {[
                  ['📍', 'Studio Location', 'Golden legacy events, Tirupattur, TN 635901', 'https://maps.app.goo.gl/E5GxpuczcpBS5dyP7'],
                  ['📞', 'Phone / WhatsApp', '+91 6382748663', null],
                  ['⏰', 'Studio Hours',     'Monday – Saturday: 9 AM to 7 PM', null],
                ].map(([icon, label, val, link]) => (
                  <motion.div
                    key={label}
                    className="contact-item"
                    whileHover={{ x: 6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{ cursor: link ? 'pointer' : 'default' }}
                    onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="contact-icon">{icon}</div>
                    <div>
                      <div className="contact-label">{label}</div>
                      <div className="contact-value" style={link ? { textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' } : {}}>{val}</div>
                    </div>
                  </motion.div>
                ))}
              </Reveal>

              <Reveal variant={fadeRight}>
                <div className="form-section">
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Quick Enquiry</h3>
                  <QuickEnquiryForm />
                </div>
              </Reveal>
            </div>
          </Section>
        </div>
      </section>
    </>
  );
}

// ── Quick Enquiry Form ────────────────────────────────────────

function QuickEnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: 'Wedding Photography', message: '' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const send = () => {
    if (!form.name || !form.phone) { alert('Please enter name and phone'); return; }
    const msg = encodeURIComponent(
      `Hi GLE Studio! I'd like to enquire about ${form.service}.\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`
    );
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
          <option>Frames &amp; Prints</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea className="form-control" name="message" rows={3} placeholder="Tell us about your vision..." value={form.message} onChange={handle} />
      </div>
      <motion.button
        className="btn-wa btn-full"
        onClick={send}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        📱 Send via WhatsApp
      </motion.button>
    </>
  );
}
