import api from './api';

const UserService = {
  getUserProfile: async () => {
    const token = localStorage.getItem('jwtToken');
    const headers = token ? { Authorization: `Bearer ${token.replace(/^Bearer /, '')}` } : {};
    return api.get('/users/profile', { headers });
  },

  updateUserProfile: async (updateRequest) => {
    return api.put('/users/profile', updateRequest);
  },

  getAllUsers: async (page = 0, size = 10, userType = '') => {
    return api.get('/users/admin', { params: { page, size, userType } });
  },

  deleteUser: async (userId) => {
    return api.delete(`/users/admin/${userId}`);
  },

  downloadUsersPdf: async (userType = '') => {
    return api.get('/users/admin/download-pdf', {
      params: { userType },
      responseType: 'blob', // For downloading PDF
    });
  },
};

export default UserService;