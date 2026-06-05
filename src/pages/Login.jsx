import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      // Redirect back to where they came from, or default
      if (state?.redirectTo) {
        navigate(state.redirectTo, { state: { service: state.service } });
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad">
      <div className="container-sm" style={{ maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="section-tag">Welcome Back</span>
          <h2 className="section-title">Sign In to <em>GLE Studio</em></h2>
          <div className="divider center"></div>
        </div>
        <div className="form-section">
          {error && <div className="alert alert-danger">{error}</div>}
          {state?.redirectTo && (
            <div className="alert" style={{ background: 'var(--gold-pale)', color: 'var(--dark)', marginBottom: '1rem', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
              🔐 Please sign in to complete your booking
            </div>
          )}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" name="email" type="email" placeholder="your@email.com"
                value={form.email} onChange={handle} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handle} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="card-flat" style={{ marginTop: '1.5rem', padding: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Fill</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setForm({ email: 'admin@glestudio.com', password: 'Admin@123' })}>
                🔧 Admin Login
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" state={state} style={{ color: 'var(--gold)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const { state }    = useLocation();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success(`Welcome to GLE Studio, ${user.name.split(' ')[0]}!`);
      // Redirect back to booking if came from services
      if (state?.redirectTo) {
        navigate(state.redirectTo, { state: { service: state.service } });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad">
      <div className="container-sm" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="section-tag">Join Us</span>
          <h2 className="section-title">Create Your <em>Account</em></h2>
          <div className="divider center"></div>
        </div>
        <div className="form-section">
          {error && <div className="alert alert-danger">{error}</div>}
          {state?.redirectTo && (
            <div className="alert" style={{ background: 'var(--gold-pale)', color: 'var(--dark)', marginBottom: '1rem', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
              🎯 Create an account to book <strong>{state.service}</strong>
            </div>
          )}
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" name="name" placeholder="Priya Sharma" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handle} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-control" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-control" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input className="form-control" name="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={handle} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" state={state} style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;