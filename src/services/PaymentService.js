import api from './api';

const PaymentService = {
  initiatePayment: async (request) => {
    return api.post('/payments/initiate', request);
  },

  verifyPayment: async (request) => {
    return api.post('/payments/verify', request);
  },

  validatePaymentSignature: async (orderId, paymentId, signature) => {
    return api.get('/payments/validate-signature', { params: { orderId, paymentId, signature } });
  },

  getPaymentById: async (paymentId) => {
    return api.get(`/payments/${paymentId}`);
  },

  getPaymentByRideId: async (rideId) => {
    return api.get(`/payments/ride/${rideId}`);
  },

  getPaymentHistoryByUserId: async (userId) => {
    return api.get(`/payments/user/${userId}`);
  },

  getAllPayments: async (pageable) => {
    return api.get('/payments/all', { params: pageable });
  },

  getDriverEarnings: async (driverId) => {
    return api.get(`/payments/driver/${driverId}/earnings`);
  },

  updatePaymentStatus: async (paymentId, status) => {
    return api.put(`/payments/${paymentId}/status`, null, { params: { status } });
  },

  processRefund: async (paymentId) => {
    return api.post(`/payments/${paymentId}/refund`);
  },
};

export default PaymentService;