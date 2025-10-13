// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Box,
//   Avatar,
//   Divider,
//   Chip,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   TwoWheeler,
//   CurrencyRupee,
//   Star,
//   History,
//   LocationOn,
//   VerifiedUser,
//   AccountBalanceWallet,
//   MyLocation,
// } from "@mui/icons-material";
// import LocationService from "../../services/locationService"; // Ensure this is imported
// import DriverService from "../../services/DriverService";
// import RideService from "../../services/RideService";
// import useGeolocation from "../../hooks/useGeolocation";
// import useAuth from "../../hooks/useAuth";
// import Wallet from "./Wallet.jsx";
// import RideRequestInbox from "./RideRequestInbox";

// // Helper component for Tab Panels (no changes needed)
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
//     </div>
//   );
// }

// export default function Dashboard() {
//   // --- Original Logic ---
//   const { user, token } = useAuth(); // Destructured token here
//   const geo = useGeolocation();
//   const navigate = useNavigate();
//   const locationIntervalRef = useRef(null);
//   const pollingIntervalRef = useRef(null);
//   const requestTimersRef = useRef({}); // NEW: Ref to store timers for ride requests

//   const getInitialOnlineStatus = () => {
//     return localStorage.getItem("driverOnlineStatus") === "true";
//   };

//   // UI State
//   const [tabValue, setTabValue] = useState(0);
//   const [walletOpen, setWalletOpen] = useState(false);
//   const [online, setOnline] = useState(getInitialOnlineStatus);
//   const [rideRequests, setRideRequests] = useState([]);

//   // Data & Loading State
//   const [driverProfile, setDriverProfile] = useState(null);
//   const [summary, setSummary] = useState([]);
//   const [recentRides, setRecentRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
//   const [error, setError] = useState("");

//   // --- NEW: Function to remove a ride request and clear its associated timer ---
//   const handleRemoveRequest = (rideId) => {
//     // Clear the specific timer for this ride to prevent it from running later
//     if (requestTimersRef.current[rideId]) {
//       clearTimeout(requestTimersRef.current[rideId]);
//       delete requestTimersRef.current[rideId]; // Clean up the ref
//     }
//     // Update state to remove the ride from the UI
//     setRideRequests((prevRequests) =>
//       prevRequests.filter((request) => request.id !== rideId)
//     );
//   };

//   // --- Function to handle a single location update (UNCHANGED) ---
//   const handleUpdateLocation = async () => {
//     if (!user?.id || typeof geo?.latitude !== "number") {
//       setError(
//         "Current location is not available. Please enable location services."
//       );
//       return;
//     }

//     setIsUpdatingLocation(true);
//     setError("");

//     const locationRequest = {
//       userId: user.id,
//       latitude: geo.latitude,
//       longitude: geo.longitude,
//       locationType: "CURRENT",
//       timestamp: Date.now(),
//     };

//     try {
//       await LocationService.updateLocation(locationRequest);
//     } catch (err) {
//       setError("Failed to send location. You may appear offline.");
//       console.error("Location update failed:", err);
//       // If location fails, automatically go offline to stop trying
//       setOnline(false);
//       clearInterval(locationIntervalRef.current);
//     } finally {
//       setIsUpdatingLocation(false);
//     }
//   };

//   // --- MODIFIED: Function to poll for new rides and set a 60-second timer for each ---
//   const checkForNewRides = async () => {
//     if (!online) return; // Don't poll if offline
//     console.log("Polling for new rides...");

//     try {
//       const response = await DriverService.getRideRequests(token);
//       const newRequests = response.data;

//       if (Array.isArray(newRequests) && newRequests.length > 0) {
//         setRideRequests((prevRequests) => {
//           const existingIds = new Set(prevRequests.map((r) => r.id));
//           const uniqueNewRequests = newRequests.filter(
//             (r) => !existingIds.has(r.id)
//           );

//           if (uniqueNewRequests.length > 0) {
//             console.log("New rides found:", uniqueNewRequests);

//             // Set a 60-second timer for each new, unique request
//             uniqueNewRequests.forEach((request) => {
//               const timerId = setTimeout(() => {
//                 console.log(`Request ${request.id} expired after 60 seconds.`);
//                 handleRemoveRequest(request.id);
//               }, 60000); // 60 seconds
//               requestTimersRef.current[request.id] = timerId;
//             });

