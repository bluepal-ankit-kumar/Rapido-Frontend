import useGeolocation from '../../hooks/useGeolocation';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Divider, 
  LinearProgress,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Person, 
  Phone, 
  Message, 
  Star, 
  DirectionsBike, 
  LocalTaxi, 
  AirportShuttle,
  LocationOn,
  AccessTime,
  NearMe,
  Share,
  Cancel
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';
import { useGlobalStore } from '../../context/GlobalStore.jsx';

// Mock data for demonstration
const mockRide = {
  id: 101,
  status: 'In Progress',
  driver: {
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    rating: 4.8,
    vehicle: 'Honda Activa',
    licensePlate: 'DL-01-AB-1234'
  },
  pickup: 'MG Road, Bangalore',
  destination: 'Koramangala, Bangalore',
  fare: 120,
  estimatedTime: '15 min',
  distance: '5.2 km'
};

const mockTrackingData = [
  { id: 1, status: 'Driver Assigned', time: '10:25 AM', completed: true },
  { id: 2, status: 'Driver Arriving', time: '10:30 AM', completed: true },
  { id: 3, status: 'Ride Started', time: '10:35 AM', completed: true },
  { id: 4, status: 'In Progress', time: '10:40 AM', completed: false },
  { id: 5, status: 'Completed', time: '10:50 AM', completed: false }
];

const mockLocation = {
  latitude: 12.9716,
  longitude: 77.5946
};

