import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fundsAPI = {
  list: () => api.get('/funds/'),
  create: (data) => api.post('/funds/', data),
  detail: (id) => api.get(`/funds/${id}/`),
};

export const transactionsAPI = {
  list: () => api.get('/transactions/'),
  create: (data) => api.post('/transactions/', data),
};

export const walletAPI = {
  balance: () => api.get('/wallet/balance/'),
};

export default api;