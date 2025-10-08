import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress, 
  Divider,
  Box,
  Button,
  Chip,
  Alert
} from '@mui/material';
import { 
  Person, 
  Star, 
  LocationOn, 
  Directions,
  Phone,
  Message,
  Navigation
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';
import RideService from '../../services/rideService';
import useAuth from '../../hooks/useAuth';

export default function RideToDestination() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rideId } = location.state || {};
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchRide() {
      if (!rideId) {
        setError('No ride ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await RideService.getRide(rideId);
        const rideData = res.data || res;
        setRide(rideData);
        
        // Update ride status to IN_PROGRESS
        await RideService.updateRideStatus({ rideId, status: 'IN_PROGRESS' });
      } catch (err) {
        setError('Failed to load ride details');
        console.error('Failed to fetch ride:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (ride) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(100, prev + Math.floor(Math.random() * 5) + 2);
          if (next >= 100) {
            clearInterval(interval);
          }
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [ride]);

  const handleReachedDestination = async () => {
    try {
      await RideService.updateRideStatus({ rideId, status: 'COMPLETED' });
      navigate('/rider/dashboard');
    } catch (err) {
      setError('Failed to complete ride');
      console.error('Failed to complete ride:', err);
    }
  };

  const handleCancelRide = async () => {
    try {
      await RideService.updateRideStatus({ rideId, status: 'CANCELLED' });
      navigate('/rider/dashboard');
    } catch (err) {
      setError('Failed to cancel ride');
      console.error('Failed to cancel ride:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading ride details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
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
        <Alert severity="error">Ride not found</Alert>
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
        <Box mb={4}>
          <Typography variant="h4" className="font-bold text-gray-800">Ride in Progress</Typography>
          <Typography variant="body1" className="text-gray-600">Taking customer to destination</Typography>
        </Box>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Info and Progress */}
          <div className="space-y-6">
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Customer Information</Typography>
                
                <Box className="flex items-center mb-4">
                  <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${customer.name || 'user'}`} />
                  <Box>
                    <Typography variant="h6" className="font-medium">{customer.name || 'N/A'}</Typography>
                    <Box className="flex items-center">
                      <Star className="text-yellow-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{customer.rating || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="space-y-3">
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Pickup</Typography>
                      <Typography variant="h6" className="font-medium">{ride.currentPlaceName || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  
                  <Box className="flex items-center">
                    <Directions className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Destination</Typography>
                      <Typography variant="h6" className="font-medium">{ride.dropOffPlaceName || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex gap-2">
                  <Button 
                    variant="outlined" 
                    startIcon={<Phone />}
                    className="flex-1"
                    disabled={!customer.phone}
                    onClick={() => window.location.href = `tel:${customer.phone}`}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Message />}
                    className="flex-1"
                    disabled={!customer.phone}
                    onClick={() => window.location.href = `sms:${customer.phone}`}
                  >
                    Message
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Ride Progress</Typography>
                
                <Box className="mb-4">
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="body2" className="text-gray-600">Trip Progress</Typography>
                    <Chip label={`${progress}%`} color="primary" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    className="h-3 rounded-lg"
                  />
                </Box>
                
                <Box className="space-y-2">
                  <Typography variant="body2" className="text-gray-600">Fare: ₹{ride.cost || 'N/A'}</Typography>
                  <Typography variant="body2" className="text-gray-600">Distance: {ride.distance || 'N/A'} km</Typography>
                  <Typography variant="body2" className="text-gray-600">Vehicle: {ride.vehicleType || 'N/A'}</Typography>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex gap-2">
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={handleReachedDestination}
                    disabled={progress < 100}
                    className="flex-1"
                  >
                    {progress >= 100 ? 'Complete Ride' : 'In Progress...'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleCancelRide}
                    className="flex-1"
                  >
                    Cancel Ride
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}