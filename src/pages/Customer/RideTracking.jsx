// ...existing code...
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { 
//   Person, 
//   Phone, 
//   Message, 
//   Star, 
//   DirectionsBike, 
//   LocalTaxi, 
//   AirportShuttle,
//   LocationOn,
//   AccessTime,
//   NearMe,
//   Share,
//   Cancel
// } from '@mui/icons-material';
// import MapDisplay from '../../components/shared/MapDisplay';
// // import GoogleMapDisplay from '../../components/shared/GoogleMapDisplay';
// import webSocketService from '../../services/WebSocketService';

// import RideService from '../../services/RideService.js';

// export default function RideTracking() {
//   const geo = useGeolocation();
//   const navigate = useNavigate();
//   const routerLocation = useLocation();
//   const [ride, setRide] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentCoords, setCurrentCoords] = useState(null); // { latitude, longitude }
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [driverCoords, setDriverCoords] = useState(null);
//   const [trackingDataState, setTrackingDataState] = useState([
//     { id: 1, status: 'REQUESTED', time: '', completed: false },
//     { id: 2, status: 'ACCEPTED', time: '', completed: false },
//     { id: 3, status: 'IN_PROGRESS', time: '', completed: false },
//     { id: 4, status: 'COMPLETED', time: '', completed: false },
//   ]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [eta, setEta] = useState('');
//   const [distance, setDistance] = useState('');

//   // payment dialog state (was missing -> caused ReferenceError)
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
 
//   // prevent repeated redirects to rating
//   const [redirectedToRating, setRedirectedToRating] = useState(false);
 
//   // Initialize ride from navigation state and current geolocation / backend response
//   useEffect(() => {
//     const state = routerLocation.state || {};
//     const rideResp = state.ride || {};
//     // Compose a local ride model using backend response
//     const initialRide = {
//       id: rideResp.id,
//       pickup: state.pickup || '',
//       destination: state.dropoff || '',
//       fare: typeof rideResp.cost === 'number' ? rideResp.cost : 0,
//       status: rideResp.status || 'REQUESTED',
//       driver: {
//         name: 'Driver',
//         rating: 4.8,
//         vehicle: state.vehicleType || 'Bike',
//         licensePlate: '----',
//       },
//     };
//     setRide(initialRide);
//     // set coordinates from backend where available
//     if (rideResp?.driverLocation && typeof rideResp.driverLocation.latitude === 'number' && typeof rideResp.driverLocation.longitude === 'number') {
//       setDriverCoords({ latitude: rideResp.driverLocation.latitude, longitude: rideResp.driverLocation.longitude });
//     }
//     if (rideResp?.dropOffLocation && typeof rideResp.dropOffLocation.latitude === 'number' && typeof rideResp.dropOffLocation.longitude === 'number') {
//       setDestinationCoords({ latitude: rideResp.dropOffLocation.latitude, longitude: rideResp.dropOffLocation.longitude });
//     } else {
//       const parsed = typeof state.dropoff === 'string' ? state.dropoff.split(',').map(s => parseFloat(s.trim())) : [];
//       if (parsed.length === 2 && parsed.every(n => !Number.isNaN(n))) {
//         setDestinationCoords({ latitude: parsed[0], longitude: parsed[1] });
//       }
//     }
//     if (geo && typeof geo.latitude === 'number' && typeof geo.longitude === 'number') {
//       setCurrentCoords({ latitude: geo.latitude, longitude: geo.longitude });
//       setLocation({ latitude: geo.latitude, longitude: geo.longitude });
//     }
//     setLoading(false);
//   }, [routerLocation.state, geo]);

//   // derive progress step from backend status
//   useEffect(() => {
//     const status = (ride?.status || '').toUpperCase();
//     const map = { REQUESTED: 0, ACCEPTED: 1, IN_PROGRESS: 2, COMPLETED: 3 };
//     if (status in map) setCurrentStep(map[status]);
//   }, [ride?.status]);

//   // Synchronize trackingData completed flags with currentStep
//   useEffect(() => {
//     setTrackingDataState(prev => prev.map((step, idx) => ({
//       ...step,
//       completed: idx < currentStep
//     })));
//   }, [currentStep]);

//   // Compute live ETA/distance using haversine if we have coordinates
//   const haversineKm = (a, b) => {
//     const toRad = (deg) => deg * Math.PI / 180;
//     const R = 6371; // km
//     const dLat = toRad(b.latitude - a.latitude);
//     const dLon = toRad(b.longitude - a.longitude);
//     const lat1 = toRad(a.latitude);
//     const lat2 = toRad(b.latitude);
//     const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
//     return 2 * R * Math.asin(Math.sqrt(h));
//   };

//   useEffect(() => {
//     if (!ride) return;
//     const dest = destinationCoords;
//     const curr = (driverCoords || currentCoords || location || (geo && typeof geo.latitude === 'number' && typeof geo.longitude === 'number' ? { latitude: geo.latitude, longitude: geo.longitude } : null));
//     if (dest && curr) {
//       const km = haversineKm(curr, dest);
//       setDistance(`${km.toFixed(1)} km`);
//       const minutes = Math.max(1, Math.round((km / 25) * 60));
//       setEta(`${minutes} min`);
//     } else {
//       setDistance('N/A');
//       setEta('N/A');
//     }
//   }, [ride, driverCoords, currentCoords, destinationCoords, location, geo?.latitude, geo?.longitude]);

//   // Poll backend for latest ride data as fallback to websocket
//   useEffect(() => {
//     if (!ride?.id) return;
//     const interval = setInterval(async () => {
//       try {
//         const res = await RideService.getRide(ride.id);
//         const data = res?.data || res; // normalize ApiResponse vs direct
//         if (data?.driverLocation && typeof data.driverLocation.latitude === 'number') {
//           setDriverCoords({ latitude: data.driverLocation.latitude, longitude: data.driverLocation.longitude });
//         }
//         if (data?.dropOffLocation && typeof data.dropOffLocation.latitude === 'number') {
//           setDestinationCoords({ latitude: data.dropOffLocation.latitude, longitude: data.dropOffLocation.longitude });
//         }
//         if (typeof data?.cost === 'number') {
//           setRide(prev => prev ? { ...prev, fare: data.cost } : prev);
//         }
//         if (typeof data?.status === 'string') {
//           setRide(prev => prev ? { ...prev, status: data.status } : prev);
//         }
//       } catch (e) {
//         // swallow polling errors
//       }
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [ride?.id]);

