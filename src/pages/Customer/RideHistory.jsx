import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  TablePagination,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  MoreVert, 
  CalendarToday, 
  AccessTime, 
  DirectionsBike,
  LocalTaxi,
  AirportShuttle,
  Star,
  Receipt,
  LocationOn,
  Directions
} from '@mui/icons-material';

const rides = [
  { 
    id: 1, 
    pickup: 'MG Road', 
    drop: 'Koramangala', 
    date: '2025-09-20', 
    time: '10:30 AM',
    status: 'Completed',
    fare: 120,
    distance: '5.2 km',
    duration: '15 min',
    driver: 'Rahul Kumar',
    rating: 5,
    vehicleType: 'Bike'
  },
  { 
    id: 2, 
    pickup: 'Indiranagar', 
    drop: 'HSR Layout', 
    date: '2025-09-22', 
    time: '06:45 PM',
    status: 'Completed',
    fare: 85,
    distance: '3.8 km',
    duration: '12 min',
    driver: 'Vikram Singh',
    rating: 4,
    vehicleType: 'Auto'
  },
  { 
    id: 3, 
    pickup: 'Koramangala', 
    drop: 'Electronic City', 
    date: '2025-09-25', 
    time: '09:15 AM',
    status: 'Cancelled',
    fare: 0,
    distance: '8.1 km',
    duration: '22 min',
    driver: 'Amit Sharma',
    rating: 0,
    vehicleType: 'Cab'
  },
  { 
    id: 4, 
    pickup: 'HSR Layout', 
    drop: 'Bellandur', 
    date: '2025-09-28', 
    time: '02:30 PM',
    status: 'Completed',
    fare: 150,
    distance: '12.5 km',
    duration: '30 min',
    driver: 'Sanjay Patel',
    rating: 4.5,
    vehicleType: 'Bike'
  },
  { 
    id: 5, 
    pickup: 'Electronic City', 
    drop: 'MG Road', 
    date: '2025-09-30', 
    time: '07:45 PM',
    status: 'Completed',
    fare: 95,
    distance: '4.3 km',
    duration: '18 min',
    driver: 'Rajesh Kumar',
    rating: 4,
    vehicleType: 'Auto'
  }
];

const statusColors = {
  'Completed': '#4CAF50',
  'Cancelled': '#F44336',
  'Ongoing': '#2196F3',
  'Scheduled': '#FF9800'
};

const vehicleIcons = {
  'Bike': <DirectionsBike className="text-yellow-500" />,
  'Auto': <AirportShuttle className="text-yellow-500" />,
  'Cab': <LocalTaxi className="text-yellow-500" />
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RideHistory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);

  // Filter rides based on search and filters
  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ride.drop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || ride.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle menu click
  const handleMenuClick = (event, ride) => {
    setAnchorEl(event.currentTarget);
    setSelectedRide(ride);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRide(null);
  };

  // Get vehicle icon based on type
  const getVehicleIcon = (type) => {
    return vehicleIcons[type] || <DirectionsBike className="text-yellow-500" />;
  };

  // Calculate statistics
  const totalRides = rides.length;
  const completedRides = rides.filter(r => r.status === 'Completed').length;
  const cancelledRides = rides.filter(r => r.status === 'Cancelled').length;
  const totalSpent = rides.reduce((sum, ride) => sum + ride.fare, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Ride History</Typography>
          <Typography variant="body1" className="text-gray-600">View your past rides and manage your bookings</Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-blue-500">
              <CardContent>
                <Typography variant="h6" className="text-gray-600">Total Rides</Typography>
                <Typography variant="h4" className="font-bold text-blue-500">{totalRides}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-green-500">
              <CardContent>
                <Typography variant="h6" className="text-gray-600">Completed</Typography>
                <Typography variant="h4" className="font-bold text-green-500">{completedRides}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-red-500">
              <CardContent>
                <Typography variant="h6" className="text-gray-600">Cancelled</Typography>
                <Typography variant="h4" className="font-bold text-red-500">{cancelledRides}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-yellow-500">
              <CardContent>
                <Typography variant="h6" className="text-gray-600">Total Spent</Typography>
                <Typography variant="h4" className="font-bold text-yellow-500">₹{totalSpent}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box className="mb-6">
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="ride history tabs">
            <Tab label="All Rides" id="tab-0" />
            <Tab label="Completed" id="tab-1" />
            <Tab label="Cancelled" id="tab-2" />
          </Tabs>
        </Box>

        {/* Search and Filters */}
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
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
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

        {/* Rides List */}
        <Paper className="overflow-hidden shadow-md rounded-xl">
          <Box className="p-4">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4">
              Your Rides
              <Badge 
                badgeContent={filteredRides.length} 
                color="primary" 
                className="ml-2"
              />
            </Typography>
          </Box>
          
          <List>
            {filteredRides
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ride) => (
              <React.Fragment key={ride.id}>
                <ListItem 
                  alignItems="flex-start" 
                  className="px-4 py-3 hover:bg-gray-50"
                >
                  <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${ride.id}`} />
                  <ListItemText
                    primary={
                      <Box className="flex justify-between">
                        <Typography variant="h6" className="font-bold">
                          {ride.pickup} → {ride.drop}
                        </Typography>
                        <Chip 
                          label={ride.status}
                          size="small"
                          style={{ 
                            backgroundColor: `${statusColors[ride.status]}20`,
                            color: statusColors[ride.status],
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box className="mt-1">
                        <Box className="flex items-center mb-1">
                          <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                          <Typography variant="body2" component="span">{ride.date} at {ride.time}</Typography>
                          <Typography variant="body2" component="span" className="mx-2">•</Typography>
                          <Typography variant="body2" component="span">{ride.distance} • {ride.duration}</Typography>
                        </Box>
                        <Box className="flex items-center justify-between">
                          <Box className="flex items-center">
                            {getVehicleIcon(ride.vehicleType)}
                            <Typography variant="body2" component="span" className="ml-1">{ride.vehicleType}</Typography>
                            <Typography variant="body2" component="span" className="mx-2">•</Typography>
                            <Typography variant="body2" component="span">Driver: {ride.driver}</Typography>
                          </Box>
                          <Box className="flex items-center">
                            <Typography variant="body2" component="span" className="font-medium mr-2">₹{ride.fare}</Typography>
                            {ride.rating > 0 && (
                              <Box className="flex items-center">
                                <Star className="text-yellow-500" fontSize="small" />
                                <Typography variant="body2" component="span">{ride.rating}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleMenuClick(e, ride)}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
          
          {filteredRides.length === 0 && (
            <Box className="text-center py-8">
              <Receipt className="text-gray-300" fontSize="large" />
              <Typography variant="body1" className="text-gray-500 mt-2">No rides found</Typography>
              <Typography variant="body2" className="text-gray-400">
                Try changing your search or filter criteria
              </Typography>
            </Box>
          )}
          
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
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <LocationOn className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Receipt className="mr-2" fontSize="small" />
          Download Receipt
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Star className="mr-2" fontSize="small" />
          Rate Again
        </MenuItem>
      </Menu>
    </div>
  );
}