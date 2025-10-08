// import React, { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import MapDisplay from '../../components/shared/MapDisplay';
// import { 
//   Typography, 
//   Card, 
//   CardContent, 
//   Avatar, 
//   LinearProgress, 
//   Divider,
//   Box,
//   Button
// } from '@mui/material';
// import { Person, Star } from '@mui/icons-material';
// import { useGlobalStore } from '../../context/GlobalStore.jsx';

// export default function RideToDestination() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { rideId } = location.state || {};
//   const { getRide, updateProgress, completeRide } = useGlobalStore();
//   const ride = getRide(rideId);
//   const [localProgress, setLocalProgress] = useState(ride ? ride.progress : 0);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     if (!ride) {
//       navigate('/rider/dashboard');
//       return;
//     }
//     // simulate progress increasing every 2s
//     timerRef.current = setInterval(() => {
//       setLocalProgress(prev => {
//         const next = Math.min(100, prev + Math.floor(Math.random() * 10) + 5);
//         updateProgress(rideId, next);
//         return next;
//       });
//     }, 2000);

//     return () => clearInterval(timerRef.current);
//   }, []);

//   useEffect(() => {
//     if (localProgress >= 100) {
//       clearInterval(timerRef.current);
//     }
//   }, [localProgress]);

//   const handleReachedDestination = () => {
//     completeRide(rideId);
//     alert(`Ride completed. You earned ₹${ride.fare}. Amount added to your wallet.`);
//     navigate('/rider/dashboard');
//   };

//   if (!ride) return null;

//   const routePoints = [
//     ride.driver.location,
//     ride.customer.location
//   ];

//   const etaEstimate = Math.max(1, Math.round((100 - localProgress) / 10) * 2);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Heading to Destination
//       </Typography>

//       <Card elevation={3} className="mb-6">
//         <CardContent className="p-0">
//           <div className="w-full h-80 rounded-xl overflow-hidden">
//             <MapDisplay
//               userLocation={ride.customer.location}
//               nearbyRiders={[
//                 { id: ride.driver.name, name: ride.driver.name, location: ride.driver.location, distance: '---', eta: '---' }
//               ]}
//               routePoints={routePoints}
//               riderLocation={ride.driver.location}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <Card elevation={2} className="mb-6">
//         <CardContent className="p-4">
//           <Box className="mb-3">
//             <Typography variant="h6">Trip Progress</Typography>
//             <LinearProgress variant="determinate" value={localProgress} className="h-3 my-2" />
//             <Box className="flex justify-between">
//               <Typography variant="caption">{localProgress}% completed</Typography>
//               <Typography variant="caption">ETA: {etaEstimate} min</Typography>
//             </Box>
//           </Box>

//           <Divider className="my-3" />

//           <Box className="flex items-center mb-3">
//             <Avatar className="bg-blue-100 text-blue-600 mr-3">
//               <Person />
//             </Avatar>
//             <Box>
//               <Typography variant="subtitle1">{ride.driver.name}</Typography>
//               <Box className="flex items-center">
//                 <Star className="text-yellow-500 mr-1" fontSize="small" />
//                 <Typography variant="body2">{ride.driver.rating}</Typography>
//               </Box>
//             </Box>
//           </Box>

//           <Box className="mb-3">
//             <Typography variant="subtitle1">Estimated Fare</Typography>
//             <Typography variant="h6">₹{ride.fare}</Typography>
//           </Box>

//           <Box className="flex justify-end">
//             <Button variant="contained" color="success" onClick={handleReachedDestination}>
//               Reached Destination
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { 
  Typography, Card, CardContent, Grid, Button, Box, Avatar, Divider,
  Chip, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, IconButton, CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  TwoWheeler, CurrencyRupee, Star, History, LocationOn, 
  VerifiedUser, AccountBalanceWallet, MyLocation
} from '@mui/icons-material';
import LocationService from '../../services/locationService';
import DriverService from '../../services/DriverService';
import RideService from '../../services/RideService';
import useGeolocation from '../../hooks/useGeolocation';
import useAuth from '../../hooks/useAuth';

const RideToDestination = () => {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { rideId } = routerLocation.state || {};
  const { user } = useAuth();
  const geo = useGeolocation();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    async function fetchRide() {
      try {
        const res = await RideService.getRide(rideId);
        const data = res.data;
        setRide(data);
        if (data.pickupLocation) {
          setPickupCoords([data.pickupLocation.latitude, data.pickupLocation.longitude]);
        }
        if (data.dropOffLocation) {
          setDropoffCoords([data.dropOffLocation.latitude, data.dropOffLocation.longitude]);
        }
        if (data.driverLocation) {
          setDriverCoords([data.driverLocation.latitude, data.driverLocation.longitude]);
        }
      } catch (err) {
        setError('Failed to fetch ride details');
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (geo && ride) {
      const updateLocation = async () => {
        try {
          await LocationService.updateLocation({
            userId: user.id,
            rideId: ride.id,
            latitude: geo.latitude,
            longitude: geo.longitude,
            locationType: 'CURRENT',
            timestamp: Date.now(),
          });
          setDriverCoords([geo.latitude, geo.longitude]);
        } catch (e) {
          console.error("Location update failed", e);
        }
      };
      updateLocation();
      const interval = setInterval(updateLocation, 20000); // Every 20 seconds
      return () => clearInterval(interval);
    }
  }, [geo, ride, user.id]);

  useEffect(() => {
    if (driverCoords && dropoffCoords) {
      const km = haversineKm(driverCoords, dropoffCoords);
      setDistance(`${km.toFixed(1)} km`);
      const minutes = Math.max(1, Math.round((km / 25) * 60));
      setEta(`${minutes} min`);
    }
  }, [driverCoords, dropoffCoords]);

  const haversineKm = (a, b) => {
    const toRad = (deg) => deg * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const handleReachedDestination = async () => {
    try {
      await RideService.updateRideStatus({ rideId: ride.id, status: 'COMPLETED' });
      alert(`Ride completed. You earned ₹${ride.cost}. Amount added to your wallet.`);
      navigate('/rider/dashboard');
    } catch (e) {
      setError('Failed to complete ride');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!ride) return <Typography>No ride found</Typography>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Heading to Destination
      </Typography>

      <Card elevation={3} className="mb-6">
        <CardContent className="p-0">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <MapDisplay 
              userLocation={pickupCoords}
              riderLocation={driverCoords}
              routePoints={[pickupCoords, dropoffCoords]}
            />
          </div>
        </CardContent>
      </Card>

      <Card elevation={2} className="mb-6">
        <CardContent className="p-4">
          <Box className="mb-3">
            <Typography variant="h6">Trip Progress</Typography>
            <LinearProgress variant="determinate" value={ride.progress} className="h-3 my-2" />
            <Box className="flex justify-between">
              <Typography variant="caption">{ride.progress}% completed</Typography>
              <Typography variant="caption">ETA: {eta}</Typography>
            </Box>
          </Box>

          <Divider className="my-3" />

          <Box className="flex items-center mb-3">
            <Avatar className="bg-blue-100 text-blue-600 mr-3">
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{ride.driver.name}</Typography>
              <Box className="flex items-center">
                <Star className="text-yellow-500 mr-1" fontSize="small" />
                <Typography variant="body2">{ride.driver.rating}</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="mb-3">
            <Typography variant="subtitle1">Estimated Fare</Typography>
            <Typography variant="h6">₹{ride.cost}</Typography>
          </Box>

          <Box className="flex justify-end">
            <Button variant="contained" color="success" onClick={handleReachedDestination}>
              Reached Destination
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideToDestination;