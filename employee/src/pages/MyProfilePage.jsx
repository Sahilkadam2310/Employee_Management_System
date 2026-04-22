import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';
import { Mail, Phone, MapPin, Building2, Briefcase, Calendar, BadgeCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function MyProfilePage() {
  const { user, isAdmin } = useAuth();
  const [emp,     setEmp]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.employeeId) {
      employeeAPI.getById(user.employeeId)
        .then(r  => setEmp(r.data))
        .catch(() => setEmp(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your account information</p>
        </div>
      </div>

      {/* Profile header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16, padding: '22px' }}>
        <div className="avatar" style={{ width: 68, height: 68, fontSize: 22 }}>{initials}</div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
            {emp ? `${emp.firstName} ${emp.lastName}` : user?.username}
          </h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-employee'}`}>
              <BadgeCheck size={12} /> {isAdmin ? 'Administrator' : 'Employee'}
            </span>
            {emp?.department && <span className="badge badge-employee">{emp.department}</span>}
            {emp?.status     && <StatusBadge status={emp.status} />}
          </div>
        </div>
      </div>

      {/* Account section */}
      <div className="card" style={{ marginBottom: 14 }}>
        <SectionTitle>Account</SectionTitle>
        <InfoRow icon={<BadgeCheck size={15} />} label="Username" value={`@${user?.username}`} />
        <InfoRow icon={<BadgeCheck size={15} />} label="Role"     value={isAdmin ? 'Administrator' : 'Employee'} />
      </div>

      {emp ? (
        <>
          {/* Contact section */}
          <div className="card" style={{ marginBottom: 14 }}>
            <SectionTitle>Contact</SectionTitle>
            <InfoRow icon={<Mail     size={15} />} label="Email"   value={emp.email}   />
            <InfoRow icon={<Phone    size={15} />} label="Phone"   value={emp.phone}   />
            <InfoRow icon={<MapPin   size={15} />} label="Address" value={emp.address} />
          </div>

          {/* Employment section */}
          <div className="card">
            <SectionTitle>Employment</SectionTitle>
            <InfoRow icon={<Building2 size={15} />} label="Department"   value={emp.department} />
            <InfoRow icon={<Briefcase size={15} />} label="Position"     value={emp.position}   />
            <InfoRow
              icon={<Calendar size={15} />}
              label="Joining Date"
              value={emp.joiningDate
                ? new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                : null
              }
            />
            <InfoRow
              icon={<span style={{ fontSize: 15, lineHeight: 1 }}>₹</span>}
              label="Salary"
              value={emp.salary ? `₹${emp.salary.toLocaleString('en-IN')} / month` : null}
            />
          </div>
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <BadgeCheck size={40} />
            <p>No employee record linked to this account</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
      marginBottom: 12, color: 'var(--text-primary)',
    }}>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '9px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, color: value ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: 2 }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
}