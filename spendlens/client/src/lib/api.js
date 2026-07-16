import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

export const createAudit = (data) => api.post('/audit', data);
export const getAudit = (id) => api.get(`/audit/${id}`);
export const captureLead = (data) => api.post('/leads', data);

export default api;
