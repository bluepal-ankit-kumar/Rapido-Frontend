import { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { clearAuthToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(storedRole);
        if (storedRole === 'rider') {
          navigate(parsedUser.verified ? '/rider/dashboard' : '/rider-verification');
        } else if (storedRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (storedRole === 'customer') {
          navigate('/');
        }
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('jwtToken');
      }
    }
    setLoading(false);
  }, [navigate]);

  const signIn = async (email, password) => {
    try {
      const response = await AuthService.signin({ email, password });
      const { user, status, message } = response;
      if (!user || !status) {
        throw new Error(message || 'Invalid credentials');
      }
      setUser(user);
      const role = user.role === 'RIDER' ? 'rider' : user.role === 'ADMIN' ? 'admin' : 'customer';
      setUserRole(role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      if (role === 'rider') {
        navigate(user.verified ? '/rider/dashboard' : '/rider-verification');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      return { user, role };
    } catch (error) {
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      throw error;
    }
  };

  const signUp = async (name, email, password, userType = 'CUSTOMER') => {
    try {
      const userRequest = { username: name, email, password, userType };
      const response = await AuthService.signup(userRequest);
      const { user, status, message } = response;
      if (!user || !status) {
        throw new Error(message || 'Registration failed');
      }
      setUser(user);
      const role = user.role === 'RIDER' ? 'rider' : user.role === 'ADMIN' ? 'admin' : 'customer';
      setUserRole(role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      if (role === 'rider') {
        navigate('/rider-verification');
      } else {
        navigate('/login');
      }
      return { user, role };
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    clearAuthToken();
    navigate('/login');
  };

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signUp,
    logout: signOut,
    setUser,
    setUserRole,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;