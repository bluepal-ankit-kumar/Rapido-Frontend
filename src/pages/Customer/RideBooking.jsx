import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect, useRef } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import Button from '../../components/common/Button';
import RideService from '../../services/RideService.js';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  Autocomplete
} from '@mui/material';

import {
  LocationOn,
  Directions,
  ArrowForward,
} from '@mui/icons-material';

// --- Main RideBooking Component ---

export default function RideBooking() {
  const { user } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  // State for what the user sees in the input fields (the full address)
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const [selectedType, setSelectedType] = useState('Bike');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // The definitive source of truth for location coordinates
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  const [searching, setSearching] = useState({ pickup: false, dropoff: false });
  const [autofilledFromGeo, setAutofilledFromGeo] = useState(false);

  // --- API & Helper Functions ---

  const searchPlaces = async (query) => {
    if (!query) return [];
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', addressdetails: 1, limit: 5 }
      });
      return response.data.map(place => ({
        label: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        id: place.place_id,
      }));
    } catch (err) {
      console.error("Nominatim search failed:", err);
      return [];
    }
  };

  // const reverseGeocode = async (lat, lon) => {
  //   try {
  //     const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
  //       params: { lat, lon, format: 'json' }
  //     });
  //     return response.data.display_name || null;
  //   } catch (err) {
  //     console.error("Nominatim reverse geocode failed:", err);
  //     return null;
  //   }
  // };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { lat, lon, format: 'json' },
        timeout: 20000 // Keep the increased timeout, but be ready for it to fail.
      });
      return response.data.display_name || null;
    } catch (err) {
      // Log the error (timeout) for debugging
      console.error("Nominatim reverse geocode failed:", err);
      // **Crucial Change:** Return null on failure (timeout or network error)
      return null;
    }
  };



