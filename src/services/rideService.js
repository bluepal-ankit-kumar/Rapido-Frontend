import api from './api';

const RideService = {
  bookRide: async (request) => {
    return api.post('/rides/book', request);
  },

  updateRideStatus: async (request) => {
    return api.post('/rides/status', request);
  },

  getRide: async (rideId) => {
    return api.get(`/rides/${rideId}`);
  },
};

export default RideService;