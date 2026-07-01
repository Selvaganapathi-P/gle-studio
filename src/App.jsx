import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import useScrollReveal from './hooks/useScrollReveal';
import WelcomeIntro from './components/WelcomeIntro';

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

// ── Page transition variants ──────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

// ── Layout ────────────────────────────────────────────────────
const PublicLayout = ({ children }) => {
  const location = useLocation();
  useScrollReveal();
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="fm-page"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WelcomeIntro />
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