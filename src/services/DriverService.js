import api from './api';

const DriverService = {
  registerDriver: async (request, licenseImage) => {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    if (licenseImage) {
      formData.append('licenseImage', licenseImage);
    }
    return api.post('/drivers/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateDriver: async (request, licenseImage) => {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    if (licenseImage) {
      formData.append('licenseImage', licenseImage);
    }
    return api.post('/drivers/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  assignRide: async (request) => {
    return api.post('/drivers/assign-ride', request);
  },

  getPendingDrivers: async () => {
    return api.get('/drivers/pending');
  },

  approveDriver: async (request) => {
    return api.post('/drivers/approve', request);
  },
};

export default DriverService;