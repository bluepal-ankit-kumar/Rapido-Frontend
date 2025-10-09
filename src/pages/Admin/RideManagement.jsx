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
  const [ridersData, setRidersData] = useState([]);
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
    async function loadRiders() {
      setLoading(true);
      setError('');
      try {
        const res = await UserService.getAllUsers(0, 1000);
        const payload = res && res.data !== undefined ? res.data : res;
        let users = [];
        if (Array.isArray(payload)) users = payload;
        else if (payload && Array.isArray(payload.data)) users = payload.data;
        else if (payload && payload.data && Array.isArray(payload.data.content)) users = payload.data.content;
        else users = [];
        const riders = users.filter(u => (u.userType || u.role || '').toString().toUpperCase() === 'RIDER');
        if (mounted) setRidersData(riders);
      } catch (err) {
        console.error('Failed to load riders for RideManagement:', err);
        setError(err.message || 'Failed to load riders');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRiders();
    return () => { mounted = false; };
  }, []);

  // Calculate statistics for riders
  const totalRides = ridersData.length;
  const completedRides = 0;
  const ongoingRides = 0;
  const cancelledRides = 0;
  const totalRevenue = 0;

  // Handle search and filters
  const filteredRides = ridersData.filter(user => {
    const name = (user.fullName || user.username || '').toString();
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || (user.email || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) || (user.phone || '').toString().includes(searchTerm);
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
  const promptDelete = (rider) => {
    setSelectedItem(rider);
    setConfirmDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!selectedItem || !selectedItem.id) {
      setDeleteError('Invalid rider selected');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await UserService.deleteUser(selectedItem.id);
      setRidersData(prev => prev.filter(r => r.id !== selectedItem.id));
      setConfirmDeleteOpen(false);
      setSelectedItem(null);
      setAnchorEl(null);
    } catch (err) {
      console.error('Failed to delete rider:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete rider');
    } finally {
      setDeleting(false);
    }
  };

  // Download single rider details as CSV fallback
  const downloadRider = async (rider) => {
    // Open PDF preview modal that fetches riders PDF from backend (userType=RIDER)
    setPreviewLoading(true);
    try {
      const res = await UserService.downloadUsersPdf('RIDER');
      const blob = new Blob([res.data], { type: res.headers?.['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setAnimatingDownload(true);
      setTimeout(() => setAnimatingDownload(false), 1400);
    } catch (err) {
      console.error('Failed to fetch riders PDF:', err);
    } finally {
      setPreviewLoading(false);
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
                <TableCell>Rider</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7}><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>Loading riders...</Box></TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={7}><Box sx={{ color: 'error.main', p: 2 }}>{error}</Box></TableCell></TableRow>
              ) : filteredRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rider, idx) => (
                <TableRow key={rider.id || idx} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{page * rowsPerPage + idx + 1}.</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{rider.fullName || rider.username || '—'}</Typography>
                        {/* <Typography variant="caption" sx={{ color: 'grey.500' }}>{rider.userType || rider.role}</Typography> */}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{rider.email || '—'}</TableCell>
                  <TableCell>{rider.phone || '—'}</TableCell>
                  <TableCell>{rider.rating != null ? rider.rating : '—'}</TableCell>
                  <TableCell>{rider.createdAt ? new Date(rider.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={() => openView(rider)}>View</Button>
                      <IconButton size="small" color="error" onClick={() => promptDelete(rider)} title="Delete"><Delete /></IconButton>
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