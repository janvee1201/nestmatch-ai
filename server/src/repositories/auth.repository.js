import { User } from '../models/User.model.js';

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email, selectPassword = false) => {
  const query = User.findOne({ email });
  if (selectPassword) {
    query.select('+password');
  }
  return await query;
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const checkEmailExists = async (email) => {
  const user = await User.findOne({ email }).select('_id');
  return !!user;
};
