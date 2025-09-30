// contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/authService.js';
// TODO: Implement and import register from authService.js when available

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('customer'); // 'customer', 'rider', 'admin'

  useEffect(() => {
    // Mock persistent login
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole || 'customer');
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const { user } = await login(email, password);
    setUser(user);
    let role = 'customer';
    if (user) {
      if (user.user_type) {
        if (user.user_type.toLowerCase() === 'driver' || user.user_type.toLowerCase() === 'rider') role = 'rider';
        else if (user.user_type.toLowerCase() === 'admin') role = 'admin';
        else role = 'customer';
      } else if (user.role) {
        if (user.role.toLowerCase() === 'rider') role = 'rider';
        else if (user.role.toLowerCase() === 'admin') role = 'admin';
        else role = 'customer';
      }
    }
    setUserRole(role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', role);
    return { user };
  };

  const signUp = async (email, password) => {
    const { user } = await register(email, password);
    setUser(user);
    setUserRole('customer');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', 'customer');
  };

  const signOut = () => {
    setUser(null);
    setUserRole('customer');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, signIn, signUp, logout: signOut }}>
      {children}
    </AuthContext.Provider>
  );
};