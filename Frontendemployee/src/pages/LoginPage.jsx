import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2"  y="7" width="9" height="10" rx="1" fill="currentColor" opacity=".7" />
              <rect x="13" y="3" width="9" height="18" rx="1" fill="currentColor" />
            </svg>
          </div>
          <span className="login-logo-text">EmpAxis</span>
        </div>

        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">Access your workspace</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="input"
              name="username"
              autoComplete="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 4,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--danger-dim)', border: '1px solid #ef444433',
              borderRadius: 'var(--radius-sm)', padding: '8px 12px',
              color: 'var(--danger)', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading
              ? <div className="spinner" />
              : <><LogIn size={16} /> Sign In</>
            }
          </button>
        </form>

        {/* Demo hint */}
        <div className="login-hint">
          <p>Demo credentials</p>
          <div className="login-creds">
            <span><strong>Admin:</strong> admin / admin123</span>
            <span><strong>Employee:</strong> john / emp123</span>
          </div>
        </div>
      </div>
    </div>
  );
}