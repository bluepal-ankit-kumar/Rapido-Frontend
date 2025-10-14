import api from "./api";

const RideService = {
  bookRide: async (request) => {
    try {
      const response = await api.post("/rides/book", request);
      const payload = response.data;
      if (
        payload &&
        typeof payload.success === "boolean" &&
        payload.success === false
      ) {
        const err = new Error(payload.message || "Ride booking failed");
        err.status = response.status;
        throw err;
      }
      return payload;
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.message || "Ride booking failed";
      const err = new Error(message);
      err.status = status;
      throw err;
    }
  },
  

  updateRideStatus: async (request, token) => {
    console.log("request", request);
    try {
      const response = await api.post("/rides/status", request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Ride status update failed"
      );
    }
  },

  getRide: async (rideId) => {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      const err = new Error(
        error.response?.data?.message || "Failed to fetch ride"
      );
      err.status = error.response?.status;
      throw err;
    }
  },
  deleteRide: async (rideId, token) => {
  try {
    const response = await api.delete(`/rides/delete/${rideId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = new Error(
      error.response?.data?.message || "Failed to delete ride"
    );
    err.status = error.response?.status;
    throw err;
  }
},

  getAllRides: async () => {
    try {
      const response = await api.get("/rides");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
  },

  verifyOtp: async (rideId, otp, token) => {
    console.log("rideId:- ",rideId , "otp:- ",otp , "token:- ",token)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const requestBody = { otp: otp };

      const response = await api.post(
        `/rides/${rideId}/verify-otp`,
        requestBody,
        config
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
  },
 // Fetch total number of rides
  getTotalRides: async () => {
    try {
      const response = await api.get("/rides/total"); // Send GET request to /rides/total
      console.log("total rides response", response); // Log full response for debugging
      // Handle various response formats
      if (typeof response.data === "number") {
        return response.data; // Direct number (e.g., 5)
      } else if (typeof response.data?.data === "number") {
        return response.data.data; // { data: number }
      } else if (typeof response.data?.total === "number") {
        return response.data.total; // { total: number }
      } else if (typeof response.data?.count === "number") {
        return response.data.count; // { count: number }
      } else {
        console.warn("Unexpected response format for total rides:", response.data); // Warn on unexpected format
        return 0; // Fallback to 0
      }
    } catch (error) {
      console.error("Error in getTotalRides:", error.response || error); // Log error details
      throw new Error(
        error.response?.data?.message || "Failed to fetch total rides" // Handle error
      );
    }
  },
 
};

export default RideService;
