import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/gl_studio_.png';   // ← logo import

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Home',     path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery',  path: '/gallery' },
    { label: 'Frames',   path: '/frames' },
    { label: 'Book Now', path: '/booking' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
    setMobileOpen(false);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo */}
          <div className="navbar-logo" onClick={() => { navigate('/'); setMobileOpen(false); }}>
            <img src={logo} alt="Golden Legacy Event" className="navbar-logo-img" />
            <div className="navbar-logo-text">
              <span className="navbar-logo-name">Golden Legacy Event</span>
              <span className="navbar-logo-sub">Photography &amp; Events</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="navbar-links">
            {links.map(l => (
              <button key={l.path} className={`nav-link${isActive(l.path) ? ' active' : ''}`} onClick={() => navigate(l.path)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                {isAdmin && (
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>Admin Panel</button>
                )}
                <button className="nav-link" onClick={() => navigate('/dashboard')}>My Orders</button>
                <div className="avatar" onClick={() => navigate('/profile')} title={user.name}>{initials}</div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Join Us</button>
              </>
            )}
            {/* Hamburger */}
            <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {links.map(l => (
          <button key={l.path} className={`nav-link${isActive(l.path) ? ' active' : ''}`}
            onClick={() => { navigate(l.path); setMobileOpen(false); }}>
            {l.label}
          </button>
        ))}
        <hr style={{ borderColor: 'var(--bg3)', margin: '0.5rem 0' }} />
        {user ? (
          <>
            {isAdmin && <button className="nav-link" onClick={() => { navigate('/admin'); setMobileOpen(false); }}>Admin Panel</button>}
            <button className="nav-link" onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>My Orders</button>
            <button className="nav-link" onClick={() => { navigate('/profile'); setMobileOpen(false); }}>Profile</button>
            <button className="btn btn-ghost btn-sm mt-2" style={{width:'100%'}} onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" style={{width:'100%'}} onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</button>
            <button className="btn btn-primary btn-sm mt-1" style={{width:'100%'}} onClick={() => { navigate('/register'); setMobileOpen(false); }}>Join Us</button>
          </>
        )}
      </div>
    </>
  );
}