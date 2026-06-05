import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// ── Shared Components ─────────────────────────────────────────
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── Public Pages ──────────────────────────────────────────────
import Home     from './pages/Home';
import Services from './pages/Services';
import Gallery  from './pages/Gallery';
import Frames   from './pages/Frames';
import Booking  from './pages/Booking';
import Login    from './pages/Login';
import Register from './pages/Register';

// ── Protected User Pages ──────────────────────────────────────
import Dashboard from './pages/Dashboard';
import Profile   from './pages/Profile';

// ── Admin Pages ───────────────────────────────────────────────
import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminGallery   from './pages/admin/AdminGallery';
import AdminFrames    from './pages/admin/AdminFrames';
import AdminClients   from './pages/admin/AdminClients';
import AdminStaff     from './pages/admin/AdminStaff';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings  from './pages/admin/AdminSettings';
import AdminPages     from './pages/admin/AdminPages';
import AdminServices  from './pages/admin/AdminServices';

// ── Shared Spinner ────────────────────────────────────────────
const Spinner = () => (
  <div className="spinner-wrap"><div className="spinner" /></div>
);

// ── Route Guards ──────────────────────────────────────────────

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  return children;
};

// ── Layout ────────────────────────────────────────────────────
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="page-wrapper">{children}</div>
    <Footer />
  </>
);

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem' },
          }}
        />
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"         element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/gallery"  element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/frames"   element={<PublicLayout><Frames /></PublicLayout>} />
          <Route path="/booking"  element={<PublicLayout><Booking /></PublicLayout>} />

          {/* ── Guest Only ── */}
          <Route path="/login"
            element={<GuestRoute><PublicLayout><Login /></PublicLayout></GuestRoute>}
          />
          <Route path="/register"
            element={<GuestRoute><PublicLayout><Register /></PublicLayout></GuestRoute>}
          />

          {/* ── Protected User Routes ── */}
          <Route path="/dashboard"
            element={<PrivateRoute><PublicLayout><Dashboard /></PublicLayout></PrivateRoute>}
          />
          <Route path="/profile"
            element={<PrivateRoute><PublicLayout><Profile /></PublicLayout></PrivateRoute>}
          />

          {/* ── Admin Routes ── */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index              element={<AdminDashboard />} />
            <Route path="orders"      element={<AdminOrders />} />
            <Route path="gallery"     element={<AdminGallery />} />
            <Route path="frames"      element={<AdminFrames />} />
            <Route path="services"    element={<AdminServices />} />
            <Route path="clients"     element={<AdminClients />} />
            <Route path="staff"       element={<AdminStaff />} />
            <Route path="analytics"   element={<AdminAnalytics />} />
            <Route path="settings"    element={<AdminSettings />} />
            <Route path="pages"       element={<AdminPages />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}