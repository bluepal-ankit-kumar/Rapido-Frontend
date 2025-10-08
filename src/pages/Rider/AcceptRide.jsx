// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
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
//   ListItemAvatar
// } from '@mui/material';
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
//   AirportShuttle
// } from '@mui/icons-material';
// import MapDisplay from '../../components/shared/MapDisplay';

// const rideRequest = {
//   id: 201,
//   pickup: 'MG Road, Bangalore',
//   drop: 'Koramangala, Bangalore',
//   fare: 120,
//   distance: '5.2 km',
//   estimatedTime: '15 min',
//   customer: {
//     name: 'John Doe',
//     phone: '+91 9876543210',
//     rating: 4.5,
//     totalRides: 24
//   },
//   pickupLocation: { lat: 12.9716, lng: 77.5946 },
//   dropLocation: { lat: 12.9279, lng: 77.6271 }
// };

// const mockNearbyRiders = [
//   { id: 1, name: 'Rahul Kumar', location: { lat: 12.9750, lng: 77.5900 }, distance: '0.5 km', eta: '3 min' },
//   { id: 2, name: 'Vikram Singh', location: { lat: 12.9700, lng: 77.5950 }, distance: '0.8 km', eta: '5 min' },
//   { id: 3, name: 'Amit Sharma', location: { lat: 12.9650, lng: 77.6000 }, distance: '1.2 km', eta: '7 min' }
// ];

// export default function AcceptRide() {
//   const navigate = useNavigate();
//   const [accepted, setAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(30); // 30 seconds to accept
//   const [selectedRider, setSelectedRider] = useState(null);

//   // Simulate countdown timer
//   useEffect(() => {
//     if (!accepted && countdown > 0) {
//       const timer = setTimeout(() => {
//         setCountdown(prev => prev - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (countdown === 0 && !accepted) {
//       // Auto-reject when timer expires
//       setAccepted(true);
//     }
//   }, [accepted, countdown]);

//   const handleAccept = () => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setAccepted(true);
//       setLoading(false);
//       // Redirect to Ride In Progress after accepting
//       navigate('/rider/ride-in-progress');
//     }, 1000);
//   };

//   const handleReject = () => {
//     setAccepted(true);
//   };

//   const getVehicleIcon = (type) => {
//     switch(type) {
//       case 'Bike': return <TwoWheeler className="text-yellow-500" />;
//       case 'Auto': return <AirportShuttle className="text-yellow-500" />;
//       case 'Cab': return <LocalTaxi className="text-yellow-500" />;
//       default: return <TwoWheeler className="text-yellow-500" />;
//     }
//   };

//   // No need for accepted state UI, as we redirect to RideInProgress
//   if (accepted) {
//     return null;
//   }

//   return (
//     <div 
//       className="p-6 bg-gray-50 min-h-screen"
//       style={{ marginTop: 'clamp(64px, 8vw, 88px)', zIndex: 1, position: 'relative' }}
//     >
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <Box className="mb-8">
//           <Typography variant="h4" className="font-bold text-gray-800">New Ride Request</Typography>
//           <Typography variant="body1" className="text-gray-600">Accept or reject the ride request within the time limit</Typography>
//         </Box>

//         <Grid container spacing={3}>
//           {/* Left Column - Request Details */}
//           <Grid item xs={12} md={5} minHeight={610}>
//             <Card className="shadow-md rounded-xl" style={{ height: '100%' }}>
//               <CardContent className="p-6">
//                 <Box className="flex justify-between items-center mb-30 ">
//                   <Typography variant="h6" className="font-bold text-gray-800 ">Ride Details</Typography>
//                   <Chip 
//                     label={`${countdown}s`} 
//                     color={countdown < 10 ? "error" : "primary"}
//                     variant="outlined"
//                   />
//                 </Box>
                
//                 <Box className="mb-10">
//                   <Typography variant="body2" className="text-gray-600 mb-3">Customer</Typography>
//                   <Box className="flex items-center">
//                     <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${rideRequest.customer.name}`} />
//                     <Box>
//                       <Typography variant="h6" className="font-medium">{rideRequest.customer.name}</Typography>
//                       <Box className="flex items-center">
//                         <Star className="text-yellow-500 mr-1" fontSize="small" />
        
//                         <Typography variant="body2">{rideRequest.customer.rating}</Typography>
//                         <Typography variant="body2" className="mx-2">•</Typography>
//                         <Typography variant="body2">{rideRequest.customer.totalRides} rides</Typography>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </Box>
                
//                 <Divider className="my-4" />
                
//                 <Box className="space-y-4 mb-6 mt-6">
//                   <Box className="flex items-center">
//                     <LocationOn className="text-gray-500 mr-3" />
//                     <Box>
//                       <Typography variant="body2" className="text-gray-600">Pickup</Typography>
//                       <Typography variant="h6" className="font-medium">{rideRequest.pickup}</Typography>
//                     </Box>
//                   </Box>
                  
