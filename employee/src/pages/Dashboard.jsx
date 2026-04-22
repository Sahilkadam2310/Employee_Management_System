import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, leaveAPI } from '../services/api';
import { Users, UserCheck, Clock, Building2, TrendingUp, CalendarClock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [leaves,  setLeaves]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests = isAdmin
      ? [employeeAPI.getStats(), leaveAPI.getAll()]
      : [Promise.resolve({ data: {} }), leaveAPI.getMy()];

    Promise.all(requests)
      .then(([s, l]) => { setStats(s.data); setLeaves(l.data.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const chartData = [
    { name: 'Pending',  value: leaves.filter(l => l.status === 'PENDING').length,  color: '#f59e0b' },
    { name: 'Approved', value: leaves.filter(l => l.status === 'APPROVED').length, color: '#10b981' },
    { name: 'Rejected', value: leaves.filter(l => l.status === 'REJECTED').length, color: '#ef4444' },
  ];

  if (loading) return (
    <div>
      <div className="stat-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ height: 36, width: 36, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 12, width: 90, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 28, width: 50, marginTop: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back,{' '}
            <strong style={{ color: 'var(--accent)' }}>{user?.username}</strong>
          </p>
        </div>
      </div>

      {/* Stat cards — Admin only */}
      {isAdmin && stats && (
        <div className="stat-grid">
          <StatCard icon={<Users size={20} />}      label="Total Employees" value={stats.totalEmployees}  color="var(--accent)"  />
          <StatCard icon={<UserCheck size={20} />}  label="Active"          value={stats.activeEmployees} color="var(--success)" />
          <StatCard icon={<Clock size={20} />}      label="On Leave"        value={stats.onLeave}         color="var(--info)"    />
          <StatCard icon={<Building2 size={20} />}  label="Departments"     value={stats.departments}     color="var(--warning)" />
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Bar chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <TrendingUp size={17} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              {isAdmin ? 'Leave Overview' : 'My Leave Status'}
            </span>
          </div>
          {leaves.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <CalendarClock size={36} />
              <p>No leave data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={chartData} barSize={44}>
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}
                  cursor={{ fill: '#ffffff08' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent leaves */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <CalendarClock size={17} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              Recent Requests
            </span>
          </div>
          {leaves.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <CalendarClock size={36} />
              <p>No leave requests</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {leaves.map(l => (
                <div key={l.id} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 12px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                    {(l.employeeName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.employeeName || 'Employee'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.leaveType}</div>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
    </div>
  );
}