//   // Connect and subscribe to WebSocket ride updates
//   useEffect(() => {
//     if (!ride?.id) return;
//     let connected = false;
//     const ensureConnect = () => {
//       if (connected) return;
//       connected = true;
//       // Subscribe to user-specific updates (sendToUser) and ride topic updates
//       webSocketService.subscribe('/user/topic/ride-updates', (payload) => {
//         // payload could be ApiResponse or RideResponse; normalize
//         const data = payload?.data || payload;
//         if (data?.id && data.id !== ride.id) return;
//         if (data?.driverLocation && typeof data.driverLocation.latitude === 'number') {
//           setDriverCoords({ latitude: data.driverLocation.latitude, longitude: data.driverLocation.longitude });
//         }
//         if (data?.dropOffLocation && typeof data.dropOffLocation.latitude === 'number') {
//           setDestinationCoords({ latitude: data.dropOffLocation.latitude, longitude: data.dropOffLocation.longitude });
//         }
//         if (data?.status) {
//           setRide(prev => prev ? { ...prev, status: data.status } : prev);
//         }
//       });
//       webSocketService.subscribe(`/topic/ride-updates/${ride.id}`, (data) => {
//         if (data?.driverLocation && typeof data.driverLocation.latitude === 'number') {
//           setDriverCoords({ latitude: data.driverLocation.latitude, longitude: data.driverLocation.longitude });
//         }
//         if (data?.dropOffLocation && typeof data.dropOffLocation.latitude === 'number') {
//           setDestinationCoords({ latitude: data.dropOffLocation.latitude, longitude: data.dropOffLocation.longitude });
//         }
//         if (data?.status) {
//           setRide(prev => prev ? { ...prev, status: data.status } : prev);
//         }
//       });
//     };
//     webSocketService.connect(ensureConnect, () => {});
//     return () => {
//       webSocketService.unsubscribe('/user/topic/ride-updates');
//       webSocketService.unsubscribe(`/topic/ride-updates/${ride.id}`);
//     };
//   }, [ride?.id]);