//             // Add the new requests to the state
//             return [...prevRequests, ...uniqueNewRequests];
//           }
//           return prevRequests;
//         });
//       }
//     } catch (err) {
//       console.error("Polling for rides failed:", err);
//     }
//   };

//   // --- Effect to manage online/offline duties (UNCHANGED) ---
//   useEffect(() => {
//     const startActiveDuties = () => {
//       console.log("Driver is ONLINE. Starting active duties...");
//       handleUpdateLocation();
//       checkForNewRides();

//       locationIntervalRef.current = setInterval(handleUpdateLocation, 20000);
//       pollingIntervalRef.current = setInterval(checkForNewRides, 5000);
//     };

//     const stopActiveDuties = () => {
//       console.log("Driver is OFFLINE. Stopping active duties...");
//       clearInterval(locationIntervalRef.current);
//       clearInterval(pollingIntervalRef.current);
//       locationIntervalRef.current = null;
//       pollingIntervalRef.current = null;
//     };

//     if (online) {
//       startActiveDuties();
//     } else {
//       stopActiveDuties();
//     }

//     return () => {
//       stopActiveDuties();
//     };
//   }, [online, token]);


//   // --- Function to toggle online status (UNCHANGED) ---
//   const toggleOnlineStatus = () => {
//     const newOnlineStatus = !online;
//     setOnline(newOnlineStatus);
//     localStorage.setItem("driverOnlineStatus", newOnlineStatus);
//     // The `useEffect` hook handles starting/stopping the intervals
//   };

//   // --- Main data fetching and verification logic (UNCHANGED logic, MODIFIED cleanup) ---
//   useEffect(() => {
//     async function fetchDashboardData() {
//       if (!user?.id) {
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError("");

//       try {
//         const driverRes = await DriverService.getDriverByUserId(user.id);
//         const profile = driverRes?.data;
//         setDriverProfile(profile);

//         if (profile?.verificationStatus === "APPROVED") {
//           // Assuming getAllRides takes token or fetches for current driver
//           const ridesRes = await RideService.getAllRides();
//           const allRides =
//             ridesRes?.data?.data || ridesRes?.data || ridesRes || [];
//           const myRides = Array.isArray(allRides)
//             ? allRides.filter((r) => r.driverId === profile.id)
//             : [];

//           const completedRides = myRides.filter(
//             (r) => r.status === "COMPLETED"
//           );
//           const totalEarnings = completedRides.reduce(
//             (sum, ride) => sum + (ride.cost || 0),
//             0
//           );



//           setRecentRides(completedRides.slice(0, 5));
//         }
//       } catch (err) {
//         if (err.status === 404) {
//           setDriverProfile(null);
//         } else {
//           setError("Failed to load dashboard data. Please refresh the page.");
//           console.error("Dashboard fetch error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDashboardData();

//     // Cleanup effect: ensures all intervals and timers are cleared on unmount
//     return () => {
//       if (locationIntervalRef.current) {
//         clearInterval(locationIntervalRef.current);
//       }
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//       // NEW: Clear all pending ride request timers to prevent memory leaks
//       Object.values(requestTimersRef.current).forEach(clearTimeout);
//     };
//   }, [user]);

//   // --- MODIFIED: Handle Accept Ride now also clears the request from the inbox ---
//   const handleAcceptRide = (rideRequestObject) => {
//     // Immediately remove the ride from the inbox and cancel its timeout
//     handleRemoveRequest(rideRequestObject.id);

//     try {
//       // Navigate to the details page
//       navigate("/rider/accept-ride", {
//         state: { rideDetails: rideRequestObject },
//       });
//     } catch (err) {
//       console.error("Failed to navigate to accept ride:", err);
//       setError(
//         "Could not process ride acceptance. Please try again."
//       );
//     }
//   };

//   const handleTabChange = (event, newValue) => setTabValue(newValue);

