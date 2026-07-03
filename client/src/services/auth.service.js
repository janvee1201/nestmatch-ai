import api from './api.js';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const getProfile = async () => {
  return await api.get('/profile');
};

export const updateProfile = async (profileData) => {
  return await api.put('/profile', profileData);
};