//   // compute progress percent based on current step vs steps before final completion
//   const totalProgressSteps = Math.max(1, trackingDataState.length - 1); // avoid divide by zero
//   const progressPercent = Math.min(100, Math.round((currentStep / totalProgressSteps) * 100));

//   // Get vehicle icon based on type
//   const getVehicleIcon = () => {
//     if (ride?.driver?.vehicle?.toLowerCase().includes('bike') || ride?.driver?.vehicle?.toLowerCase().includes('activa')) {
//       return <DirectionsBike className="text-yellow-500" />;
//     } else if (ride?.driver?.vehicle?.toLowerCase().includes('auto')) {
//       return <AirportShuttle className="text-yellow-500" />;
//     } else {
//       return <LocalTaxi className="text-yellow-500" />;
//     }
//   };

//   // Get status color
//   const getStatusColor = () => {
//     switch ((ride?.status || '').toUpperCase()) {
//       case 'COMPLETED': return '#4CAF50';
//       case 'IN_PROGRESS': return '#2196F3';
//       case 'CANCELLED': return '#F44336';
//       case 'ACCEPTED': return '#FFB300';
//       default: return '#FF9800';
//     }
//   };

//   // load Razorpay checkout script
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const existing = document.getElementById('razorpay-sdk');
//       if (existing) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.id = 'razorpay-sdk';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePay = async () => {
//     if (!ride) return;
//     setPaymentProcessing(true);
//     const res = await loadRazorpayScript();
//     const amountInPaise = Math.round((ride.fare || 0) * 100);

//     if (!res) {
//       alert('Razorpay SDK failed to load. Please try again later.');
//       setPaymentProcessing(false);
//       return;
//     }

//     const options = {
//       key: 'rzp_test_1234567890', // mock/test key
//       amount: amountInPaise,
//       currency: 'INR',
//       name: 'Rapido',
//       description: `Payment for ride #${ride.id}`,
//       handler: function (response) {
//         setPaymentProcessing(false);
//         setShowPaymentDialog(false);
//         alert('Payment successful. Redirecting to rating page.');
//         navigate('/costumor/RatingPage');
//       },
//       prefill: {
//         name: 'Customer',
//         email: 'customer@example.com',
//         contact: '9999999999'
//       },
//       theme: {
//         color: '#1976d2'
//       }
//     };

//     // eslint-disable-next-line no-undef
//     const rzp = new window.Razorpay(options);
//     rzp.on('payment.failed', function (response) {
//       setPaymentProcessing(false);
//       alert('Payment failed. Please try again.');
//     });
//     rzp.open();
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="max-w-6xl w-full">
//           {/* Header */}
//           <Box className="mb-8">
//             <Typography variant="h4" className="font-bold text-gray-800">Track Your Ride</Typography>
//             <Typography variant="body1" className="text-gray-600">Real-time tracking of your ride status and location</Typography>
//           </Box>

//           <Grid container spacing={4} style={{ minHeight: '70vh' }}>
//             {/* Left Column - Map and Status */}
//             <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexBasis: '45%', maxWidth: '45%' }}>
//               {/* Status Card */}
//               <Card className="shadow-md rounded-xl mb-4" style={{ maxHeight: 340, overflow: 'auto' }}>
//                 <CardContent className="p-6">
//                   <Box className="flex justify-between items-center mb-6">
//                     <Typography variant="h6" className="font-bold text-gray-800">Ride Status</Typography>
//                     <Chip 
//                       label={ride.status} 
//                       size="medium"
//                       style={{ 
//                         backgroundColor: `${getStatusColor()}20`,
//                         color: getStatusColor(),
//                         fontWeight: 'bold'
//                       }}
//                     />
//                   </Box>
                  
