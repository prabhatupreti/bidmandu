import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'ADMIN') {
          setAdmin({ id: payload.sub, email: payload.email });
        } else {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
      } catch (e) {
        localStorage.removeItem('admin_token');
        setToken(null);
      }
    }
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    const data = res.data;
    // Verify the user is ADMIN (backend returns role in token)
    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
    if (payload.role !== 'ADMIN') throw new Error('Not an admin account');
    localStorage.setItem('admin_token', data.access_token);
    setToken(data.access_token);
    setAdmin({ id: payload.sub, email: payload.email });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);