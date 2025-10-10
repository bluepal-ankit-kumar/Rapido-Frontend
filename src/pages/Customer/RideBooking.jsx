import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect, useRef } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import Button from '../../components/common/Button';
import RideService from '../../services/RideService.js';
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
} from '@mui/icons-material';

// --- Leaflet Icon Fix ---
// This is a common fix to ensure Leaflet's default marker icons load correctly.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
    <MapContainer center={center} zoom={12} style={{ height: '250px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pickupCoords && <Marker position={pickupCoords}></Marker>}
      {dropoffCoords && <Marker position={dropoffCoords}></Marker>}
      {routePoints && routePoints.length === 2 && <RoutingMachine routePoints={routePoints} />}
    </MapContainer>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card className="shadow-xl rounded-2xl w-full max-w-xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>Enter Your Trip Details</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

                {/* Pickup Location */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Pickup Location</Typography>
                    <Button size="small" variant="text" onClick={useCurrentLocationForPickup}>Use current location</Button>
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
                      <TextField {...params} placeholder="Search pickup location"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (<LocationOn color="warning" sx={{ mr: 1 }} />),
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
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Dropoff Location</Typography>
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
                      <TextField {...params} placeholder="Search dropoff location"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (<Directions color="warning" sx={{ mr: 1 }} />),
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

                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>Select Vehicle Type</Typography>
                  <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <LeafletMapDisplay
                    userLocation={pickupCoords || (geo?.latitude ? [geo.latitude, geo.longitude] : null)}
                    routePoints={(pickupCoords && dropoffCoords) ? [pickupCoords, dropoffCoords] : []}
                  />
                </Box>

                <Box sx={{ mt: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                        boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)'
                      }
                    }}
                    onClick={handleBook}
                    disabled={loading || !pickup || !dropoff} // Button is enabled as long as text fields are filled
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