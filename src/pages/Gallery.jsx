import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FALLBACK = [
  { _id: 'f1',  title: 'Wedding Ceremony',   category: 'Wedding',    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
  { _id: 'f2',  title: 'Bridal Portrait',     category: 'Wedding',    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80' },
  { _id: 'f3',  title: 'Ring Exchange',       category: 'Wedding',    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80' },
  { _id: 'f4',  title: 'Wedding Dance',       category: 'Wedding',    imageUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80' },
  { _id: 'f5',  title: 'Wedding Flowers',     category: 'Wedding',    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80' },
  { _id: 'f6',  title: 'Studio Portrait',     category: 'Portrait',   imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80' },
  { _id: 'f7',  title: 'Family Session',      category: 'Portrait',   imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80' },
  { _id: 'f8',  title: 'Child Portrait',      category: 'Portrait',   imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80' },
  { _id: 'f9',  title: 'Outdoor Portrait',    category: 'Portrait',   imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80' },
  { _id: 'f10', title: 'Birthday Party',      category: 'Events',     imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80' },
  { _id: 'f11', title: 'Baby Shower',         category: 'Events',     imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { _id: 'f12', title: 'Corporate Gala',      category: 'Events',     imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { _id: 'f13', title: 'Concert Night',       category: 'Events',     imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
  { _id: 'f14', title: 'Product Shoot',       category: 'Commercial', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  { _id: 'f15', title: 'Brand Campaign',      category: 'Commercial', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
  { _id: 'f16', title: 'Food Photography',    category: 'Commercial', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
  { _id: 'f17', title: 'Fashion Editorial',   category: 'Commercial', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80' },
  { _id: 'f18', title: 'Watch Product Shoot', category: 'Commercial', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e0f411?w=800&q=80' },
];

const SAFE_FALLBACK = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80';
const DEFAULT_CATS  = ['All', 'Wedding', 'Portrait', 'Events', 'Commercial'];

const isPhoto = url =>
  url && (
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    (url.startsWith('/uploads/') && /\.(jpg|jpeg|png|webp|gif)$/i.test(url))
  );

export default function Gallery() {
  const [photos, setPhotos]     = useState(FALLBACK);
  const [cats, setCats]         = useState(DEFAULT_CATS);
  const [cat, setCat]           = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/gallery')
      .then(r => {
        const adminPhotos = r.data.filter(p => isPhoto(p.imageUrl));
        if (adminPhotos.length > 0) {
          // Build dynamic categories from actual uploaded photos
          const uploadedCats = [...new Set(adminPhotos.map(p => p.category))];
          // Merge with default cats, keeping All first
          const merged = ['All', ...new Set([...DEFAULT_CATS.slice(1), ...uploadedCats])];
          setCats(merged);

          const adminCatSet = new Set(adminPhotos.map(p => p.category));
          const fillIn = FALLBACK.filter(f => !adminCatSet.has(f.category));
          setPhotos([...adminPhotos, ...fillIn]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = cat === 'All' ? photos : photos.filter(p => p.category === cat);

  const closeLb = () => setLightbox(null);
  const prevLb  = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const nextLb  = () => setLightbox(i => (i + 1) % filtered.length);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = e => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  prevLb();
      if (e.key === 'ArrowRight') nextLb();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, filtered.length]);

  return (
    <>
      <div className="page-hero">
        <span className="section-tag">Portfolio</span>
        <h1>Our <em style={{ color: 'var(--gold3)' }}>Gallery</em></h1>
        <p>A showcase of moments captured — weddings, portraits, events & commercial work.</p>
      </div>

      <section className="section-pad">
        <div className="container">

          {/* Dynamic category filters */}
          <div className="gallery-filters">
            {cats.map(c => (
              <button
                key={c}
                className={`filter-btn${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="gallery-masonry">
              {filtered.map((photo, idx) => (
                <div key={photo._id} className="gallery-item" onClick={() => setLightbox(idx)}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    onError={e => {
                      const same = FALLBACK.find(f => f.category === photo.category && f.imageUrl !== photo.imageUrl);
                      e.currentTarget.src = same ? same.imageUrl : SAFE_FALLBACK;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-title">{photo.title} · {photo.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📷</div>
              <h3>No photos in this category yet</h3>
              <p>Check back soon — we're always shooting!</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox-backdrop" onClick={closeLb}>
          <button className="lightbox-close" onClick={closeLb}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); prevLb(); }}>‹</button>
          <img
            src={filtered[lightbox]?.imageUrl}
            alt={filtered[lightbox]?.title}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
            onError={e => { e.currentTarget.src = SAFE_FALLBACK; e.currentTarget.onerror = null; }}
          />
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); nextLb(); }}>›</button>
          <div style={{
            position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem',
            background: 'rgba(0,0,0,0.5)', padding: '0.4rem 1rem', borderRadius: '40px',
          }}>
            {filtered[lightbox]?.title} &nbsp;·&nbsp; {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}