import api from './api';

const RideService = {
  bookRide: async (request) => {
    try {
      const response = await api.post('/rides/book', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ride booking failed');
    }
  },

  updateRideStatus: async (request) => {
    try {
      const response = await api.post('/rides/status', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ride status update failed');
    }
  },

  getRide: async (rideId) => {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ride');
    }
  },

  getAllRides: async () => {
    try {
      const response = await api.get('/rides');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rides');
    }
  },
};

export default RideService;