//                   <Box className="mb-6">
//                     <Typography variant="body2" className="text-gray-600 mb-1">Route</Typography>
//                     <Box className="flex items-center">
//                       <LocationOn className="text-gray-500 mr-2" />
//                       <Typography variant="h6" className="font-medium">
//                         {ride.pickup}
//                       </Typography>
//                     </Box>
//                     <Box className="flex items-center my-1">
//                       <div className="w-4 h-4 rounded-full bg-gray-300 mx-2"></div>
//                       <div className="flex-1 h-0.5 bg-gray-300"></div>
//                     </Box>
//                     <Box className="flex items-center">
//                       <LocationOn className="text-gray-500 mr-2" />
//                       <Typography variant="h6" className="font-medium">
//                         {ride.destination}
//                       </Typography>
//                     </Box>
//                   </Box>
                  
//                   <Divider className="my-6" />
                  
//                   <Box className="flex justify-between items-center">
//                     <Box>
//                       <Typography variant="body2" className="text-gray-600">Estimated Time</Typography>
//                       <Typography variant="h6" className="font-medium">{eta}</Typography>
//                     </Box>
//                     <Box>
//                       <Typography variant="body2" className="text-gray-600">Distance</Typography>
//                       <Typography variant="h6" className="font-medium">{distance}</Typography>
//                     </Box>
//                     <Box>
//                       <Typography variant="body2" className="text-gray-600">Fare</Typography>
//                       <Typography variant="h6" className="font-medium">₹{ride.fare}</Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
              
//               {/* Map */}
//               <Card className="shadow-md rounded-xl flex-1">
//                 <CardContent className="p-0">
//                   <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Live Tracking</Typography>
//                   <Divider />
//                   <MapDisplay 
//                     userLocation={currentCoords ? [currentCoords.latitude, currentCoords.longitude] : (geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : (location ? [location.latitude, location.longitude] : [12.9716, 77.5946]))} 
//                     riderLocation={driverCoords ? [driverCoords.latitude, driverCoords.longitude] : (destinationCoords ? [destinationCoords.latitude, destinationCoords.longitude] : null)} 
//                     routePoints={(currentCoords && destinationCoords) ? [[currentCoords.latitude, currentCoords.longitude], [destinationCoords.latitude, destinationCoords.longitude]] : []}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Right Column - Driver Info and Actions */}
//             <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexBasis: '40%', maxWidth: '40%' }}>
//               {/* Driver Info */}
//               <Card className="shadow-md rounded-xl mb-4" style={{ maxHeight: 340, overflow: 'auto' }}>
//                 <CardContent className="p-6">
//                   <Typography variant="h6" className="font-bold text-gray-800 mb-4">Driver Information</Typography>
                  
//                   <Box className="flex items-center mb-4">
//                     <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${ride.driver.name}`} />
//                     <Box>
//                       <Typography variant="h6" className="font-medium">{ride.driver.name}</Typography>
//                       <Box className="flex items-center">
//                         <Star className="text-yellow-500 mr-1" fontSize="small" />
//                         <Typography variant="body2">{ride.driver.rating}</Typography>
//                       </Box>
//                     </Box>
//                   </Box>
                  
//                   <Divider className="my-4" />
                  
//                   <Box className="space-y-3">
//                     <Box className="flex items-center">
//                       {getVehicleIcon()}
//                       <Typography variant="body2" className="ml-2">{ride.driver.vehicle}</Typography>
//                     </Box>
//                     <Box className="flex items-center">
//                       <Typography variant="body2" className="text-gray-600">License Plate:</Typography>
//                       <Typography variant="body2" className="ml-2 font-medium">{ride.driver.licensePlate}</Typography>
//                     </Box>
//                   </Box>
                  
//                   <Divider className="my-4" />
                  
