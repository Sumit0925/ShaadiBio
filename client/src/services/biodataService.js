import apiClient from './apiClient';

export const biodataService = {
  async create(data) {
    const res = await apiClient.post('/biodata', data);
    return res.data;
  },
  async getAll() {
    const res = await apiClient.get('/biodata');
    return res.data;
  },
  async getById(id) {
    const res = await apiClient.get(`/biodata/${id}`);
    return res.data;
  },
  async update(id, data) {
    const res = await apiClient.put(`/biodata/${id}`, data);
    return res.data;
  },
  async remove(id) {
    const res = await apiClient.delete(`/biodata/${id}`);
    return res.data;
  },
  async uploadPhoto(id, file) {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await apiClient.post(`/biodata/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async getPDF(id) {
    const res = await apiClient.get(`/biodata/${id}/pdf`, { responseType: 'blob' });
    return res.data;
  },
};
