
import useGeolocation from "../../hooks/useGeolocation";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentService from "../../services/PaymentService.js";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person,
  Phone,
  Message,
  Star,
  DirectionsBike,
  LocalTaxi,
  AirportShuttle,
  LocationOn,
  AccessTime,
  NearMe,
  Share,
  Cancel,
} from "@mui/icons-material";
import MapDisplay from "../../components/shared/MapDisplay";

import RideService from "../../services/RideService.js";

export default function RideTracking() {
  const geo = useGeolocation();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [ride, setRide] = useState(null);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState(null); // { latitude, longitude }
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);

  const [trackingDataState, setTrackingDataState] = useState([
    { id: 1, status: "REQUESTED", time: "", completed: false },
    { id: 2, status: "ACCEPTED", time: "", completed: false },
    { id: 3, status: "IN_PROGRESS", time: "", completed: false },
    { id: 4, status: "COMPLETED", time: "", completed: false },
  ]);
  const [otp, setOtp] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState("");
  const [distance, setDistance] = useState("");

  // payment dialog state (was missing -> caused ReferenceError)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // prevent repeated redirects to rating
  const [redirectedToRating, setRedirectedToRating] = useState(false);

  // Initialize ride from navigation state and current geolocation / backend response
  useEffect(() => {
    const state = routerLocation.state || {};
    const rideResp = state.ride || {};
    
    // Use the calculated fare from RideBooking if available, otherwise use backend cost
    const calculatedFare = state.calculatedFare || (typeof rideResp.cost === "number" ? rideResp.cost : 0);
    
    // Compose a local ride model using backend response
    const initialRide = {
      id: rideResp.id,
      userId: rideResp?.userId,
      pickup: state.pickup || "",
      destination: state.dropoff || "",
      fare: calculatedFare, // Use the calculated fare from RideBooking
      status: rideResp.status || "REQUESTED",
    };
    
    if (rideResp.driver) {
      initialRide.driver = rideResp.driver;
      initialRide.driverId = rideResp.driver.id; // ✅ Add this
    }
    
    setRide(initialRide);
    
    // set coordinates from backend where available
    if (
      rideResp?.driverLocation &&
      typeof rideResp.driverLocation.latitude === "number" &&
      typeof rideResp.driverLocation.longitude === "number"
    ) {
      setDriverCoords({
        latitude: rideResp.driverLocation.latitude,
        longitude: rideResp.driverLocation.longitude,
      });
    }
    
    if (
      rideResp?.dropOffLocation &&
      typeof rideResp.dropOffLocation.latitude === "number" &&
      typeof rideResp.dropOffLocation.longitude === "number"
    ) {
      setDestinationCoords({
        latitude: rideResp.dropOffLocation.latitude,
        longitude: rideResp.dropOffLocation.longitude,
      });
    } else {
      const parsed =
        typeof state.dropoff === "string"
          ? state.dropoff.split(",").map((s) => parseFloat(s.trim()))
          : [];
      if (parsed.length === 2 && parsed.every((n) => !Number.isNaN(n))) {
        setDestinationCoords({ latitude: parsed[0], longitude: parsed[1] });
      }
    }
    
    if (
      geo &&
      typeof geo.latitude === "number" &&
      typeof geo.longitude === "number"
    ) {
      setCurrentCoords({ latitude: geo.latitude, longitude: geo.longitude });
      setLocation({ latitude: geo.latitude, longitude: geo.longitude });
    }
    setLoading(false);
  }, [routerLocation.state, geo]);

  useEffect(() => {
    // Guard clause: Exit if we don't have the necessary data points.
    if (!ride || !driverCoords || !currentCoords) {
      setDistance("Calculating...");
      setEta("Calculating...");
      return;
    }

    let startingPoint = driverCoords;
    let endPoint;

    // Determine the correct destination for the ETA calculation
    if (ride.status === "ACCEPTED") {
      // If the ride is accepted, the driver is coming to YOU (the customer).
      // The target is your current location (the pickup point).
      endPoint = currentCoords;
    } else {
      // If the ride is STARTED or later, the target is the final destination.
      endPoint = destinationCoords;
    }

    // If we don't have a valid endpoint for some reason, exit.
    if (!endPoint) return;

    // Now, calculate the distance and ETA based on the correct points.
    const km = haversineKm(startingPoint, endPoint);
    setDistance(`${km.toFixed(1)} km`);

    // A simple ETA calculation (average speed of 25 km/h)
    const minutes = Math.max(1, Math.round((km / 25) * 60));
    setEta(`${minutes} min`);
  }, [ride, driverCoords, currentCoords, destinationCoords]); // Dependency array is key

  // derive progress step from backend status
  useEffect(() => {
    const status = (ride?.status || "").toUpperCase();
    console.log("status:- ", status);
    const map = { REQUESTED: 0, ACCEPTED: 1, IN_PROGRESS: 2, COMPLETED: 3 };
    if (status in map) setCurrentStep(map[status]);
    console.log("current step:- ", currentStep);
  }, [ride?.status]);

  // Synchronize trackingData completed flags with currentStep
  useEffect(() => {
    setTrackingDataState((prev) =>
      prev.map((step, idx) => ({
        ...step,
        completed: idx < currentStep,
      }))
    );
    console.log("setTracking:- ", setTrackingDataState);
  }, [currentStep]);

  // Compute live ETA/distance using haversine if we have coordinates
  const haversineKm = (a, b) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  useEffect(() => {
    if (!ride) return;
    const dest = destinationCoords;
    const curr =
      driverCoords ||
      currentCoords ||
      location ||
      (geo &&
      typeof geo.latitude === "number" &&
      typeof geo.longitude === "number"
        ? { latitude: geo.latitude, longitude: geo.longitude }
        : null);
    if (dest && curr) {
      const km = haversineKm(curr, dest);
      setDistance(`${km.toFixed(1)} km`);
      const minutes = Math.max(1, Math.round((km / 25) * 60));
      setEta(`${minutes} min`);
    } else {
      setDistance("N/A");
      setEta("N/A");
    }
  }, [
    ride,
    driverCoords,
    currentCoords,
    destinationCoords,
    location,
    geo?.latitude,
    geo?.longitude,
  ]);

 const  deleteRide = async (token) => {
    setTimeout(() => {
      if(ride?.status=="REQUESTED" && !redirectedToRating){
        RideService.deleteRide(ride.id, token);
        navigate("/ride-booking");
      }
    },60000);
  }

  // Poll backend for latest ride data as fallback to websocket
  useEffect(
    () => {
      if (!ride?.id) return;
      const interval = setInterval(async () => {
        try {
          const res = await RideService.getRide(ride.id);
          const safeOtp = res?.data?.otp ?? null;
          console.log("otp:- ", safeOtp);
          
          const data = res?.data || res; // normalize ApiResponse vs direct
          
          setRide((prev) => ({
            ...prev,
            userId: data.userId || prev?.userId, // ✅ Capture userId
            driverId: data.driverId || prev?.driverId, // ✅ Capture driverId
            status: data.status || prev?.status,
            // Keep the original fare from RideBooking, don't override with backend data
            fare: prev?.fare || data.cost || 0,
            driver: data.driver || prev?.driver,
          }));
          
          setOtp(safeOtp);
          console.log("Customer received location data:", res.data); // <-- ADD THIS LOG

          if (
            data?.driverLocation &&
            typeof data.driverLocation.latitude === "number"
          ) {
            setDriverCoords({
              latitude: data.driverLocation.latitude,
              longitude: data.driverLocation.longitude,
            });
          }
          if (
            data?.dropOffLocation &&
            typeof data.dropOffLocation.latitude === "number"
          ) {
            setDestinationCoords({
              latitude: data.dropOffLocation.latitude,
              longitude: data.dropOffLocation.longitude,
            });
          }
          // Don't update fare from backend data - keep the RideBooking calculated fare
          // if (typeof data?.cost === "number") {
          //   setRide((prev) => (prev ? { ...prev, fare: data.cost } : prev));
          // }
          
          if (typeof data?.status === "string") {
            setRide((prev) => (prev ? { ...prev, status: data.status } : prev));
          }

          if (data?.driver) {
            setRide((prev) => (prev ? { ...prev, driver: data.driver } : prev));
          }
          if (data.status === "COMPLETED" && !showPaymentDialog) {
            setShowPaymentDialog(true);
            clearInterval(interval); // Stop polling once the ride is complete
          }
        } catch (e) {
          // swallow polling errors
        }
      }, 5000);
      return () => clearInterval(interval);
    },
    [ride?.id],
    showPaymentDialog
  );

  // compute progress percent based on current step vs steps before final completion
  const totalProgressSteps = Math.max(1, trackingDataState.length - 1); // avoid divide by zero
  const progressPercent = Math.min(
    100,
    Math.round((currentStep / totalProgressSteps) * 100)
  );

  // Get vehicle icon based on type
  const getVehicleIcon = () => {
    if (
      ride?.driver?.vehicle?.toLowerCase().includes("bike") ||
      ride?.driver?.vehicle?.toLowerCase().includes("activa")
    ) {
      return <DirectionsBike className="text-yellow-500" />;
    } else if (ride?.driver?.vehicle?.toLowerCase().includes("auto")) {
      return <AirportShuttle className="text-yellow-500" />;
    } else {
      return <LocalTaxi className="text-yellow-500" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch ((ride?.status || "").toUpperCase()) {
      case "COMPLETED":
        return "#4CAF50";
      case "IN_PROGRESS":
        return "#2196F3";
      case "CANCELLED":
        return "#F44336";
      case "ACCEPTED":
        return "#FFB300";
      default:
        return "#FF9800";
    }
  };

  // load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.getElementById("razorpay-sdk");
      if (existing) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-sdk";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // const handlePay = async () => {
  //   if (!ride) return;
  //   setPaymentProcessing(true);
  //   const res = await loadRazorpayScript();
  //   const amountInPaise = Math.round((ride.fare || 0) * 100);

  //   if (!res) {
  //     alert("Razorpay SDK failed to load. Please try again later.");
  //     setPaymentProcessing(false);
  //     return;
  //   }

  //   const options = {
  //     key: "rzp_test_1234567890", // mock/test key
  //     amount: amountInPaise,
  //     currency: "INR",
  //     name: "Rapido",
  //     description: `Payment for ride #${ride.id}`,
  //     handler: function (response) {
  //       setPaymentProcessing(false);
  //       setShowPaymentDialog(false);
  //       alert("Payment successful. Redirecting to rating page.");
  //       navigate("/costumor/RatingPage");
  //     },
  //     prefill: {
  //       name: "Customer",
  //       email: "customer@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#1976d2",
  //     },
  //   };

  //   // eslint-disable-next-line no-undef
  //   const rzp = new window.Razorpay(options);
  //   rzp.on("payment.failed", function (response) {
  //     setPaymentProcessing(false);
  //     alert("Payment failed. Please try again.");
  //   });
  //   rzp.open();
  // };

  const handlePay = async () => {
    if (!ride) return;
    setPaymentProcessing(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert("Payment gateway failed to load. Please try again.");
      setPaymentProcessing(false);
      return;
    }

    try {
      // Get current user info from localStorage or your auth context
      console.log("localStorage:-", localStorage)
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Please login to make payment");
        setPaymentProcessing(false);
        return;
      }

      // --- Step A: Initiate Payment with ALL required fields ---
      const initiateRequest = {
        rideId: ride.id,
        userId: ride.userId || getCurrentUserId(), // Get from ride or decode from token
        driverId: ride.driver?.id || ride.driverId, // Get from driver object
        amount: ride.fare, // Use the fare from RideBooking
        paymentMethod: "UPI", // ✅ Add payment method
      };

      console.log("Initiating payment with:", initiateRequest); // Debug log

      const orderResponse = await PaymentService.initiatePayment(
        initiateRequest,
        token // Pass token
      );

      // Your backend should return the order details from Razorpay
      const { razorpayOrderId, amount } = orderResponse;

      
      const options = {
        key: "rzp_test_RBUXcgoNul6l9q", 
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Rapido",
        description: `Payment for ride #${ride.id}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // --- Step C: Verify Payment ---
          const verifyRequest = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          await PaymentService.verifyPayment(verifyRequest, token); // Pass token

          // --- Step D: Success ---
          setPaymentProcessing(false);
          setShowPaymentDialog(false);
          alert("Payment successful!");
          navigate("/ride-booking", { state: { ride } });
        },
        prefill: {
          name: "Customer", // Get from auth context if available
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#1976d2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setPaymentProcessing(false);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during payment."
      );
      setPaymentProcessing(false);
    }
  };

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    // Option 1: If you store user info in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }

    // Option 2: Decode from JWT token (you'll need a JWT decode library)
    // const token = localStorage.getItem('token');
    // const decoded = jwtDecode(token);
    // return decoded.userId;

    return null;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  let routeToShow = { pickup: null, dropoff: null };
  if (ride && driverCoords && currentCoords && destinationCoords) {
    console.log("status:- ", ride.status);
    if (ride.status === "ACCEPTED") {
      // Show the route from the driver to the customer's pickup
      routeToShow = {
        pickup: [driverCoords.latitude, driverCoords.longitude],
        dropoff: [currentCoords.latitude, currentCoords.longitude],
      };
    } else if (ride.status === "IN_PROGRESS" || ride.status === "STARTED") {
      // Show the route from the customer's pickup to the final destination
      routeToShow = {
        pickup: [currentCoords.latitude, currentCoords.longitude],
        dropoff: [destinationCoords.latitude, destinationCoords.longitude],
      };
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-grey-50">
        <div className="max-w-6xl w-full" style={{ maxWidth: 1400 }}>
        
          {/* Header */}
          <Box className="mb-4 mt-4">
            <Typography variant="h4" className="font-bold text-gray-800">
              Track Your Ride
            </Typography>
           
          </Box>
            
              {/* Status Card */}
              <Card
                className="shadow-md rounded-xl mb-4"
                style={{  overflow: "auto",width:"100%",maxWidth: 1400 ,backgroundColor:"#f6f7f9"}}
              >
                <CardContent className="p-6">
                  <Box className="flex justify-between items-center mb-2 ">
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-800"
                    >
                      Ride Status
                    </Typography>
                    <Chip
                      label={ride.status}
                      size="medium"
                      style={{
                        backgroundColor: `${getStatusColor()}20`,
                        color: getStatusColor(),
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  <Box className="mb-6">
                    
                    <Box className="flex items-center">
                      <LocationOn className="text-green-600 mr-2" />
                      <Typography variant="h6" className="font-medium">
                        {ride.pickup}
                      </Typography>
                    </Box>
                    <Box className="flex items-center my-1">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mx-2"></div>
                      <div className="flex-1 h-0.5 bg-gray-300"></div>
                    </Box>
                    <Box className="flex items-center">
                      <LocationOn className="text-red-600 mr-2" />
                      <Typography variant="h6" className="font-medium">
                        {ride.destination}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider className="my-6" />

                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600">
                        Estimated Time
                      </Typography>
                      <Typography variant="h6" className="font-medium">
                        {eta}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" className="text-gray-600">
                        Distance
                      </Typography>
                      <Typography variant="h6" className="font-medium">
                        {distance}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" className="text-gray-600">
                        Fare
                      </Typography>
                      <Typography variant="h6" className="font-medium">
                        ₹{ride.fare}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Map */}
              
                {/* <CardContent className="p-0 shadow-md rounded-xl " style={{backgroundColor:"#f6f7f9"}}> */}
                  {/* <Typography
                    variant="h6"
                    className="font-bold text-gray-800 p-4 pb-2"
                  >
                    Live Tracking
                  </Typography> */}
                  <Divider />
                  <div style={{ position: "relative", width: "100%", height: "350px", overflow: "hidden", zIndex: 1 }}>
                    <MapDisplay
                      userLocation={
                        currentCoords
                          ? [currentCoords.latitude, currentCoords.longitude]
                          : null
                      }
                      riderLocation={
                        driverCoords
                          ? [driverCoords.latitude, driverCoords.longitude]
                          : null
                      }
                      pickupCoords={routeToShow.pickup}
                      dropoffCoords={routeToShow.dropoff}
                    />
                  </div>
                {/* </CardContent> */}
             
            

            
              {/* Driver Info */}
              <Card
                className="shadow-md rounded-xl mb-4"
                style={{ maxHeight: 340, overflow: "auto", backgroundColor:"#f6f7f9" }}
              >
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 mb-4"
                  >
                    Driver Information
                  </Typography>
                  <Divider className="my-6 height-3" /> 
                  {ride.status === "ACCEPTED" ||
                  ride.status === "STARTED" ||
                  ride.status === "IN_PROGRESS" ||
                  ride.status === "COMPLETED" ? (
                    // --- If YES, show the full driver details ---
                    <>
                      {ride.driver ? (
                        <>
                          <Box className="flex items-center mb-4">
                            
                            <Box>
                              <Typography variant="h4" className="font-medium ">
                                {ride.driver.username}
                              </Typography>
                              
                            </Box>
                          </Box>

                          {/* <Divider className="my-4" /> */}
                          <Box className="flex justify-between items-center">
                            <Box className="flex justify-between">
                              <Typography fontWeight="medium" >
                                {ride.driver.vehicleModel}
                              </Typography>
                              <Chip
                                label={ride.driver.vehicleNumber || "N/A"}
                                variant="outlined"
                                sx={{
                                  mt: 0.5,
                                  ml: 4,
                                  fontWeight: "bold",
                                  letterSpacing: 1,
                                }}
                              />

                              <Typography fontWeight="medium" className="ml-10">Otp</Typography>
                              <Chip
                                label={otp || "N/A"}
                                variant="outlined"
                                sx={{
                                  mt: 0.5,
                                  ml: 4,
                                  fontWeight: "bold",
                                  letterSpacing: 1,
                                }}
                              />
                            </Box>
                            {/* Use the getVehicleIcon function you already have */}
                            {getVehicleIcon()}
                          </Box>
                          {/* <Divider className="my-4" /> */}
                          {/* ... Other driver details like vehicle, license plate, etc. ... */}
                          {/* <Box className="flex justify-between">
                            <Button startIcon={<Phone />}>Call Driver</Button>
                            <Button variant="outlined" startIcon={<Message />}>
                              Message
                            </Button>
                          </Box> */}
                        </>
                      ) : (
                        // This is a fallback in case driver data is missing after acceptance
                        <Typography color="text.secondary">
                          Waiting for driver details...
                        </Typography>
                      )}
                    </>
                  ) : (
                    // --- If NO (status is 'REQUESTED'), show a searching message ---
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      <CircularProgress sx={{ mb: 2 }} />
                      <Typography color="text.secondary">
                        Searching for a nearby driver...
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        We're connecting you with the best driver for your trip.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Tracking Progress */}
              <Card className="shadow-md rounded-xl flex-1" style={{ backgroundColor:"#f6f7f9" }}>
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 mb-4"
                  >
                    Ride Progress
                  </Typography>
                  <Box className="space-y-4">
                    <Box className="space-y-4">
                      <Box className="flex items-center">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            ride.status === "COMPLETED"
                              ? "bg-green-500"
                              : ride.status === "IN_PROGRESS" ||
                                ride.status === "STARTED"
                              ? "bg-blue-500"
                              : ride.status === "ACCEPTED"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {(ride.status === "COMPLETED" ||
                            ride.status === "IN_PROGRESS" ||
                            ride.status === "STARTED" ||
                            ride.status === "ACCEPTED") && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </Box>
                        <Box className="flex-1">
                          <Typography
                            variant="body2"
                            className={`${
                              ride.status === "COMPLETED" ||
                              ride.status === "IN_PROGRESS" ||
                              ride.status === "STARTED" ||
                              ride.status === "ACCEPTED"
                                ? "font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {ride.status}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="mt-6">
                    {/* Conditionally render the text based on the ride's status */}
                    {ride.status === "ACCEPTED" && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                      >
                        Your driver is approximately <b>{eta}</b> away (
                        {distance}).
                      </Typography>
                    )}

                    {(ride.status === "IN_PROGRESS" ||
                      ride.status === "STARTED") && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                      >
                        You will reach your destination in approximately{" "}
                        <b>{eta}</b>.
                      </Typography>
                    )}

                    {ride.status === "REQUESTED" && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                      >
                        Searching for a nearby driver...
                      </Typography>
                    )}

                    {ride.status === "COMPLETED" && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                        color="green"
                      >
                        You have arrived at your destination!
                      </Typography>
                    )}

                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      className="h-2 rounded-lg"
                    />
                  </Box>
                  <Box className="mt-6 pt-4 border-t border-gray-200">
                    {ride?.status === "REQUESTED" && (
                      <Button
                        variant="contained"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                        startIcon={<Cancel />}
                        onClick={() => {
                          setRide((prev) => ({ ...prev, status: "Cancelled" }));
                          setTimeout(() => {
                            navigate("/ride-booking");
                          }, 500);
                        }}
                      >
                        Cancel Ride
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            
          
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => {
          if (!paymentProcessing) setShowPaymentDialog(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Pay for your ride</DialogTitle>
        <DialogContent>
          <Box className="py-2">
            <Typography variant="subtitle2" color="textSecondary">
              Amount to pay
            </Typography>
            <Typography variant="h4" className="font-bold">
              ₹{ride?.fare ?? "0.00"}
            </Typography>
            <Typography variant="caption" className="text-gray-600 mt-2">
              Complete payment to proceed to rating.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!paymentProcessing) setShowPaymentDialog(false);
            }}
            disabled={paymentProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePay}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? "Processing..." : `Pay ₹${ride?.fare ?? "0"}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 