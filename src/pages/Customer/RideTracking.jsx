import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
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
  Cancel
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';

// Mock data for demonstration
const mockRide = {
  id: 101,
  status: 'In Progress',
  driver: {
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    rating: 4.8,
    vehicle: 'Honda Activa',
    licensePlate: 'DL-01-AB-1234'
  },
  pickup: 'MG Road, Bangalore',
  destination: 'Koramangala, Bangalore',
  fare: 120,
  estimatedTime: '15 min',
  distance: '5.2 km'
};

const mockTrackingData = [
  { id: 1, status: 'Driver Assigned', time: '10:25 AM', completed: true },
  { id: 2, status: 'Driver Arriving', time: '10:30 AM', completed: true },
  { id: 3, status: 'Ride Started', time: '10:35 AM', completed: true },
  { id: 4, status: 'In Progress', time: '10:40 AM', completed: false },
  { id: 5, status: 'Completed', time: '10:50 AM', completed: false }
];

const mockLocation = {
  latitude: 12.9716,
  longitude: 77.5946
};

export default function RideTracking() {
  const geo = useGeolocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState(mockTrackingData);
  const [currentStep, setCurrentStep] = useState(3);
  const [eta, setEta] = useState('10 min');
  const [distance, setDistance] = useState('3.2 km');

  // Simulate ride tracking data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRide(mockRide);
      if (geo && geo.latitude && geo.longitude) {
        setLocation({ latitude: geo.latitude, longitude: geo.longitude });
      } else {
        setLocation(mockLocation);
      }
      setLoading(false);
    }, 1000);
  }, [geo]);

  // Simulate real-time tracking updates
  useEffect(() => {
    if (!loading && ride && ride.status === 'In Progress') {
      const interval = setInterval(() => {
        // Update ETA and distance
        const newEta = Math.max(1, parseInt(eta) - 1);
        const newDistance = Math.max(0.1, parseFloat(distance) - 0.5);
        
        setEta(`${newEta} min`);
        setDistance(`${newDistance.toFixed(1)} km`);
        
        // Update location slightly
        setLocation(prev => ({
          latitude: prev.latitude + 0.0001,
          longitude: prev.longitude + 0.0001
        }));
        
        // Check if ride should be completed
        if (newEta <= 1) {
          setRide(prev => ({ ...prev, status: 'Completed' }));
          setCurrentStep(4);
          clearInterval(interval);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [loading, ride, eta, distance]);

  // Get vehicle icon based on type
  const getVehicleIcon = () => {
    if (ride?.driver?.vehicle?.toLowerCase().includes('bike') || ride?.driver?.vehicle?.toLowerCase().includes('activa')) {
      return <DirectionsBike className="text-yellow-500" />;
    } else if (ride?.driver?.vehicle?.toLowerCase().includes('auto')) {
      return <AirportShuttle className="text-yellow-500" />;
    } else {
      return <LocalTaxi className="text-yellow-500" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (ride?.status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#FF9800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Track Your Ride</Typography>
          <Typography variant="body1" className="text-gray-600">Real-time tracking of your ride status and location</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Map and Status */}
          <Grid>
            {/* Status Card */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-6">
                <Box className="flex justify-between items-center mb-6">
                  <Typography variant="h6" className="font-bold text-gray-800">Ride Status</Typography>
                  <Chip 
                    label={ride.status} 
                    size="medium"
                    style={{ 
                      backgroundColor: `${getStatusColor()}20`,
                      color: getStatusColor(),
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Box className="mb-6">
                  <Typography variant="body2" className="text-gray-600 mb-1">Route</Typography>
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-2" />
                    <Typography variant="h6" className="font-medium">
                      {ride.pickup}
                    </Typography>
                  </Box>
                  <Box className="flex items-center my-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mx-2"></div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                  </Box>
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-2" />
                    <Typography variant="h6" className="font-medium">
                      {ride.destination}
                    </Typography>
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
                    <Typography variant="h6" className="font-medium">{distance}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" className="text-gray-600">Fare</Typography>
                    <Typography variant="h6" className="font-medium">₹{ride.fare}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            {/* Map */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Live Tracking</Typography>
                <Divider />
                <MapDisplay 
                  userLocation={geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : (location ? [location.latitude, location.longitude] : [12.9716, 77.5946])} 
                  nearbyRiders={[{
                    id: 1,
                    name: ride && ride.driver ? ride.driver.name : 'Driver',
                    location: geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : (location ? [location.latitude, location.longitude] : [12.9716, 77.5946])
                  }]} 
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Driver Info and Actions */}
          <Grid>
            {/* Driver Info */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Driver Information</Typography>
                
                <Box className="flex items-center mb-4">
                  <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${ride.driver.name}`} />
                  <Box>
                    <Typography variant="h6" className="font-medium">{ride.driver.name}</Typography>
                    <Box className="flex items-center">
                      <Star className="text-yellow-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{ride.driver.rating}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="space-y-3">
                  <Box className="flex items-center">
                    {getVehicleIcon()}
                    <Typography variant="body2" className="ml-2">{ride.driver.vehicle}</Typography>
                  </Box>
                  <Box className="flex items-center">
                    <Typography variant="body2" className="text-gray-600">License Plate:</Typography>
                    <Typography variant="body2" className="ml-2 font-medium">{ride.driver.licensePlate}</Typography>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex justify-between">
                  <Button 
                    variant="contained" 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    startIcon={<Phone />}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<Message />}
                  >
                    Message
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            {/* Tracking Progress */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Ride Progress</Typography>
                
                <Box className="space-y-4">
                  {trackingData.map((step, index) => (
                    <Box key={step.id} className="flex items-center">
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
                          {step.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                <Box className="mt-6">
                  <Typography variant="body2" className="text-gray-600 mb-2">Driver is {eta} away</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(4 - currentStep) * 25} 
                    className="h-2 rounded-lg"
                  />
                </Box>
                
                <Box className="mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    variant="contained" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setRide(prev => ({ ...prev, status: 'Cancelled' }));
                      setTimeout(() => {
                        navigate('/ride-booking');
                      }, 500);
                    }}
                  >
                    Cancel Ride
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}