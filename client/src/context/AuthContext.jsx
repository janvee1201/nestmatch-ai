import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh user data from API in background to ensure it is fresh
          const res = await authService.getProfile();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          // If profile fetch fails with 401, service response interceptor clears localStorage
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Session expiration listener
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      toast.error('Session expired. Please sign in again.');
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { token, user: loggedUser } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      return await authService.register(userData);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getProfile();
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refreshUser,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