//                   <Box className="flex items-center mt-6">
//                     <Directions className="text-gray-500 mr-3" />
//                     <Box>
//                       <Typography variant="body2" className="text-gray-600">Destination</Typography>
//                       <Typography variant="h6" className="font-medium">{rideRequest.drop}</Typography>
//                     </Box>
//                   </Box>
//                 </Box>
                
//                 <Divider className="my-4" />
                
//                 <Grid container spacing={2} className="mt-6">

//                   <Grid item xs={6}>
//                     <Box className="flex items-center">
//                       <AttachMoney className="text-gray-500 mr-2" />
//                       <Box>
//                         <Typography variant="body2" className="text-gray-600">Fare</Typography>
//                         <Typography variant="h6" className="font-medium">₹{rideRequest.fare}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Box className="flex items-center">
//                       <AccessTime className="text-gray-500 mr-2" />
//                       <Box>
//                         <Typography variant="body2" className="text-gray-600">Est. Time</Typography>
//                         <Typography variant="h6" className="font-medium">{rideRequest.estimatedTime}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Box className="flex items-center">
//                       <TwoWheeler className="text-gray-500 mr-2" />
//                       <Box>
//                         <Typography variant="body2" className="text-gray-600">Distance</Typography>
//                         <Typography variant="h6" className="font-medium">{rideRequest.distance}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Box className="flex items-center">
//                       <Person className="text-gray-500 mr-2" />
//                       <Box>
//                         <Typography variant="body2" className="text-gray-600">Customer Phone</Typography>
//                         <Typography variant="h6" className="font-medium">{rideRequest.customer.phone}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
                
//                 <Box className="mt-6 pt-4 border-t border-gray-200">
//                   <Typography variant="body2" className="text-gray-600 mb-3 mt-6">Customer Contact</Typography>
//                   <Box className="flex gap-2 mt-6">
//                     <Button 
//                       variant="outlined" 
//                       startIcon={<Phone />}
//                       className="flex-1"
//                     >
//                       Call
//                     </Button>
//                     <Button 
//                       variant="outlined" 
//                       startIcon={<Message />}
//                       className="flex-1"
//                     >
//                       Message
//                     </Button>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Right Column - Map and Action */}
//           <Grid item xs={12} md={7} minWidth={600} height={200}>
//             {/* Map */}
//             <Card className="shadow-md rounded-xl mb-2">
//               <CardContent className="p-0">
//                 <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2 ">Route Map</Typography>
//                 <Divider />
//                 <MapDisplay 
//                   userLocation={rideRequest.pickupLocation} 
//                   nearbyRiders={mockNearbyRiders} 
//                 />
//               </CardContent>
//             </Card>
            
//             {/* Action */}
//             <Card className="shadow-md rounded-xl">
//               <CardContent className="p-6">
//                 <Typography variant="h6" className="font-bold text-gray-800 mb-4">Take Action</Typography>
                
//                 <Box className="mb-6">
//                   <Typography variant="body2" className="text-gray-600 mb-2">Accept or reject this ride request</Typography>
//                   <Typography variant="body2" className="text-gray-500">
//                     You have {countdown} seconds to respond
//                   </Typography>
//                 </Box>
                
//                 <Box className="flex gap-4">
//                   <Button 
//                     variant="contained" 
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white"
//                     onClick={handleAccept}
//                     disabled={loading}
//                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
//                   >
//                     {loading ? 'Processing...' : 'Accept Ride'}
//                   </Button>
//                   <Button 
//                     variant="outlined" 
//                     className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
//                     onClick={handleReject}
//                   >
//                     Reject
//                   </Button>
//                 </Box>
                
