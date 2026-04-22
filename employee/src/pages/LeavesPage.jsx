import React, { useEffect, useState, useCallback } from 'react';
import { leaveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, CalendarClock, Check, X, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const LEAVE_TYPES = ['SICK','CASUAL','ANNUAL','UNPAID','MATERNITY','PATERNITY'];
const EMPTY_FORM  = { startDate: '', endDate: '', leaveType: 'SICK', reason: '' };

export default function LeavesPage() {
  const { isAdmin } = useAuth();
  const [leaves,   setLeaves]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [acting,   setActing]   = useState(null);
  const [filter,   setFilter]   = useState('ALL');

  const loadLeaves = useCallback(() => {
    setLoading(true);
    const req = isAdmin ? leaveAPI.getAll() : leaveAPI.getMy();
    req.then(r  => setLeaves(r.data))
       .catch(() => toast.error('Failed to load leaves'))
       .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => { loadLeaves(); }, [loadLeaves]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const applyLeave = async e => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) { toast.error('Please select start and end dates'); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { toast.error('End date must be after start date'); return; }
    setSaving(true);
    try {
      await leaveAPI.apply(form);
      toast.success('Leave request submitted');
      setShowForm(false);
      setForm(EMPTY_FORM);
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (id, action) => {
    setActing(id + action);
    try {
      if (action === 'approve') {
        await leaveAPI.approve(id, { comment: 'Approved' });
        toast.success('Leave approved');
      } else if (action === 'reject') {
        const comment = window.prompt('Reason for rejection (optional):') || '';
        await leaveAPI.reject(id, { comment });
        toast.success('Leave rejected');
      } else if (action === 'cancel') {
        if (!window.confirm('Cancel this leave request?')) { setActing(null); return; }
        await leaveAPI.cancel(id);
        toast.success('Leave request cancelled');
      }
      loadLeaves();
    } catch {
      toast.error('Action failed');
    } finally {
      setActing(null);
    }
  };

  const filtered = filter === 'ALL' ? leaves : leaves.filter(l => l.status === filter);
  const counts   = { ALL: leaves.length, PENDING: 0, APPROVED: 0, REJECTED: 0 };
  leaves.forEach(l => { if (counts[l.status] !== undefined) counts[l.status]++; });

  const daysBetween = (s, e) => {
    if (!s || !e) return 0;
    const d = (new Date(e) - new Date(s)) / 86400000 + 1;
    return d > 0 ? d : 0;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Leave Requests' : 'My Leaves'}</h1>
          <p className="page-subtitle">{leaves.length} total requests</p>
        </div>
        {!isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(p => !p)}>
            <Plus size={16} /> Apply Leave
          </button>
        )}
      </div>

      {/* Apply leave form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            New Leave Request
          </h3>
          <form onSubmit={applyLeave}>
            <div className="form-grid" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="input" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input className="input" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Leave Type</label>
              <select className="select" name="leaveType" value={form.leaveType} onChange={handleChange}>
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Reason</label>
              <textarea className="textarea" name="reason" value={form.reason} onChange={handleChange} placeholder="Brief reason for leave…" />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <div className="spinner" /> : 'Submit Request'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(isAdmin ? 7 : 6)].map((_, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 13, width: j === 0 ? 120 : 60 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6}>
                    <div className="empty-state">
                      <CalendarClock size={40} />
                      <p>No leave requests</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id}>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                            {(l.employeeName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{l.employeeName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.employeeDepartment}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td>
                      <span className="badge badge-employee" style={{ fontSize: 11 }}>{l.leaveType}</span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {new Date(l.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} –{' '}
                      {new Date(l.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
                        {daysBetween(l.startDate, l.endDate)}d
                      </strong>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.reason || '—'}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={l.status} />
                      {l.adminComment && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                          {l.adminComment}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {isAdmin && l.status === 'PENDING' && (<>
                          <button
                            className="btn btn-icon btn-success btn-sm"
                            onClick={() => handleAction(l.id, 'approve')}
                            disabled={!!acting}
                            title="Approve"
                          >
                            {acting === l.id + 'approve'
                              ? <div className="spinner" style={{ width: 13, height: 13 }} />
                              : <Check size={14} />
                            }
                          </button>
                          <button
                            className="btn btn-icon btn-danger btn-sm"
                            onClick={() => handleAction(l.id, 'reject')}
                            disabled={!!acting}
                            title="Reject"
                          >
                            {acting === l.id + 'reject'
                              ? <div className="spinner" style={{ width: 13, height: 13 }} />
                              : <X size={14} />
                            }
                          </button>
                        </>)}
                        {!isAdmin && l.status === 'PENDING' && (
                          <button
                            className="btn btn-icon btn-danger btn-sm"
                            onClick={() => handleAction(l.id, 'cancel')}
                            disabled={!!acting}
                            title="Cancel request"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                        {l.status !== 'PENDING' && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}