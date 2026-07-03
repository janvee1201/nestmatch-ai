import api from './api.js';

export const createProperty = async (propertyData) => {
  return await api.post('/properties', propertyData);
};

export const updateProperty = async (id, propertyData) => {
  return await api.put(`/properties/${id}`, propertyData);
};

export const deleteProperty = async (id) => {
  return await api.delete(`/properties/${id}`);
};

export const getPropertyById = async (id) => {
  return await api.get(`/properties/${id}`);
};

export const getMyProperties = async () => {
  return await api.get('/properties/my/listings');
};

export const searchProperties = async (params = {}) => {
  // Filter out empty params
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });
  return await api.get('/properties', { params: cleanParams });
};
