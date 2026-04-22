import React, { useEffect, useState, useCallback } from 'react';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import EmployeeModal from '../components/EmployeeModal';
import StatusBadge   from '../components/StatusBadge';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(null); // null | 'create' | employee object
  const [deleting,  setDeleting]  = useState(null);

  const loadEmployees = useCallback(() => {
    setLoading(true);
    employeeAPI.getAll()
      .then(r  => setEmployees(r.data))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const filtered = employees.filter(e =>
    !search ||
    `${e.firstName} ${e.lastName} ${e.email} ${e.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deleted');
      loadEmployees();
    } catch {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} team members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Search toolbar */}
      <div className="card" style={{ marginBottom: 18, padding: '12px 14px' }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={14} style={{
            position: 'absolute', left: 11, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
            pointerEvents: 'none',
          }} />
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            placeholder="Search name, email, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Employee', 'Department', 'Position', 'Status', 'Joined', 'Salary', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 13, width: j === 0 ? 160 : 70 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <Users size={40} />
                      <p>No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id}>
                    {/* Employee name + avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            @{emp.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.department || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.position   || '—'}</td>
                    <td><StatusBadge status={emp.status || 'ACTIVE'} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : '—'}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {emp.salary ? `₹${emp.salary.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-icon btn-secondary btn-sm"
                          onClick={() => setModal(emp)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger btn-sm"
                          onClick={() => handleDelete(emp.id)}
                          disabled={deleting === emp.id}
                          title="Delete"
                        >
                          {deleting === emp.id
                            ? <div className="spinner" style={{ width: 13, height: 13 }} />
                            : <Trash2 size={14} />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <EmployeeModal
          employee={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadEmployees(); }}
        />
      )}
    </div>
  );
}