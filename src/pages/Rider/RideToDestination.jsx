import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapDisplay from '../../components/shared/MapDisplay';
import { 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress, 
  Divider,
  Box,
  Button
} from '@mui/material';
import { Person, Star } from '@mui/icons-material';
import { useGlobalStore } from '../../context/GlobalStore.jsx';

export default function RideToDestination() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rideId } = location.state || {};
  const { getRide, updateProgress, completeRide } = useGlobalStore();
  const ride = getRide(rideId);
  const [localProgress, setLocalProgress] = useState(ride ? ride.progress : 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!ride) {
      navigate('/rider/dashboard');
      return;
    }
    // simulate progress increasing every 2s
    timerRef.current = setInterval(() => {
      setLocalProgress(prev => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 10) + 5);
        updateProgress(rideId, next);
        return next;
      });
    }, 2000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (localProgress >= 100) {
      clearInterval(timerRef.current);
    }
  }, [localProgress]);

  const handleReachedDestination = () => {
    completeRide(rideId);
    alert(`Ride completed. You earned ₹${ride.fare}. Amount added to your wallet.`);
    navigate('/rider/dashboard');
  };

  if (!ride) return null;

  const routePoints = [
    ride.driver.location,
    ride.customer.location
  ];

  const etaEstimate = Math.max(1, Math.round((100 - localProgress) / 10) * 2);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Heading to Destination
      </Typography>

      <Card elevation={3} className="mb-6">
        <CardContent className="p-0">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <MapDisplay
              userLocation={ride.customer.location}
              nearbyRiders={[
                { id: ride.driver.name, name: ride.driver.name, location: ride.driver.location, distance: '---', eta: '---' }
              ]}
              routePoints={routePoints}
              riderLocation={ride.driver.location}
            />
          </div>
        </CardContent>
      </Card>

      <Card elevation={2} className="mb-6">
        <CardContent className="p-4">
          <Box className="mb-3">
            <Typography variant="h6">Trip Progress</Typography>
            <LinearProgress variant="determinate" value={localProgress} className="h-3 my-2" />
            <Box className="flex justify-between">
              <Typography variant="caption">{localProgress}% completed</Typography>
              <Typography variant="caption">ETA: {etaEstimate} min</Typography>
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
            <Typography variant="h6">₹{ride.fare}</Typography>
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
}
