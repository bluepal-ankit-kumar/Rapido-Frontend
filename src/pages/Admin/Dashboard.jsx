import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, List, ListItem, ListItemText, ListItemAvatar, Divider, Link as MuiLink, Alert, CircularProgress, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { People, CheckCircle, Cancel, Refresh } from '@mui/icons-material';
import DriverService from '../../services/DriverService';

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
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800">Admin Dashboard</Typography>
          <Typography variant="subtitle1" className="text-gray-600">Welcome back, Administrator</Typography>
        </div>
        <IconButton onClick={() => window.location.reload()} sx={{ mt: { xs: 2, sm: 0 } }}><Refresh /></IconButton>
      </Box>

      {/* Pending Approvals Section */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} width="100%">
          <PendingDriverApprovals />
        </Grid>
      </Grid>
    </div>
  );
}