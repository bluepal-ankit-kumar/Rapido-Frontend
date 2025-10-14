import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, Button, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { People, DirectionsBike, Assessment, StarRate, Help, Refresh, CheckCircle, Cancel, MoreVert, TrendingUp } from '@mui/icons-material';
import DriverService from '../../services/DriverService';
import RideStatisticsChart from './RideStatisticsChart.jsx';
import { subDays, format } from 'date-fns';

// Fetch summary data from backend
import UserService from '../../services/UserService';
import RideService from '../../services/RideService';

// This component handles fetching and displaying pending drivers
function PendingDriverApprovals() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await DriverService.getPendingDrivers();
      if (response.success) {
        setDrivers(response.data);
      } else {
        throw new Error(response.message || 'API responded with an error');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pending drivers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const handleApproval = async (driverId, isApproved) => {
    try {
      const response = await DriverService.approveDriver({ driverId, approved: isApproved });
      if (response.success) {
        // Provide instant feedback by removing the driver from the UI list
        setDrivers(prev => prev.filter(d => d.id !== driverId));
      } else {
        setError(response.message || 'The action could not be completed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Pending Driver Approvals</Typography>
          <Chip label={drivers.length} color="primary" />
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : drivers.length === 0 ? (
          <Typography color="text.secondary">No pending approvals at the moment.</Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {drivers.map((driver, index) => (
              <React.Fragment key={driver.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" color="success" size="small" onClick={() => handleApproval(driver.id, true)} startIcon={<CheckCircle />}>Approve</Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleApproval(driver.id, false)} startIcon={<Cancel />}>Reject</Button>
                    </Box>
                  }
                >
                  <ListItemAvatar><Avatar>{driver.fullName?.charAt(0) || 'D'}</Avatar></ListItemAvatar>
                  <ListItemText
                    primary={driver.fullName || `User ID: ${driver.userId}`}
                    secondary={
                      <>
                        {`Vehicle: ${driver.vehicleModel} (${driver.vehicleNumber})`}
                        <br />
                        <MuiLink href={driver.licenseImageUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 'medium' }}>
                          View License
                        </MuiLink>
                      </>
                    }
                  />
                </ListItem>
                {index < drivers.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [rideStatsData, setRideStatsData] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRiders, setTotalRiders] = useState(0);
  const [totalRides, setTotalRides] = useState(0);

  useEffect(() => {
    async function fetchSummary() {
      setLoadingSummary(true);
      try {
        // Fetch all users, total rides, pending drivers, ratings, help tickets
        const promises = [
          UserService.getAllUsers(0, 10000), // all users
          RideService.getTotalRides(), // total rides from /rides/total
          DriverService.getPendingDrivers(),
          UserService.getAllRatings(),
          UserService.getAllHelpTickets()
        ];

        const results = await Promise.allSettled(promises);

        const valueOrDefault = (res, defaultVal) => {
          if (!res) return defaultVal;
          if (res.status === 'fulfilled') return res.value;
          console.error('Summary fetch failed:', res.reason);
          return defaultVal;
        };

        // --- Normalize users array as in UserManagement ---
        const usersRes = valueOrDefault(results[0], { data: [] });
        let usersArr = [];
        const usersPayload = usersRes && usersRes.data !== undefined ? usersRes.data : usersRes;
        if (Array.isArray(usersPayload)) usersArr = usersPayload;
        else if (usersPayload && Array.isArray(usersPayload.data)) usersArr = usersPayload.data;
        else if (usersPayload && usersPayload.data && Array.isArray(usersPayload.data.content)) usersArr = usersPayload.data.content;
        else if (usersPayload && Array.isArray(usersPayload.users)) usersArr = usersPayload.users;
        else if (usersPayload && Array.isArray(usersPayload.items)) usersArr = usersPayload.items;
        else usersArr = [];

        // --- Get total rides from /rides/total endpoint ---
        // const totalRidesRes = valueOrDefault(results[1], { data: 0 });
        // let totalRidesCount = 0;
        // // RideService.getTotalRides() returns { success, message, data: <number> }
        // if (typeof totalRidesRes === 'number') {
        //   totalRidesCount = totalRidesRes;
        // } else if (totalRidesRes && typeof totalRidesRes.data === 'number') {
        //   totalRidesCount = totalRidesRes.data;
        // } else if (totalRidesRes && typeof totalRidesRes.total === 'number') {
        //   totalRidesCount = totalRidesRes.total;
        // } else if (totalRidesRes && typeof totalRidesRes.count === 'number') {
        //   totalRidesCount = totalRidesRes.count;
        // } else if (totalRidesRes && typeof totalRidesRes.data === 'object' && typeof totalRidesRes.data.data === 'number') {
        //   totalRidesCount = totalRidesRes.data.data;
        // }
        // setTotalRides(totalRidesCount);
const totalRidesCount = valueOrDefault(results[1], 0); // result of RideService.getTotalRides()
setTotalRides(totalRidesCount);
        // --- Ride Statistics Chart Data (keep previous logic, but fallback to 0 rides) ---
        // If you want to keep chart, you may need to fetch all rides separately

        const pendingRes = valueOrDefault(results[2], { data: [] });
        const ratingRes = valueOrDefault(results[3], { data: [] });
        const helpRes = valueOrDefault(results[4], { data: [] });

        // --- Count customers and riders from usersArr ---
        const totalCustomersCount = usersArr.filter(u => (u.userType || u.role || '').toUpperCase() === 'CUSTOMER').length;
        const totalRidersCount = usersArr.filter(u => (u.userType || u.role || '').toUpperCase() === 'RIDER').length;
        setTotalCustomers(totalCustomersCount);
        setTotalRiders(totalRidersCount);

        const pendingCount = Array.isArray(pendingRes.data) ? pendingRes.data.length : (pendingRes.data?.length || 0);
        const ratingsCount = Array.isArray(ratingRes.data) ? ratingRes.data.length : (ratingRes.data?.length || 0);
        const helpCount = Array.isArray(helpRes.data) ? helpRes.data.length : (helpRes.data?.length || 0);

        setSummary([
          { title: 'Rides', value: totalRidesCount, link: '/admin/ride-management', icon: <TrendingUp />, color: '#FACC15' },
          { title: 'Pending', value: pendingCount, link: '/admin/reports', icon: <Assessment />, color: '#F57C00' },
          { title: 'Ratings', value: ratingsCount, link: '/admin/ratings-review', icon: <StarRate />, color: '#D32F2F' },
          { title: 'Help Tickets', value: helpCount, link: '/admin/help-management', icon: <Help />, color: '#7B1FA2' },
        ]);
      } catch (err) {
        console.error('Failed to fetch admin summary:', err);
        setSummary([]);
        setTotalCustomers(0);
        setTotalRiders(0);
        setTotalRides(0);
      }
      setLoadingSummary(false);
    }
    fetchSummary();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800">Admin Dashboard</Typography>
          <Typography variant="subtitle1" className="text-gray-600">Welcome back, Administrator</Typography>
        </div>
        <IconButton onClick={() => window.location.reload()} sx={{ mt: { xs: 2, sm: 0 } }}><Refresh /></IconButton>
      </Box>

      {/* Explicit Total Customers, Total Riders, and Total Rides Cards */}
      {!loadingSummary && (
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#1976D220', color: '#1976D2' }}><People /></Avatar>
                  <Box>
                    <Typography variant="h6">Total Customers</Typography>
                    <Typography variant="h4" fontWeight="bold">{totalCustomers}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#388E3C20', color: '#388E3C' }}><DirectionsBike /></Avatar>
                  <Box>
                    <Typography variant="h6">Total Riders</Typography>
                    <Typography variant="h4" fontWeight="bold">{totalRiders}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#FACC1520', color: '#FACC15' }}><TrendingUp /></Avatar>
                  <Box>
                    <Typography variant="h6">Total Rides</Typography>
                    <Typography variant="h4" fontWeight="bold">{totalRides}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        {loadingSummary ? (
          <Grid item xs={12}><Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box></Grid>
        ) : summary.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.title}>
            <RouterLink to={item.link} style={{ textDecoration: 'none' }}>
              <Card className="h-full hover:shadow-lg transition-transform transform hover:-translate-y-1" sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, mb: 1 }}>{item.icon}</Avatar>
                  <Typography variant="h5" className="font-bold">{item.value}</Typography>
                  <Typography className="text-gray-600">{item.title}</Typography>
                </CardContent>
              </Card>
            </RouterLink>
          </Grid>  
        ))}
      </Grid>  
      {/* Pending Approvals Section */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} width="100%">
          <PendingDriverApprovals />
        </Grid>
      </Grid>
      {/* Charts and Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <RouterLink to="/admin/ride-statistics" style={{ textDecoration: 'none' }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6" className="font-bold text-gray-800">Ride Statistics</Typography>
                <Box sx={{ height: 300 }}>
                  <RideStatisticsChart
                    data={rideStatsData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </RouterLink>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" className="font-bold text-gray-800">Recent Activities (Coming Soon)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}