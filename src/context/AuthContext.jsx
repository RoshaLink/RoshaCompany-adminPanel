import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('roshalink_admin_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate existing token and load user profile on startup
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session expired or invalid:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.post('/auth/login', { username, password });

      if (res.success && res.data) {
        const { user: userData, token: jwtToken } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('roshalink_admin_token', jwtToken);
        return { success: true };
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.success) {
        return { success: true, message: res.message || 'Password updated successfully' };
      }
      return { success: false, error: res.message || 'Failed to update password' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update password' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('roshalink_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
