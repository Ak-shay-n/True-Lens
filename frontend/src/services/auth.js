import api from './api';

export const register = async (email, password) => {
  const response = await api.post('/api/auth/register', {
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password
  });
  
  const { token, user } = response.data;
  
  // Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};
