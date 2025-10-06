import api from './api';

const LocationService = {
  updateLocation: async (request) => {
    try {
      const response = await api.post('/locations/update', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Location update failed');
    }
  },

  bookRide: async (request) => {
    try {
      const response = await api.post('/locations/book-ride', request);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ride booking failed');
    }
  },

  trackRide: async (rideId) => {
    try {
      const response = await api.get(`/locations/track/${rideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to track ride');
    }
  },

  updateLocationRideId: async (locationId, rideId) => {
    try {
      const response = await api.put(`/locations/${locationId}/ride/${rideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update location ride ID');
    }
  },
};

export default LocationService;