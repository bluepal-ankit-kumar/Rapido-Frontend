import React, { useState, useEffect } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import MapDisplay from '../../components/shared/MapDisplay';
import RiderCard from '../../components/shared/RiderCard';
import Button from '../../components/common/Button';
import { mockAvailableVehicles, mockRiders } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  LocationOn, 
  Directions, 
  AccessTime, 
  AttachMoney,
  Person,
  TwoWheeler,
  LocalTaxi,
  AirportShuttle
} from '@mui/icons-material';

export default function RideBooking() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedType, setSelectedType] = useState('Bike');
  const [selectedRider, setSelectedRider] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get vehicle icon based on type
  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Bike': return <TwoWheeler className="text-yellow-500" />;
      case 'Auto': return <AirportShuttle className="text-yellow-500" />;
      case 'Cab': return <LocalTaxi className="text-yellow-500" />;
      default: return <TwoWheeler className="text-yellow-500" />;
    }
  };

  // Calculate fare and time when locations change
  useEffect(() => {
    if (pickup && dropoff) {
      // Simulate API call to calculate fare and time
      setLoading(true);
      setTimeout(() => {
        // Mock calculation based on distance and vehicle type
        const baseFare = { 'Bike': 25, 'Auto': 35, 'Cab': 50 };
        const perKm = { 'Bike': 10, 'Auto': 15, 'Cab': 20 };
        
        // Mock distance calculation (in km)
        const mockDistance = Math.floor(Math.random() * 15) + 5;
        const fare = baseFare[selectedType] + (mockDistance * perKm[selectedType]);
        const time = Math.ceil(mockDistance * 3); // Mock time in minutes
        
        setDistance(mockDistance);
        setEstimatedFare(fare);
        setEstimatedTime(time);
        setLoading(false);
      }, 800);
    }
  }, [pickup, dropoff, selectedType]);

  // Filter riders by selected vehicle type
  const availableRiders = mockRiders.filter(r => r.type === selectedType);

  // Auto-select first available rider if none is selected
  useEffect(() => {
    if (availableRiders.length > 0 && !selectedRider) {
      setSelectedRider(availableRiders[0]);
    }
  }, [selectedType, availableRiders]);

  const handleBook = () => {
    if (!pickup || !dropoff) {
      setError('Please enter pickup and dropoff locations');
      return;
    }
    if (!selectedRider) {
      setError('Please select a rider');
      return;
    }
    
    // Simulate booking logic
    setLoading(true);
    setTimeout(() => {
      alert(`Ride booked from ${pickup} to ${dropoff} with ${selectedRider.name}!`);
      navigate('/ride-tracking', { 
        state: { 
          pickup, 
          dropoff, 
          rider: selectedRider, 
          fare: estimatedFare,
          vehicleType: selectedType
        } 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Book a Ride</Typography>
          <Typography variant="body1" className="text-gray-600">Fast, safe, and affordable rides at your fingertips</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Booking Form */}
          <Grid item xs={12} md={5}>
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Enter Your Trip Details</Typography>
                
                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <Box className="mb-4">
                  <Typography variant="body2" className="text-gray-600 mb-2">Pickup Location</Typography>
                  <TextField
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <LocationOn className="text-gray-500 mr-2" />
                      )
                    }}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="body2" className="text-gray-600 mb-2">Dropoff Location</Typography>
                  <TextField
                    placeholder="Enter dropoff location"
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Directions className="text-gray-500 mr-2" />
                      )
                    }}
                  />
                </Box>
                
                <Box className="mb-6">
                  <Typography variant="body2" className="text-gray-600 mb-2">Select Vehicle Type</Typography>
                  <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                </Box>
                
                {/* Trip Summary */}
                {(estimatedFare > 0 || estimatedTime > 0) && (
                  <Card className="bg-yellow-50 border border-yellow-200 mb-6">
                    <CardContent className="p-4">
                      <Typography variant="h6" className="font-bold text-gray-800 mb-3">Trip Summary</Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box className="flex items-center">
                            <AccessTime className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">Est. Time</Typography>
                          </Box>
                          <Typography variant="h6" className="font-bold">{estimatedTime} min</Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Box className="flex items-center">
                            <AttachMoney className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">Est. Fare</Typography>
                          </Box>
                          <Typography variant="h6" className="font-bold">₹{estimatedFare}</Typography>
                        </Grid>
                      </Grid>
                      
                      <Box className="flex items-center mt-3">
                        {getVehicleIcon(selectedType)}
                        <Typography variant="body2" className="text-gray-600 ml-2">
                          {selectedType} • {selectedRider ? selectedRider.distance : distance} km
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}
                
                <Button
                  variant="contained"
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-md"
                  onClick={handleBook}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Map and Riders */}
          <Grid item xs={12} md={7}>
            {/* Map */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Map View</Typography>
                <Divider />
                <MapDisplay 
                  userLocation={{ lat: 12.9716, lng: 77.5946 }} 
                  nearbyRiders={availableRiders} 
                />
              </CardContent>
            </Card>
            
            {/* Available Riders */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-4">
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-800">Available Riders</Typography>
                  <Chip 
                    label={`${availableRiders.length} riders`} 
                    size="small"
                    style={{ backgroundColor: '#FFF8E1' }}
                  />
                </Box>
                
                {availableRiders.length === 0 ? (
                  <Box className="text-center py-6">
                    <Person className="text-gray-300" fontSize="large" />
                    <Typography variant="body1" className="text-gray-500 mt-2">No riders available</Typography>
                    <Typography variant="body2" className="text-gray-400">Try changing vehicle type or location</Typography>
                  </Box>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableRiders.map(rider => (
                      <div 
                        key={rider.id} 
                        className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                          selectedRider?.id === rider.id 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                        onClick={() => setSelectedRider(rider)}
                      >
                        <RiderCard rider={rider} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}