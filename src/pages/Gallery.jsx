import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const SAFE_FALLBACK  = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80';
const DEFAULT_CATS   = ['All', 'Wedding', 'Portrait', 'Events', 'Commercial'];

const isPhoto = url =>
  url && (url.startsWith('https://') || url.startsWith('http://') ||
    (url.startsWith('/uploads/') && /\.(jpg|jpeg|png|webp|gif)$/i.test(url)));

const ease = [0.22, 1, 0.36, 1];

export default function Gallery() {
  const [photos,   setPhotos]   = useState(FALLBACK);
  const [cats,     setCats]     = useState(DEFAULT_CATS);
  const [cat,      setCat]      = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/gallery')
      .then(r => {
        const adminPhotos = r.data.filter(p => isPhoto(p.imageUrl));
        if (adminPhotos.length > 0) {
          const uploadedCats = [...new Set(adminPhotos.map(p => p.category))];
          setCats(['All', ...new Set([...DEFAULT_CATS.slice(1), ...uploadedCats])]);
          const adminCatSet = new Set(adminPhotos.map(p => p.category));
          setPhotos([...adminPhotos, ...FALLBACK.filter(f => !adminCatSet.has(f.category))]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = cat === 'All' ? photos : photos.filter(p => p.category === cat);

  const closeLb = () => setLightbox(null);
  const prevLb  = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const nextLb  = () => setLightbox(i => (i + 1) % filtered.length);

  useEffect(() => {
    const onKey = e => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  prevLb();
      if (e.key === 'ArrowRight') nextLb();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, filtered.length]);

  return (
    <>
      {/* Page hero */}
      <div className="page-hero">
        <motion.span
          className="section-tag"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Portfolio
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
        >
          Our <em style={{ color: 'var(--gold3)' }}>Gallery</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
        >
          A showcase of moments captured — weddings, portraits, events &amp; commercial work.
        </motion.p>
      </div>

      <section className="section-pad">
        <div className="container">

          {/* Category filters */}
          <motion.div
            className="gallery-filters"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            {cats.map(c => (
              <motion.button
                key={c}
                className={`filter-btn${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {c}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                className="gallery-masonry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((photo, idx) => (
                  <motion.div
                    key={photo._id}
                    className="gallery-item"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1,    y: 0 }}
                    transition={{ duration: 0.45, delay: (idx % 8) * 0.055, ease }}
                    onClick={() => setLightbox(idx)}
                    whileHover={{ scale: 1.03, zIndex: 2 }}
                    layout
                  >
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
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-state-icon">📷</div>
              <h3>No photos in this category yet</h3>
              <p>Check back soon — we're always shooting!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLb}
          >
            <motion.button
              className="lightbox-close"
              onClick={closeLb}
              whileHover={{ rotate: 90, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              ×
            </motion.button>
            <motion.button
              className="lightbox-nav lightbox-prev"
              onClick={e => { e.stopPropagation(); prevLb(); }}
              whileHover={{ scale: 1.15, x: -4 }}
            >
              ‹
            </motion.button>
            <motion.img
              key={lightbox}
              src={filtered[lightbox]?.imageUrl}
              alt={filtered[lightbox]?.title}
              className="lightbox-img"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease }}
              onClick={e => e.stopPropagation()}
              onError={e => { e.currentTarget.src = SAFE_FALLBACK; e.currentTarget.onerror = null; }}
            />
            <motion.button
              className="lightbox-nav lightbox-next"
              onClick={e => { e.stopPropagation(); nextLb(); }}
              whileHover={{ scale: 1.15, x: 4 }}
            >
              ›
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem',
                background: 'rgba(10,31,23,0.7)', backdropFilter: 'blur(8px)',
                padding: '0.4rem 1.2rem', borderRadius: '40px',
                border: '1px solid rgba(184,134,42,0.2)',
              }}
            >
              {filtered[lightbox]?.title} &nbsp;·&nbsp; {lightbox + 1} / {filtered.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
