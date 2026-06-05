import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PACKAGES = [
  { icon: '💍', title: 'Wedding Photography',     price: '₹45,000 – ₹1,20,000', minPrice: 45000, desc: 'Full-day cinematic wedding coverage. Includes pre-wedding shoot, ceremony, reception, unlimited edited photos delivered in 21 days.', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80', features: ['Full day coverage','Pre-wedding shoot','300+ edited photos','Online gallery','Printed album'] },
  { icon: '🎭', title: 'Portrait Sessions',        price: '₹8,000 – ₹25,000',    minPrice: 8000,  desc: 'Individual, couple, or family portraits with professional lighting. Studio or outdoor. 2-hour session with 50 edited high-resolution images.', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80', features: ['2-hour session','50 edited photos','Studio or outdoor','Outfit changes','Digital delivery'] },
  { icon: '🎂', title: 'Birthday & Baby Shower',   price: '₹15,000 – ₹35,000',   minPrice: 15000, desc: 'Memorable event photography for birthdays, baby showers, naming ceremonies. 3-hour coverage with 100+ edited images and a digital album.', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=80', features: ['3-hour coverage','100+ edited photos','Candid + posed','Same-day previews','Slideshow'] },
  { icon: '🏢', title: 'Corporate Events',         price: '₹20,000 – ₹60,000',   minPrice: 20000, desc: 'Professional coverage for conferences, product launches, award nights, and team events. Includes headshots, event coverage, and same-day photo delivery.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80', features: ['Full event coverage','Staff headshots','Same-day delivery','Web-ready files','Branded gallery'] },
  { icon: '📦', title: 'Commercial & Product',     price: '₹20,000 – ₹80,000',   minPrice: 20000, desc: 'E-commerce, branding, and editorial photography. White-background, lifestyle, and creative setups. Quick 48-hour turnaround available.', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80', features: ['Product shots','Lifestyle images','White background','48hr turnaround','License included'] },
  { icon: '🌅', title: 'Pre-Wedding / Engagement', price: '₹18,000 – ₹45,000',   minPrice: 18000, desc: 'Romantic pre-wedding shoot at your chosen location — beach, heritage site, or our studio. Half-day session with 80+ edited images.', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80', features: ['Half-day shoot','80+ edited photos','Video highlight','Any location','Same outfits as wedding'] },
];

export function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = pkg => {
    if (!user) navigate('/register', { state: { redirectTo: '/booking', service: pkg.title } });
    else navigate('/booking', { state: { service: pkg.title, amount: pkg.minPrice } });
  };

  return (
    <>
      <div className="page-hero">
        <span className="section-tag">Our Services</span>
        <h1>Photography <em style={{ color: 'var(--gold3)' }}>Packages</em></h1>
        <p>Choose a package that fits your vision. Every booking is customisable.</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {PACKAGES.map((pkg, i) => (
              /* service-pkg-card — CSS handles responsive collapse to 1 col on mobile */
              <div key={pkg.title} className="card service-pkg-card"
                style={{ padding: 0, overflow: 'hidden', display: 'grid',
                  gridTemplateColumns: i % 2 === 0 ? '1fr 1.8fr' : '1.8fr 1fr' }}>
                {i % 2 !== 0 && (
                  <div style={{ padding: '2rem' }}>
                    <ServiceCardBody pkg={pkg} onBook={() => handleBook(pkg)} user={user} />
                  </div>
                )}
                <img src={pkg.img} alt={pkg.title}
                  style={{ width: '100%', height: 320, objectFit: 'cover',
                    order: i % 2 !== 0 ? 1 : 0 }} />
                {i % 2 === 0 && (
                  <div style={{ padding: '2rem' }}>
                    <ServiceCardBody pkg={pkg} onBook={() => handleBook(pkg)} user={user} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCardBody({ pkg, onBook, user }) {
  return (
    <>
      <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{pkg.icon}</div>
      <h3 style={{ marginBottom: '0.5rem' }}>{pkg.title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text2)' }}>{pkg.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {pkg.features.map(f => <span key={f} className="badge badge-gold">{f}</span>)}
      </div>
      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
        {pkg.price}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onBook}>
          {user ? 'Book This Package →' : '🔐 Sign Up to Book →'}
        </button>
        {!user && <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Account required to book</span>}
      </div>
    </>
  );
}

export default Services;