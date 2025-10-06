import api from './api';

const PaymentService = {
  initiatePayment: async (request) => {
    try {
      const response = await api.post('/payments/initiate', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment initiation failed');
    }
  },

  verifyPayment: async (request) => {
    try {
      const response = await api.post('/payments/verify', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  validatePaymentSignature: async (orderId, paymentId, signature) => {
    try {
      const response = await api.get('/payments/validate-signature', { params: { orderId, paymentId, signature } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment signature validation failed');
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  getPaymentByRideId: async (rideId) => {
    try {
      const response = await api.get(`/payments/ride/${rideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment by ride');
    }
  },

  getPaymentHistoryByUserId: async (userId) => {
    try {
      const response = await api.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  },

  getAllPayments: async (pageable) => {
    try {
      const response = await api.get('/payments/all', { params: pageable });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all payments');
    }
  },

  getDriverEarnings: async (driverId) => {
    try {
      const response = await api.get(`/payments/driver/${driverId}/earnings`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch driver earnings');
    }
  },

  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await api.put(`/payments/${paymentId}/status`, null, { params: { status } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment status');
    }
  },

  processRefund: async (paymentId) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process refund');
    }
  },
};

export default PaymentService;