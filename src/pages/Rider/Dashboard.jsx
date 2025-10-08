// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Typography, Card, CardContent, Grid, Button, Box, Avatar, Divider,
//   Chip, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab, Dialog,
//   DialogTitle, DialogContent, IconButton, CircularProgress, Alert
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { 
//   TwoWheeler, CurrencyRupee, Star, History, LocationOn, 
//   VerifiedUser, AccountBalanceWallet, MyLocation
// } from '@mui/icons-material';
// import LocationService from '../../services/locationService'; // Ensure this is imported
// import DriverService from '../../services/DriverService';
// import RideService from '../../services/RideService';
// import useGeolocation from '../../hooks/useGeolocation';
// import useAuth from '../../hooks/useAuth';
// import Wallet from './Wallet.jsx';

// // Helper component for Tab Panels (no changes needed)
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
//       {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
//     </div>
//   );
// }

// export default function Dashboard() {
//   const { user } = useAuth();
//   const geo = useGeolocation();
//   const navigate = useNavigate();
//   const locationIntervalRef = useRef(null); // Ref to hold the interval ID for location updates

//   // UI State
//   const [tabValue, setTabValue] = useState(0);
//   const [walletOpen, setWalletOpen] = useState(false);
//   const [online, setOnline] = useState(false); // Default to offline
  
//   // Data & Loading State
//   const [driverProfile, setDriverProfile] = useState(null);
//   const [summary, setSummary] = useState([]);
//   const [recentRides, setRecentRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
//   const [error, setError] = useState('');

//   // --- Function to handle a single location update ---
//   const handleUpdateLocation = async () => {
//     if (!user?.id || typeof geo?.latitude !== 'number') {
//       setError('Current location is not available. Please enable location services.');
//       return;
//     }
    
//     setIsUpdatingLocation(true);
//     setError('');
    
//     const locationRequest = {
//       userId: user.id,
//       latitude: geo.latitude,
//       longitude: geo.longitude,
//       locationType: 'CURRENT',
//       timestamp: Date.now(),
//     };

//     try {
//       await LocationService.updateLocation(locationRequest);
//     } catch (err) {
//       setError('Failed to send location. You may appear offline.');
//       console.error("Location update failed:", err);
//       // If location fails, automatically go offline to stop trying
//       setOnline(false); 
//       clearInterval(locationIntervalRef.current);
//     } finally {
//       setIsUpdatingLocation(false);
//     }
//   };

//   // --- Function to toggle online status and manage automatic "heartbeat" updates ---
//   const toggleOnlineStatus = () => {
//     const newOnlineStatus = !online;
//     setOnline(newOnlineStatus);

//     if (newOnlineStatus) {
//       // GOING ONLINE: Send location immediately and then start the interval
//       handleUpdateLocation();
//       locationIntervalRef.current = setInterval(handleUpdateLocation, 20000); // Send update every 20 seconds
//     } else {
//       // GOING OFFLINE: Stop the interval
//       clearInterval(locationIntervalRef.current);
//       locationIntervalRef.current = null;
//     }
//   };

//   // --- Main data fetching and verification logic ---
//   useEffect(() => {
//     async function fetchDashboardData() {
//       if (!user?.id) {
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError('');

//       try {
//         const driverRes = await DriverService.getDriverByUserId(user.id);
//         const profile = driverRes?.data;
//         setDriverProfile(profile); // Set profile regardless of status

//         // Only fetch ride/earnings data if the driver is fully approved
//         if (profile?.verificationStatus === 'APPROVED') {
//           // Only admins can call getAllRides, so for riders use getAllRidesForRider
//           if (user.role === 'ADMIN') {
//             const ridesRes = await RideService.getAllRides();
//             const allRides = ridesRes?.data?.data || ridesRes?.data || ridesRes || [];
//             const myRides = Array.isArray(allRides) ? allRides.filter(r => r.driverId === profile.id) : [];

//             const completedRides = myRides.filter(r => r.status === 'COMPLETED');
//             const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.cost || 0), 0);
            
//             setSummary([
//               { title: 'Completed Rides', value: completedRides.length, icon: <TwoWheeler color="primary" /> },
//               { title: 'Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <CurrencyRupee color="primary" /> },
//               { title: 'Rating', value: `${profile?.rating?.toFixed(1) || 'N/A'}/5`, icon: <Star color="primary" /> },
//             ]);
//             setRecentRides(completedRides.slice(0, 5));
//           } else {
//             const ridesRes = await RideService.getAllRidesForRider(user.id);
//             const completedRides = ridesRes.data.data.filter(r => r.status === 'COMPLETED');
//             const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
//             setSummary([
//               { title: 'Completed Rides', value: completedRides.length, icon: <TwoWheeler color="primary" /> },
//               { title: 'Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <CurrencyRupee color="primary" /> },
//               { title: 'Rating', value: `${profile?.rating?.toFixed(1) || 'N/A'}/5`, icon: <Star color="primary" /> },
//             ]);
//             setRecentRides(completedRides.slice(0, 5));
//           }
//         }
//       } catch (err) {
//         if (err.status === 404) {
//           // This means the driver profile doesn't exist yet, which is a valid state
//           setDriverProfile(null);
//         } else {
//           setError('Failed to load dashboard data. Please refresh the page.');
//           console.error("Dashboard fetch error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDashboardData();

//     // Cleanup effect: ensures the location heartbeat stops when the component is unmounted
//     return () => {
//       if (locationIntervalRef.current) {
//         clearInterval(locationIntervalRef.current);
//       }
//     };
//   }, [user]);

//   const handleTabChange = (event, newValue) => setTabValue(newValue);

//   // --- RENDER STATES ---

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
//   }

//   // State 1: Driver profile does not exist OR is rejected. Show "Start Verification".
//   if (!driverProfile || driverProfile.verificationStatus === 'REJECTED') {
//     return (
//       <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//         <Card sx={{ maxWidth: 500, textAlign: 'center', p: 3, boxShadow: 4, borderRadius: 3 }}>
//           <CardContent>
//             <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}><VerifiedUser sx={{ fontSize: 30 }} /></Avatar>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>Verification Required</Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               To start accepting rides and earning money, you need to complete your driver verification process.
//             </Typography>
//             {driverProfile?.verificationStatus === 'REJECTED' && (
//               <Alert severity="warning" sx={{ mb: 2 }}>Your previous application was rejected. Please review your details and resubmit.</Alert>
//             )}
//             <Button variant="contained" size="large" onClick={() => navigate('/rider-verification')}>
//               Start Verification
//             </Button>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   // State 2: Driver profile exists and is PENDING. Show "Under Review".
//   if (driverProfile.verificationStatus === 'PENDING') {
//     return (
//       <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//         <Card sx={{ maxWidth: 500, textAlign: 'center', p: 3, boxShadow: 4, borderRadius: 3 }}>
//           <CardContent>
//             <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.main', width: 60, height: 60 }}><History sx={{ fontSize: 30 }} /></Avatar>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>Application Under Review</Typography>
//             <Typography color="text.secondary">
//               Your application is being reviewed by our team. We will notify you once the status changes.
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   // State 3: Driver is APPROVED. Render the full dashboard.
//   return (
//     <>
//       <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//         <Box className="max-w-7xl mx-auto">
//           <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//             <Typography variant="h4" className="font-bold text-gray-800">Rider Dashboard</Typography>
//             {error && <Alert severity="error" sx={{ mt: { xs: 2, sm: 0 }, width: '100%' }}>{error}</Alert>}
//           </Box>
          
//           <Grid container spacing={3}>
//             {/* Summary Cards */}
//             {summary.map(item => (
//               <Grid item xs={12} sm={4} key={item.title}>
//                 <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//                   <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Avatar sx={{ bgcolor: 'primary.light' }}>{item.icon}</Avatar>
//                     <Box>
//                       <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
//                       <Typography color="text.secondary">{item.title}</Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}

//             {/* Main Content Area */}
//             <Grid item xs={12} md={8}>
//               {/* Your Tabs and Recent Rides list can go here */}
//             </Grid>

//             {/* Right Sidebar: Status & Actions */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Current Status</Typography>
//                   <Chip 
//                     icon={<Box className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />} 
//                     label={online ? 'Online - Accepting Rides' : 'Offline'} 
//                     sx={{ mb: 2 }} 
//                   />
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <LocationOn color="action" />
//                     <Typography color="text.secondary">
//                       Location: {typeof geo?.latitude === 'number' ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}` : "Unavailable"}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>

//               <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                     <Button 
//                       variant="contained" 
//                       onClick={toggleOnlineStatus}
//                       color={online ? 'error' : 'primary'}
//                     >
//                       {online ? 'Go Offline' : 'Go Online'}
//                     </Button>
//                     <Button 
//                       variant="outlined"
//                       onClick={handleUpdateLocation}
//                       startIcon={isUpdatingLocation ? <CircularProgress size={20} /> : <MyLocation />}
//                       disabled={isUpdatingLocation || typeof geo?.latitude !== 'number'}
//                     >
//                       Update Location
//                     </Button>
//                     <Button variant="outlined" onClick={() => setWalletOpen(true)} startIcon={<AccountBalanceWallet />}>Wallet</Button>
//                     <Button variant="outlined" onClick={() => navigate('/rider/ride-history')} startIcon={<History />}>Ride History</Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </div>

//       <Dialog open={walletOpen} onClose={() => setWalletOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Wallet<IconButton onClick={() => setWalletOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
//         <DialogContent dividers><Wallet /></DialogContent>
//       </Dialog>
//     </>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Card, CardContent, Grid, Button, Box, Avatar, Divider,
  Chip, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, IconButton, CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  TwoWheeler, CurrencyRupee, Star, History, LocationOn, 
  VerifiedUser, AccountBalanceWallet, MyLocation
} from '@mui/icons-material';
import LocationService from '../../services/locationService';
import DriverService from '../../services/DriverService';
import RideService from '../../services/RideService';
import useGeolocation from '../../hooks/useGeolocation';
import useAuth from '../../hooks/useAuth';
import Wallet from './Wallet.jsx';

