import api, { setAuthToken, clearAuthToken } from './api';

const AuthService = {
  signup: async (userRequest) => {
    const response = await api.post('/auth/signup', userRequest);
    const { id, username, email, phone, userType, message } = response.data; // Match UserResponseDto
    const user = {
      id,
      email,
      name: username,
      role: userType,
      verified: userType === 'RIDER' ? false : true,
    };
    return { user, status: true, message };
  },

  signin: async (loginRequest) => {
    console.log('Sending signin request:', loginRequest);
    try {
      const response = await api.post('/auth/signin', loginRequest);
      const { jwt, role, status, message } = response.data;
      if (jwt) {
        setAuthToken(jwt);
      }
      const user = {
        email: loginRequest.email,
        role: role,
        verified: role === 'RIDER' ? false : true,
      };
      return { user, jwt, status, message };
    } catch (error) {
      console.error('Signin error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to sign in');
    }
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (resetRequest) => {
    return api.post('/auth/reset-password', resetRequest);
  },
};

export { clearAuthToken };
export default AuthService;