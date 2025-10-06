import { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { clearAuthToken } from '../services/authService';
import DriverService from '../services/DriverService';
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
    const isRiderVerified = localStorage.getItem('isRiderVerified') === 'true';
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(storedRole);
        // If rider and already verified previously, ensure landing is dashboard when app loads
        if (parsedUser?.role === 'RIDER' && isRiderVerified && window.location.pathname === '/rider-verification') {
          navigate('/rider/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('jwtToken');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await AuthService.signin({ email, password });
      const { jwt, message, status, user: responseUser } = response;
      const userId = responseUser?.id;
      const role = responseUser?.role;
      if (!status || !userId || !role) {
        throw new Error(message || 'Invalid credentials');
      }
      const userData = { id: userId, email, role };
      setUser(userData);
      setUserRole(role);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', role);
      localStorage.setItem('jwtToken', jwt);

      if (role === 'RIDER') {
        try {
          const driverRes = await DriverService.getDriverByUserId(userId);
          const isApproved = driverRes?.data?.verificationStatus === 'APPROVED';
          localStorage.setItem('isRiderVerified', isApproved ? 'true' : 'false');
          navigate(isApproved ? '/rider/dashboard' : '/rider-verification', { replace: true });
        } catch (err) {
          console.error('Driver fetch error:', err);
          if (err?.status === 403) {
            // Token missing/invalid; force re-login
            setUser(null);
            setUserRole(null);
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('isRiderVerified');
            navigate('/login', { replace: true });
          } else {
            localStorage.setItem('isRiderVerified', 'false');
            navigate('/rider-verification', { replace: true });
          }
        }
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'CUSTOMER') {
        navigate('/', { replace: true });
      } else {
        throw new Error('Invalid user role');
      }
      return { user: userData, role };
    } catch (error) {
      console.error('signIn error:', error);
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('jwtToken');
      throw new Error(error.message || 'Failed to sign in');
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
        navigate('/rider-verification', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
      return { user, role };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signOut = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('isRiderVerified');
    clearAuthToken();
    navigate('/login', { replace: true });
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