//                   <Box className="flex justify-between">
//                     <Button 
//                       variant="contained" 
//                       className="bg-green-500 hover:bg-green-600 text-white"
//                       startIcon={<Phone />}
//                     >
//                       Call
//                     </Button>
//                     <Button 
//                       variant="outlined"
//                       startIcon={<Message />}
//                     >
//                       Message
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
              
//               {/* Tracking Progress */}
//               <Card className="shadow-md rounded-xl flex-1">
//                 <CardContent className="p-6">
//                   <Typography variant="h6" className="font-bold text-gray-800 mb-4">Ride Progress</Typography>
                  
//                   <Box className="space-y-4">
//                     {trackingDataState.map((step, index) => (
//                       <Box key={step.id} className="flex items-center">
//                         <Box className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                           step.completed ? 'bg-green-500' : 'bg-gray-300'
//                         }`}>
//                           {step.completed && <span className="text-white text-sm">✓</span>}
//                         </Box>
//                         <Box className="flex-1">
//                           <Typography 
//                             variant="body2" 
//                             className={`${step.completed ? 'font-medium' : 'text-gray-500'}`}
//                           >
//                             {step.status}
//                           </Typography>
//                           <Typography variant="caption" className="text-gray-500">
//                             {step.time}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Box>
                  
//                   <Box className="mt-6">
//                     <Typography variant="body2" className="text-gray-600 mb-2">Driver is {eta} away</Typography>
//                     <LinearProgress 
//                       variant="determinate" 
//                       value={progressPercent} 
//                       className="h-2 rounded-lg"
//                     />
//                   </Box>
                  
//                   <Box className="mt-6 pt-4 border-t border-gray-200">
//                     <Button 
//                       variant="contained" 
//                       className="w-full bg-red-500 hover:bg-red-600 text-white"
//                       startIcon={<Cancel />}
//                       onClick={() => {
//                         setRide(prev => ({ ...prev, status: 'Cancelled' }));
//                         setTimeout(() => {
//                           navigate('/ride-booking');
//                         }, 500);
//                       }}
//                     >
//                       Cancel Ride
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </div>
//       </div>

//       {/* Payment Dialog */}
//       <Dialog open={showPaymentDialog} onClose={() => { if (!paymentProcessing) setShowPaymentDialog(false); }} maxWidth="xs" fullWidth>
//         <DialogTitle>Pay for your ride</DialogTitle>
//         <DialogContent>
//           <Box className="py-2">
//             <Typography variant="subtitle2" color="textSecondary">Amount to pay</Typography>
//             <Typography variant="h4" className="font-bold">₹{ride?.fare ?? '0.00'}</Typography>
//             <Typography variant="caption" className="text-gray-600 mt-2">Complete payment to proceed to rating.</Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { if (!paymentProcessing) setShowPaymentDialog(false); }} disabled={paymentProcessing}>Cancel</Button>
//           <Button variant="contained" color="primary" onClick={handlePay} disabled={paymentProcessing}>
//             {paymentProcessing ? 'Processing...' : `Pay ₹${ride?.fare ?? '0'}`}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { 
  Typography, Card, CardContent, Grid, Button, Box, Avatar, Divider,
  Chip, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, Alert, LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  Person, Phone, Message, Star, DirectionsBike, LocalTaxi, AirportShuttle, 
  LocationOn, AccessTime, NearMe, Share, Cancel
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';
import RideService from '../../services/RideService';
import useGeolocation from '../../hooks/useGeolocation';
import webSocketService from '../../services/WebSocketService';

