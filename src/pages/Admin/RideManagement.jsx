import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  TablePagination,
  Avatar,
  Card,
  CardContent,
  Badge,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  MoreVert, 
  Visibility,
  Edit,
  DirectionsBike,
  LocalTaxi,
  AirportShuttle,
  Person,
  CalendarToday,
  AccessTime,
  AttachMoney,
  CheckCircle,
  Cancel,
  Directions
} from '@mui/icons-material';
import { Delete, GetApp } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UserService from '../../services/UserService';
import RideService from '../../services/RideService';

// Display riders list instead of mock rides
const statusColors = {
  'Completed': '#4CAF50',
  'Ongoing': '#2196F3',
  'Cancelled': '#F44336',
  'Scheduled': '#FF9800'
};

const vehicleIcons = {
  'Bike': <DirectionsBike className="text-yellow-500" />,
  'Auto': <AirportShuttle className="text-yellow-500" />,
  'Cab': <LocalTaxi className="text-yellow-500" />
};

export default function RideManagement() {
  const [ridesData, setRidesData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // PDF preview & download animation
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [animatingDownload, setAnimatingDownload] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadRides() {
      setLoading(true);
      setError('');
      try {
        const res = await RideService.getAllRides();
        const payload = res && res.data !== undefined ? res.data : res;
        let rides = [];
        if (Array.isArray(payload)) rides = payload;
        else if (payload && Array.isArray(payload.data)) rides = payload.data;
        else if (payload && payload.data && Array.isArray(payload.data.content)) rides = payload.data.content;
        else if (payload && Array.isArray(payload.rides)) rides = payload.rides;
        else rides = [];
        if (mounted) setRidesData(rides);
      } catch (err) {
        console.error('Failed to load rides for RideManagement:', err);
        setError(err.message || 'Failed to load rides');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRides();
    return () => { mounted = false; };
  }, []);

  // Calculate statistics for rides
  const totalRides = ridesData.length;
  const completedRides = 0;
  const ongoingRides = 0;
  const cancelledRides = 0;
  const totalRevenue = 0;

  // Handle search and filters
  const filteredRides = ridesData.filter(ride => {
    const customerName = ((ride.customer && (ride.customer.fullName || ride.customer.username)) || ride.customerName || '').toString();
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) || (ride.rideId || ride.id || '').toString().includes(searchTerm) || (ride.status || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // (no status update for riders list)

  // Handle menu open
  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  // Handle view ride
  const handleView = () => { handleMenuClose(); };

  // Handle edit ride
  const handleEdit = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  // Handle cancel ride
  const handleCancel = () => {
    // No-op for riders list; placeholder for potential actions
    handleMenuClose();
  };

  // View dialog
  const openView = (rider) => {
    setSelectedItem(rider);
    setViewOpen(true);
  };
  const closeView = () => {
    setViewOpen(false);
    setSelectedItem(null);
  };

  // Delete flow (similar to UserManagement)
  // Prompt cancel (admin action) for ride
  const promptDelete = (ride) => {
    setSelectedItem(ride);
    setConfirmDeleteOpen(true);
  };

  // Cancel ride using RideService.updateRideStatus
  const performDelete = async () => {
    if (!selectedItem || !(selectedItem.id || selectedItem.rideId)) {
      setDeleteError('Invalid ride selected');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      const rideId = selectedItem.id || selectedItem.rideId;
      await RideService.updateRideStatus({ rideId, status: 'CANCELLED' });
      setRidesData(prev => prev.filter(r => (r.id || r.rideId) !== rideId));
      setConfirmDeleteOpen(false);
      setSelectedItem(null);
      setAnchorEl(null);
    } catch (err) {
      console.error('Failed to cancel ride:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to cancel ride');
    } finally {
      setDeleting(false);
    }
  };

  // Download single rider details as CSV fallback
  const downloadRider = async () => {
    // Fallback: generate CSV from ridesData and download
    try {
      if (!ridesData || ridesData.length === 0) return;
      const fields = ['rideId', 'customerName', 'driverName', 'pickupAddress', 'dropAddress', 'status', 'fare', 'createdAt'];
      const csvRows = [fields.join(',')];
      for (const r of ridesData) {
        const row = fields.map(f => {
          let v = '';
          if (f === 'rideId') v = r.rideId || r.id || '';
          else if (f === 'customerName') v = (r.customer && (r.customer.fullName || r.customer.username)) || r.customerName || '';
          else if (f === 'driverName') v = (r.driver && (r.driver.fullName || r.driver.username)) || r.driverName || '';
          else if (f === 'pickupAddress') v = r.pickupAddress || (r.locationFrom && r.locationFrom.address) || '';
          else if (f === 'dropAddress') v = r.dropAddress || (r.locationTo && r.locationTo.address) || '';
          else if (f === 'status') v = r.status || '';
          else if (f === 'fare') v = r.fare != null ? r.fare : '';
          else if (f === 'createdAt') v = r.createdAt || '';
          return `"${(v ?? '').toString().replace(/"/g, '""')}"`;
        }).join(',');
        csvRows.push(row);
      }
      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rides-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setAnimatingDownload(true);
      setTimeout(() => setAnimatingDownload(false), 1400);
    } catch (err) {
      console.error('Failed to export rides:', err);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const savePreviewToDisk = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `riders-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
  <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
  <Box sx={{ mb: { xs: 2, sm: 4, md: 6 } }}>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Ride Management
        </Typography>
        {/* <Typography variant="body1" className="text-gray-600">
          Monitor and manage all rides in the system
        </Typography> */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -6 }}>
          <Button variant="contained" startIcon={<GetApp />} onClick={() => downloadRider()} sx={{ bgcolor: 'yellow.500', '&:hover': { bgcolor: 'yellow.600' } }}>
            Download PDF
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards
  <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4, md: 6 } }}>
  <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'yellow.500', mb: { xs: 2, sm: 0 } }}>
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Total Rides</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {totalRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Completed</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {completedRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Ongoing</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {ongoingRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Revenue</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                ₹{totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Filters and Search */}
  {/* <Box sx={{ mb: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="Search rides..."
          variant="outlined"
          size="small"
          sx={{ flex: 1, minWidth: 180 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        /> */}
  {/* <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
          </TextField>
          {/* Vehicle filter removed for riders list */}
          {/* <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            More Filters
          </Button>
        </Box>
      </Box>  */}

      {/* Table */}
  <Paper sx={{ overflow: 'hidden', width: '100%', mt: { xs: 2, sm: 0 } }}>
        <TableContainer>
          <Table>
                      <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>Ride ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Pickup</TableCell>
                          <TableCell>Drop</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Fare</TableCell>
                          <TableCell>Created</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7}><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>Loading riders...</Box></TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={7}><Box sx={{ color: 'error.main', p: 2 }}>{error}</Box></TableCell></TableRow>
              ) : filteredRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ride, idx) => (
                <TableRow key={ride.id || ride.rideId || idx} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{page * rowsPerPage + idx + 1}.</TableCell>
                  <TableCell>{ride.rideId || ride.id || '—'}</TableCell>
                  <TableCell>{(ride.customer && (ride.customer.fullName || ride.customer.username)) || ride.customerName || '—'}</TableCell>
                  <TableCell>{(ride.driver && (ride.driver.fullName || ride.driver.username)) || ride.driverName || '—'}</TableCell>
                  <TableCell>{ride.pickupAddress || (ride.locationFrom && ride.locationFrom.address) || '—'}</TableCell>
                  <TableCell>{ride.dropAddress || (ride.locationTo && ride.locationTo.address) || '—'}</TableCell>
                  <TableCell>{ride.status || '—'}</TableCell>
                  <TableCell>{ride.fare != null ? `₹${ride.fare}` : '—'}</TableCell>
                  <TableCell>{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={() => openView(ride)}>View</Button>
                      <IconButton size="small" color="error" onClick={() => promptDelete(ride)} title="Cancel"><Delete /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRides.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Rider Dialog */}
      <Dialog open={viewOpen} onClose={closeView} maxWidth="sm" fullWidth>
        <DialogTitle>Rider details</DialogTitle>
        <DialogContent>
          {selectedItem ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Name:</strong> {selectedItem.fullName || selectedItem.username || '—'}</Typography>
              <Typography><strong>Email:</strong> {selectedItem.email || '—'}</Typography>
              <Typography><strong>Phone:</strong> {selectedItem.phone || '—'}</Typography>
              <Typography><strong>Joined:</strong> {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : '—'}</Typography>
              <Typography><strong>Rating:</strong> {selectedItem.rating != null ? selectedItem.rating : '—'}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Raw JSON:</strong></Typography>
              <Paper variant="outlined" sx={{ p: 1, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
                {JSON.stringify(selectedItem, null, 2)}
              </Paper>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>No rider selected</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete <strong>{selectedItem?.fullName || selectedItem?.username}</strong>?</Typography>
          {deleteError && <Box sx={{ color: 'error.main', mt: 2 }}>{deleteError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>Cancel</Button>
          <Button onClick={performDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={previewOpen} onClose={closePreview} maxWidth="lg" fullWidth>
        <DialogTitle>Riders PDF Preview</DialogTitle>
        <DialogContent sx={{ height: '80vh' }}>
          {previewLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box> : (
            previewUrl ? <iframe title="riders-pdf" src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} /> : <Box sx={{ p: 2 }}>No preview available</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview}>Close</Button>
          <Button onClick={savePreviewToDisk} variant="contained">Download</Button>
        </DialogActions>
      </Dialog>

      {/* simple download animation indicator */}
      {animatingDownload && (
        <Box sx={{ position: 'fixed', right: 24, bottom: 24, width: 80, height: 80, borderRadius: '50%', bgcolor: 'background.paper', boxShadow: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'flyToDownloads 1.2s ease-in-out' }}>
          <GetApp />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit className="mr-2" fontSize="small" />
          Edit Ride
        </MenuItem>
        {selectedItem && selectedItem.status !== 'Cancelled' && (
          <MenuItem onClick={handleCancel}>
            <Cancel className="mr-2" fontSize="small" />
            Cancel Ride
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <Directions className="mr-2" fontSize="small" />
          Track Ride
        </MenuItem>
      </Menu>
  </Box>
  );
}