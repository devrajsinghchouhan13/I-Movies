import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: profile } = await api.getProfile();
        setUser(profile);
      } catch (err) {
        console.warn('Session expired or invalid, clearing token');
        localStorage.removeItem('imovies_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, pass) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem('imovies_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, pass, phone) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password: pass, phone });
      localStorage.setItem('imovies_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    setToken(null);
    setUser(null);
  };

  const loginAsDemoUser = async () => {
    await login('elena@cinema.com', 'User@123');
  };

  const loginAsAdmin = async () => {
    await login('admin@imovies.com', 'Admin@123');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        loginAsDemoUser,
        loginAsAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
