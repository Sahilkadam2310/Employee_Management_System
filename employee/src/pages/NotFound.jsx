import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'var(--bg-base)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 110,
        fontWeight: 800, color: 'var(--border-light)', lineHeight: 1,
      }}>
        404
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>
        Page not found
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}