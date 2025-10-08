import api from './api';

const DriverService = {
  // Registers a new driver with their details and an optional license image. Corresponds to: POST /drivers/register
  registerDriver: async (driverRequest, licenseImage) => {
    try {
      const formData = new FormData();
      // Ensure dob is a string in YYYY-MM-DD format
      const safeRequest = {
        ...driverRequest,
        dob: typeof driverRequest.dob === 'string' ? driverRequest.dob : new Date(driverRequest.dob).toISOString().split('T')[0],
      };
      formData.append('request', new Blob([JSON.stringify(safeRequest)], { type: 'application/json' }));
      if (licenseImage instanceof File) {
        formData.append('licenseImage', licenseImage);
      } else if (licenseImage) {
        throw new Error('License image is not a valid file');
      }
      // Debug: log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      const response = await api.post('/drivers/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Driver registration failed');
    }
  },

  // Updates an existing driver's profile and optionally their license image. Corresponds to: POST /drivers/update
  updateDriver: async (driverRequest, licenseImage) => {
    try {
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(driverRequest)], { type: 'application/json' }));
      if (licenseImage) {
        formData.append('licenseImage', licenseImage);
      }
      const response = await api.post('/drivers/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Driver update failed');
    }
  },

  // Assigns a ride to a driver or records their acceptance/rejection. Corresponds to: POST /drivers/assign-ride
  assignRide: async ({ rideId, driverId, accepted }) => {
    try {
      const response = await api.post('/rides/assign', { rideId, driverId, accepted });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to assign ride');
    }
  },
  // Fetches a list of drivers whose applications are pending approval. Corresponds to: GET /drivers/pending
  getPendingDrivers: async () => {
    try {
      const response = await api.get('/drivers/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending drivers');
    }
  },

  // Approves a pending driver's application. Corresponds to: POST /drivers/approve
  approveDriver: async (approvalRequest) => {
    try {
      const response = await api.post('/drivers/approve', approvalRequest);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Driver approval failed');
    }
  },

  // Fetches driver details for a given userId. Corresponds to: GET /drivers/user/{userId}
  getDriverByUserId: async (userId) => {
    try {
      const response = await api.get(`/drivers/user/${userId}`);
      return response.data;
    } catch (error) {
      const err = new Error(error.response?.data?.message || 'Failed to fetch driver details');
      err.status = error.response?.status;
      throw err;
    }
  },

  // Updates the driver's online/offline status. Corresponds to: POST /drivers/status
  updateDriverStatus: async (status) => {
    try {
      // Validate and normalize status
      if (typeof status !== 'string') {
        throw new Error('Status must be a string (AVAILABLE or OFFLINE)');
      }
      const normalizedStatus = status.toUpperCase();
      if (!['AVAILABLE', 'OFFLINE'].includes(normalizedStatus)) {
        throw new Error('Status must be either AVAILABLE or OFFLINE');
      }
      const response = await api.post('/drivers/status', { status: normalizedStatus });
      return response.data;
    } catch (error) {
      console.error('Failed to update driver status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update driver status');
    }
  },
};

export default DriverService;