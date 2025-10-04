import api from './api';

const NotificationService = {
  sendNotification: async (request) => {
    return api.post('/notifications/send', request);
  },

  getNotifications: async (userId, page = 0, size = 10) => {
    return api.get(`/notifications/${userId}`, { params: { page, size } });
  },
};

export default NotificationService;