//   // --- RENDER STATES (UNCHANGED) ---

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "80vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // State 1 & 2: Verification Required / Under Review (UNCHANGED)
//   if (!driverProfile || driverProfile.verificationStatus === "REJECTED") {
//     return (
//       <Box
//         sx={{
//           p: 4,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "80vh",
//         }}
//       >
//         <Card
//           sx={{
//             maxWidth: 500,
//             textAlign: "center",
//             p: 3,
//             boxShadow: 4,
//             borderRadius: 3,
//           }}
//         >
//           <CardContent>
//             <Avatar
//               sx={{
//                 mx: "auto",
//                 mb: 2,
//                 bgcolor: "primary.main",
//                 width: 60,
//                 height: 60,
//               }}
//             >
//               <VerifiedUser sx={{ fontSize: 30 }} />
//             </Avatar>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Verification Required
//             </Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               To start accepting rides and earning money, you need to complete
//               your driver verification process.
//             </Typography>
//             {driverProfile?.verificationStatus === "REJECTED" && (
//               <Alert severity="warning" sx={{ mb: 2 }}>
//                 Your previous application was rejected. Please review your
//                 details and resubmit.
//               </Alert>
//             )}
//             <Button
//               variant="contained"
//               size="large"
//               onClick={() => navigate("/rider-verification")}
//             >
//               Start Verification
//             </Button>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   if (driverProfile.verificationStatus === "PENDING") {
//     return (
//       <Box
//         sx={{
//           p: 4,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "80vh",
//         }}
//       >
//         <Card
//           sx={{
//             maxWidth: 500,
//             textAlign: "center",
//             p: 3,
//             boxShadow: 4,
//             borderRadius: 3,
//           }}
//         >
//           <CardContent>
//             <Avatar
//               sx={{
//                 mx: "auto",
//                 mb: 2,
//                 bgcolor: "secondary.main",
//                 width: 60,
//                 height: 60,
//               }}
//             >
//               <History sx={{ fontSize: 30 }} />
//             </Avatar>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Application Under Review
//             </Typography>
//             <Typography color="text.secondary">
//               Your application is being reviewed by our team. We will notify you
//               once the status changes.
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   // State 3: Driver is APPROVED. Render the full dashboard. (UNCHANGED)
//   return (
//     <>
//       <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//         <Box className="max-w-7xl mx-auto">
//           {/* Dashboard Header and Global Error Alert */}
//           <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//             <Typography variant="h4" className="font-bold text-gray-800">
//               Rider Dashboard
//             </Typography>
//             {error && (
//               <Alert
//                 severity="error"
//                 sx={{ mt: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
//               >
//                 {error}
//               </Alert>
//             )}
//           </Box>

//           {/* Main Grid Container */}
//           <Grid container spacing={4}>
//             {/* Summary Cards (Full Width at Top) */}
//             {summary.map((item) => (
//               <Grid item xs={12} sm={4} key={item.title}>
//                 <Card
//                   sx={{
//                     borderRadius: 3,
//                     boxShadow: 2,
//                     transition: "transform 0.2s",
//                     "&:hover": { transform: "translateY(-2px)" },
//                   }}
//                 >
//                   <CardContent
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       py: 3,
//                     }}
//                   >
//                     <Avatar sx={{ bgcolor: "primary.light" }}>
//                       {item.icon}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="caption" color="text.secondary">
//                         {item.title}
//                       </Typography>
//                       <Typography variant="h5" fontWeight="bold">
//                         {item.value}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}

//             <Grid item xs={12} md={8}>
//               {/* Main Content Area: Ride Inbox / Offline Message */}
//               <Card
//                 sx={{ borderRadius: 3, boxShadow: 3, minHeight: "400px" }}
//               >
//                 <CardContent sx={{ p: 0 }}>
//                   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                     <Tabs value={tabValue} onChange={handleTabChange}>
//                       <Tab label="New Ride Requests" />
//                       <Tab label="Statistics & History" />
//                     </Tabs>
//                   </Box>

//                   {/* Tab Panel 0: Ride Requests */}
//                   <TabPanel value={tabValue} index={0}>
//                     {online ? (
//                       <RideRequestInbox
//                         requests={rideRequests}
//                         onAccept={handleAcceptRide} // Pass the updated handler
//                       />
//                     ) : (
//                       <Box sx={{ textAlign: "center", p: 4 }}>
//                         <TwoWheeler
//                           color="action"
//                           sx={{ fontSize: 60, mb: 2 }}
//                         />
//                         <Typography
//                           variant="h6"
//                           fontWeight="bold"
//                           color="text.secondary"
//                           sx={{ mb: 1 }}
//                         >
//                           Go Online to Start Earning!
//                         </Typography>
//                         <Typography color="text.secondary">
//                           Toggle the "Go Online" button on the right to start
//                           receiving ride requests.
//                         </Typography>
//                       </Box>
//                     )}
//                   </TabPanel>