export default function RideTracking() {
  const geo = useGeolocation();
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { rideId } = routerLocation.state || {};
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [redirectedToRating, setRedirectedToRating] = useState(false);

  useEffect(() => {
    async function fetchRide() {
      try {
        const res = await RideService.getRide(rideId);
        const rideData = res.data;
        setRide(rideData);
        if (rideData.startLatitude && rideData.startLongitude) {
          setCurrentCoords([rideData.startLatitude, rideData.startLongitude]);
        }
        if (rideData.endLatitude && rideData.endLongitude) {
          setDestinationCoords([rideData.endLatitude, rideData.endLongitude]);
        }
        if (rideData.driverLocation?.latitude && rideData.driverLocation?.longitude) {
          setDriverCoords([rideData.driverLocation.latitude, rideData.driverLocation.longitude]);
        }
      } catch (err) {
        setError('Failed to fetch ride');
        console.error("Fetch ride error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (rideId) fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (geo?.latitude && geo?.longitude && ride) {
      setCurrentCoords([geo.latitude, geo.longitude]);
    }
  }, [geo, ride]);

  useEffect(() => {
    if (!rideId) return;
    const interval = setInterval(async () => {
      try {
        const res = await RideService.getRide(rideId);
        const rideData = res.data;
        setRide(rideData);
        if (rideData.driverLocation?.latitude && rideData.driverLocation?.longitude) {
          setDriverCoords([rideData.driverLocation.latitude, rideData.driverLocation.longitude]);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [rideId]);

  useEffect(() => {
    if (ride?.status === 'COMPLETED' && !redirectedToRating) {
      setShowPaymentDialog(true);
      setRedirectedToRating(true);
    }
  }, [ride?.status, redirectedToRating]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    setPaymentProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load.');
      setPaymentProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_1234567890',
      amount: ride?.cost ? ride.cost * 100 : 0,
      currency: 'INR',
      name: 'Rapido',
      description: `Payment for ride #${ride?.id || ''}`,
      handler: (response) => {
        setPaymentProcessing(false);
        setShowPaymentDialog(false);
        navigate('/costumor/rating-page', { state: { rideId } });
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#1976d2'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setPaymentProcessing(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
  };

  const haversineKm = (a, b) => {
    if (!a || !b || !a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
    const toRad = (deg) => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const handleCancelRide = async () => {
    try {
      await RideService.updateRideStatus({ rideId, status: 'CANCELLED' });
      navigate('/costumor/ride-booking');
    } catch (e) {
      setError('Failed to cancel ride');
      console.error("Cancel ride error:", e);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!ride) return <Typography>No ride found</Typography>;

  const km = currentCoords && destinationCoords ? haversineKm(
    { latitude: currentCoords[0], longitude: currentCoords[1] },
    { latitude: destinationCoords[0], longitude: destinationCoords[1] }
  ) : 0;
  const eta = km ? `${Math.max(1, Math.round((km / 25) * 60))} min` : 'N/A';

  const getVehicleIcon = () => {
    switch (ride.vehicleType) {
      case 'Bike': return <DirectionsBike className="text-yellow-500" />;
      case 'Auto': return <AirportShuttle className="text-yellow-500" />;
      case 'Cab': return <LocalTaxi className="text-yellow-500" />;
      default: return <DirectionsBike className="text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (ride.status) {
      case 'COMPLETED': return '#4CAF50';
      case 'IN_PROGRESS': return '#2196F3';
      case 'CANCELLED': return '#F44336';
      case 'ACCEPTED': return '#FFB300';
      default: return '#FF9800';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-6xl w-full p-4 sm:p-6">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Track Your Ride</Typography>
          <Typography variant="body1" className="text-gray-600">Real-time tracking of your ride status and location</Typography>
        </Box>

        <Grid container spacing={4} style={{ minHeight: '70vh' }}>
          <Grid item xs={12} md={6}>
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-6">
                <Box className="flex justify-between items-center mb-6">
                  <Typography variant="h6" className="font-bold text-gray-800">Ride Status</Typography>
                  <Chip 
                    label={ride.status} 
                    size="medium" 
                    style={{ backgroundColor: `${getStatusColor()}20`, color: getStatusColor(), fontWeight: 'bold' }} 
                  />
                </Box>
                
                <Box className="mb-6">
                  <Typography variant="body2" className="text-gray-600 mb-1">Route</Typography>
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-2" />
                    <Typography variant="h6" className="font-medium">{ride.currentPlaceName || 'Current Location'}</Typography>
                  </Box>
                  <Box className="flex items-center my-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mx-2"></div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                  </Box>
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-2" />
                    <Typography variant="h6" className="font-medium">{ride.dropOffPlaceName || 'Destination'}</Typography>
                  </Box>
                </Box>
                
                <Divider className="my-6" />
                
                <Box className="flex justify-between items-center">
                  <Box>
                    <Typography variant="body2" className="text-gray-600">Estimated Time</Typography>
                    <Typography variant="h6" className="font-medium">{eta}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" className="text-gray-600">Distance</Typography>
                    <Typography variant="h6" className="font-medium">{km ? `${km.toFixed(1)} km` : 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" className="text-gray-600">Fare</Typography>
                    <Typography variant="h6" className="font-medium">₹{ride.cost || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card className="shadow-md rounded-xl flex-1">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Live Tracking</Typography>
                <Divider />
                <MapDisplay 
                  userLocation={currentCoords ? [currentCoords[0], currentCoords[1]] : [17.3850, 78.4867]} 
                  riderLocation={driverCoords ? [driverCoords[0], driverCoords[1]] : null} 
                  routePoints={
                    currentCoords && destinationCoords 
                      ? [[currentCoords[0], currentCoords[1]], [destinationCoords[0], destinationCoords[1]]] 
                      : [[17.3850, 78.4867], [17.3850, 78.4867]]
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Driver Information</Typography>
                
                <Box className="flex items-center mb-4">
                  <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${ride.driver?.name || 'driver'}`} />
                  <Box>
                    <Typography variant="h6" className="font-medium">{ride.driver?.name || 'N/A'}</Typography>
                    <Box className="flex items-center">
                      <Star className="text-yellow-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{ride.driver?.rating || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="space-y-3">
                  <Box className="flex items-center">
                    {getVehicleIcon()}
                    <Typography variant="body2" className="ml-2">{ride.vehicleType || 'N/A'}</Typography>
                  </Box>
                  <Box className="flex items-center">
                    <Typography variant="body2" className="text-gray-600">License Plate:</Typography>
                    <Typography variant="body2" className="ml-2 font-medium">{ride.driver?.licensePlate || 'N/A'}</Typography>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex justify-between">
                  <Button 
                    variant="contained" 
                    className="bg-green-500 hover:bg-green-600 text-white" 
                    startIcon={<Phone />}
                    disabled={!ride.driver?.phone}
                    onClick={() => window.location.href = `tel:${ride.driver?.phone}`}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Message />}
                    disabled={!ride.driver?.phone}
                    onClick={() => window.location.href = `sms:${ride.driver?.phone}`}
                  >
                    Message
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card className="shadow-md rounded-xl flex-1">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Ride Progress</Typography>
                
                <Box className="space-y-4">
                  {ride.progressSteps?.map((step, index) => (
                    <Box key={index} className="flex items-center">
                      <Box className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed && <span className="text-white text-sm">✓</span>}
                      </Box>
                      <Box className="flex-1">
                        <Typography 
                          variant="body2" 
                          className={`${step.completed ? 'font-medium' : 'text-gray-500'}`}
                        >
                          {step.status}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {step.time || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )) || <Typography>No progress available</Typography>}
                </Box>
                
                <Box className="mt-6">
                  <Typography variant="body2" className="text-gray-600 mb-2">Driver is {eta} away</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={ride.progress || 0} 
                    className="h-2 rounded-lg" 
                  />
                </Box>
                
                <Box className="mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    variant="contained" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white" 
                    startIcon={<Cancel />} 
                    onClick={handleCancelRide}
                    disabled={ride.status === 'COMPLETED' || ride.status === 'CANCELLED'}
                  >
                    Cancel Ride
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            Complete Payment
            <IconButton onClick={() => setShowPaymentDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h5">₹{ride.cost || 'N/A'}</Typography>
            <Typography variant="body2">Pay to complete the ride.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPaymentDialog(false)} disabled={paymentProcessing}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handlePay} 
              disabled={paymentProcessing || !ride?.cost}
            >
              {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};