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

// --- Haversine Distance Fallback ---
const haversineKm = (a, b) => {
  if (!a || !b || !a[0] || !a[1] || !b[0] || !b[1] || isNaN(a[0]) || isNaN(a[1]) || isNaN(b[0]) || isNaN(b[1])) {
    return 0;
  }
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// --- Leaflet Map Components ---

const RoutingMachine = ({ routePoints, selectedType, onRouteCalculated }) => {
  const map = useMap();

  useEffect(() => {
    // Clean up existing routing control
    if (map.routingControl) {
      map.removeControl(map.routingControl);
      map.routingControl = null;
    }

    if (!routePoints || routePoints.length < 2 || !routePoints[0] || !routePoints[1]) {
      console.log('Invalid routePoints:', routePoints);
      onRouteCalculated(0, 0, 'Invalid pickup or dropoff coordinates');
      return;
    }

    const [pickup, dropoff] = routePoints;
    if (
      !pickup[0] || !pickup[1] || !dropoff[0] || !dropoff[1] ||
      isNaN(pickup[0]) || isNaN(pickup[1]) || isNaN(dropoff[0]) || isNaN(dropoff[1])
    ) {
      console.log('Invalid coordinates:', pickup, dropoff);
      onRouteCalculated(0, 0, 'Invalid coordinates');
      return;
    }

    const waypoints = [
      L.latLng(pickup[0], pickup[1]),
      L.latLng(dropoff[0], dropoff[1])
    ];

    const profile = ['Bike', 'Scooty'].includes(selectedType) ? 'bike' : 'car';

    const router = new L.Routing.OSRMv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: profile,
    });

    const routingControl = L.Routing.control({
      waypoints,
      router,
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366f1', opacity: 0.8, weight: 6 }]
      },
      createMarker: () => null,
    }).addTo(map);

    const handleRoutesFound = (e) => {
      console.log('Routes found:', e.routes);
      if (e.routes && e.routes[0] && e.routes[0].summary) {
        const summary = e.routes[0].summary;
        const distKm = summary.totalDistance / 1000; // km
        const timeMin = Math.round(summary.totalTime / 60); // min
        onRouteCalculated(distKm, timeMin, null);
      } else {
        const distKm = haversineKm(pickup, dropoff);
        console.log("distKm:- ", distKm)
        const timeMin = Math.max(1, Math.round((distKm / 25) * 60)); // Assume 25 km/h
        onRouteCalculated(distKm, timeMin, 'Using approximate distance (OSRM failed)');
      }
    };

    const handleRoutingError = (e) => {
      console.error('Routing error:', e);
      const distKm = haversineKm(pickup, dropoff);
      const timeMin = Math.max(1, Math.round((distKm / 25) * 60));
      onRouteCalculated(distKm, timeMin, 'Routing service unavailable');
    };

    routingControl.on('routesfound', handleRoutesFound);
    routingControl.on('routingerror', handleRoutingError);

    map.routingControl = routingControl;

    return () => {
      routingControl.off('routesfound', handleRoutesFound);
      routingControl.off('routingerror', handleRoutingError);
      if (map.routingControl) {
        map.removeControl(map.routingControl);
        map.routingControl = null;
      }
    };
  }, [map, routePoints, selectedType, onRouteCalculated]);

  return null;
};

