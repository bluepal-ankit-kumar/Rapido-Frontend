import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect, useRef } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import '../../styles/pickupDropoffSeparator.css';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';

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
  MyLocation,
} from '@mui/icons-material';

// --- Leaflet Icon Fix ---
// This is a common fix to ensure Leaflet's default marker icons load correctly.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import RideService from '../../services/RideService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- Leaflet Map Components (Integrated) ---

const RoutingMachine = ({ routePoints }) => {
  const map = useMap();

  useEffect(() => {
    // FIX for 'removeLayer' error: First, remove any existing routing control.
    if (map.routingControl) {
      map.removeControl(map.routingControl);
    }

    if (!routePoints || routePoints.length < 2) return;

    const [pickup, dropoff] = routePoints;
    const waypoints = [
      L.latLng(pickup[0], pickup[1]),
      L.latLng(dropoff[0], dropoff[1])
    ];

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      show: false, // Hide the turn-by-turn instruction panel
      addWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366f1', opacity: 0.8, weight: 6 }]
      },
      createMarker: () => null, // We use our own markers
    }).addTo(map);

    // Store the control instance on the map to allow for removal later
    map.routingControl = routingControl;

  }, [map, routePoints]);

  return null;
};

const LeafletMapDisplay = ({ userLocation, routePoints }) => {
  const center = userLocation ? [userLocation[0], userLocation[1]] : [17.3850, 78.4867]; // Default to Hyderabad
  const [pickupCoords, dropoffCoords] = routePoints || [];

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '250px', width: '100%', borderRadius: '12px', position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pickupCoords && <Marker position={pickupCoords}></Marker>}
        {dropoffCoords && <Marker position={dropoffCoords}></Marker>}
        {routePoints && routePoints.length === 2 && <RoutingMachine routePoints={routePoints} />}
      </MapContainer>
    </div>
  );
};


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

  // const deleteRide = async (token) => {
  //   console.log("inside delete ride method")
  //   setTimeout(async() => {
  //     console.log("inside settimeout")
  //      const res = await RideService.getRide(123);
  //      console.log("res:- ", res.data)
  //     if(res.data?.status=="REQUESTED"){
  //       console.log("inside if")
  //       RideService.deleteRide(123, token);
  //       navigate("/ride-booking");
  //     }
  //   },20000);
  // }

  const deleteRide = async (rideId, token) => {
    console.log("inside delete ride method for ride ID:", rideId);
    setTimeout(async() => {
      console.log("inside settimeout checking ride status for ID:", rideId);
       const res = await RideService.getRide(rideId);
       console.log("res:- ", res.data);
      if(res.data?.status=="REQUESTED"){
        console.log("inside if - deleting ride ID:", rideId);
        RideService.deleteRide(rideId, token);
        navigate("/ride-booking");
      }
    },20000);
  }

  const handleBook = async () => {
    const jwtToken=localStorage.getItem("jwtToken")
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

      // Call deleteRide with the new ride's ID and token
      deleteRide(rideResp.id, jwtToken);

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

  // const handleBook = async () => {
  //   const jwtToken=localStorage.getItem("jwtToken")
  //   setError('');
  //   if (!pickup || !dropoff) {
  //     setError('Please enter pickup and dropoff locations.');
  //     return;
  //   }
  //   if (!user?.id) {
  //     setError('You must be logged in to book a ride.');
  //     return;
  //   }
  //   deleteRide(jwtToken);

  //   setLoading(true);

  //   try {
  //     let finalPickupCoords = pickupCoords;
  //     let finalDropoffCoords = dropoffCoords;

  //     // If pickup coordinates are missing (user typed manually), find them now.
  //     if (!finalPickupCoords) {
  //       const pickupResults = await searchPlaces(pickup);
  //       if (pickupResults.length > 0) {
  //         finalPickupCoords = [pickupResults[0].lat, pickupResults[0].lon];
  //         setPickupCoords(finalPickupCoords); // Update state to reflect on the map
  //       } else {
  //         throw new Error(`Could not find a valid location for pickup: "${pickup}"`);
  //       }
  //     }

  //     // If dropoff coordinates are missing, find them now.
  //     if (!finalDropoffCoords) {
  //       const dropoffResults = await searchPlaces(dropoff);
  //       if (dropoffResults.length > 0) {
  //         finalDropoffCoords = [dropoffResults[0].lat, dropoffResults[0].lon];
  //         setDropoffCoords(finalDropoffCoords); // Update state to reflect on the map
  //       } else {
  //         throw new Error(`Could not find a valid location for dropoff: "${dropoff}"`);
  //       }
  //     }

  //     const rideRequest = {
  //       userId: user.id,
  //       currentPlaceName: pickup,
  //       dropOffPlaceName: dropoff,
  //       vehicleType: selectedType,
  //       timestamp: Date.now(),
  //       startLatitude: finalPickupCoords[0],
  //       startLongitude: finalPickupCoords[1],
  //       endLatitude: finalDropoffCoords[0],
  //       endLongitude: finalDropoffCoords[1],
  //     };

  //     const response = await RideService.bookRide(rideRequest);
  //     const rideResp = response?.data || response;

  //     navigate('/ride-tracking', {
  //       state: {
  //         pickup,
  //         dropoff,
  //         vehicleType: selectedType,
  //         ride: rideResp,
  //       }
  //     });

  //   } catch (err) {
  //     console.log("err:- ", err);
  //     setError(err.message || 'Unable to book the ride. Please check locations and try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-screen h-screen min-h-screen min-w-full p-0 m-0">
        <Card
          elevation={0}
          sx={{
            width: '100vw',
            minHeight: '100vh',
            borderRadius: 0,
            background: '#f8fafc',
            border: 'none',
            boxShadow: 'none',
            p: 0,
            m: 0,
          }}
        >
          <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, mt: 2, textAlign: 'center', color: '#1e293b', letterSpacing: 0.5 }}>Enter Your Trip Details</Typography>
                


                

                {/* Pickup & Dropoff Grouped Box */}
                <Box sx={{
                  mb: 2,
                  width: '100%',
                  maxWidth: 1100,
                  background: '#f6f7f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)'
                  
                }} >
                  {/* Pickup & Dropoff Icons with Dotted Line */}
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', p: 2, pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, mt: 2, minWidth: 32, justifyContent: 'center', height: '100%' }}>
                      <LocationOn color="success" sx={{ fontSize: 28, mb: 0.5 }} />
                      <Box sx={{ flex: 1, width: 2, minHeight: 24, borderRight: '2px dotted #94a3b8', my: 0.5 }} />
                      <Directions color="error" sx={{ fontSize: 28, mt: 0.5 }} />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                      <Autocomplete
                        freeSolo
                        options={pickupSuggestions}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        loading={searching.pickup}
                        value={pickup}
                        onInputChange={(e, newValue) => {
                          setPickup(newValue);
                          setPickupCoords(null);
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
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                color: 'transparent',
                                caretColor: '#2563eb',
                                background: 'transparent',
                              },
                              endAdornment: (
                                <>
                                  <MyLocation
                                    sx={{ cursor: 'pointer', color: '#2563eb', mr: 1 }}
                                    fontSize="medium"
                                    onClick={useCurrentLocationForPickup}
                                  />
                                  {searching.pickup ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                            sx={{
                              background: 'transparent',
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#64748b',
                                opacity: 1,
                              },
                              '& .MuiInputBase-input': {
                                color: 'transparent',
                                textShadow: '0 0 0 #000',
                              },
                            }}
                          />
                        )}
                      />
                      <div className="pickup-dropoff-separator" />
                      <Autocomplete
                        freeSolo
                        options={dropoffSuggestions}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        loading={searching.dropoff}
                        value={dropoff}
                        onInputChange={(e, newValue) => {
                          setDropoff(newValue);
                          setDropoffCoords(null);
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
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                color: 'transparent',
                                caretColor: '#2563eb',
                                background: 'transparent',
                              },
                              endAdornment: (
                                <>
                                  {searching.dropoff ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                            sx={{
                              background: 'transparent',
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#64748b',
                                opacity: 1,
                              },
                              '& .MuiInputBase-input': {
                                color: 'transparent',
                                textShadow: '0 0 0 #000',
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3, textAlign: 'center', width: '100%', maxWidth: 1100 }}>
                  {/* <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5, color: '#334155' }}>Select Vehicle Type</Typography> */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ width: '100%', maxWidth: 1100 }}>
                        <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                      </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3, width: '100%', maxWidth: 1100 }}>
                  <LeafletMapDisplay
                    userLocation={pickupCoords || (geo?.latitude ? [geo.latitude, geo.longitude] : null)}
                    routePoints={(pickupCoords && dropoffCoords) ? [pickupCoords, dropoffCoords] : []}
                  />
                </Box>

                <Box sx={{ mt: 'auto', width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', borderTop: '1px solid #facc15', mb: 3, mt: 1, opacity: 1.7 }} />
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disableElevation
                    sx={{
                      backgroundColor: '#fde047 !important',
                      color: '#2e2a2a !important',
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px 0 rgba(250,204,21,0.10)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#facc15 !important',
                        boxShadow: '0 8px 24px 0 rgba(250,204,21,0.13)',
                        transform: 'scale(1.03)',
                        filter: 'brightness(1.05)'
                      },
                      '&:active': {
                        filter: 'brightness(0.97)'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#fef9c3 !important',
                        color: '#bdbdbd !important'
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
              {error && <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{error}</Alert>}
        </Card>
        
      </div>
    </div>
  );
}
