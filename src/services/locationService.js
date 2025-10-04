import api from './api';

const LocationService = {
  updateLocation: async (request) => {
    return api.post('/locations/update', request);
  },

  bookRide: async (request) => {
    return api.post('/locations/book-ride', request);
  },

  trackRide: async (rideId) => {
    return api.get(`/locations/track/${rideId}`);
  },

  updateLocationRideId: async (locationId, rideId) => {
    return api.put(`/locations/${locationId}/ride/${rideId}`);
  },
};

export default LocationService;