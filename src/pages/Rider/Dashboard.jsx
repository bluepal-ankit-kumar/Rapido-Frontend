import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Card, CardContent, Grid, Button, Box, Avatar, Divider,
  Chip, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, IconButton, CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  TwoWheeler, CurrencyRupee, Star, History, LocationOn, 
  VerifiedUser, AccountBalanceWallet
} from '@mui/icons-material';
import MapDisplay from '../../components/shared/MapDisplay';
import RideService from '../../services/RideService';
import UserService from '../../services/UserService';
import DriverService from '../../services/DriverService';
import useGeolocation from '../../hooks/useGeolocation';
import useAuth from '../../hooks/useAuth';
import Wallet from './Wallet.jsx';

// Helper component for Tab Panels
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

  // UI State
  const [tabValue, setTabValue] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [online, setOnline] = useState(true);
  
  // Data & Loading State
  const [driverProfile, setDriverProfile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        // Fetch driver details using DriverService and correct DTO
        const driverRes = await DriverService.getDriverByUserId(user.id);
        setDriverProfile(driverRes);
        // Only fetch ride and earnings data if the driver is fully approved
        if (driverRes.verificationStatus === 'APPROVED') {
          const ridesRes = await RideService.getAllRidesForRider(user.id); 
          const completedRides = ridesRes.data.data.filter(r => r.status === 'COMPLETED');
          const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
          setSummary([
            { title: 'Completed Rides', value: completedRides.length, icon: <TwoWheeler color="primary" /> },
            { title: 'Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <CurrencyRupee color="primary" /> },
            { title: 'Rating', value: `${driverRes.rating?.toFixed(1) || 'N/A'}/5`, icon: <Star color="primary" /> },
          ]);
          setRecentRides(completedRides.slice(0, 5));
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh the page.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  // Handler for changing tabs
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Show a loading spinner while fetching initial data
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  // --- Conditional Rendering based on Verification Status ---
  if (!driverProfile || driverProfile.verificationStatus !== 'APPROVED') {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center', p: 3, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
              <VerifiedUser sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {driverProfile?.verificationStatus === 'PENDING' ? 'Application Under Review' : 'Verification Required'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {driverProfile?.verificationStatus === 'PENDING'
                ? "Your application has been submitted and is currently being reviewed by our team. We will notify you once it's approved."
                : "To start accepting rides and earning money, you need to complete your driver verification process."
              }
            </Typography>
            {driverProfile?.verificationStatus !== 'PENDING' && (
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/rider-verification')}
              >
                Start Verification
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  // --- Render the Full Dashboard if Approved ---
  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <Box className="max-w-7xl mx-auto">
          <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <Typography variant="h4" className="font-bold text-gray-800">Rider Dashboard</Typography>
            {error && <Alert severity="error" sx={{ mt: { xs: 2, sm: 0 } }}>{error}</Alert>}
          </Box>
          
          <Grid container spacing={3}>
            {/* Summary Cards */}
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

            {/* Main Content Area */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Recent Rides" />
                  <Tab label="Earnings" />
                </Tabs>
                <Divider />
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Your Latest Rides</Typography>
                  <List>
                    {recentRides.length > 0 ? recentRides.map(ride => (
                      <ListItem key={ride.id} divider>
                        <ListItemAvatar><Avatar><TwoWheeler /></Avatar></ListItemAvatar>
                        <ListItemText 
                          primary={`${ride.pickup_location?.name || 'Start'} to ${ride.dropoff_location?.name || 'End'}`}
                          secondary={`Date: ${new Date(ride.start_time).toLocaleDateString()}`}
                        />
                        <Chip label={`₹${ride.fare?.toFixed(2)}`} color="primary" />
                      </ListItem>
                    )) : <Typography>No completed rides yet.</Typography>}
                  </List>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="h6" fontWeight="bold">Earnings Overview (Coming Soon)</Typography>
                </TabPanel>
              </Card>
            </Grid>

            {/* Right Sidebar: Status & Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Current Status</Typography>
                  <Chip icon={<Box className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />} label={online ? 'Online' : 'Offline'} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="action" />
                    <Typography color="text.secondary">Current location: {geo.latitude ? `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}` : "Unavailable"}</Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button variant="contained" onClick={() => setOnline(p => !p)}>{online ? 'Go Offline' : 'Go Online'}</Button>
                    <Button variant="outlined" onClick={() => setWalletOpen(true)} startIcon={<AccountBalanceWallet />}>Wallet</Button>
                    <Button variant="outlined" onClick={() => navigate('/rider/ride-history')} startIcon={<History />}>Ride History</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>

      <Dialog open={walletOpen} onClose={() => setWalletOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Wallet<IconButton onClick={() => setWalletOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent dividers><Wallet /></DialogContent>
      </Dialog>
    </>
  );
}