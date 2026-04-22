import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Users, CalendarClock,
  UserCircle, LogOut, Menu, X, ChevronRight, Bell,
} from 'lucide-react';
import './Layout.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',  adminOnly: false },
  { to: '/employees', icon: Users,            label: 'Employees',  adminOnly: true  },
  { to: '/leaves',    icon: CalendarClock,    label: 'Leaves',     adminOnly: false },
  { to: '/profile',   icon: UserCircle,       label: 'My Profile', adminOnly: false },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const visibleNav = NAV_ITEMS.filter(n => !n.adminOnly || isAdmin);
  const initials   = user?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2"  y="7" width="9" height="10" rx="1" fill="currentColor" opacity=".7" />
                <rect x="13" y="3" width="9" height="18" rx="1" fill="currentColor" />
              </svg>
            </div>
            <span>EmpAxis</span>
          </div>
          <button className="btn btn-icon sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={13} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username}</div>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-employee'}`}
              style={{ fontSize: 10, padding: '2px 7px' }}>
              {isAdmin ? 'Admin' : 'Employee'}
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="main">
        <header className="topbar">
          <button
            className="btn btn-icon topbar-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="topbar-right">
            <button className="btn btn-icon" style={{ color: 'var(--text-muted)' }}>
              <Bell size={18} />
            </button>
            <div className="avatar">{initials}</div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}