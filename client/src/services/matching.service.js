import api from './api.js';

export const getRecommendations = async () => {
  return await api.get('/matching/recommendations');
};