//                   {/* Tab Panel 1: Statistics & History */}
//                   <TabPanel value={tabValue} index={1}>
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       Recent Completed Rides
//                     </Typography>
//                     {recentRides.length > 0 ? (
//                       <List>
//                         {recentRides.map((ride, index) => (
//                           <React.Fragment key={ride.id}>
//                             <ListItem>
//                               <ListItemAvatar>
//                                 <Avatar sx={{ bgcolor: "success.light" }}>
//                                   <History />
//                                 </Avatar>
//                               </ListItemAvatar>
//                               <ListItemText
//                                 primary={`Trip to ${ride.endLocation}`}
//                                 secondary={`Earned: ₹${
//                                   ride.cost?.toFixed(2) || "N/A"
//                                 } | Date: ${new Date(
//                                   ride.endTime
//                                 ).toLocaleDateString()}`}
//                               />
//                             </ListItem>
//                             {index < recentRides.length - 1 && (
//                               <Divider component="li" />
//                             )}
//                           </React.Fragment>
//                         ))}
//                       </List>
//                     ) : (
//                       <Typography color="text.secondary">
//                         No recent completed rides found.
//                       </Typography>
//                     )}
//                     <Box sx={{ mt: 3, textAlign: "right" }}>
//                       <Button
//                         variant="text"
//                         onClick={() => navigate("/rider/ride-history")}
//                       >
//                         View Full History
//                       </Button>
//                     </Box>
//                   </TabPanel>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Right Sidebar: Status & Actions */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
//                     Session Controls
//                   </Typography>

//                   {/* Online/Offline Status */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       mb: 2,
//                       p: 1,
//                       border: "1px solid",
//                       borderColor: online ? "success.main" : "warning.main",
//                       borderRadius: 1,
//                     }}
//                   >
//                     <Typography variant="subtitle1" fontWeight="medium">
//                       Status:
//                     </Typography>
//                     <Chip
//                       label={online ? "Online" : "Offline"}
//                       color={online ? "success" : "warning"}
//                       size="small"
//                       sx={{ fontWeight: "bold" }}
//                     />
//                   </Box>

//                   {/* Location Info */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 2,
//                     }}
//                   >
//                     <LocationOn color="action" sx={{ fontSize: 18 }} />
//                     <Typography variant="body2" color="text.secondary">
//                       Current Location:{" "}
//                       {typeof geo?.latitude === "number"
//                         ? `${geo.latitude.toFixed(
//                             4
//                           )}, ${geo.longitude.toFixed(4)}`
//                         : "Unavailable"}
//                     </Typography>
//                   </Box>

//                   {/* Main Action Toggle */}
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     size="large"
//                     onClick={toggleOnlineStatus}
//                     color={online ? "error" : "primary"}
//                     sx={{ mb: 2 }}
//                   >
//                     {online ? "Go Offline" : "Go Online"}
//                   </Button>

//                   <Divider sx={{ my: 2 }} />

//                   {/* Secondary Actions */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: 1.5,
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       onClick={handleUpdateLocation}
//                       startIcon={
//                         isUpdatingLocation ? (
//                           <CircularProgress size={20} />
//                         ) : (
//                           <MyLocation />
//                         )
//                       }
//                       disabled={
//                         isUpdatingLocation ||
//                         typeof geo?.latitude !== "number"
//                       }
//                     >
//                       Force Location Update
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       onClick={() => setWalletOpen(true)}
//                       startIcon={<AccountBalanceWallet />}
//                     >
//                       View Wallet & Earnings
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>

//               {/* Profile Card */}
//               <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
//                     Driver Profile
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Avatar
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         mr: 2,
//                         bgcolor: "primary.main",
//                       }}
//                     >
//                       {user?.firstName?.charAt(0) || "R"}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {user?.firstName || "Rider"} {user?.lastName}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Vehicle: {driverProfile?.vehicleType || "N/A"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Divider sx={{ mb: 2 }} />
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography variant="body2">Rating:</Typography>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Star
//                         color="warning"
//                         sx={{ fontSize: 16, mr: 0.5 }}
//                       />
//                       <Typography variant="body2" fontWeight="bold">
//                         {driverProfile?.rating?.toFixed(1) || "N/A"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </div>

