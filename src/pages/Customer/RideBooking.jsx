import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect } from 'react';
import VehicleTypeSelector from '../../components/common/VehicleTypeSelector';
import RiderCard from '../../components/shared/RiderCard';
import Button from '../../components/common/Button';
import RideService from '../../services/RideService.js';
import GoogleMapDisplay from '../../components/shared/GoogleMapDisplay';
import useAuth from '../../hooks/useAuth';
import { loadGoogleMaps } from '../../services/GoogleMapsLoader';
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
  alpha,
  Autocomplete
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

// Google services singletons
let googlePlacesService = null;
let googlePlacesDetailsService = null;
let googleGeocoder = null;

export default function RideBooking() {
  const theme = useTheme();
  const geo = useGeolocation();
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedType, setSelectedType] = useState('Bike');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [searching, setSearching] = useState({ pickup: false, dropoff: false });
  const [autofilledFromGeo, setAutofilledFromGeo] = useState(false);

  // AbortControllers (kept for interface consistency)
  let pickupAbort;
  let dropoffAbort;

  const initGoogle = async () => {
    try {
      const g = await loadGoogleMaps();
      if (!googlePlacesService) {
        const dummy = document.createElement('div');
        googlePlacesService = new g.maps.places.AutocompleteService();
        // Create hidden map to back Places Details service
        const map = new g.maps.Map(dummy);
        googlePlacesDetailsService = new g.maps.places.PlacesService(map);
      }
      if (!googleGeocoder) {
        googleGeocoder = new g.maps.Geocoder();
      }
      return g;
    } catch (e) {
      return null;
    }
  };

  const googlePlacePredictions = async (q) => {
    const g = await initGoogle();
    if (!g || !googlePlacesService || !googlePlacesDetailsService) return [];
    return new Promise((resolve) => {
      googlePlacesService.getPlacePredictions(
        { input: q, types: ['geocode', 'establishment'] },
        (preds, status) => {
          if (status !== g.maps.places.PlacesServiceStatus.OK || !Array.isArray(preds)) {
            resolve([]);
            return;
          }
          const tasks = preds.slice(0, 7).map((p) => new Promise((res) => {
            googlePlacesDetailsService.getDetails(
              { placeId: p.place_id, fields: ['geometry.location', 'formatted_address', 'name'] },
              (place, detStatus) => {
                if (detStatus === g.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                  const lat = place.geometry.location.lat();
                  const lon = place.geometry.location.lng();
                  res({
                    label: place.formatted_address || p.description,
                    lat,
                    lon,
                    id: p.place_id,
                    source: 'google',
                  });
                } else {
                  res(null);
                }
              }
            );
          }));
          Promise.all(tasks).then((out) => resolve(out.filter(Boolean)));
        }
      );
    });
  };

  const searchPlaces = async (q) => {
    const qStr = String(q || '').trim();
    if (!qStr) return [];
    const googleRes = await googlePlacePredictions(qStr).catch(() => []);
    return googleRes || [];
  };

  const reverseGeocode = async (lat, lon) => {
    const g = await initGoogle();
    if (g && googleGeocoder) {
      return new Promise((resolve) => {
        googleGeocoder.geocode({ location: { lat, lng: lon } }, (results, status) => {
          if (status === 'OK' && results && results[0]) resolve(results[0].formatted_address);
          else resolve(null);
        });
      });
    }
    return null;
  };

  const nearestPlaceName = async (lat, lon) => {
    const g = await initGoogle();
    if (!g || !googlePlacesDetailsService) return null;
    return new Promise((resolve) => {
      const location = new g.maps.LatLng(lat, lon);
      googlePlacesDetailsService.nearbySearch(
        { location, radius: 150, rankBy: undefined, type: ['establishment'] },
        (results, status) => {
          if (status === g.maps.places.PlacesServiceStatus.OK && Array.isArray(results) && results[0]) {
            const r = results[0];
            const name = r.name;
            const vicinity = r.vicinity || '';
            resolve([name, vicinity].filter(Boolean).join(', '));
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  let pickupSearchTimeout;
  let dropoffSearchTimeout;

  const handlePickupChange = (val) => {
    setPickup(val);
    setPickupCoords(null);
    if (!val || val.trim().length < 3) { setPickupSuggestions([]); return; }
    setSearching(s => ({ ...s, pickup: true }));
    clearTimeout(pickupSearchTimeout);
    if (pickupAbort) pickupAbort.abort();
    pickupAbort = new AbortController();
    pickupSearchTimeout = setTimeout(async () => {
      try {
        const results = await searchPlaces(val.trim());
        setPickupSuggestions(results);
      } catch {
        setPickupSuggestions([]);
      } finally {
        setSearching(s => ({ ...s, pickup: false }));
      }
    }, 400);
  };

  const handleDropoffChange = (val) => {
    setDropoff(val);
    setDropoffCoords(null);
    if (!val || val.trim().length < 3) { setDropoffSuggestions([]); return; }
    setSearching(s => ({ ...s, dropoff: true }));
    clearTimeout(dropoffSearchTimeout);
    if (dropoffAbort) dropoffAbort.abort();
    dropoffAbort = new AbortController();
    dropoffSearchTimeout = setTimeout(async () => {
      try {
        const results = await searchPlaces(val.trim());
        setDropoffSuggestions(results);
      } catch {
        setDropoffSuggestions([]);
      } finally {
        setSearching(s => ({ ...s, dropoff: false }));
      }
    }, 400);
  };

  const selectPickupSuggestion = (sugg) => {
    setPickup(sugg.label);
    setPickupCoords([sugg.lat, sugg.lon]);
    setPickupSuggestions([]);
  };

  const selectDropoffSuggestion = (sugg) => {
    setDropoff(sugg.label);
    setDropoffCoords([sugg.lat, sugg.lon]);
    setDropoffSuggestions([]);
  };

  const useCurrentLocationForPickup = async () => {
    try {
      if (geo && typeof geo.latitude === 'number' && typeof geo.longitude === 'number') {
        const label = await reverseGeocode(geo.latitude, geo.longitude);
        let finalLabel = label;
        if (!finalLabel) {
          finalLabel = await nearestPlaceName(geo.latitude, geo.longitude);
        }
        if (finalLabel) {
          setPickup(finalLabel);
          setPickupCoords([geo.latitude, geo.longitude]);
          setPickupSuggestions([]);
          setAutofilledFromGeo(true);
          setError('');
        } else {
          setError('Could not determine your current address. Please type to search.');
        }
      } else {
        setError('Location permissions not available. Please enable location or type to search.');
      }
    } catch (e) {
      setError('Unable to fetch current location name. Please try again.');
    }
  };

  useEffect(() => {
    if (!autofilledFromGeo && user?.id && geo && typeof geo.latitude === 'number' && typeof geo.longitude === 'number' && !pickup) {
      useCurrentLocationForPickup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, geo?.latitude, geo?.longitude]);

  const handleBook = () => {
    const coordLike = (s) => /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(String(s || '').trim());
    const normalizePlaceName = (s) => {
      if (!s) return s;
      let v = String(s).trim().replace(/\s+/g, ' ');
      // common typo fixes and expansions
      const replacements = [
        { from: /\bcollage\b/gi, to: 'college' },
        { from: /\buni\.?\b/gi, to: 'university' },
        { from: /\bjntu\b/gi, to: 'JNTU college' },
      ];
        replacements.forEach(r => { v = v.replace(r.from, r.to); });
      // title case words with letters only
      v = v.split(' ').map(w => /[a-zA-Z]/.test(w) ? (w.charAt(0).toUpperCase() + w.slice(1)) : w).join(' ');
      return v;
    };
    if (!pickup || !dropoff) {
      setError('Please enter pickup and dropoff locations');
      return;
    }
    if (coordLike(pickup) || coordLike(dropoff)) {
      setError('Please enter real place names (not coordinates)');
      return;
    }
    if (!user?.id) {
      setError('You must be logged in to book a ride.');
      return;
    }
    setLoading(true);
    const rideRequest = {
      userId: user.id,
      currentPlaceName: normalizePlaceName(pickup),
      dropOffPlaceName: normalizePlaceName(dropoff),
      vehicleType: selectedType,
      timestamp: Date.now(),
    };
    RideService.bookRide(rideRequest)
      .then((response) => {
        const rideResp = response?.data || response;
        navigate('/ride-tracking', {
          state: {
            pickup,
            dropoff,
            vehicleType: selectedType,
            ride: rideResp
          }
        });
      })
      .catch((err) => {
        const status = err?.status;
        const message = err?.message || '';
        if (status === 404) {
          setError('Service not available. Please check server URL or try again later.');
        } else if (status === 400) {
          setError(message || 'Invalid request. Please check your inputs.');
        } else if (status === 401 || status === 403) {
          setError('You are not authorized. Please sign in again.');
        } else if (message) {
          setError(message);
        } else {
          setError('Unable to book right now. Please try again.');
        }
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
                  <Box className="w-full max-w-[400px] flex items-center justify-between mb-2">
                    <Typography variant="body1" className="text-gray-600" sx={{ fontWeight: 600 }}>Pickup Location</Typography>
                    <Button size="small" variant="text" onClick={useCurrentLocationForPickup}>Use current location</Button>
                  </Box>
                  <Autocomplete 
                    freeSolo
                    disableClearable
                    options={pickupSuggestions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
                    isOptionEqualToValue={(option, value) => {
                      const o = typeof option === 'string' ? { label: option } : option;
                      const v = typeof value === 'string' ? { label: value } : value;
                      return o.label === v.label && (o.id ? o.id === v.id : true);
                    }}
                    loading={searching.pickup}
                    value={pickup}
                    onInputChange={(e, newInput) => handlePickupChange(newInput)}
                    onChange={(e, newValue) => {
                      if (typeof newValue === 'string') {
                        setPickup(newValue);
                        setPickupCoords(null);
                      } else if (newValue && newValue.label) {
                        selectPickupSuggestion(newValue);
                      } else {
                        setPickup('');
                        setPickupCoords(null);
                      }
                    }}
                    renderOption={(props, option) => {
                      const key = typeof option === 'string' ? option : (option.id || option.label);
                      return (
                        <li {...props} key={key}>
                          {typeof option === 'string' ? option : option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params}
                        placeholder="Search pickup location"
                        variant="outlined"
                        size="medium"
                        sx={{ width: '100%', maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: alpha(theme.palette.grey[400], 0.5) }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }} 
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (<LocationOn className="text-amber-500 mr-2" sx={{ fontSize: 24 }} />),
                          endAdornment: (
                            <>
                              {searching.pickup ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                    sx={{ width: '100%', maxWidth: 400 }}
                  />
                </Box>
                <Box className="mb-5 w-full flex flex-col items-center">
                  <Typography variant="body1" className="text-gray-600 mb-2" sx={{ fontWeight: 600 }}>Dropoff Location</Typography>
                  <Autocomplete 
                    freeSolo
                    disableClearable
                    options={dropoffSuggestions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
                    isOptionEqualToValue={(option, value) => {
                      const o = typeof option === 'string' ? { label: option } : option;
                      const v = typeof value === 'string' ? { label: value } : value;
                      return o.label === v.label && (o.id ? o.id === v.id : true);
                    }}
                    loading={searching.dropoff}
                    value={dropoff}
                    onInputChange={(e, newInput) => handleDropoffChange(newInput)}
                    onChange={(e, newValue) => {
                      if (typeof newValue === 'string') {
                        setDropoff(newValue);
                        setDropoffCoords(null);
                      } else if (newValue && newValue.label) {
                        selectDropoffSuggestion(newValue);
                      } else {
                        setDropoff('');
                        setDropoffCoords(null);
                      }
                    }}
                    renderOption={(props, option) => {
                      const key = typeof option === 'string' ? option : (option.id || option.label);
                      return (
                        <li {...props} key={key}>
                          {typeof option === 'string' ? option : option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params}
                        placeholder="Search dropoff location"
                        variant="outlined"
                        size="medium"
                        sx={{ width: '100%', maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: alpha(theme.palette.grey[400], 0.5) }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }} 
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (<Directions className="text-amber-500 mr-2" sx={{ fontSize: 24 }} />),
                          endAdornment: (
                            <>
                              {searching.dropoff ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                    sx={{ width: '100%', maxWidth: 400 }}
                  />
                </Box>
                <Box className="mb-7 w-full flex flex-col items-center">
                  <Typography variant="body1" className="text-gray-600 mb-3" sx={{ fontWeight: 600 }}>Select Vehicle Type</Typography>
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <VehicleTypeSelector selected={selectedType} onSelect={setSelectedType} />
                  </Box>
                </Box>
                {/* Live map preview using selected places */}
                <Box className="w-full max-w-md mx-auto mb-6">
                  <GoogleMapDisplay 
                    userLocation={pickupCoords || (geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : null)}
                    riderLocation={dropoffCoords || null}
                    routePoints={pickupCoords && dropoffCoords ? [pickupCoords, dropoffCoords] : []}
                  />
                </Box>
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