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
  Badge
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
  import { mockRides } from '../../data/mockData';
const rides = [
  { 
    id: 101, 
 
    user: 'John Doe', 
    email: 'john@example.com',
    phone: '+91 9876543210',
    status: 'Completed', 
    fare: 120,
    date: '2023-06-15',
    time: '10:30 AM',
    vehicleType: 'Bike',
    driver: 'Rahul Kumar',
    pickup: '123 Main Street',
    destination: '456 Park Avenue',
    distance: '5.2 km',
    duration: '15 min'
  },
  { 
    id: 102, 
    user: 'Jane Smith', 
    email: 'jane@example.com',
    phone: '+91 8765432109',
    status: 'Ongoing', 
    fare: 80,
    date: '2023-06-15',
    time: '11:45 AM',
    vehicleType: 'Auto',
    driver: 'Vikram Singh',
    pickup: '789 Market Road',
    destination: '321 Office Complex',
    distance: '3.8 km',
    duration: '12 min'
  },
  { 
    id: 103, 
    user: 'Robert Brown', 
    email: 'robert@example.com',
    phone: '+91 7654321098',
    status: 'Cancelled', 
    fare: 0,
    date: '2023-06-14',
    time: '09:15 AM',
    vehicleType: 'Cab',
    driver: 'Amit Sharma',
    pickup: '555 Residential Area',
    destination: '777 Commercial Hub',
    distance: '8.1 km',
    duration: '22 min'
  },
  { 
    id: 104, 
    user: 'Emily Davis', 
    email: 'emily@example.com',
    phone: '+91 6543210987',
    status: 'Completed', 
    fare: 150,
    date: '2023-06-14',
 
    pickup: 'Home Address',
    destination: 'Railway Station',
    distance: '4.3 km',
    duration: '18 min'
  }
];

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Ride Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Monitor and manage all rides in the system
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-blue-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Total Rides</Typography>
              <Typography variant="h4" className="font-bold text-blue-500">
                {totalRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-green-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Completed</Typography>
              <Typography variant="h4" className="font-bold text-green-500">
                {completedRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-orange-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Ongoing</Typography>
              <Typography variant="h4" className="font-bold text-orange-500">
                {ongoingRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-purple-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Revenue</Typography>
              <Typography variant="h4" className="font-bold text-purple-500">
                ₹{totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search rides..."
          variant="outlined"
          size="small"
          className="flex-1"
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
        <Box className="flex gap-2">
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
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
            className="w-32"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Auto">Auto</MenuItem>
            <MenuItem value="Cab">Cab</MenuItem>
          </TextField>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            className="whitespace-nowrap"
          >
            More Filters
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper className="overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-100">
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
                  <TableCell className="font-medium">#{ride.id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-2" src={`https://i.pravatar.cc/150?u=${ride.id}`} />
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {ride.user}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {ride.email}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-2" src={`https://i.pravatar.cc/150?d=${ride.id}`} />
                      <Typography variant="body2">{ride.driver}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Box className="flex items-start">
                      <div className="text-center mr-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="w-0.5 h-8 bg-gray-300 my-1 mx-auto"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                      <div>
                        <Typography variant="body2" className="font-medium truncate">
                          {ride.pickup}
                        </Typography>
                        <Typography variant="body2" className="font-medium truncate">
                          {ride.destination}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {ride.distance} • {ride.duration}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      {vehicleIcons[ride.vehicleType]}
                      <Typography variant="body2" className="ml-1">
                        {ride.vehicleType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box className="flex items-center">
                        <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{ride.date}</Typography>
                      </Box>
                      <Box className="flex items-center">
                        <AccessTime className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{ride.time}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ride.status}
                      size="small"
                      style={{ 
                        backgroundColor: `${statusColors[ride.status]}20`,
                        color: statusColors[ride.status],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <AttachMoney className="text-gray-500 mr-1" fontSize="small" />
                      <Typography variant="body2" className="font-medium">
                        ₹{ride.fare}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-1">
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
    </div>
  );
}