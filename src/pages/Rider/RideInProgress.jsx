import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress, 
  Divider,
  Chip,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import { 
  LocationOn, 
  Person, 
  DirectionsCar, 
  AccessTime, 
  Star,
  Phone,
  Message,
  Navigation
} from '@mui/icons-material';
import useRideTracking from '../../hooks/useRideTracking.js';

export default function RideInProgress() {
  // Simulate rideId for demo
  const rideId = 201;
  const { ride, location } = useRideTracking(rideId);

  // Mock driver data (would normally come from the ride object)
  const driver = {
    name: "Rajesh Kumar",
    rating: 4.8,
    vehicle: "Toyota Innova",
    licensePlate: "KA-01-AB-1234",
    phone: "+91 98765 43210"
  };

  // Mock trip progress
  const progress = 65; // percentage

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ride In Progress
      </Typography>
      
      {/* Status Card */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" fontWeight="medium">
              Ride Status
            </Typography>
            <Chip 
              label={ride ? ride.status : 'Loading...'} 
              color="primary" 
              size="medium"
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="body2" color="textSecondary" className="mb-1">
              Current Location
            </Typography>
            <Box className="flex items-center">
              <LocationOn className="text-blue-500 mr-1" />
              <Typography>
                {location ? `${location.latitude}, ${location.longitude}` : 'Fetching...'}
              </Typography>
            </Box>
          </Box>
          
          <Box className="mt-4">
            <Typography variant="body2" color="textSecondary" className="mb-1">
              Trip Progress
            </Typography>
            <LinearProgress variant="determinate" value={progress} className="h-3" />
            <Box className="flex justify-between mt-1">
              <Typography variant="caption">{progress}% completed</Typography>
              <Typography variant="caption">ETA: 15 min</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Driver and Vehicle Info */}
      <Card elevation={2} className="mb-6">
        <CardContent className="p-4">
          <Typography variant="h6" fontWeight="medium" className="mb-4">
            Driver & Vehicle Details
          </Typography>
          
          <Box className="flex items-center mb-4">
            <Avatar className="bg-blue-100 text-blue-600 mr-3">
              <Person />
            </Avatar>
            <Box className="flex-1">
              <Typography variant="subtitle1" fontWeight="medium">
                {driver.name}
              </Typography>
              <Box className="flex items-center">
                <Star className="text-yellow-500 mr-1" fontSize="small" />
                <Typography variant="body2">{driver.rating}</Typography>
              </Box>
            </Box>
            
            <Box className="flex space-x-2">
              <IconButton color="primary" aria-label="call driver">
                <Phone />
              </IconButton>
              <IconButton color="primary" aria-label="message driver">
                <Message />
              </IconButton>
            </Box>
          </Box>
          
          <Divider className="my-3" />
          
          <Box className="flex items-center">
            <DirectionsCar className="text-gray-500 mr-3" />
            <Box>
              <Typography variant="subtitle1">{driver.vehicle}</Typography>
              <Typography variant="body2" color="textSecondary">
                {driver.licensePlate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Trip Details */}
      <Card elevation={2} className="mb-6">
        <CardContent className="p-4">
          <Typography variant="h6" fontWeight="medium" className="mb-4">
            Trip Details
          </Typography>
          
          <Box className="mb-4">
            <Box className="flex items-start mb-3">
              <Box className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-0.5 h-12 bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </Box>
              <Box className="flex-1">
                <Typography variant="body1" fontWeight="medium">
                  MG Road
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-3">
                  Pickup Location
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  Koramangala
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drop Location
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box className="flex justify-between">
            <Box className="flex items-center">
              <AccessTime className="text-gray-500 mr-1" />
              <Typography variant="body2">
                Started: 10:30 AM
              </Typography>
            </Box>
            <Box className="flex items-center">
              <Navigation className="text-gray-500 mr-1" />
              <Typography variant="body2">
                Distance: 8.5 km
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <Box className="flex justify-between mt-6">
        <Button variant="outlined" color="primary" size="large">
          Share Trip Status
        </Button>
        <Button variant="contained" color="primary" size="large">
          Emergency Help
        </Button>
      </Box>
    </div>
  );
}