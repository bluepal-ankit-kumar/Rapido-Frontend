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
  // --- Original Logic (UNCHANGED) ---
  const { user } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const locationIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const { token } = useAuth();
  const getInitialOnlineStatus = () => {
    return localStorage.getItem("driverOnlineStatus") === "true";
  };

  // UI State
  const [tabValue, setTabValue] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [online, setOnline] = useState(getInitialOnlineStatus);
  const [rideRequests, setRideRequests] = useState([]);

  // Data & Loading State
  const [driverProfile, setDriverProfile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [error, setError] = useState("");

  // --- Function to handle a single location update (UNCHANGED) ---
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

  // --- Effect to manage online/offline duties (UNCHANGED) ---
  useEffect(() => {
    const startActiveDuties = () => {
      console.log("Driver is ONLINE. Starting active duties...");
      handleUpdateLocation();
      checkForNewRides();

      locationIntervalRef.current = setInterval(handleUpdateLocation, 20000);
      pollingIntervalRef.current = setInterval(checkForNewRides, 5000);
    };

    const stopActiveDuties = () => {
      console.log("Driver is OFFLINE. Stopping active duties...");
      clearInterval(locationIntervalRef.current);
      clearInterval(pollingIntervalRef.current);
      locationIntervalRef.current = null;
      pollingIntervalRef.current = null;
    };

    if (online) {
      startActiveDuties();
    } else {
      stopActiveDuties();
    }

    return () => {
      stopActiveDuties();
    };
  }, [online, token]);

  // --- Function to poll for new rides (UNCHANGED) ---
  const checkForNewRides = async () => {
    console.log("online status:", online);
    try {
      console.log("Polling for new rides...");
      // Using token here as per your original logic
      const response = await DriverService.getRideRequests(token);

      console.log("API Response received:", response.data);
      const newRequests = response.data;

      if (Array.isArray(newRequests) && newRequests.length > 0) {
        console.log("New rides found:", newRequests);

        setRideRequests((prevRequests) => {
          const existingIds = new Set(prevRequests.map((r) => r.id));
          const uniqueNewRequests = newRequests.filter(
            (r) => !existingIds.has(r.id)
          );

          if (uniqueNewRequests.length === 0) {
            return prevRequests;
          }

          const updatedRequests = [...prevRequests, ...uniqueNewRequests];
          console.log("Updating state with:", updatedRequests);
          return updatedRequests;
        });
      }
    } catch (err) {
      console.error("Polling for rides failed:", err);
    }
  };

  // --- Function to toggle online status (REMOVED redundant logic, kept state update) ---
  const toggleOnlineStatus = () => {
    const newOnlineStatus = !online;
    setOnline(newOnlineStatus);
    localStorage.setItem("driverOnlineStatus", newOnlineStatus);
    // The `useEffect` hook handles starting/stopping the intervals
  };

  // --- Main data fetching and verification logic (UNCHANGED) ---
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
        setDriverProfile(profile);

        if (profile?.verificationStatus === "APPROVED") {
          // Assuming getAllRides takes token or fetches for current driver
          const ridesRes = await RideService.getAllRides(); 
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

  // --- Handle Accept Ride (UNCHANGED) ---
  const handleAcceptRide = async (rideRequestObject) => {
    try {
      // NOTE: `rideId` is not defined here, but the logic navigates with the full object.
      // Assuming the navigation handles the acceptance flow.
      navigate("/rider/accept-ride", {
        state: { rideDetails: rideRequestObject },
      });
    } catch (err) {
      console.error("Failed to accept ride:", err);
      setError(
        err.message ||
          "Could not accept ride. It may have been taken by another driver."
      );
      // Removed filter logic here as `rideId` is undefined, this should be in the component that manages the list.
    }
  };
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // --- RENDER STATES (UNCHANGED) ---

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

  // State 1 & 2: Verification Required / Under Review (UNCHANGED)
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
          {/* Dashboard Header and Global Error Alert */}
          <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <Typography variant="h4" className="font-bold text-gray-800">
              Rider Dashboard
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{ mt: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
              >
                {error}
              </Alert>
            )}
          </Box>

          {/* Main Grid Container */}
          <Grid container spacing={4}>
            {/* Summary Cards (Full Width at Top) */}
            {summary.map((item) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: 2,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-2px)" }
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}
                  >
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} md={8}>
              {/* Main Content Area: Ride Inbox / Offline Message */}
              <Card sx={{ borderRadius: 3, boxShadow: 3, minHeight: '400px' }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="New Ride Requests" />
                            <Tab label="Statistics & History" />
                        </Tabs>
                    </Box>
                
                    {/* Tab Panel 0: Ride Requests */}
                    <TabPanel value={tabValue} index={0}>
                        {online ? (
                        <RideRequestInbox 
                          requests={rideRequests} 
                          onAccept={handleAcceptRide}
                          // This is crucial: Clear the requests after accepting/rejecting (not implemented in the original logic, but implied)
                        />
                        ) : (
                        <Box sx={{ textAlign: "center", p: 4 }}>
                            <TwoWheeler color="action" sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                                Go Online to Start Earning!
                            </Typography>
                            <Typography color="text.secondary">
                                Toggle the "Go Online" button on the right to start receiving ride requests.
                            </Typography>
                        </Box>
                        )}
                    </TabPanel>

                    {/* Tab Panel 1: Statistics & History */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Recent Completed Rides
                        </Typography>
                        {recentRides.length > 0 ? (
                            <List>
                                {recentRides.map((ride, index) => (
                                    <React.Fragment key={ride.id}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'success.light' }}><History /></Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`Trip to ${ride.endLocation}`}
                                                secondary={`Earned: ₹${ride.cost?.toFixed(2) || 'N/A'} | Date: ${new Date(ride.endTime).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                        {index < recentRides.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary">No recent completed rides found.</Typography>
                        )}
                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            <Button 
                                variant="text" 
                                onClick={() => navigate("/rider/ride-history")}
                            >
                                View Full History
                            </Button>
                        </Box>
                    </TabPanel>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Sidebar: Status & Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Session Controls
                  </Typography>
                  
                  {/* Online/Offline Status */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between', mb: 2, p: 1, border: '1px solid', borderColor: online ? 'success.main' : 'warning.main', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">Status:</Typography>
                    <Chip
                      label={online ? "Online" : "Offline"}
                      color={online ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Location Info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <LocationOn color="action" sx={{ fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      Current Location:{" "}
                      {typeof geo?.latitude === "number"
                        ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(
                            4
                          )}`
                        : "Unavailable"}
                    </Typography>
                  </Box>

                  {/* Main Action Toggle */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={toggleOnlineStatus}
                    color={online ? "error" : "primary"}
                    sx={{ mb: 2 }}
                  >
                    {online ? "Go Offline" : "Go Online"}
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  {/* Secondary Actions */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
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
                      Force Location Update
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setWalletOpen(true)}
                      startIcon={<AccountBalanceWallet />}
                    >
                      View Wallet & Earnings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Profile Card */}
              <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
                  <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          Driver Profile
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                              {user?.firstName?.charAt(0) || 'R'}
                          </Avatar>
                          <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                  {user?.firstName || 'Rider'} {user?.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                  Vehicle: {driverProfile?.vehicleType || 'N/A'}
                              </Typography>
                          </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Rating:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" fontWeight="bold">{driverProfile?.rating?.toFixed(1) || 'N/A'}</Typography>
                          </Box>
                      </Box>
                  </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>

      {/* Wallet Dialog (UNCHANGED) */}
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