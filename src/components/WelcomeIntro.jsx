import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMERALD_DEEP = '#0a1f17';
const EMERALD_MID  = '#1a5c42';
const GOLD         = '#b8862a';
const GOLD_LIGHT   = '#f0c468';

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size:  [3,2,4,2,5,3,2,4,3,2,5,3,2,4][i],
  left:  [8,15,22,30,38,45,53,62,70,78,85,92,18,68][i] + '%',
  delay: [0,1,2.5,0.5,3,1.5,4,0.8,2,3.5,1.2,5,2.2,0.3][i],
  dur:   [9,12,7,15,10,8,11,6,13,9,14,8,10,7][i],
}));

export default function WelcomeIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('gle_visited')) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        localStorage.setItem('gle_visited', '1');
      }, 3800);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${EMERALD_DEEP} 0%, ${EMERALD_MID} 55%, ${EMERALD_DEEP} 100%)`,
            overflow: 'hidden',
          }}
        >
          {/* Gold particle field */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.size, height: p.size,
                left: p.left, bottom: '-8px',
                borderRadius: '50%',
                background: GOLD_LIGHT,
                pointerEvents: 'none',
              }}
              animate={{
                y: [0, -180],
                opacity: [0, 0.85, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Corner accent lines */}
          {[
            { top: 24, left: 24, borderTop: `1.5px solid ${GOLD}`, borderLeft: `1.5px solid ${GOLD}` },
            { top: 24, right: 24, borderTop: `1.5px solid ${GOLD}`, borderRight: `1.5px solid ${GOLD}` },
            { bottom: 24, left: 24, borderBottom: `1.5px solid ${GOLD}`, borderLeft: `1.5px solid ${GOLD}` },
            { bottom: 24, right: 24, borderBottom: `1.5px solid ${GOLD}`, borderRight: `1.5px solid ${GOLD}` },
          ].map((style, i) => (
            <motion.div
              key={i}
              style={{ position: 'absolute', width: 56, height: 56, ...style }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}

          {/* Orbiting ring */}
          <motion.div
            style={{
              position: 'absolute',
              width: 340, height: 340,
              borderRadius: '50%',
              border: `1px solid rgba(99,102,241,0.12)`,
              pointerEvents: 'none',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            style={{
              position: 'absolute',
              width: 220, height: 220,
              borderRadius: '50%',
              border: `1px dashed rgba(99,102,241,0.18)`,
              pointerEvents: 'none',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />

          {/* GLE Monogram */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280, delay: 0.15 }}
            style={{
              fontFamily: 'Playfair Display, Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 8vw, 4.5rem)',
              fontWeight: 800,
              background: `linear-gradient(135deg, #7a5810 0%, ${GOLD} 30%, ${GOLD_LIGHT} 55%, ${GOLD} 80%, #7a5810 100%)`,
              backgroundSize: '300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.18em',
              marginBottom: '1.25rem',
            }}
          >
            GLE
          </motion.div>

          {/* Top rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 1,
              width: 'min(220px, 55vw)',
              background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
              marginBottom: '1.5rem',
              transformOrigin: 'center',
            }}
          />

          {/* Studio name words */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.85rem' }}>
            {['Golden', 'Legacy', 'Event'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.13, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                  fontWeight: 700,
                  color: i === 2 ? GOLD_LIGHT : '#ffffff',
                  letterSpacing: '0.06em',
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.72rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: 'Outfit, system-ui, sans-serif',
              margin: 0,
            }}
          >
            Photography &amp; Events · Tirupattur
          </motion.p>

          {/* Bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 1,
              width: 'min(220px, 55vw)',
              background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
              marginTop: '1.5rem',
              transformOrigin: 'center',
            }}
          />

          {/* Loading dot trail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD }}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