//       {/* Wallet Dialog (UNCHANGED) */}
//       <Dialog
//         open={walletOpen}
//         onClose={() => setWalletOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           Wallet
//           <IconButton
//             onClick={() => setWalletOpen(false)}
//             sx={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Wallet />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
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
import LocationService from "../../services/locationService";
import DriverService from "../../services/DriverService";
import RideService from "../../services/RideService";
import useGeolocation from "../../hooks/useGeolocation";
import useAuth from "../../hooks/useAuth";
import Wallet from "./Wallet.jsx";
import RideRequestInbox from "./RideRequestInbox";

// Helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 3 } }}>{children}</Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const locationIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const requestTimersRef = useRef({});

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

  const handleRemoveRequest = (rideId) => {
    if (requestTimersRef.current[rideId]) {
      clearTimeout(requestTimersRef.current[rideId]);
      delete requestTimersRef.current[rideId];
    }
    setRideRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== rideId)
    );
  };

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
      setOnline(false);
      clearInterval(locationIntervalRef.current);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const checkForNewRides = async () => {
    if (!online) return;
    console.log("Polling for new rides...");

    try {
      const response = await DriverService.getRideRequests(token);
      const newRequests = response.data;

      if (Array.isArray(newRequests) && newRequests.length > 0) {
        setRideRequests((prevRequests) => {
          const existingIds = new Set(prevRequests.map((r) => r.id));
          const uniqueNewRequests = newRequests.filter(
            (r) => !existingIds.has(r.id)
          );

          if (uniqueNewRequests.length > 0) {
            console.log("New rides found:", uniqueNewRequests);
            uniqueNewRequests.forEach((request) => {
              const timerId = setTimeout(() => {
                console.log(`Request ${request.id} expired after 60 seconds.`);
                handleRemoveRequest(request.id);
              }, 60000);
              requestTimersRef.current[request.id] = timerId;
            });
            return [...prevRequests, ...uniqueNewRequests];
          }
          return prevRequests;
        });
      }
    } catch (err) {
      console.error("Polling for rides failed:", err);
    }
  };

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

  const toggleOnlineStatus = () => {
    const newOnlineStatus = !online;
    setOnline(newOnlineStatus);
    localStorage.setItem("driverOnlineStatus", newOnlineStatus);
  };

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

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      Object.values(requestTimersRef.current).forEach(clearTimeout);
    };
  }, [user]);

  const handleAcceptRide = (rideRequestObject) => {
    handleRemoveRequest(rideRequestObject.id);

    try {
      if (!rideRequestObject || !rideRequestObject.id) {
        throw new Error("Invalid ride request data");
      }

      const safeRideDetails = {
        ...rideRequestObject,
        startLatitude: rideRequestObject.startLatitude || 0,
        startLongitude: rideRequestObject.startLongitude || 0,
        endLatitude: rideRequestObject.endLatitude || 0,
        endLongitude: rideRequestObject.endLongitude || 0,
      };

      navigate("/rider/accept-ride", {
        state: { rideDetails: safeRideDetails },
      });
    } catch (err) {
      console.error("Failed to navigate to accept ride:", err);
      setError("Could not process ride acceptance. Please try again.");
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: { xs: "100vh", sm: "80vh" },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!driverProfile || driverProfile.verificationStatus === "REJECTED") {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "100vh", sm: "80vh" },
        }}
      >
        <Card
          sx={{
            maxWidth: { xs: "100%", sm: 500 },
            textAlign: "center",
            p: { xs: 2, sm: 3 },
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
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
              }}
            >
              <VerifiedUser sx={{ fontSize: { xs: 25, sm: 30 } }} />
            </Avatar>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Verification Required
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
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
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
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
          p: { xs: 2, sm: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "100vh", sm: "80vh" },
        }}
      >
        <Card
          sx={{
            maxWidth: { xs: "100%", sm: 500 },
            textAlign: "center",
            p: { xs: 2, sm: 3 },
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
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
              }}
            >
              <History sx={{ fontSize: { xs: 25, sm: 30 } }} />
            </Avatar>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Application Under Review
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Your application is being reviewed by our team. We will notify you
              once the status changes.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: { xs: 2, sm: 4, md: 6 },
          bgcolor: "grey.50",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
          {/* Dashboard Header and Global Error Alert */}
          <Box
            sx={{
              mb: { xs: 4, sm: 6 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "grey.800",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              }}
            >
              Rider Dashboard
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: { xs: 2, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
          {/* Main Grid Container */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Right Sidebar: Status & Actions */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  width: "100%",
                  minWidth: "1380px",
                  mb: { xs: 2, md: 3 },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    Session Controls
                  </Typography>

                  {/* Online/Offline Status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                      p: 1,
                      border: "1px solid",
                      borderColor: online ? "success.main" : "warning.main",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      Status:
                    </Typography>
                    <Chip
                      label={online ? "Online" : "Offline"}
                      color={online ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  {/* Location Info */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <LocationOn
                      color="action"
                      sx={{ fontSize: { xs: 16, sm: 18 } }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                    >
                      Current Location:{" "}
                      {typeof geo?.latitude === "number"
                        ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}`
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
                    sx={{
                      mb: 2,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      py: { xs: 1, sm: 1.5 },
                    }}
                  >
                    {online ? "Go Offline" : "Go Online"}
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  {/* Secondary Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 1, sm: 1.5 },
                    }}
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
                      disabled={isUpdatingLocation || typeof geo?.latitude !== "number"}
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                    >
                      Force Location Update
                    </Button>
                    {/* <Button
                      variant="outlined"
                      onClick={() => setWalletOpen(true)}
                      startIcon={<AccountBalanceWallet />}
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                    >
                      View Wallet & Earnings
                    </Button> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  minHeight: { xs: "300px", sm: "400px" },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider",width: "100%", minWidth: "1380px", }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      sx={{ "& .MuiTab-root": { fontSize: { xs: "0.85rem", sm: "0.9rem" } } }}
                    >
                      <Tab label="New Ride Requests" />
                      <Tab label="Statistics & History" />
                    </Tabs>
                  </Box>

                  {/* Tab Panel 0: Ride Requests */}
                  <TabPanel value={tabValue} index={0} >
                    {online ? (
                      <Box sx={{ maxHeight: { xs: "400px", sm: "500px" }, overflowY: "auto", width: "100%", maxWidth: "1330px" }}>
                        <RideRequestInbox
                          requests={rideRequests}
                          onAccept={handleAcceptRide}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center", p: { xs: 3, sm: 4 } }}>
                        <TwoWheeler
                          color="action"
                          sx={{ fontSize: { xs: 50, sm: 60 }, mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                        >
                          Go Online to Start Earning!
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          Toggle the "Go Online" button to start receiving ride requests.
                        </Typography>
                      </Box>
                    )}
                  </TabPanel>

                  {/* Tab Panel 1: Statistics & History */}
                  <TabPanel value={tabValue} index={1} >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                    >
                      Recent Completed Rides
                    </Typography>
                    {recentRides.length > 0 ? (
                      <List sx={{ maxHeight: { xs: "400px", sm: "500px" }, overflowY: "auto" }}>
                        {recentRides.map((ride, index) => (
                          <React.Fragment key={ride.id}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "success.light" }}>
                                  <History />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`Trip to ${ride.endLocation}`}
                                secondary={`Earned: ₹${ride.cost?.toFixed(2) || "N/A"} | Date: ${new Date(
                                  ride.endTime
                                ).toLocaleDateString()}`}
                                primaryTypographyProps={{
                                  fontSize: { xs: "0.9rem", sm: "1rem" },
                                }}
                                secondaryTypographyProps={{
                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                }}
                              />
                            </ListItem>
                            {index < recentRides.length - 1 && (
                              <Divider component="li" />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        No recent completed rides found.
                      </Typography>
                    )}
                    <Box sx={{ mt: 3, textAlign: "right" }}>
                      <Button
                        variant="text"
                        onClick={() => navigate("/rider/ride-history")}
                        sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                      >
                        View Full History
                      </Button>
                    </Box>
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Wallet Dialog */}
      <Dialog
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={{ xs: true, sm: false }}
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
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Wallet />
        </DialogContent>
      </Dialog>
    </>
  );
}