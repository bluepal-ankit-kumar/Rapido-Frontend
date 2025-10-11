// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import DriverService from "../../services/DriverService";
// import RideService from "../../services/RideService";
// import useAuth from "../../hooks/useAuth";
// import {
//   Typography,
//   Paper,
//   Button,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Alert,
//   CircularProgress,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
// } from "@mui/material";
// import {
//   Person,
//   LocationOn,
//   Directions,
//   AccessTime,
//   AttachMoney,
//   CheckCircle,
//   Phone,
//   Message,
//   Star,
//   TwoWheeler,
//   LocalTaxi,
//   CurrencyRupee,
//   Straighten,
//   AirportShuttle,
// } from "@mui/icons-material";
// import MapDisplay from "../../components/shared/MapDisplay";
// import useGeolocation from "../../hooks/useGeolocation"; // To show the driver's own location

// export default function AcceptRide() {
//   const navigate = useNavigate();
//   const location = useLocation(); // <-- Get the location object
//   const { token } = useAuth();
//   const [accepted, setAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(30); // 30 seconds to accept
//   const [selectedRider, setSelectedRider] = useState(null);
//   const rideDetails = location.state?.rideDetails;
//   const [error, setError] = useState(""); // State for handling errors
//   const geo = useGeolocation(); // Get the driver's current location

//   const pickupCoords = [rideDetails.startLatitude, rideDetails.startLongitude];
//   const dropoffCoords = [rideDetails.endLatitude, rideDetails.endLongitude];
//   // const driverCoords = geo.latitude ? [geo.latitude, geo.longitude] : null;
//   const driverCoords = [rideDetails.endLatitude, rideDetails.endLongitude];

//   useEffect(() => {
//     console.log(rideDetails);
//     if (!rideDetails) {
//       console.error("No ride details found. Redirecting to dashboard.");
//       navigate("/rider/dashboard");
//     }
//   }, [rideDetails, navigate]);

//   // Simulate countdown timer
//   useEffect(() => {
//     if (!accepted && countdown > 0) {
//       const timer = setTimeout(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (countdown === 0 && !accepted) {
//       // Auto-reject when timer expires
//       setAccepted(true);
//       navigate("/rider/dashboard");
//     }
//   }, [accepted, countdown]);

//   // const handleAccept = () => {
//   //   setLoading(true);
//   //   // Simulate API call
//   //   setTimeout(() => {
//   //     setAccepted(true);
//   //     setLoading(false);
//   //     // Redirect to Ride In Progress after accepting
//   //     navigate("/rider/ride-in-progress");
//   //   }, 1000);
//   // };

//   const handleAccept = async () => {
//     setLoading(true);
//     setError("");
//     console.log("requestRideId:- ", rideDetails.userId);
//     try {
//       const request = {
//         rideId: rideDetails.id,
//         status: "ACCEPTED",
//       };
//       // Call the REAL API to accept the ride
//       await RideService.updateRideStatus(request, token);
//       alert("Ride Started");
//       setAccepted(true);
//       // Navigate to the next screen upon successful acceptance
//       navigate(`/rider/ride-in-progress/${rideDetails.id}`); // Pass ride ID
//     } catch (err) {
//       console.error("Failed to accept ride:", err);
//       setError(
//         err.message ||
//           "Failed to accept ride. It might have been taken by another driver."
//       );
//       // You might want to automatically navigate back after a few seconds
//       setTimeout(() => navigate("/rider/dashboard"), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReject = () => {
//     setAccepted(true);
//     navigate("/rider/dashboard");
//   };

//   const getVehicleIcon = (type) => {
//     switch (type) {
//       case "Bike":
//         return <TwoWheeler className="text-yellow-500" />;
//       case "Auto":
//         return <AirportShuttle className="text-yellow-500" />;
//       case "Cab":
//         return <LocalTaxi className="text-yellow-500" />;
//       default:
//         return <TwoWheeler className="text-yellow-500" />;
//     }
//   };

//   // No need for accepted state UI, as we redirect to RideInProgress
//   if (accepted) {
//     return null;
//   }
//   const cost = rideDetails.cost?.toFixed(2) ?? "0.00";
//   const distance = rideDetails.distance?.toFixed(1) ?? "0.0";
//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <Box className="mb-8">
//           <Typography variant="h4" fontWeight="bold">
//             Ride Details (ID: {rideDetails.id})
//           </Typography>
//         </Box>
//         <Grid container spacing={3}>
//           {/* Left Column: Details */}
//           <Grid item xs={12} md={5}>
//             <Card sx={{ borderRadius: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={2}
//                 >
//                   {rideDetails.customer ? (
//                     <Typography variant="h6" fontWeight="bold">
//                       Customer: {rideDetails.customer.username}
//                     </Typography>
//                   ) : (
//                     <Typography variant="h6" fontWeight="bold">
//                       Customer ID: {rideDetails.userId}
//                     </Typography>
//                   )}
//                   <Chip
//                     label={`${countdown}s`}
//                     color={countdown < 10 ? "error" : "primary"}
//                   />
//                 </Box>
//                 {/* To show customer name/rating, you need to add that to your RideResponse DTO */}
//                 <Divider sx={{ my: 2 }} />
//                 <Box display="flex" alignItems="center" mb={2}>
//                   <LocationOn color="primary" sx={{ mr: 2 }} />
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Pickup
//                     </Typography>
//                         <Typography fontWeight="medium">{rideDetails.pickupName || 'Loading...'}</Typography>

//                   </Box>
//                 </Box>
//                 <Box display="flex" alignItems="center">
//                   <Directions color="secondary" sx={{ mr: 2 }} />
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Dropoff
//                     </Typography>
//                        <Typography fontWeight="medium">{rideDetails.dropoffName || 'Loading...'}</Typography>

