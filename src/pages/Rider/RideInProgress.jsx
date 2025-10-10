import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import { Star, Phone, Message } from "@mui/icons-material";
import MapDisplay from "../../components/shared/MapDisplay";
import useGeolocation from "../../hooks/useGeolocation";
import useAuth from "../../hooks/useAuth";
import RideService from "../../services/RideService";
import DriverService from "../../services/DriverService";

export default function RideInProgress() {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const { user, jwt } = useAuth();
  const geo = useGeolocation();

  // State for data
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for UI interactions
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const locationIntervalRef = useRef(null);

  // --- 1. FETCH INITIAL RIDE DETAILS ---
  useEffect(() => {
    console.log("rideId:- ", rideId, "token:- ", jwt);
    if (!rideId) {
      navigate("/rider/dashboard");
      return;
    }

    const fetchRideData = async () => {
      setLoading(true);
      try {
        const response = await RideService.getRide(rideId);
        setRideDetails(response.data);
      } catch (err) {
        setError("Failed to load ride details.");
        console.error("Fetch ride error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRideData();
  }, [rideId, navigate]);

  useEffect(() => {
    console.log("🔄 geo changed:", geo);

    if (geo === null) {
      console.log("❌ Still null - waiting for location...");
    } else if (geo.latitude) {
      console.log("✅ Got location!", {
        lat: geo.latitude,
        lng: geo.longitude,
        time: new Date().toLocaleTimeString(),
      });
    }
  }, [geo]); // Runs every time geo changes

  // --- 2. START SENDING LIVE LOCATION UPDATES ---
  useEffect(() => {
    const sendLocationUpdate = async () => {
      // Check if geo exists and has latitude property
      if (!user || !geo || !geo.latitude || !rideId) return;

      const locationRequest = {
        userId: user.id,
        rideId: parseInt(rideId),
        latitude: geo.latitude,
        longitude: geo.longitude,
        locationType: "CURRENT",
      };

      try {
        // await DriverService.updateLocation(locationRequest, jwt);
      } catch (err) {
        console.error("Location update send failed:", err);
      }
    };

    // Start the interval to send location every 10 seconds
    locationIntervalRef.current = setInterval(sendLocationUpdate, 10000);

    // Cleanup: Stop sending updates when the component unmounts
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [user, rideId, geo?.latitude, geo?.longitude]);

  // --- 3. HANDLE RIDE STATUS CHANGES ---
  const handleReachedCustomer = () => {
    setOtpValue("");
    setOtpError("");
    setOtpOpen(true);
  };

  // const validateOtpAndProceed = async () => {

  //   if (otpValue.trim() === "1234") {
  //     setOtpOpen(false);
  //     try {
  //       const statusRequest = { rideId: parseInt(rideId), status: 'STARTED' };
  //       await RideService.updateRideStatus(statusRequest, token);
  //       setRideDetails(prev => ({ ...prev, status: 'STARTED' }));
  //     } catch (err) {
  //       setOtpError('Failed to start the ride. Please try again.');
  //     }
  //   } else {
  //     setOtpError('Invalid OTP');
  //   }
  // };

  const validateOtpAndProceed = async () => {
    if (!otpValue || otpValue.length !== 4) {
      setOtpError("Please enter the 4-digit OTP.");
      return;
    }

    try {
      // Call the new service method
      await RideService.verifyOtp(rideId, otpValue, jwt);

      setOtpOpen(false);
      // Manually update the local state so the UI changes instantly
      setRideDetails((prev) => ({ ...prev, status: "STARTED" }));
    } catch (err) {
      console.error("OTP verification failed:", err);
      setOtpError(err.message || "Invalid OTP. Please try again.");
    }
  };
  const handleCompleteRide = async () => {
    try {
      const statusRequest = { rideId: parseInt(rideId), status: "COMPLETED" };
      await RideService.updateRideStatus(statusRequest, jwt);
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      navigate("/rider/dashboard");
    } catch (err) {
      setError("Failed to complete the ride.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!rideDetails)
    return <Typography sx={{ p: 4 }}>Ride not found.</Typography>;

  // --- Prepare coordinates for the map (with null checks) ---
  const driverLocation =
    geo && geo.latitude ? [geo.latitude, geo.longitude] : null;
  const customerLocation = [
    rideDetails.startLatitude,
    rideDetails.startLongitude,
  ];
  const destinationLocation = [
    rideDetails.endLatitude,
    rideDetails.endLongitude,
  ];

  // Determine which route to show on the map
  const routeToShow =
    rideDetails.status === "ACCEPTED"
      ? { pickup: driverLocation, dropoff: customerLocation }
      : { pickup: customerLocation, dropoff: destinationLocation };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ride In Progress (ID: {rideId})
      </Typography>

      {/* Show location loading state */}
      {!driverLocation && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Getting your location...
        </Alert>
      )}

      {/* Map View */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-0">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <MapDisplay
              userLocation={driverLocation}
              pickupCoords={routeToShow.pickup}
              dropoffCoords={routeToShow.dropoff}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer/Trip Card */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" fontWeight="medium">
              {rideDetails.status === "ACCEPTED"
                ? "Navigate to Customer"
                : "Navigate to Destination"}
            </Typography>
            <Chip label={rideDetails.status} color="primary" />
          </Box>
          <Box className="flex items-center mb-3">
            <Avatar className="mr-3">
              {rideDetails.customer?.username?.charAt(0) || "C"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {rideDetails.customer?.username ||
                  `Customer ID: ${rideDetails.userId}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Phone: {rideDetails.customer?.phone || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="primary">
              <Phone />
            </IconButton>
            <IconButton color="primary">
              <Message />
            </IconButton>
          </Box>
          <Divider className="my-3" />
          <Box className="flex justify-between">
            {rideDetails.status === "ACCEPTED" && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleReachedCustomer}
              >
                Reached Customer
              </Button>
            )}
            {rideDetails.status === "STARTED" && (
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleCompleteRide}
              >
                Complete Ride
              </Button>
            )}
            <Button variant="outlined" color="error" size="large">
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
        <DialogTitle>Enter OTP to Start Ride</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={otpValue}
            onChange={(e) => {
              setOtpValue(e.target.value);
              setOtpError("");
            }}
            label="4-Digit OTP"
            fullWidth
            inputProps={{ maxLength: 4 }}
            helperText={
              otpError || "Ask the customer for the OTP provided in their app."
            }
            error={!!otpError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpOpen(false)}>Cancel</Button>
          <Button onClick={validateOtpAndProceed} variant="contained">
            Verify & Start Trip
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
