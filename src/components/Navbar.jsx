import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/gl_studio_.png';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Detect scroll for glass intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home',     path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery',  path: '/gallery' },
    { label: 'Frames',   path: '/frames' },
    { label: 'Book Now', path: '/booking' },
  ];

  const isActive = path => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -68, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled
            ? 'rgba(8,9,14,0.95)'
            : 'rgba(8,9,14,0.68)',
          boxShadow: scrolled
            ? '0 4px 40px rgba(0,0,0,0.60), 0 1px 0 rgba(232,184,75,0.12)'
            : 'none',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          borderBottom: scrolled
            ? '1px solid rgba(232,184,75,0.18)'
            : '1px solid rgba(255,255,255,0.04)',
          transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div className="navbar-inner">

          {/* Logo */}
          <motion.div
            className="navbar-logo"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <img src={logo} alt="Golden Legacy Event" className="navbar-logo-img" />
            <div className="navbar-logo-text">
              <span className="navbar-logo-name">Golden Legacy Event</span>
              <span className="navbar-logo-sub">Photography &amp; Events</span>
            </div>
          </motion.div>

          {/* Desktop Links */}
          <div className="navbar-links">
            {links.map((l, i) => (
              <motion.button
                key={l.path}
                className={`nav-link${isActive(l.path) ? ' active' : ''}`}
                onClick={() => navigate(l.path)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                whileHover={{ y: -2 }}
                style={{ position: 'relative' }}
              >
                {l.label}
                {isActive(l.path) && (
                  <motion.span
                    layoutId="nav-active-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--gold-pale)',
                      borderRadius: 'var(--radius-sm)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                {isAdmin && (
                  <motion.button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate('/admin')}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Admin Panel
                  </motion.button>
                )}
                <motion.button
                  className="nav-link"
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ y: -2 }}
                >
                  My Orders
                </motion.button>
                <motion.div
                  className="avatar"
                  onClick={() => navigate('/profile')}
                  title={user.name}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {initials}
                </motion.div>
                <motion.button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.04 }}
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.04 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/register')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Join Us
                </motion.button>
              </>
            )}

            {/* Animated hamburger */}
            <motion.div
              className="hamburger"
              onClick={() => setMobileOpen(v => !v)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -12,  scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.path}
                className={`nav-link${isActive(l.path) ? ' active' : ''}`}
                onClick={() => navigate(l.path)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {l.label}
              </motion.button>
            ))}
            <hr style={{ borderColor: 'var(--bg3)', margin: '0.5rem 0' }} />
            {user ? (
              <>
                {isAdmin && (
                  <button className="nav-link" onClick={() => navigate('/admin')}>Admin Panel</button>
                )}
                <button className="nav-link" onClick={() => navigate('/dashboard')}>My Orders</button>
                <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
                <button className="btn btn-ghost btn-sm mt-2" style={{ width: '100%' }} onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <button className="btn btn-primary btn-sm mt-1" style={{ width: '100%' }} onClick={() => navigate('/register')}>
                  Join Us
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
