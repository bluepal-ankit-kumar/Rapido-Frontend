import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  TwoWheeler,
  CurrencyRupee,
  Star,
  History,
  LocationOn,
  VerifiedUser,
  AccountBalanceWallet,
  MyLocation,
} from "@mui/icons-material";
import LocationService from "../../services/locationService"; // Ensure this is imported
import DriverService from "../../services/DriverService";
import RideService from "../../services/RideService";
import useGeolocation from "../../hooks/useGeolocation";
import useAuth from "../../hooks/useAuth";
import Wallet from "./Wallet.jsx";
import RideRequestInbox from "./RideRequestInbox";

// Helper component for Tab Panels (no changes needed)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const locationIntervalRef = useRef(null); // Ref to hold the interval ID for location updates
  const pollingIntervalRef = useRef(null);
  const { token } = useAuth();

  // UI State
  const [tabValue, setTabValue] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [online, setOnline] = useState(false); // Default to offline
  const [rideRequests, setRideRequests] = useState([]);

  // Data & Loading State
  const [driverProfile, setDriverProfile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [error, setError] = useState("");

  // --- Function to handle a single location update ---
  const handleUpdateLocation = async () => {
    if (!user?.id || typeof geo?.latitude !== "number") {
      setError(
        "Current location is not available. Please enable location services."
      );
      return;
    }

    setIsUpdatingLocation(true);
    setError("");

    const locationRequest = {
      userId: user.id,
      latitude: geo.latitude,
      longitude: geo.longitude,
      locationType: "CURRENT",
      timestamp: Date.now(),
    };

    try {
      await LocationService.updateLocation(locationRequest);
    } catch (err) {
      setError("Failed to send location. You may appear offline.");
      console.error("Location update failed:", err);
      // If location fails, automatically go offline to stop trying
      setOnline(false);
      clearInterval(locationIntervalRef.current);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const checkForNewRides = async () => {
    // if (!token) return;
    try {
      console.log("Polling for new rides..."); // 1. Check if the function is running
      const response = await DriverService.getRideRequests(token);

      console.log("API Response received:", response.data); // 2. Check the raw data
      const newRequests = response.data; // You might need .data.data depending on your ApiResponse structure

     if (Array.isArray(newRequests) && newRequests.length > 0) {
            console.log("New rides found:", newRequests);

            // This is the correct way to update the state
            setRideRequests((prevRequests) => {
                // Get the IDs of the requests we are already showing
                const existingIds = new Set(prevRequests.map(r => r.id));
                
                // Filter out any new requests that we are already showing
                const uniqueNewRequests = newRequests.filter(r => !existingIds.has(r.id));
                
                // If there are no truly new requests, don't update the state
                if (uniqueNewRequests.length === 0) {
                    return prevRequests;
                }

                // Add the unique new requests to the existing list
                const updatedRequests = [...prevRequests, ...uniqueNewRequests];
                console.log("Updating state with:", updatedRequests);
                return updatedRequests;
            });
        }

    } catch (err) {
      console.error("Polling for rides failed:", err);
    }
  };

  // --- Function to toggle online status and manage automatic "heartbeat" updates ---
  const toggleOnlineStatus = () => {
    const newOnlineStatus = !online;
    setOnline(newOnlineStatus);

    if (newOnlineStatus) {
      // GOING ONLINE: Send location immediately and then start the interval
      handleUpdateLocation();
      locationIntervalRef.current = setInterval(handleUpdateLocation, 20000); // Send update every 20 seconds
      checkForNewRides();
      pollingIntervalRef.current = setInterval(checkForNewRides, 6000); // Poll every 5 seconds
    } else {
      // GOING OFFLINE: Stop the interval
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;

      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // --- Main data fetching and verification logic ---
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const driverRes = await DriverService.getDriverByUserId(user.id);
        const profile = driverRes?.data;
        setDriverProfile(profile); // Set profile regardless of status

        // Only fetch ride/earnings data if the driver is fully approved
        if (profile?.verificationStatus === "APPROVED") {
          const ridesRes = await RideService.getAllRides(); // Simplified: get all rides
          const allRides =
            ridesRes?.data?.data || ridesRes?.data || ridesRes || [];
          const myRides = Array.isArray(allRides)
            ? allRides.filter((r) => r.driverId === profile.id)
            : [];

          const completedRides = myRides.filter(
            (r) => r.status === "COMPLETED"
          );
          const totalEarnings = completedRides.reduce(
            (sum, ride) => sum + (ride.cost || 0),
            0
          );

          setSummary([
            {
              title: "Completed Rides",
              value: completedRides.length,
              icon: <TwoWheeler color="primary" />,
            },
            {
              title: "Earnings",
              value: `₹${totalEarnings.toFixed(2)}`,
              icon: <CurrencyRupee color="primary" />,
            },
            {
              title: "Rating",
              value: `${profile?.rating?.toFixed(1) || "N/A"}/5`,
              icon: <Star color="primary" />,
            },
          ]);
          setRecentRides(completedRides.slice(0, 5));
        }
      } catch (err) {
        if (err.status === 404) {
          // This means the driver profile doesn't exist yet, which is a valid state
          setDriverProfile(null);
        } else {
          setError("Failed to load dashboard data. Please refresh the page.");
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Cleanup effect: ensures the location heartbeat stops when the component is unmounted
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user]);

  // In Dashboard.jsx, add this new function

  const handleAcceptRide = async (rideRequestObject) => {
    try {
      // IMPORTANT: Navigate to the live ride screen for the driver
      navigate("/rider/accept-ride", {
        state: { rideDetails: rideRequestObject },
      });
    } catch (err) {
      console.error("Failed to accept ride:", err);
      setError(
        err.message ||
          "Could not accept ride. It may have been taken by another driver."
      );
      // Remove the ride from the list as it's no longer available
      setRideRequests((prev) => prev.filter((req) => req.rideId !== rideId));
    }
  };
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // --- RENDER STATES ---

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // State 1: Driver profile does not exist OR is rejected. Show "Start Verification".
  if (!driverProfile || driverProfile.verificationStatus === "REJECTED") {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            textAlign: "center",
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                width: 60,
                height: 60,
              }}
            >
              <VerifiedUser sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Verification Required
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              To start accepting rides and earning money, you need to complete
              your driver verification process.
            </Typography>
            {driverProfile?.verificationStatus === "REJECTED" && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your previous application was rejected. Please review your
                details and resubmit.
              </Alert>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/rider-verification")}
            >
              Start Verification
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // State 2: Driver profile exists and is PENDING. Show "Under Review".
  if (driverProfile.verificationStatus === "PENDING") {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            textAlign: "center",
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "secondary.main",
                width: 60,
                height: 60,
              }}
            >
              <History sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Application Under Review
            </Typography>
            <Typography color="text.secondary">
              Your application is being reviewed by our team. We will notify you
              once the status changes.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // State 3: Driver is APPROVED. Render the full dashboard.
  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <Box className="max-w-7xl mx-auto">
          <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <Typography variant="h4" className="font-bold text-gray-800">
              Rider Dashboard
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{ mt: { xs: 2, sm: 0 }, width: "100%" }}
              >
                {error}
              </Alert>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Summary Cards */}
            {summary.map((item) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {item.value}
                      </Typography>
                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
            ))}

            {/* Main Content Area */}
            <Grid item xs={12} md={8}>
              {/* Your Tabs and Recent Rides list can go here */}

              {online ? (
                <RideRequestInbox requests={rideRequests} />
              ) : (
                <Card sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary">
                      You are currently offline.
                    </Typography>
                    <Typography color="text.secondary">
                      Click "Go Online" to start receiving ride requests.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Right Sidebar: Status & Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Current Status
                  </Typography>
                  <Chip
                    icon={
                      <Box
                        className={`w-3 h-3 rounded-full ${
                          online ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    }
                    label={online ? "Online - Accepting Rides" : "Offline"}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn color="action" />
                    <Typography color="text.secondary">
                      Location:{" "}
                      {typeof geo?.latitude === "number"
                        ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(
                            4
                          )}`
                        : "Unavailable"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Button
                      variant="contained"
                      onClick={toggleOnlineStatus}
                      color={online ? "error" : "primary"}
                    >
                      {online ? "Go Offline" : "Go Online"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleUpdateLocation}
                      startIcon={
                        isUpdatingLocation ? (
                          <CircularProgress size={20} />
                        ) : (
                          <MyLocation />
                        )
                      }
                      disabled={
                        isUpdatingLocation || typeof geo?.latitude !== "number"
                      }
                    >
                      Update Location
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setWalletOpen(true)}
                      startIcon={<AccountBalanceWallet />}
                    >
                      Wallet
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/rider/ride-history")}
                      startIcon={<History />}
                    >
                      Ride History
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>

      <Dialog
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Wallet
          <IconButton
            onClick={() => setWalletOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Wallet />
        </DialogContent>
      </Dialog>
    </>
  );
}
