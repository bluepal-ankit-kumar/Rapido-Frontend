import React, { useState, useEffect } from 'react';
import useGeolocation from '../../hooks/useGeolocation';
import { useNavigate } from 'react-router-dom';
import MapDisplay from '../../components/shared/MapDisplay';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import Button from '../../components/common/Button';
import { Card, CardContent, Grid, Typography, Box, Divider } from '@mui/material';
import { 
  DirectionsBike, 
  AccessTime, 
  Star, 
  LocationOn, 
  Person,
  LocalTaxi,
  AirportShuttle
} from '@mui/icons-material';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('Bike');
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default to Delhi
  const [nearbyRiders, setNearbyRiders] = useState([
    { id: 1, name: 'Rahul', location: [28.6150, 77.2100] },
    { id: 2, name: 'Vikram', location: [28.6120, 77.2080] },
    { id: 3, name: 'Amit', location: [28.6140, 77.2110] },
  ]);
  const geo = useGeolocation();
  useEffect(() => {
    if (geo && geo.latitude && geo.longitude) {
      setUserLocation([geo.latitude, geo.longitude]);
    }
  }, [geo]);

  // Always pass userLocation as [lat, lng] array to MapDisplay
  const mapUserLocation = Array.isArray(userLocation)
    ? userLocation
    : (userLocation && userLocation.latitude && userLocation.longitude
        ? [userLocation.latitude, userLocation.longitude]
        : [28.6139, 77.2090]);

  const handleBookRide = () => {
    navigate('/ride-booking', { state: { vehicleType: selectedType } });
  };

  const rideSummary = [
    { 
      title: 'Upcoming Ride', 
      value: 'No rides scheduled',
      icon: <AccessTime className="text-blue-500" />,
      color: '#E3F2FD'
    },
    { 
      title: 'Total Rides', 
      value: '24',
      icon: <DirectionsBike className="text-yellow-500" />,
      color: '#FFF8E1'
    },
    { 
      title: 'Rating', 
      value: '4.8/5',
      icon: <Star className="text-green-500" />,
      color: '#E8F5E9'
    },
  ];

  const quickActions = [
    { title: 'Book a Ride', icon: <DirectionsBike />, action: handleBookRide },
    { title: 'Ride History', icon: <AccessTime />, action: () => navigate('/ride-history') },
    { title: 'Payment', icon: <LocationOn />, action: () => navigate('/payment') },
    { title: 'Profile', icon: <Person />, action: () => navigate('/profile') },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-8 rounded-b-3xl shadow-lg mb-8">
        <div className="max-w-6xl mx-auto">
          <Typography variant="h3" className="font-bold mb-2">Welcome to Rapido!</Typography>
          <Typography variant="h6" className="mb-6 opacity-90">Fast, safe, and affordable rides at your fingertips</Typography>
          <Grid container spacing={3}>
            {rideSummary.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border-0 shadow-md">
                  <CardContent className="flex items-center p-3">
                    <Box className="p-2 rounded-full bg-white bg-opacity-30 mr-3">
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" className="opacity-90">{item.title}</Typography>
                      <Typography variant="h6" className="font-bold">{item.value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Box>

      <div className="max-w-6xl mx-auto p-4">
        <Grid container spacing={4}>
          {/* Left Column - Booking & Map */}
          <Grid item xs={12} md={7}>
            <Card className="shadow-md rounded-xl mb-6">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold p-4 pb-2">Book Your Ride</Typography>
                <Divider />
                <Box className="p-4">
                  <Typography variant="body2" className="text-gray-600 mb-3">Select Vehicle Type</Typography>
                  <VehicleTypeSelector 
                    selected={selectedType} 
                    onSelect={setSelectedType} 
                  />
                </Box>
                <Box className="p-4 pt-0">
                  <Typography variant="body2" className="text-gray-600 mb-3">Your Location</Typography>
                  <MapDisplay 
                    userLocation={mapUserLocation} 
                    nearbyRiders={nearbyRiders} 
                  />
                </Box>
                <Box className="p-4">
                  <Button 
                    variant="contained" 
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-md"
                    onClick={handleBookRide}
                  >
                    Book a Ride
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Quick Actions & Offers */}
          <Grid item xs={12} md={5}>
            <Card className="shadow-md rounded-xl mb-6">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Quick Actions</Typography>
                <Box className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                      onClick={action.action}
                    >
                      <CardContent className="flex items-center p-3">
                        <Box className="p-2 rounded-lg bg-yellow-100 mr-3">
                          {action.icon}
                        </Box>
                        <Typography variant="body1" className="font-medium">{action.title}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-xl">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Special Offers</Typography>
                <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 mb-3">
                  <CardContent className="p-3">
                    <Typography variant="body1" className="font-bold text-yellow-800 mb-1">
                      First Ride Free
                    </Typography>
                    <Typography variant="body2" className="text-yellow-700">
                      Use code FREERIDE on your first booking
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <CardContent className="p-3">
                    <Typography variant="body1" className="font-bold text-blue-800 mb-1">
                      Weekend Special
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      Get 20% off on all weekend rides
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}