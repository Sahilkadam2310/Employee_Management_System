import React from 'react';

const STATUS_CLASSES = {
  ACTIVE:   'badge badge-active',
  INACTIVE: 'badge badge-inactive',
  ON_LEAVE: 'badge badge-on_leave',
  PENDING:  'badge badge-pending',
  APPROVED: 'badge badge-approved',
  REJECTED: 'badge badge-rejected',
  ADMIN:    'badge badge-admin',
  EMPLOYEE: 'badge badge-employee',
};

export default function StatusBadge({ status }) {
  return (
    <span className={STATUS_CLASSES[status] || 'badge badge-employee'}>
      {status}
    </span>
  );
}