//                   </Box>
//                 </Box>
//                 <Divider sx={{ my: 2 }} />
//                 <Grid container spacing={1}>
//                   <Grid
//                     item
//                     xs={6}
//                     display="flex"
//                     alignItems="center"
//                     gap={1.5}
//                   >
//                     <CurrencyRupee color="action" />
//                     <Typography fontWeight="bold">
//                       ₹{rideDetails.cost?.toFixed(2) ?? " "}
//                     </Typography>
//                   </Grid>
//                   <Grid
//                     item
//                     xs={6}
//                     display="flex"
//                     alignItems="center"
//                     gap={1.5}
//                   >
//                     <Straighten color="action" />
//                     <Typography fontWeight="bold">
//                       {rideDetails.distance?.toFixed(1) ?? ""} km
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//           {/* Right Column: Map & Actions */}
//           <Grid item xs={20} md={12}>
//             <Card sx={{ borderRadius: 3, mb: 3 }}>
//               <MapDisplay
//                 userLocation={driverCoords}
//                 // Pass the pickup and dropoff coords to draw the route
//                 pickupCoords={pickupCoords}
//                 dropoffCoords={dropoffCoords}
//               />
//             </Card>
//             <Card sx={{ borderRadius: 3, p: 2 }}>
//               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
//                 Confirm Action
//               </Typography>
//               {error && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               )}
//               <Box display="flex" gap={2}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="success"
//                   onClick={handleAccept}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "Accept Ride"
//                   )}
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   color="error"
//                   onClick={handleReject}
//                 >
//                   Reject
//                 </Button>
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DriverService from "../../services/DriverService";
import RideService from "../../services/RideService";
import useAuth from "../../hooks/useAuth";
import {
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Person,
  LocationOn,
  Directions,
  AccessTime,
  AttachMoney,
  CheckCircle,
  Phone,
  Message,
  Star,
  TwoWheeler,
  LocalTaxi,
  CurrencyRupee,
  Straighten,
  AirportShuttle,
} from "@mui/icons-material";
import MapDisplay from "../../components/shared/MapDisplay";
import useGeolocation from "../../hooks/useGeolocation"; // To show the driver's own location

export default function AcceptRide() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [selectedRider, setSelectedRider] = useState(null);
  const rideDetails = location.state?.rideDetails;
  const [error, setError] = useState("");
  const geo = useGeolocation();

  // Defensive check for rideDetails
  if (!rideDetails) {
    // Navigate away or show an error if rideDetails are missing.
    // This prevents the component from crashing.
    useEffect(() => {
      navigate('/rider/dashboard');
    }, [navigate]);
    return null; // Render nothing while redirecting
  }

  const pickupCoords = [rideDetails.startLatitude, rideDetails.startLongitude];
  const dropoffCoords = [rideDetails.endLatitude, rideDetails.endLongitude];
  const driverCoords =
    geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : null;


  useEffect(() => {
    if (!rideDetails) {
      console.error("No ride details found. Redirecting to dashboard.");
      navigate("/rider/dashboard");
    }
  }, [rideDetails, navigate]);

  useEffect(() => {
    if (!accepted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !accepted) {
      setAccepted(true);
      navigate("/rider/dashboard");
    }
  }, [accepted, countdown, navigate]);

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    try {
      const request = {
        rideId: rideDetails.id,
        status: "ACCEPTED",
      };
      await RideService.updateRideStatus(request, token);
      alert("Ride Started");
      setAccepted(true);
      navigate(`/rider/ride-in-progress/${rideDetails.id}`);
    } catch (err) {
      console.error("Failed to accept ride:", err);
      setError(
        err.message ||
        "Failed to accept ride. It might have been taken by another driver."
      );
      setTimeout(() => navigate("/rider/dashboard"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setAccepted(true);
    navigate("/rider/dashboard");
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "Bike":
        return <TwoWheeler color="action" />;
      case "Auto":
        return <AirportShuttle color="action" />;
      case "Cab":
        return <LocalTaxi color="action" />;
      default:
        return <TwoWheeler color="action" />;
    }
  };

  const cost = rideDetails.cost?.toFixed(2) ?? "0.00";
  const distance = rideDetails.distance?.toFixed(1) ?? "0.0";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Box className="mb-8">
          <Typography variant="h4" fontWeight="bold">
            Ride Details (ID: {rideDetails.id})
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Customer ID: {rideDetails.userId}
                  </Typography>
                  <Chip
                    label={`${countdown}s`}
                    color={countdown < 10 ? "error" : "primary"}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pickup
                    </Typography>
                    <Typography fontWeight="medium">{rideDetails.pickupName || 'Loading...'}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <Directions color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Dropoff
                    </Typography>
                    <Typography fontWeight="medium">{rideDetails.dropoffName || 'Loading...'}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6} display="flex" alignItems="center" gap={1.5}>
                    <CurrencyRupee color="action" />
                    <Typography fontWeight="bold">
                      ₹{cost}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} display="flex" alignItems="center" gap={1.5}>
                    <Straighten color="action" />
                    <Typography fontWeight="bold">
                      {distance} km
                    </Typography>
                  </Grid>
                  {/* --- NEWLY ADDED CODE --- */}
                  <Grid item xs={12} display="flex" alignItems="center" gap={1.5} sx={{ mt: 1 }}>
                    {getVehicleIcon(rideDetails.vehicleType)}
                    <Typography fontWeight="bold">
                      {rideDetails.vehicleType}
                    </Typography>
                  </Grid>
                  {/* --- END OF NEW CODE --- */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <MapDisplay
                userLocation={driverCoords}
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
              />
            </Card>
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Confirm Action
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box display="flex" gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Accept Ride"
                  )}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  disabled={loading}
                >
                  Reject
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}