import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'Dashboard',  path: '/admin',          icon: '📊', section: null },
  { label: 'All Orders', path: '/admin/orders',    icon: '📋', section: 'Orders' },
  { label: 'Gallery',    path: '/admin/gallery',   icon: '🖼️', section: 'Content' },
  { label: 'Frames',     path: '/admin/frames',    icon: '🗃️', section: 'Content' },
  { label: 'Services',   path: '/admin/services',  icon: '📸', section: 'Content' },
  { label: 'Clients',    path: '/admin/clients',   icon: '👥', section: 'People' },
  { label: 'Staff',      path: '/admin/staff',     icon: '🧑‍💼', section: 'People' },
  { label: 'Analytics',  path: '/admin/analytics', icon: '📈', section: 'Reports' },
  { label: 'Settings',   path: '/admin/settings',  icon: '⚙️', section: 'System' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Signed out'); navigate('/'); };
  const isActive = path => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const sections = [];
  const seen = new Set();
  NAV.forEach(item => {
    const sec = item.section || '__top__';
    if (!seen.has(sec)) { seen.add(sec); sections.push(sec); }
  });

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'A';

  return (
    <div style={{ paddingTop: 68 }}>

      {/* Mobile toggle bar — shown via CSS on small screens */}
      <div className="admin-mobile-bar">
        <span style={{ color: 'var(--gold3)', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}>
          ⚡ Admin Panel
        </span>
        <button
          className="admin-mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.85rem' }}>{initials}</div>
              <div>
                <div className="logo-name">GLE Studio</div>
                <div className="logo-role">Admin Panel</div>
              </div>
            </div>
          </div>

          {sections.map(sec => (
            <div key={sec}>
              {sec !== '__top__' && <div className="sidebar-section-label">{sec}</div>}
              {NAV.filter(n => (n.section || '__top__') === sec).map(item => (
                <div key={item.path}
                  className={`sidebar-link${isActive(item.path) ? ' active' : ''}`}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="sidebar-link" onClick={() => { navigate('/'); setMobileOpen(false); }}>
              <span className="sidebar-link-icon">🏠</span> View Site
            </div>
            <div className="sidebar-link" style={{ color: '#f87171' }} onClick={handleLogout}>
              <span className="sidebar-link-icon">🚪</span> Sign Out
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}