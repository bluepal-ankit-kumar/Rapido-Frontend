import api, { setAuthToken, clearAuthToken } from './api';

const AuthService = {
  signup: async (userRequest) => {
    try {
      const response = await api.post('/auth/signup', userRequest);
      const { id, username, email, phone, userType, message } = response.data;
      const user = {
        id,
        email,
        name: username,
        role: userType,
        verified: userType === 'RIDER' ? false : true,
      };
      return { user, status: true, message };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  signin: async (loginRequest) => {
    console.log('Sending signin request:', loginRequest);
    try {
      const response = await api.post('/auth/signin', loginRequest);
      const { jwt, role, status, message, userId } = response.data;
      if (jwt) {
        setAuthToken(jwt);
      }
      const user = {
        id: userId,
        email: loginRequest.email,
        role: role, // 'CUSTOMER', 'RIDER', 'ADMIN' from backend
        verified: role === 'RIDER' ? false : true,
      };
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, jwt, status, message };
    } catch (error) {
      console.error('Signin error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to sign in');
    }
  },

  forgotPassword: async (email) => {
    try {
      // Ensure payload matches backend DTO: { email }
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  resetPassword: async (resetRequest) => {
    try {
      // Ensure payload matches backend DTO: { email, otp, newPassword }
      const response = await api.post('/auth/reset-password', resetRequest);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },
};

export { clearAuthToken };
export default AuthService;