//                 {countdown < 10 && (
//                   <Alert severity="warning" className="mt-4">
//                     Hurry! You have only {countdown} seconds left to respond.
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Divider,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { 
  Person, 
  LocationOn, 
  Directions, 
  AccessTime, 
  AttachMoney,
  Star,
  TwoWheeler,
  LocalTaxi,
  AirportShuttle
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';
import DriverService from '../../services/DriverService';
import RideService from '../../services/RideService';
import useAuth from '../../hooks/useAuth';

export default function AcceptRide() {
  const { rideId: rideIdParam } = useParams();
  const rideId = rideIdParam ? rideIdParam.trim() : null;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchRide() {
      if (!rideId || rideId === 'undefined' || isNaN(Number(rideId))) {
        setErrorMessage('Invalid or missing ride ID. Please access this page from a valid ride request.');
        setLoading(false);
        console.error('Invalid rideId provided to fetchRide:', rideId);
        return;
      }
      try {
        const res = await RideService.getRide(Number(rideId));
        if (!res.success || !res.data) {
          throw new Error('Ride data not found in response');
        }
        // Verify driver ID matches the logged-in user
        if (res.data.driverId !== user?.id) {
          setErrorMessage('Unauthorized: This ride is not assigned to you.');
          setRide(null);
        } else {
          setRide(res.data);
        }
      } catch (err) {
        setRide(null);
        setErrorMessage('Failed to load ride details. Please try again or check if the ride exists.');
        console.error('Failed to fetch ride:', err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchRide();
    } else {
      setErrorMessage('You must be logged in to view this ride.');
      setLoading(false);
    }
  }, [rideId, user]);

  useEffect(() => {
    if (countdown > 0 && !errorMessage) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && ride && !errorMessage) {
      handleReject();
    }
  }, [countdown, ride, errorMessage]);

  const handleAccept = async () => {
    if (!ride || !ride.id || !ride.driverId || ride.driverId !== user?.id) {
      console.error('Invalid ride data for acceptance:', { ride, userId: user?.id });
      setErrorMessage('Cannot accept ride: Invalid or unauthorized ride data.');
      return;
    }
    try {
      setLoading(true);
      await DriverService.assignRide({ rideId: ride.id, driverId: ride.driverId, accepted: true });
      navigate('/rider/ride-to-destination', { state: { rideId: ride.id } });
    } catch (err) {
      console.error('Failed to accept ride:', err);
      setErrorMessage('Failed to accept the ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!ride || !ride.id || !ride.driverId || ride.driverId !== user?.id) {
      console.error('Invalid ride data for rejection:', { ride, userId: user?.id });
      setErrorMessage('Cannot reject ride: Invalid or unauthorized ride data.');
      return;
    }
    try {
      setLoading(true);
      await DriverService.assignRide({ rideId: ride.id, driverId: ride.driverId, accepted: false });
      navigate('/rider/dashboard');
    } catch (err) {
      console.error('Failed to reject ride:', err);
      setErrorMessage('Failed to reject the ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Bike': return <TwoWheeler className="text-yellow-500" />;
      case 'Auto': return <AirportShuttle className="text-yellow-500" />;
      case 'Cab': return <LocalTaxi className="text-yellow-500" />;
      default: return <TwoWheeler className="text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">{errorMessage}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rider/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!ride) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">Ride not found or could not be loaded.</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rider/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const customer = ride.customer || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={{ marginTop: 'clamp(64px, 8vw, 88px)' }}>
      <div className="max-w-6xl mx-auto">
        <Box mb={8}>
          <Typography variant="h4" className="font-bold text-gray-800">New Ride Request</Typography>
          <Typography variant="body1" className="text-gray-600">Accept or reject the ride request within the time limit</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card className="shadow-md rounded-xl" style={{ height: '100%' }}>
              <CardContent className="p-6">
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-800">Ride Details</Typography>
                  <Chip label={`${countdown}s`} color={countdown < 10 ? "error" : "primary"} variant="outlined" />
                </Box>
                <Box mb={4}>
                  <Typography variant="body2" className="text-gray-600 mb-2">Customer</Typography>
                  <Box className="flex items-center">
                    <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${customer.name || 'user'}`} />
                    <Box>
                      <Typography variant="h6" className="font-medium">{customer.name || 'N/A'}</Typography>
                      <Box className="flex items-center">
                        <Star className="text-yellow-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{customer.rating || 'N/A'}</Typography>
                        <Typography variant="body2" className="mx-2">•</Typography>
                        <Typography variant="body2">{customer.totalRides || 0} rides</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider className="my-4" />
                <Box className="space-y-4 mb-6">
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Pickup</Typography>
                      <Typography variant="h6" className="font-medium">{ride.currentPlaceName || ride.pickup || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  <Box className="flex items-center mt-6">
                    <Directions className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Destination</Typography>
                      <Typography variant="h6" className="font-medium">{ride.dropOffPlaceName || ride.drop || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider className="my-4" />
                <Grid container spacing={2} className="mt-6">
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <AttachMoney className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Fare</Typography>
                        <Typography variant="h6" className="font-medium">{ride.cost ? `₹${ride.cost}` : 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <AccessTime className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Distance</Typography>
                        <Typography variant="h6" className="font-medium">{ride.distance ? `${ride.distance} km` : 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Divider className="my-4" />
                <Box className="flex items-center mt-4">
                  {getVehicleIcon(ride.vehicleType)}
                  <Typography variant="body2" className="ml-2">{ride.vehicleType || 'N/A'}</Typography>
                </Box>
                <Box className="flex gap-4 mt-6">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAccept}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Accept'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReject}
                    disabled={loading}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Route Map</Typography>
                <Divider />
                <MapDisplay
                  pickup={ride.startLatitude && ride.startLongitude ? { lat: ride.startLatitude, lng: ride.startLongitude } : null}
                  dropoff={ride.endLatitude && ride.endLongitude ? { lat: ride.endLatitude, lng: ride.endLongitude } : null}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}