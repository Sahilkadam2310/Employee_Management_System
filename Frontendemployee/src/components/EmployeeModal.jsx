import React, { useState } from 'react';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const DEPARTMENTS = ['Engineering','HR','Finance','Marketing','Sales','Operations','Design','Legal'];
const POSITIONS   = ['Manager','Senior Developer','Developer','Analyst','Designer','Executive','Intern','Director'];
const STATUSES    = ['ACTIVE','INACTIVE','ON_LEAVE'];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  department: '', position: '', salary: '',
  joiningDate: '', address: '', status: 'ACTIVE',
  username: '', password: '',
};

export default function EmployeeModal({ employee, onClose, onSaved }) {
  const isEdit = !!employee;

  const [form, setForm] = useState(isEdit ? {
    firstName:   employee.firstName   || '',
    lastName:    employee.lastName    || '',
    email:       employee.email       || '',
    phone:       employee.phone       || '',
    department:  employee.department  || '',
    position:    employee.position    || '',
    salary:      employee.salary      || '',
    joiningDate: employee.joiningDate || '',
    address:     employee.address     || '',
    status:      employee.status      || 'ACTIVE',
    username:    employee.username    || '',
    password:    '',
  } : EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('First name, last name, and email are required.');
      return;
    }
    if (!isEdit && !form.username) {
      toast.error('Username is required when creating an employee.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, salary: form.salary ? parseFloat(form.salary) : null };
      if (isEdit) {
        await employeeAPI.update(employee.id, payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeAPI.create(payload);
        toast.success('Employee created successfully');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input className="input" name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Salary (₹)</label>
                <input className="input" type="number" name="salary" value={form.salary} onChange={handleChange} placeholder="50000" />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="select" name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <select className="select" name="position" value={form.position} onChange={handleChange}>
                  <option value="">Select position</option>
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input className="input" type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="select" name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="textarea" name="address" value={form.address} onChange={handleChange} placeholder="Full address" rows={2} />
            </div>

            <hr className="divider" />

            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Login Credentials
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Username{!isEdit && ' *'}</label>
                <input
                  className="input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  disabled={isEdit}
                  style={isEdit ? { opacity: 0.5 } : {}}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isEdit ? 'Password (leave blank to keep)' : 'Password'}</label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isEdit ? 'Keep unchanged' : 'Set password'}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? <div className="spinner" />
                : isEdit ? 'Update Employee' : 'Create Employee'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}