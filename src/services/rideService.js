import api from './api';

const RideService = {
  bookRide: async (request) => {
    try {
      const response = await api.post('/rides/book', request);
      const payload = response.data;
      if (payload && typeof payload.success === 'boolean' && payload.success === false) {
        const err = new Error(payload.message || 'Ride booking failed');
        err.status = response.status;
        throw err;
      }
      return payload;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Ride booking failed';
      const err = new Error(message);
      err.status = status;
      throw err;
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
      const err = new Error(error.response?.data?.message || 'Failed to fetch ride');
      err.status = error.response?.status;
      throw err;
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


  getAllRidesForRider: async (userId) => {
    try {
      const response = await api.get(`/rides/rider/${userId}`);
      return response.data;
    } catch (error) {
      const err = new Error(error.response?.data?.message || 'Failed to fetch rider rides');
      err.status = error.response?.status;
      throw err;
    }
  },
};




export default RideService;