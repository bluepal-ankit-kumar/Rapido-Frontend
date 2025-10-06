import api from './api';

const NotificationService = {
  sendNotification: async (request) => {
    try {
      const response = await api.post('/notifications/send', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Notification send failed');
    }
  },

  getNotifications: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/notifications/${userId}`, { params: { page, size } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },
};

export default NotificationService;