const LeafletMapDisplay = ({ userLocation, routePoints, selectedType, onRouteCalculated }) => {
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
        {routePoints && routePoints.length === 2 && (
          <RoutingMachine 
            routePoints={routePoints} 
            selectedType={selectedType} 
            onRouteCalculated={onRouteCalculated} 
          />
        )}
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

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedType, setSelectedType] = useState('Bike');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [searching, setSearching] = useState({ pickup: false, dropoff: false });
  const [autofilledFromGeo, setAutofilledFromGeo] = useState(false);
  const [distance, setDistance] = useState(0); // km
  const [eta, setEta] = useState(0); // min
  const [fare, setFare] = useState(0); // INR
  const [routeError, setRouteError] = useState(null);

  // Define rates per vehicle type
  const rates = {
    'Bike': { base: 20, perKm: 10 },
    'Scooty': { base: 15, perKm: 8 },
    'Auto': { base: 30, perKm: 15 },
    'SUV': { base: 50, perKm: 20 },
    'Non AC Cab': { base: 40, perKm: 18 },
    'AC Cab': { base: 60, perKm: 22 },
  };

  // Recalculate fare when distance or vehicle type changes
  useEffect(() => {
    if (distance > 0) {
      const rate = rates[selectedType] || { base: 0, perKm: 0 };
      const calculatedFare = Math.round(rate.base + rate.perKm * distance);
      setFare(calculatedFare);
    } else {
      setFare(0);
    }
  }, [distance, selectedType]);

  // Trigger geocoding if coordinates are missing but addresses are set
  useEffect(() => {
    const geocodeIfNeeded = async () => {
      if (pickup && !pickupCoords) {
        try {
          const results = await searchPlaces(pickup);
          if (results.length > 0) {
            setPickupCoords([results[0].lat, results[0].lon]);
          }
        } catch (err) {
          console.error('Pickup geocoding failed:', err);
          setRouteError('Could not geocode pickup location');
        }
      }
      if (dropoff && !dropoffCoords) {
        try {
          const results = await searchPlaces(dropoff);
          if (results.length > 0) {
            setDropoffCoords([results[0].lat, results[0].lon]);
          }
        } catch (err) {
          console.error('Dropoff geocoding failed:', err);
          setRouteError('Could not geocode dropoff location');
        }
      }
    };
    geocodeIfNeeded();
  }, [pickup, dropoff]);

  // Handle route calculation results
  const handleRouteCalculated = (distKm, timeMin, error) => {
    console.log('Route calculated:', { distKm, timeMin, error });
    setDistance(distKm);
    setEta(timeMin);
    setRouteError(error || null);
  };

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
        timeout: 90000
      });
      return response.data.display_name || null;
    } catch (err) {
      console.error("Nominatim reverse geocode failed:", err);
      return null;
    }
  };

  // const reverseGeocode = async (lat, lon) => {
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
    },90000);
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
    if (fare === 0) {
      setError('Unable to calculate fare. Please try different locations or check your connection.');
      return;
    }

    setLoading(true);

    try {
      let finalPickupCoords = pickupCoords;
      let finalDropoffCoords = dropoffCoords;

      if (!finalPickupCoords) {
        const pickupResults = await searchPlaces(pickup);
        if (pickupResults.length > 0) {
          finalPickupCoords = [pickupResults[0].lat, pickupResults[0].lon];
          setPickupCoords(finalPickupCoords);
        } else {
          throw new Error(`Could not find a valid location for pickup: "${pickup}"`);
        }
      }

      if (!finalDropoffCoords) {
        const dropoffResults = await searchPlaces(dropoff);
        if (dropoffResults.length > 0) {
          finalDropoffCoords = [dropoffResults[0].lat, dropoffResults[0].lon];
          setDropoffCoords(finalDropoffCoords);
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
        cost: fare, // Use the calculated fare from RideBooking
      };
      console.log("ride request:- ", rideRequest)

      const response = await RideService.bookRide(rideRequest);
      const rideResp = response?.data || response;

      deleteRide(rideResp.id, jwtToken);

      navigate('/ride-tracking', {
        state: {
          pickup,
          dropoff,
          vehicleType: selectedType,
          ride: rideResp,
          calculatedFare: fare, // Pass the calculated fare explicitly
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
      <div className="w-full h-full min-h-screen min-w-full p-0 m-0">
        <Card
          elevation={0}
          sx={{
            width: '100%',
            minHeight: '100vh',
            borderRadius: 0,
            background: '#f8fafc',
            border: 'none',
            boxShadow: 'none',
            p: 0,
            m: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardContent sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexGrow: 1,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { background: '#e2e8f0', borderRadius: '8px' },
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 2, sm: 3 }, 
                mt: { xs: 1, sm: 2 }, 
                textAlign: 'center', 
                color: '#1e293b', 
                letterSpacing: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Enter Your Trip Details
            </Typography>
            
            {/* Pickup & Dropoff Grouped Box */}
            <Box sx={{
              mb: { xs: 2, sm: 3 },
              width: '100%',
              maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 },
              background: '#f6f7f9',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'stretch', 
                p: { xs: 0, sm: 1 }, 
                pb: { xs: 0, sm: 1 } 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mr: { xs: 1, sm: 2 }, 
                  mt: { xs: 1.5, sm: 2 }, 
                  minWidth: { xs: 24, sm: 32 }, 
                  justifyContent: 'center', 
                  height: '100%' 
                }}>
                  <LocationOn color="success" sx={{ fontSize: { xs: 24, sm: 28 }, mb: 0.5 }} />
                  <Box sx={{ 
                    flex: 1, 
                    width: 2, 
                    minHeight: { xs: 20, sm: 24 }, 
                    borderRight: '2px dotted #94a3b8', 
                    my: 0.5 
                  }} />
                  <Directions color="error" sx={{ fontSize: { xs: 24, sm: 28 }, mt: 0.5 }} />
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  position: 'relative' 
                }}>
                  <Autocomplete
                    freeSolo
                    options={pickupSuggestions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    loading={searching.pickup}
                    value={pickup}
                    onInputChange={(e, newValue) => {
                      setPickup(newValue);
                      setPickupCoords(null);
                      setRouteError(null);
                      handleSearch(newValue, setPickupSuggestions, 'pickup');
                    }}
                    onChange={(e, newValue) => {
                      if (newValue && typeof newValue === 'object') {
                        setPickup(newValue.label);
                        setPickupCoords([newValue.lat, newValue.lon]);
                        setPickupSuggestions([]);
                        setRouteError(null);
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
                                sx={{ 
                                  cursor: 'pointer', 
                                  color: '#2563eb', 
                                  mr: { xs: 0.5, sm: 1 },
                                  fontSize: { xs: 'medium', sm: 'large' }
                                }}
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
                            fontSize: { xs: '0.875rem', sm: '1rem' }
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
                      setRouteError(null);
                      handleSearch(newValue, setDropoffSuggestions, 'dropoff');
                    }}
                    onChange={(e, newValue) => {
                      if (newValue && typeof newValue === 'object') {
                        setDropoff(newValue.label);
                        setDropoffCoords([newValue.lat, newValue.lon]);
                        setDropoffSuggestions([]);
                        setRouteError(null);
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
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ 
              mb: { xs: 2, sm: 3 }, 
              textAlign: 'center', 
              width: '100%', 
              maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 } 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 } }}>
                  <VehicleTypeSelector selected={selectedType} onSelect={(type) => {
                    setSelectedType(type);
                    setRouteError(null);
                  }} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ 
              mb: { xs: 2, sm: 3 }, 
              width: '100%', 
              maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 } 
            }}>
              <LeafletMapDisplay
                userLocation={pickupCoords || (geo?.latitude ? [geo.latitude, geo.longitude] : null)}
                routePoints={(pickupCoords && dropoffCoords) ? [pickupCoords, dropoffCoords] : []}
                selectedType={selectedType}
                onRouteCalculated={handleRouteCalculated}
              />
            </Box>

            <Box sx={{ 
              mb: { xs: 2, sm: 3 }, 
              p: { xs: 1.5, sm: 2 }, 
              width: '100%', 
              maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 }, 
              background: '#f6f7f9', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0' 
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Trip Estimates
              </Typography>
              {routeError ? (
                <Typography 
                  color="error" 
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Error: {routeError}
                </Typography>
              ) : (
                <>
                  <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Distance: {distance > 0 ? `${distance.toFixed(1)} km` : 'Enter locations to calculate'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Estimated Time: {eta > 0 ? `${eta} min` : 'Enter locations to calculate'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Estimated Fare: ₹{fare > 0 ? fare : 'Enter locations to calculate'}
                  </Typography>
                </>
              )}
            </Box>

            <Box sx={{ 
              mt: 'auto', 
              width: '100%', 
              maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1100 }, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              pb: { xs: 2, sm: 3 }
            }}>
              <Box sx={{ 
                width: '100%', 
                borderTop: '1px solid #facc15', 
                mb: { xs: 2, sm: 3 }, 
                mt: { xs: 1, sm: 2 }, 
                opacity: 1.7 
              }} />
              <Button
                variant="contained"
                fullWidth
                size="large"
                disableElevation
                sx={{
                  backgroundColor: '#fde047 !important',
                  color: '#2e2a2a !important',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px 0 rgba(250,204,21,0.10)',
                  transition: 'all 0.2s',
                  py: { xs: 1.2, sm: 1.5 },
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
                disabled={loading || !pickup || !dropoff || fare === 0}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                endIcon={!loading ? <ArrowForward /> : null}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </Box>
            
          </CardContent>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: { xs: 1, sm: 2 }, 
                borderRadius: '12px',
                mx: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3 }
              }}
            >
              {error}
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}