// Helper component for Tab Panels (no changes needed)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const locationIntervalRef = useRef(null);

  const [tabValue, setTabValue] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [online, setOnline] = useState(false);

  const [driverProfile, setDriverProfile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateLocation = async () => {
    if (!user?.id || typeof geo?.latitude !== 'number') {
      setError('Current location is not available. Please enable location services.');
      return;
    }
    
    setIsUpdatingLocation(true);
    setError('');
    
    const locationRequest = {
      userId: user.id,
      latitude: geo.latitude,
      longitude: geo.longitude,
      locationType: 'CURRENT',
      timestamp: Date.now(),
    };

    try {
      await LocationService.updateLocation(locationRequest);
    } catch (err) {
      setError('Failed to send location. You may appear offline.');
      console.error("Location update failed:", err);
      setOnline(false); 
      clearInterval(locationIntervalRef.current);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const toggleOnlineStatus = async () => {
    const newOnlineStatus = !online;
    setOnline(newOnlineStatus);

    if (newOnlineStatus) {
      await handleUpdateLocation();
      locationIntervalRef.current = setInterval(handleUpdateLocation, 20000);
    } else {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
      // Optional: Update backend status to OFFLINE
      try {
        await DriverService.updateDriverStatus({ status: 'OFFLINE' });
      } catch (e) {
        console.error("Failed to update status to OFFLINE", e);
      }
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const driverRes = await DriverService.getDriverByUserId(user.id);
        const profile = driverRes?.data;
        setDriverProfile(profile);

        if (profile?.verificationStatus === 'APPROVED') {
          // Only admins can call getAllRides, so for riders use getAllRidesForRider
          if (user.role === 'ADMIN') {
            const ridesRes = await RideService.getAllRides();
            const allRides = ridesRes?.data?.data || ridesRes?.data || ridesRes || [];

            const myRides = Array.isArray(allRides) ? allRides.filter(r => r.driverId === profile.id) : [];

            const completedRides = myRides.filter(r => r.status === 'COMPLETED');
            const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.cost || 0), 0);
            
            setSummary([
              { title: 'Completed Rides', value: completedRides.length, icon: <TwoWheeler color="primary" /> },
              { title: 'Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <CurrencyRupee color="primary" /> },
              { title: 'Rating', value: `${profile?.rating?.toFixed(1) || 'N/A'}/5`, icon: <Star color="primary" /> },
            ]);
            setRecentRides(completedRides.slice(0, 5));
          } else {
            const ridesRes = await RideService.getAllRidesForRider(user.id);
            // Use correct property for completedRides array
            let completedRides = [];
            if (Array.isArray(ridesRes)) {
              completedRides = ridesRes.filter(r => r.status === 'COMPLETED');
            } else if (Array.isArray(ridesRes.data)) {
              completedRides = ridesRes.data.filter(r => r.status === 'COMPLETED');
            } else if (Array.isArray(ridesRes.data?.data)) {
              completedRides = ridesRes.data.data.filter(r => r.status === 'COMPLETED');
            }
            const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
            setSummary([
              { title: 'Completed Rides', value: completedRides.length, icon: <TwoWheeler color="primary" /> },
              { title: 'Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <CurrencyRupee color="primary" /> },
              { title: 'Rating', value: `${profile?.rating?.toFixed(1) || 'N/A'}/5`, icon: <Star color="primary" /> },
            ]);
            setRecentRides(completedRides.slice(0, 5));
          }
        }
      } catch (err) {
        if (err.status === 404) {
          setDriverProfile(null);
        } else {
          setError('Failed to load dashboard data. Please refresh the page.');
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [user]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (!driverProfile || driverProfile.verificationStatus === 'REJECTED') {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', itemsCenter: 'center', minHeight: '80vh' }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center', p: 3, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}><VerifiedUser sx={{ fontSize: 30 }} /></Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Verification Required</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              To start accepting rides and earning money, you need to complete your driver verification process.
            </Typography>
            {driverProfile?.verificationStatus === 'REJECTED' && (
              <Alert severity="warning" sx={{ mb: 2 }}>Your previous application was rejected. Please review your details and resubmit.</Alert>
            )}
            <Button variant="contained" size="large" onClick={() => navigate('/rider-verification')}>
              Start Verification
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (driverProfile.verificationStatus === 'PENDING') {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', itemsCenter: 'center', minHeight: '80vh' }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center', p: 3, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.main', width: 60, height: 60 }}><History sx={{ fontSize: 30 }} /></Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Application Under Review</Typography>
            <Typography color="text.secondary">
              Your application is being reviewed by our team. We will notify you once the status changes.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Typography variant="h4" className="font-bold text-gray-800">Rider Dashboard</Typography>
          {error && <Alert severity="error" sx={{ mt: { xs: 2, sm: 0 }, width: '100%' }}>{error}</Alert>}
        </Box>
        
        <Grid container spacing={3}>
          {summary.map(item => (
            <Grid item xs={12} sm={4} key={item.title}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>{item.icon}</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                    <Typography color="text.secondary">{item.title}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} md={8}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs" centered>
              <Tab label="Recent Rides" />
              <Tab label="Earnings" />
              <Tab label="Profile" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <List>
                {recentRides.map((ride, index) => (
                  <ListItem key={ride.id} divider={index < recentRides.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <LocationOn />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`Ride #${ride.id}`}
                      secondary={`${ride.startLatitude}, ${ride.startLongitude} to ${ride.endLatitude}, ${ride.endLongitude}`}
                    />
                    <Chip label={`₹${ride.cost}`} color="success" />
                  </ListItem>
                ))}
                {recentRides.length === 0 && <Typography color="text.secondary">No recent rides</Typography>}
              </List>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6">Earnings Summary</Typography>
              {/* Add earnings chart or details here */}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6">Profile Details</Typography>
              {/* Add profile info here */}
            </TabPanel>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Current Status</Typography>
                <Chip 
                  icon={<Box className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />} 
                  label={online ? 'Online - Accepting Rides' : 'Offline'} 
                  sx={{ mb: 2 }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography color="text.secondary">
                    Location: {geo?.latitude ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}` : "Unavailable"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button 
                    variant="contained" 
                    onClick={toggleOnlineStatus}
                    color={online ? 'error' : 'primary'}
                  >
                    {online ? 'Go Offline' : 'Go Online'}
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={handleUpdateLocation}
                    startIcon={isUpdatingLocation ? <CircularProgress size={20} /> : <MyLocation />}
                    disabled={isUpdatingLocation || !geo?.latitude}
                  >
                    Update Location
                  </Button>
                  <Button variant="outlined" onClick={() => setWalletOpen(true)} startIcon={<AccountBalanceWallet />}>Wallet</Button>
                  <Button variant="outlined" onClick={() => navigate('/rider/ride-history')} startIcon={<History />}>Ride History</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={walletOpen} onClose={() => setWalletOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Wallet<IconButton onClick={() => setWalletOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent><Wallet /></DialogContent>
      </Dialog>
    </div>
  );
}