export default function RideTracking() {
  const geo = useGeolocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingDataState, setTrackingDataState] = useState(mockTrackingData);
  const [currentStep, setCurrentStep] = useState(() => mockTrackingData.filter(s => s.completed).length);
  const [eta, setEta] = useState('10 min');
  const [distance, setDistance] = useState('3.2 km');

  // payment dialog state (was missing -> caused ReferenceError)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
 
  // prevent repeated redirects to rating
  const [redirectedToRating, setRedirectedToRating] = useState(false);
 
  // read global ride (mock) so customer can see OTP and ride status updates
  const { getRide, rides, completeRide, recordPayment } = useGlobalStore();
  const globalRide = getRide ? getRide(201) : null;

  // show OTP when driver is effectively "arrived" (mocked by progress reaching arrival step) OR globalRide.stage indicates toDestination
  const showOtp = !!(globalRide && globalRide.otp && (globalRide.stage === 'toDestination' || currentStep >= 2));

  // Simulate ride tracking data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // prefer global ride if available so we reflect rider-side state changes
      setRide(globalRide || mockRide);
      if (geo && geo.latitude && geo.longitude) {
        setLocation({ latitude: geo.latitude, longitude: geo.longitude });
      } else {
        setLocation(mockLocation);
      }
      setLoading(false);
    }, 1000);
  }, [geo]);

  // keep local ride in sync when global store updates
  useEffect(() => {
    if (getRide) {
      const g = getRide(201);
      if (g) setRide(g);
    }
  }, [rides, getRide]);

  // Synchronize trackingData completed flags with currentStep
  useEffect(() => {
    setTrackingDataState(prev => prev.map((step, idx) => ({
      ...step,
      completed: idx < currentStep
    })));
  }, [currentStep]);

  // Simulate real-time tracking updates (ETA, distance, location) and step advancement
  useEffect(() => {
    // accept both local mock ('In Progress') and global mock ('ongoing') statuses
    if (!loading && ride && (ride.status === 'In Progress' || ride.status === 'ongoing')) {
      const interval = setInterval(() => {
        // Update ETA and distance (parse numeric part from strings)
        const parsedEta = parseInt(eta) || 0;
        const newEtaVal = Math.max(0, parsedEta - 1);
        const parsedDistance = parseFloat(distance) || 0;
        const newDistanceVal = Math.max(0, parsedDistance - 0.5);

        setEta(`${newEtaVal} min`);
        setDistance(`${newDistanceVal.toFixed(1)} km`);

        // Update location slightly
        setLocation(prev => ({
          latitude: prev.latitude + 0.0001,
          longitude: prev.longitude + 0.0001
        }));

        // Advance tracking step mock (up to second last step)
        setCurrentStep(prev => {
          const maxStep = mockTrackingData.length - 1; // don't auto-complete final "Completed" step until fully done
          const next = Math.min(maxStep, prev + 1);
          return next;
        });

        // If ETA reached zero or we've advanced to the final step, mark ride completed
        // final numeric ETA value used
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading, ride]); // do not depend on eta/distance here to avoid multiple intervals

  // When tracking reaches the final 'in-progress' step, mark ride completed (mock)
  useEffect(() => {
    const finalStepIndex = mockTrackingData.length - 1; // index of last step (Completed)
    if (currentStep >= finalStepIndex) {
      // mark all steps as completed locally
      setTrackingDataState(prev => prev.map(step => ({ ...step, completed: true })));

      // update global store so other pages (including rating) can read the final status / fare
      if (typeof completeRide === 'function') {
        completeRide(201);
      }

      // ensure local ride shows completed (normalize to lowercase check elsewhere)
      setRide(prev => prev ? ({ ...prev, status: 'Completed' }) : prev);

      // open payment dialog for customer to pay (show before navigating to rating)
      setShowPaymentDialog(true);
    }
  }, [currentStep]);

  // Redirect to ratings page once when ride becomes Completed
  useEffect(() => {
    // navigation is handled after successful payment; keep this effect minimal to avoid extra navigation
    if (ride?.status && !redirectedToRating) {
      const status = typeof ride.status === 'string' ? ride.status.toLowerCase() : '';
      if (status === 'completed' && globalRide?.paid) {
        setRedirectedToRating(true);
        setTimeout(() => navigate('/costumor/RatingPage'), 600);
      }
    }
  }, [ride?.status, redirectedToRating, navigate, globalRide?.paid]);

  // compute progress percent based on current step vs steps before final completion
  const totalProgressSteps = Math.max(1, mockTrackingData.length - 1); // avoid divide by zero
  const progressPercent = Math.min(100, Math.round((currentStep / totalProgressSteps) * 100));

  // Get vehicle icon based on type
  const getVehicleIcon = () => {
    if (ride?.driver?.vehicle?.toLowerCase().includes('bike') || ride?.driver?.vehicle?.toLowerCase().includes('activa')) {
      return <DirectionsBike className="text-yellow-500" />;
    } else if (ride?.driver?.vehicle?.toLowerCase().includes('auto')) {
      return <AirportShuttle className="text-yellow-500" />;
    } else {
      return <LocalTaxi className="text-yellow-500" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (ride?.status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#FF9800';
    }
  };

  // load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.getElementById('razorpay-sdk');
      if (existing) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-sdk';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    if (!ride) return;
    setPaymentProcessing(true);
    const res = await loadRazorpayScript();
    const amountInPaise = Math.round((ride.fare || 0) * 100);

    if (!res) {
      alert('Razorpay SDK failed to load. Please try again later.');
      setPaymentProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_1234567890', // mock/test key
      amount: amountInPaise,
      currency: 'INR',
      name: 'Rapido',
      description: `Payment for ride #${ride.id}`,
      handler: function (response) {
        // response.razorpay_payment_id etc.
        // record payment in global store and navigate to rating page
        if (typeof recordPayment === 'function') {
          recordPayment(ride.id, { amount: ride.fare, method: 'razorpay', id: response.razorpay_payment_id, status: 'PAID' });
        }
        setPaymentProcessing(false);
        setShowPaymentDialog(false);
        alert('Payment successful. Redirecting to rating page.');
        navigate('/costumor/RatingPage');
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#1976d2'
      }
    };

    // eslint-disable-next-line no-undef
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setPaymentProcessing(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-800">Track Your Ride</Typography>
            <Typography variant="body1" className="text-gray-600">Real-time tracking of your ride status and location</Typography>
          </Box>

          <Grid container spacing={4} style={{ minHeight: '70vh' }}>
            {/* Left Column - Map and Status */}
            <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexBasis: '45%', maxWidth: '45%' }}>
              {/* Status Card */}
              <Card className="shadow-md rounded-xl mb-4" style={{ maxHeight: 340, overflow: 'auto' }}>
                <CardContent className="p-6">
                  <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h6" className="font-bold text-gray-800">Ride Status</Typography>
                    <Chip 
                      label={ride.status} 
                      size="medium"
                      style={{ 
                        backgroundColor: `${getStatusColor()}20`,
                        color: getStatusColor(),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Box className="mb-6">
                    <Typography variant="body2" className="text-gray-600 mb-1">Route</Typography>
                    <Box className="flex items-center">
                      <LocationOn className="text-gray-500 mr-2" />
                      <Typography variant="h6" className="font-medium">
                        {ride.pickup}
                      </Typography>
                    </Box>
                    <Box className="flex items-center my-1">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mx-2"></div>
                      <div className="flex-1 h-0.5 bg-gray-300"></div>
                    </Box>
                    <Box className="flex items-center">
                      <LocationOn className="text-gray-500 mr-2" />
                      <Typography variant="h6" className="font-medium">
                        {ride.destination}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider className="my-6" />
                  
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Estimated Time</Typography>
                      <Typography variant="h6" className="font-medium">{eta}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Distance</Typography>
                      <Typography variant="h6" className="font-medium">{distance}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Fare</Typography>
                      <Typography variant="h6" className="font-medium">₹{ride.fare}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Map */}
              <Card className="shadow-md rounded-xl flex-1">
                <CardContent className="p-0">
                  <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Live Tracking</Typography>
                  <Divider />
                  <MapDisplay 
                    userLocation={geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : (location ? [location.latitude, location.longitude] : [12.9716, 77.5946])} 
                    nearbyRiders={[{
                      id: 1,
                      name: ride && ride.driver ? ride.driver.name : 'Driver',
                      location: geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : (location ? [location.latitude, location.longitude] : [12.9716, 77.5946])
                    }]} 
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Driver Info and Actions */}
            <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexBasis: '40%', maxWidth: '40%' }}>
              {/* Driver Info */}
              <Card className="shadow-md rounded-xl mb-4" style={{ maxHeight: 340, overflow: 'auto' }}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-800 mb-4">Driver Information</Typography>
                  
                  <Box className="flex items-center mb-4">
                    <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${ride.driver.name}`} />
                    <Box>
                      <Typography variant="h6" className="font-medium">{ride.driver.name}</Typography>
                      <Box className="flex items-center">
                        <Star className="text-yellow-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{ride.driver.rating}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider className="my-4" />
                  
                  <Box className="space-y-3">
                    <Box className="flex items-center">
                      {getVehicleIcon()}
                      <Typography variant="body2" className="ml-2">{ride.driver.vehicle}</Typography>
                    </Box>
                    <Box className="flex items-center">
                      <Typography variant="body2" className="text-gray-600">License Plate:</Typography>
                      <Typography variant="body2" className="ml-2 font-medium">{ride.driver.licensePlate}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider className="my-4" />
                  
                  <Box className="flex justify-between">
                    <Button 
                      variant="contained" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      startIcon={<Phone />}
                    >
                      Call
                    </Button>
                    <Button 
                      variant="outlined"
                      startIcon={<Message />}
                    >
                      Message
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
              {/* OTP Card - shown when rider has reached customer (uses global mock ride OTP or mockProgress) */}
              {showOtp && (
                <Card className="shadow-md rounded-xl mb-4">
                  <CardContent className="p-4">
                    <Typography variant="subtitle2" color="textSecondary">Provide this OTP to your driver</Typography>
                    <Box className="mt-3 flex items-center justify-between">
                      <Typography variant="h4" className="font-bold">{globalRide?.otp || '----'}</Typography>
                      <Chip label="Show to driver" color="primary" />
                    </Box>
                    <Typography variant="caption" className="text-gray-600 mt-2">Driver requested OTP after arrival. This value is from the global ride mock.</Typography>
                  </CardContent>
                </Card>
              )}

              {/* Tracking Progress */}
              <Card className="shadow-md rounded-xl flex-1">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-800 mb-4">Ride Progress</Typography>
                  
                  <Box className="space-y-4">
                    {trackingDataState.map((step, index) => (
                      <Box key={step.id} className="flex items-center">
                        <Box className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {step.completed && <span className="text-white text-sm">✓</span>}
                        </Box>
                        <Box className="flex-1">
                          <Typography 
                            variant="body2" 
                            className={`${step.completed ? 'font-medium' : 'text-gray-500'}`}
                          >
                            {step.status}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {step.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box className="mt-6">
                    <Typography variant="body2" className="text-gray-600 mb-2">Driver is {eta} away</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progressPercent} 
                      className="h-2 rounded-lg"
                    />
                  </Box>
                  
                  <Box className="mt-6 pt-4 border-t border-gray-200">
                    <Button 
                      variant="contained" 
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setRide(prev => ({ ...prev, status: 'Cancelled' }));
                        setTimeout(() => {
                          navigate('/ride-booking');
                        }, 500);
                      }}
                    >
                      Cancel Ride
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => { if (!paymentProcessing) setShowPaymentDialog(false); }} maxWidth="xs" fullWidth>
        <DialogTitle>Pay for your ride</DialogTitle>
        <DialogContent>
          <Box className="py-2">
            <Typography variant="subtitle2" color="textSecondary">Amount to pay</Typography>
            <Typography variant="h4" className="font-bold">₹{ride?.fare ?? '0.00'}</Typography>
            <Typography variant="caption" className="text-gray-600 mt-2">Complete payment to proceed to rating.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { if (!paymentProcessing) setShowPaymentDialog(false); }} disabled={paymentProcessing}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handlePay} disabled={paymentProcessing}>
            {paymentProcessing ? 'Processing...' : `Pay ₹${ride?.fare ?? '0'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}