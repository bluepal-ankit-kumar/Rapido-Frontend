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
import { reverseGeocode } from '../../services/GeocodingService';

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
  // cached reverse-geocoded addresses for display (keyed by ride key)
  const [pickupLookup, setPickupLookup] = useState({});
  const [dropLookup, setDropLookup] = useState({});

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

  // Run reverse geocode lookups when ridesData changes
  useEffect(() => {
    if (!ridesData || ridesData.length === 0) return undefined;
    let mounted = true;
    (async () => {
      try {
        for (let i = 0; i < ridesData.length; i++) {
          const ride = ridesData[i];
          const key = ride.id || ride.rideId || `r-${i}`;

          const pLat = ride.startLatitude ?? ride.start_latitude ?? ride.startLat ?? ride.pickupLat ?? ride.pickup_lat ?? ride.originLat ?? ride.origin_lat;
          const pLng = ride.startLongitude ?? ride.start_longitude ?? ride.startLng ?? ride.pickupLng ?? ride.pickup_lng ?? ride.originLng ?? ride.origin_lng;
          const dLat = ride.endLatitude ?? ride.end_latitude ?? ride.endLat ?? ride.dropLat ?? ride.drop_lat ?? ride.destinationLat ?? ride.destination_lat;
          const dLng = ride.endLongitude ?? ride.end_longitude ?? ride.endLng ?? ride.dropLng ?? ride.drop_lng ?? ride.destinationLng ?? ride.destination_lng;

          if (pLat != null && pLng != null && !pickupLookup[key]) {
            // eslint-disable-next-line no-await-in-loop
            const label = await reverseGeocode(Number(pLat), Number(pLng));
            if (!mounted) return;
            setPickupLookup(prev => ({ ...prev, [key]: label }));
            // small delay to be friendly
            // eslint-disable-next-line no-await-in-loop
            await new Promise(res => setTimeout(res, 150));
          }

          if (dLat != null && dLng != null && !dropLookup[key]) {
            // eslint-disable-next-line no-await-in-loop
            const label = await reverseGeocode(Number(dLat), Number(dLng));
            if (!mounted) return;
            setDropLookup(prev => ({ ...prev, [key]: label }));
            // eslint-disable-next-line no-await-in-loop
            await new Promise(res => setTimeout(res, 150));
          }
        }
      } catch (e) {
        console.debug('reverse geocode batch failed', e);
      }
    })();
    return () => { mounted = false; };
  }, [ridesData]);

  // Helpers to normalize ride fields across different API shapes
  const resolveAddress = (r) => {
    if (!r) return '—';
    // small helper to safely read nested values by dot path
    const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
    const candidates = [
      'pickupAddress', 'pickup_address', 'pickup', 'pickup.address', 'pickup.name', 'pickup.display_name',
      'locationFrom', 'locationFrom.address', 'locationFrom.name',
      'from', 'from.address', 'from.name', 'from.display_name',
      'origin', 'origin.address', 'origin.name', 'origin.display_name',
      'source', 'source.address', 'source.name',
      'data.pickup', 'data.pickup.address', 'data.pickup.name', 'data.origin', 'data.origin.address', 'data.origin.name',
      'pickupLocation', 'pickupLocation.address', 'pickupLocation.name', 'pickup_location', 'pickup_location.address', 'pickup_location.name'
    ];
    for (const p of candidates) {
      const v = get(r, p);
      if (v && typeof v === 'string' && v.trim() !== '') return v;
      // if the node itself is an object with address/display_name/name
      if (v && typeof v === 'object') {
        if (v.address) return v.address;
        if (v.name) return v.name;
        if (v.display_name) return v.display_name;
      }
    }
    // fallback: lat/lng pairs
    if ((r.pickupLat || r.pickup_lat) && (r.pickupLng || r.pickup_lng)) {
      const lat = r.pickupLat || r.pickup_lat;
      const lng = r.pickupLng || r.pickup_lng;
      return `${lat}, ${lng}`;
    }
    // common backend shape: startLatitude / startLongitude
    if ((r.startLatitude || r.start_latitude || r.startLat) && (r.startLongitude || r.start_longitude || r.startLng)) {
      const lat = r.startLatitude || r.start_latitude || r.startLat;
      const lng = r.startLongitude || r.start_longitude || r.startLng;
      return `${lat}, ${lng}`;
    }
    if ((r.originLat || r.origin_lat) && (r.originLng || r.origin_lng)) {
      const lat = r.originLat || r.origin_lat;
      const lng = r.originLng || r.origin_lng;
      return `${lat}, ${lng}`;
    }
    return '—';
  };

  const resolveDropAddress = (r) => {
    if (!r) return '—';
    const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
    const candidates = [
      'dropAddress', 'drop_address', 'drop', 'drop.address', 'drop.name', 'drop.display_name',
      'locationTo', 'locationTo.address', 'locationTo.name',
      'to', 'to.address', 'to.name', 'to.display_name',
      'destination', 'destination.address', 'destination.name',
      'data.drop', 'data.drop.address', 'data.drop.name', 'data.destination', 'data.destination.address'
    ];
    for (const p of candidates) {
      const v = get(r, p);
      if (v && typeof v === 'string' && v.trim() !== '') return v;
      if (v && typeof v === 'object') {
        if (v.address) return v.address;
        if (v.name) return v.name;
        if (v.display_name) return v.display_name;
      }
    }
    if ((r.dropLat || r.drop_lat) && (r.dropLng || r.drop_lng)) {
      const lat = r.dropLat || r.drop_lat;
      const lng = r.dropLng || r.drop_lng;
      return `${lat}, ${lng}`;
    }
    // common backend shape: endLatitude / endLongitude
    if ((r.endLatitude || r.end_latitude || r.endLat) && (r.endLongitude || r.end_longitude || r.endLng)) {
      const lat = r.endLatitude || r.end_latitude || r.endLat;
      const lng = r.endLongitude || r.end_longitude || r.endLng;
      return `${lat}, ${lng}`;
    }
    if ((r.destinationLat || r.destination_lat) && (r.destinationLng || r.destination_lng)) {
      const lat = r.destinationLat || r.destination_lat;
      const lng = r.destinationLng || r.destination_lng;
      return `${lat}, ${lng}`;
    }
    return '—';
  };

  const resolveFare = (r) => {
    if (!r) return null;
    const candidates = [
      'fare', 'fareAmount', 'fare_amount', 'amount', 'price', 'estimatedFare', 'estimated_fare',
      'billing.fare', 'billing.amount', 'payment.amount', 'data.fare', 'fare.value'
    ];
    const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
    for (const p of candidates) {
      const v = get(r, p);
      if (v !== undefined && v !== null && v !== '') {
        const num = typeof v === 'number' ? v : (typeof v === 'string' ? parseFloat(v.replace(/[^0-9.-]+/g, '')) : NaN);
        if (!Number.isNaN(num)) return num;
        // if it's an object with amount/fare
        if (typeof v === 'object') {
          if (v.amount && !Number.isNaN(Number(v.amount))) return Number(v.amount);
          if (v.fare && !Number.isNaN(Number(v.fare))) return Number(v.fare);
        }
      }
    }
    return null;
  };

  const resolveCreated = (r) => {
    if (!r) return null;
    const get = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
    const candidates = [
      'createdAt', 'created_at', 'created', 'created_on', 'createdDate', 'createdAtTimestamp', 'timestamp', 'time', 'dateCreated',
      'meta.createdAt', 'meta.created_at', 'data.createdAt', 'data.created'
    ];
    let v;
    for (const p of candidates) {
      v = get(r, p);
      if (v !== undefined && v !== null && v !== '') break;
    }
    if (v === undefined || v === null || v === '') return null;
    // If it's already a Date
    if (v instanceof Date) return v;
    // If it's a numeric timestamp (seconds or ms)
    if (typeof v === 'number') {
      // if likely seconds (10 digits) convert to ms
      if (v > 0 && v < 1e11) return new Date(v * 1000);
      return new Date(v);
    }
    // If it's a string, try to parse; handle numeric strings too
    const num = Number(v);
    if (!Number.isNaN(num) && String(v).trim().length <= 13) {
      // treat as timestamp
      if (num > 0 && num < 1e11) return new Date(num * 1000);
      return new Date(num);
    }
    const d = new Date(String(v));
    if (!isNaN(d.getTime())) return d;
    return null;
  };

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
          else if (f === 'pickupAddress') v = resolveAddress(r) || '';
          else if (f === 'dropAddress') v = resolveDropAddress(r) || '';
          else if (f === 'status') v = r.status || '';
          else if (f === 'fare') {
            const fv = resolveFare(r);
            v = fv != null ? fv : '';
          } else if (f === 'createdAt') {
            const cd = resolveCreated(r);
            v = cd ? cd.toISOString() : '';
          }
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
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{resolveAddress(ride)}</Typography>
                      {(() => {
                        const key = ride.id || ride.rideId || `r-${page * rowsPerPage + idx}`;
                        const label = pickupLookup[key];
                        return label ? <Typography variant="caption" color="text.secondary">{label}</Typography> : null;
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{resolveDropAddress(ride)}</Typography>
                      {(() => {
                        const key = ride.id || ride.rideId || `r-${page * rowsPerPage + idx}`;
                        const label = dropLookup[key];
                        return label ? <Typography variant="caption" color="text.secondary">{label}</Typography> : null;
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell>{ride.status || '—'}</TableCell>
                  <TableCell>{resolveFare(ride) != null ? `₹${resolveFare(ride)}` : '—'}</TableCell>
                  <TableCell>{resolveCreated(ride) ? resolveCreated(ride).toLocaleDateString() : '—'}</TableCell>
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