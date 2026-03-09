import apiClient from './apiClient';

export const authService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  async login(data) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
  },
};
