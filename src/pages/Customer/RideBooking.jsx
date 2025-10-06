import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import MapDisplay from '../../components/shared/MapDisplay';
import RiderCard from '../../components/shared/RiderCard';
import Button from '../../components/common/Button';
import RideService from '../../services/RideService.js';
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
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { amber } from '@mui/material/colors';

import { 
  LocationOn, 
  Directions, 
  AccessTime, 
  AttachMoney,
  Person,
  TwoWheeler,
  LocalTaxi,
  AirportShuttle,
  ArrowForward,
  Star
} from '@mui/icons-material';

export default function RideBooking() {
  const theme = useTheme();
  const geo = useGeolocation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedType, setSelectedType] = useState('Bike');
  // Remove customer-side rider selection
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (geo && geo.latitude && geo.longitude && !pickup) {
      setPickup(`${geo.latitude}, ${geo.longitude}`);
    }
  }, [geo]);

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Bike': return <TwoWheeler className="text-amber-500" />;
      case 'Auto': return <AirportShuttle className="text-amber-500" />;
      case 'Cab': return <LocalTaxi className="text-amber-500" />;
      default: return <TwoWheeler className="text-amber-500" />;
    }
  };

  useEffect(() => {
    if (pickup && dropoff) {
      setLoading(true);
      setTimeout(() => {
        const baseFare = { 'Bike': 25, 'Auto': 35, 'Cab': 50 };
        const perKm = { 'Bike': 10, 'Auto': 15, 'Cab': 20 };
        const mockDistance = Math.floor(Math.random() * 15) + 5;
        const fare = baseFare[selectedType] + (mockDistance * perKm[selectedType]);
        const time = Math.ceil(mockDistance * 3);
        
        setDistance(mockDistance);
        setEstimatedFare(fare);
        setEstimatedTime(time);
        setLoading(false);
      }, 800);
    }
  }, [pickup, dropoff, selectedType]);

  const [availableRiders, setAvailableRiders] = useState([]);

  useEffect(() => {
    async function fetchAvailableRiders() {
      try {
        const response = await RideService.getAvailableRiders(selectedType);
        setAvailableRiders(response.data);
      } catch (error) {
        setAvailableRiders([]);
      }
    }
    if (selectedType) {
      fetchAvailableRiders();
    }
  }, [selectedType]);

  const handleBook = () => {
    if (!pickup || !dropoff) {
      setError('Please enter pickup and dropoff locations');
      return;
    }
    setLoading(true);
    // Call backend to book ride
    RideService.bookRide({ pickup, dropoff, vehicleType: selectedType })
      .then((response) => {
        // On success, navigate to ride tracking and show available riders on map
        navigate('/ride-tracking', {
          state: {
            pickup,
            dropoff,
            fare: estimatedFare,
            vehicleType: selectedType,
            availableRiders,
            ride: response.data // backend ride info
          }
        });
      })
      .catch(() => {
        setError('Failed to book ride. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <Box className="mb-10 text-center">
          <Typography 
            variant="h3" 
            className="font-bold"
            sx={{ 
              color: theme.palette.grey[900],
              fontWeight: 800,
              letterSpacing: '-0.025em',
              mb: 1
            }}
          >
            Premium Ride Booking
          </Typography>
          <Typography 
            variant="h6" 
            className="text-gray-600"
            sx={{ 
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Experience luxury transportation with our premium fleet and professional service
          </Typography>
        </Box>

        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
          <Grid item xs={12} md={8} lg={6} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-100 w-full max-w-xl mx-auto" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0 }}>
              <CardContent className="p-6 md:p-8 w-full flex flex-col items-center" sx={{ flex: 1, minHeight: 0 }}>
                {/* ...existing code for booking form... */}
                <Typography variant="h5" className="font-bold text-gray-800 mb-6 text-center" sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}>Enter Your Trip Details</Typography>
                {error && (
                  <Alert severity="error" className="mb-6 rounded-lg" sx={{ borderRadius: '12px', '& .MuiAlert-message': { fontWeight: 500 } }}>{error}</Alert>
                )}
                <Box className="mb-5 w-full flex flex-col items-center">
                  <Typography variant="body1" className="text-gray-600 mb-2" sx={{ fontWeight: 600 }}>Pickup Location</Typography>
                  <TextField placeholder="Enter pickup location" value={pickup} onChange={e => setPickup(e.target.value)} variant="outlined" size="medium" sx={{ width: '100%', maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: alpha(theme.palette.grey[400], 0.5) }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }} InputProps={{ startAdornment: (<LocationOn className="text-amber-500 mr-2" sx={{ fontSize: 24 }} />) }} />
                </Box>
                <Box className="mb-5 w-full flex flex-col items-center">
                  <Typography variant="body1" className="text-gray-600 mb-2" sx={{ fontWeight: 600 }}>Dropoff Location</Typography>
                  <TextField placeholder="Enter dropoff location" value={dropoff} onChange={e => setDropoff(e.target.value)} variant="outlined" size="medium" sx={{ width: '100%', maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: alpha(theme.palette.grey[400], 0.5) }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }} InputProps={{ startAdornment: (<Directions className="text-amber-500 mr-2" sx={{ fontSize: 24 }} />) }} />
                </Box>
                <Box className="mb-7 w-full flex flex-col items-center">
                  <Typography variant="body1" className="text-gray-600 mb-3" sx={{ fontWeight: 600 }}>Select Vehicle Type</Typography>
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                  </Box>
                </Box>
                {(estimatedFare > 0 || estimatedTime > 0) && (
                  <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 mb-7 overflow-hidden w-full max-w-md mx-auto" sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent className="p-5">
                      <Typography variant="h6" className="font-bold text-gray-800 mb-4 text-center" sx={{ fontWeight: 700 }}>Trip Summary</Typography>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6}>
                          <Box className="flex items-center justify-center"><AccessTime className="text-amber-600 mr-2" fontSize="medium" /><Typography variant="body1" className="text-gray-600" sx={{ fontWeight: 500 }}>Est. Time</Typography></Box>
                          <Typography variant="h5" className="font-bold mt-1 text-center" sx={{ fontWeight: 700 }}>{estimatedTime} min</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box className="flex items-center justify-center"><AttachMoney className="text-amber-600 mr-2" fontSize="medium" /><Typography variant="body1" className="text-gray-600" sx={{ fontWeight: 500 }}>Est. Fare</Typography></Box>
                          <Typography variant="h5" className="font-bold mt-1 text-center" sx={{ fontWeight: 700 }}>₹{estimatedFare}</Typography>
                        </Grid>
                      </Grid>
                      <Box className="flex items-center mt-4 pt-3 border-t border-amber-200 justify-center">{getVehicleIcon(selectedType)}<Typography variant="body1" className="text-gray-700 ml-2" sx={{ fontWeight: 600 }}>{selectedType} • {distance} km</Typography></Box>
                    </CardContent>
                  </Card>
                )}
                <Box sx={{ mt: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" className="w-full max-w-md py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-400 hover:from-yellow-600 hover:to-yellow-600 text-gray-900 font-medium rounded-xl shadow-lg" sx={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.025em', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', '&:hover': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)' }, borderRadius: '12px' }} onClick={handleBook} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} endIcon={!loading ? <ArrowForward /> : null}>{loading ? 'Processing...' : 'Confirm Booking'}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={10} lg={8} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
            <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-100 w-full max-w-3xl mx-auto" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0 }}>
              <CardContent className="p-5 w-full flex flex-col items-center">
                <Box className="flex justify-between items-center mb-5 w-full max-w-2xl mx-auto">
                  <Typography variant="h5" className="font-bold text-gray-800" sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}>Available Riders</Typography>
                  <Chip label={`${availableRiders.length} riders`} size="medium" sx={{ backgroundColor: alpha(amber[500], 0.1), color: amber[700], fontWeight: 600, borderRadius: '8px', '& .MuiChip-label': { px: 2 } }} />
                </Box>
                {availableRiders.length === 0 ? (
                  <Box className="text-center py-10"><Person className="text-gray-300" fontSize="large" sx={{ fontSize: 64 }} /><Typography variant="h6" className="text-gray-500 mt-4" sx={{ fontWeight: 500 }}>No riders available</Typography><Typography variant="body1" className="text-gray-400 mt-1" sx={{ fontWeight: 400 }}>Try changing vehicle type or location</Typography></Box>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mx-auto">
                    {availableRiders.map(rider => (
                      <Card key={rider.id} className={`border rounded-xl p-1 transition-all duration-300 border-gray-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md`} sx={{ borderRadius: '16px', overflow: 'hidden' }}><CardContent className="p-4"><RiderCard rider={rider} /></CardContent></Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid> */}
  {/* End of main Grid container */}
        </Grid>
      </div>
    </div>
  );
}