//   const reverseGeocode = async (lat, lon) => {
//   try {
//     const response = await axios.get("http://localhost:8080/api/maps/reverse", {
//       params: { lat, lon },
//     });
//     return response.data.display_name || "Unknown location";
//   } catch (err) {
//     console.error("Reverse geocode failed:", err);
//     return "Unknown location";
//   }
// };


  // --- Event Handlers ---

  const handleSearch = (query, setSuggestions, type) => {
    clearTimeout(searchTimeout.current);
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSearching(s => ({ ...s, [type]: true }));
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(query.trim());
        setSuggestions(results);
      } finally {
        setSearching(s => ({ ...s, [type]: false }));
      }
    }, 400);
  };

  const useCurrentLocationForPickup = async () => {
    setError('');
    if (geo && typeof geo.latitude === 'number') {
      try {
        const address = await reverseGeocode(geo.latitude, geo.longitude);
        if (address) {
          setPickup(address);
          setPickupCoords([geo.latitude, geo.longitude]);
          setPickupSuggestions([]);
          setAutofilledFromGeo(true);
        } else {
          setError('Could not determine your address. Please search manually.');
        }
      } catch (e) {
        setError('Could not fetch address. Check your internet connection.');
      }
    } else {
      setError('Location permissions not available or location is being determined. Please enable location or wait.');
    }
  };

  useEffect(() => {
    if (!autofilledFromGeo && user?.id && geo?.latitude && !pickup) {
      useCurrentLocationForPickup();
    }
  }, [user?.id, geo?.latitude]);

  const handleBook = async () => {
    setError('');
    if (!pickup || !dropoff) {
      setError('Please enter pickup and dropoff locations.');
      return;
    }
    if (!user?.id) {
      setError('You must be logged in to book a ride.');
      return;
    }

    setLoading(true);

    try {
      let finalPickupCoords = pickupCoords;
      let finalDropoffCoords = dropoffCoords;

      // If pickup coordinates are missing (user typed manually), find them now.
      if (!finalPickupCoords) {
        const pickupResults = await searchPlaces(pickup);
        if (pickupResults.length > 0) {
          finalPickupCoords = [pickupResults[0].lat, pickupResults[0].lon];
          setPickupCoords(finalPickupCoords); // Update state to reflect on the map
        } else {
          throw new Error(`Could not find a valid location for pickup: "${pickup}"`);
        }
      }

      // If dropoff coordinates are missing, find them now.
      if (!finalDropoffCoords) {
        const dropoffResults = await searchPlaces(dropoff);
        if (dropoffResults.length > 0) {
          finalDropoffCoords = [dropoffResults[0].lat, dropoffResults[0].lon];
          setDropoffCoords(finalDropoffCoords); // Update state to reflect on the map
        } else {
          throw new Error(`Could not find a valid location for dropoff: "${dropoff}"`);
        }
      }

      const rideRequest = {
        userId: user.id,
        currentPlaceName: pickup,
        dropOffPlaceName: dropoff,
        vehicleType: selectedType,
        timestamp: Date.now(),
        startLatitude: finalPickupCoords[0],
        startLongitude: finalPickupCoords[1],
        endLatitude: finalDropoffCoords[0],
        endLongitude: finalDropoffCoords[1],
      };

      const response = await RideService.bookRide(rideRequest);
      const rideResp = response?.data || response;

      navigate('/ride-tracking', {
        state: {
          pickup,
          dropoff,
          vehicleType: selectedType,
          ride: rideResp,
        }
      });

    } catch (err) {
      console.log("err:- ", err);
      setError(err.message || 'Unable to book the ride. Please check locations and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511345624864-d6cf46344e8c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-indigo-900/50"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card 
              className="shadow-2xl rounded-3xl w-full max-w-xl mx-auto overflow-hidden backdrop-blur-lg"
              sx={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 2, 
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Premium Ride Booking
                  </Typography>
                  <Typography variant="body1" sx={{ color: ' #8b5cf6', fontWeight: 500 }}>
                    Experience luxury transportation at your fingertips
                  </Typography>
                </div>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 4, 
                      borderRadius: '12px',
                      background: 'rgba(244, 67, 54, 0.2)',
                      color: '#d32f2f',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      fontWeight: 500
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Pickup Location */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>Pickup Location</Typography>
                    <Button 
                      size="small" 
                      variant="text" 
                      onClick={useCurrentLocationForPickup}
                      sx={{ 
                        fontWeight: 600, 
                        color: '#6366f1',
                        textTransform: 'none',
                        '&:hover': { background: 'rgba(99, 10, 150, 0.1)' }
                      }}
                    >
                      Use current location
                    </Button>
                  </Box>
                  <Autocomplete
                    freeSolo
                    options={pickupSuggestions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    loading={searching.pickup}
                    value={pickup}
                    onInputChange={(e, newValue) => {
                      setPickup(newValue);
                      setPickupCoords(null); // Invalidate coords when user types manually
                      handleSearch(newValue, setPickupSuggestions, 'pickup');
                    }}
                    onChange={(e, newValue) => {
                      if (newValue && typeof newValue === 'object') {
                        setPickup(newValue.label);
                        setPickupCoords([newValue.lat, newValue.lon]);
                        setPickupSuggestions([]);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Search pickup location"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <div className="bg-indigo-100 p-2 rounded-l-lg">
                              <LocationOn color="primary" sx={{ color: '#6366f1' }} />
                            </div>
                          ),
                          endAdornment: (
                            <>
                              {searching.pickup ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Dropoff Location */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155', mb: 1.5 }}>Dropoff Location</Typography>
                  <Autocomplete
                    freeSolo
                    options={dropoffSuggestions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    loading={searching.dropoff}
                    value={dropoff}
                    onInputChange={(e, newValue) => {
                      setDropoff(newValue);
                      setDropoffCoords(null); // Invalidate coords when user types manually
                      handleSearch(newValue, setDropoffSuggestions, 'dropoff');
                    }}
                    onChange={(e, newValue) => {
                      if (newValue && typeof newValue === 'object') {
                        setDropoff(newValue.label);
                        setDropoffCoords([newValue.lat, newValue.lon]);
                        setDropoffSuggestions([]);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Search dropoff location"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <div className="bg-indigo-100 p-2 rounded-l-lg">
                              <Directions color="primary" sx={{ color: '#6366f1' }} />
                            </div>
                          ),
                          endAdornment: (
                            <>
                              {searching.dropoff ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 5, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155', mb: 2 }}>Select Vehicle Type</Typography>
                  <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                </Box>

                <Box sx={{ mt: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
                      py: 1.8,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                        boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      '&:active': {
                        transform: 'translateY(1px)'
                      }
                    }}
                    onClick={handleBook}
                    disabled={loading || !pickup || !dropoff}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    endIcon={!loading ? <ArrowForward /> : null}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
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