import React, { useState, useEffect } from 'react';
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
  ListItemAvatar
} from '@mui/material';
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
  AirportShuttle
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';

const rideRequest = {
  id: 201,
  pickup: 'MG Road, Bangalore',
  drop: 'Koramangala, Bangalore',
  fare: 120,
  distance: '5.2 km',
  estimatedTime: '15 min',
  customer: {
    name: 'John Doe',
    phone: '+91 9876543210',
    rating: 4.5,
    totalRides: 24
  },
  pickupLocation: { lat: 12.9716, lng: 77.5946 },
  dropLocation: { lat: 12.9279, lng: 77.6271 }
};

const mockNearbyRiders = [
  { id: 1, name: 'Rahul Kumar', location: { lat: 12.9750, lng: 77.5900 }, distance: '0.5 km', eta: '3 min' },
  { id: 2, name: 'Vikram Singh', location: { lat: 12.9700, lng: 77.5950 }, distance: '0.8 km', eta: '5 min' },
  { id: 3, name: 'Amit Sharma', location: { lat: 12.9650, lng: 77.6000 }, distance: '1.2 km', eta: '7 min' }
];

export default function AcceptRide() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30); // 30 seconds to accept
  const [selectedRider, setSelectedRider] = useState(null);

  // Simulate countdown timer
  useEffect(() => {
    if (!accepted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !accepted) {
      // Auto-reject when timer expires
      setAccepted(true);
    }
  }, [accepted, countdown]);

  const handleAccept = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAccepted(true);
      setLoading(false);
    }, 1000);
  };

  const handleReject = () => {
    setAccepted(true);
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Bike': return <TwoWheeler className="text-yellow-500" />;
      case 'Auto': return <AirportShuttle className="text-yellow-500" />;
      case 'Cab': return <LocalTaxi className="text-yellow-500" />;
      default: return <TwoWheeler className="text-yellow-500" />;
    }
  };

  if (accepted) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg rounded-xl">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" fontSize="large" />
            </div>
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              {countdown > 0 ? 'Ride Accepted!' : 'Request Expired'}
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              {countdown > 0 
                ? 'Proceed to the pickup location. Customer is waiting for you.' 
                : 'The ride request has expired. You will receive new requests soon.'
              }
            </Typography>
            <Button 
              variant="contained" 
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => window.location.href = '/rider/dashboard'}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">New Ride Request</Typography>
          <Typography variant="body1" className="text-gray-600">Accept or reject the ride request within the time limit</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Request Details */}
          <Grid item xs={12} md={5}>
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Box className="flex justify-between items-center mb-6">
                  <Typography variant="h6" className="font-bold text-gray-800">Ride Details</Typography>
                  <Chip 
                    label={`${countdown}s`} 
                    color={countdown < 10 ? "error" : "primary"}
                    variant="outlined"
                  />
                </Box>
                
                <Box className="mb-6">
                  <Typography variant="body2" className="text-gray-600 mb-2">Customer</Typography>
                  <Box className="flex items-center">
                    <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${rideRequest.customer.name}`} />
                    <Box>
                      <Typography variant="h6" className="font-medium">{rideRequest.customer.name}</Typography>
                      <Box className="flex items-center">
                        <Star className="text-yellow-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{rideRequest.customer.rating}</Typography>
                        <Typography variant="body2" className="mx-2">•</Typography>
                        <Typography variant="body2">{rideRequest.customer.totalRides} rides</Typography>
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
                      <Typography variant="h6" className="font-medium">{rideRequest.pickup}</Typography>
                    </Box>
                  </Box>
                  
                  <Box className="flex items-center">
                    <Directions className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Destination</Typography>
                      <Typography variant="h6" className="font-medium">{rideRequest.drop}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <AttachMoney className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Fare</Typography>
                        <Typography variant="h6" className="font-medium">₹{rideRequest.fare}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <AccessTime className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Est. Time</Typography>
                        <Typography variant="h6" className="font-medium">{rideRequest.estimatedTime}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <TwoWheeler className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Distance</Typography>
                        <Typography variant="h6" className="font-medium">{rideRequest.distance}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="flex items-center">
                      <Person className="text-gray-500 mr-2" />
                      <Box>
                        <Typography variant="body2" className="text-gray-600">Customer Phone</Typography>
                        <Typography variant="h6" className="font-medium">{rideRequest.customer.phone}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box className="mt-6 pt-4 border-t border-gray-200">
                  <Typography variant="body2" className="text-gray-600 mb-3">Customer Contact</Typography>
                  <Box className="flex gap-2">
                    <Button 
                      variant="outlined" 
                      startIcon={<Phone />}
                      className="flex-1"
                    >
                      Call
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Message />}
                      className="flex-1"
                    >
                      Message
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Map and Action */}
          <Grid item xs={12} md={7}>
            {/* Map */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Route Map</Typography>
                <Divider />
                <MapDisplay 
                  userLocation={rideRequest.pickupLocation} 
                  nearbyRiders={mockNearbyRiders} 
                />
              </CardContent>
            </Card>
            
            {/* Action */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Take Action</Typography>
                
                <Box className="mb-6">
                  <Typography variant="body2" className="text-gray-600 mb-2">Accept or reject this ride request</Typography>
                  <Typography variant="body2" className="text-gray-500">
                    You have {countdown} seconds to respond
                  </Typography>
                </Box>
                
                <Box className="flex gap-4">
                  <Button 
                    variant="contained" 
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleAccept}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Processing...' : 'Accept Ride'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    Reject
                  </Button>
                </Box>
                
                {countdown < 10 && (
                  <Alert severity="warning" className="mt-4">
                    Hurry! You have only {countdown} seconds left to respond.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}