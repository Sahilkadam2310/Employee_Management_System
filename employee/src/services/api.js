import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9999/api',
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getStats: () => api.get('/employees/stats'),
};

export const leaveAPI = {
  getAll: () => api.get('/leaves'),
  getMy: () => api.get('/leaves/my'),

  apply: (data) => api.post('/leaves', data),

  // ✅ FIX HERE
  approve: (id, data) => api.put(`/leaves/${id}/approve`, data),

  // ✅ FIX HERE
  reject: (id, data) => api.put(`/leaves/${id}/reject`, data),

  cancel: (id) => api.delete(`/leaves/${id}`),
};

export default api;