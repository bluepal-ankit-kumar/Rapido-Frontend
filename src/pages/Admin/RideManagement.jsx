import React, { useState } from 'react';
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
  IconButton
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
// TODO: Replace with RideService API call


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
  const [ridesData, setRidesData] = useState(rides);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterVehicle, setFilterVehicle] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);

  // Calculate statistics
  const totalRides = ridesData.length;
  const completedRides = ridesData.filter(r => r.status === 'Completed').length;
  const ongoingRides = ridesData.filter(r => r.status === 'Ongoing').length;
  const cancelledRides = ridesData.filter(r => r.status === 'Cancelled').length;
  const totalRevenue = ridesData.reduce((sum, ride) => sum + ride.fare, 0);

  // Handle search and filters
  const filteredRides = ridesData.filter(ride => {
    const matchesSearch = ride.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || ride.status === filterStatus;
    const matchesVehicle = filterVehicle === 'All' || ride.vehicleType === filterVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
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

  // Handle status update
  const updateStatus = (id, newStatus) => {
    setRidesData(ridesData.map(ride => 
      ride.id === id ? { ...ride, status: newStatus } : ride
    ));
  };

  // Handle menu open
  const handleMenuClick = (event, ride) => {
    setAnchorEl(event.currentTarget);
    setSelectedRide(ride);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRide(null);
  };

  // Handle view ride
  const handleView = () => {
    // Implement view functionality
    handleMenuClose();
  };

  // Handle edit ride
  const handleEdit = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  // Handle cancel ride
  const handleCancel = () => {
    updateStatus(selectedRide.id, 'Cancelled');
    handleMenuClose();
  };

  return (
  <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
  <Box sx={{ mb: { xs: 2, sm: 4, md: 6 } }}>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Ride Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Monitor and manage all rides in the system
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
      </Grid>

      {/* Filters and Search */}
  <Box sx={{ mb: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
        />
  <Box sx={{ display: 'flex', gap: 2 }}>
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
          <TextField
            select
            label="Vehicle"
            variant="outlined"
            size="small"
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            sx={{ width: { xs: '100%', sm: 120 } }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Auto">Auto</MenuItem>
            <MenuItem value="Cab">Cab</MenuItem>
          </TextField>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            More Filters
          </Button>
        </Box>
      </Box>

      {/* Table */}
  <Paper sx={{ overflow: 'hidden', width: '100%', mt: { xs: 2, sm: 0 } }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRides
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>#{ride.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }} src={`https://i.pravatar.cc/150?u=${ride.id}`} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ride.user}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>
                          {ride.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }} src={`https://i.pravatar.cc/150?d=${ride.id}`} />
                      <Typography variant="body2">{ride.driver}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={{ textAlign: 'center', mr: 2 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'green.500', mb: 0.5 }}></Box>
                        <Box sx={{ width: 2, height: 32, bgcolor: 'grey.300', my: 0.5, mx: 'auto' }}></Box>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'red.500', mt: 0.5 }}></Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ride.pickup}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ride.destination}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>
                          {ride.distance} • {ride.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {vehicleIcons[ride.vehicleType]}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {ride.vehicleType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{ride.date}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{ride.time}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ride.status}
                      size="small"
                      sx={{ 
                        bgcolor: `${statusColors[ride.status]}20`,
                        color: statusColors[ride.status],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney className="text-gray-500 mr-1" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ₹{ride.fare}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<Visibility />}
                      >
                        View
                      </Button>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuClick(e, ride)}
                      >
                        <MoreVert />
                      </IconButton>
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
        {selectedRide && selectedRide.status !== 'Cancelled' && (
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