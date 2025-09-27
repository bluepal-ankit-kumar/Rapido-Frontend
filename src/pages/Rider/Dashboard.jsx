import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Box, 
  Avatar, 
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { 
  Person, 
  TwoWheeler, 
  CurrencyRupee, 
  Star, 
  History,
  Settings,
  Notifications,
  AccountBalanceWallet,
  TrendingUp,
  CalendarToday,
  AccessTime,
  LocationOn,
  Directions,
  MoreVert
} from '@mui/icons-material';

const summary = [
  { title: 'Completed Rides', value: 120, icon: <TwoWheeler className="text-yellow-500" />, color: '#FFF8E1' },
  { title: 'Earnings', value: '₹8,500', icon: <CurrencyRupee className="text-yellow-500" />, color: '#FFF8E1' },
  { title: 'Rating', value: '4.9/5', icon: <Star className="text-yellow-500" />, color: '#FFF8E1' },
];

const recentRides = [
  { id: 1, pickup: 'MG Road', drop: 'Koramangala', date: '2023-06-15', time: '10:30 AM', fare: 120 },
  { id: 2, pickup: 'Indiranagar', drop: 'HSR Layout', date: '2023-06-14', time: '06:45 PM', fare: 85 },
  { id: 3, pickup: 'Koramangala', drop: 'Electronic City', date: '2023-06-13', time: '09:15 AM', fare: 150 },
];

const earningsData = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 1500 },
  { day: 'Wed', amount: 900 },
  { day: 'Thu', amount: 1800 },
  { day: 'Fri', amount: 2000 },
  { day: 'Sat', amount: 1700 },
  { day: 'Sun', amount: 1300 },
];

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

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="mb-8 flex justify-between items-center">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">Rider Dashboard</Typography>
            <Typography variant="body1" className="text-gray-600">Welcome back, Rahul!</Typography>
          </div>
          <Box className="flex items-center">
            <Avatar className="mr-3" src="https://i.pravatar.cc/150?u=rider" />
            <div>
              <Typography variant="h6" className="font-medium">Rahul Kumar</Typography>
              <Typography variant="body2" className="text-gray-600">Online</Typography>
            </div>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <AccountBalanceWallet /> Wallet
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <History /> Ride History
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Settings /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>
                <Notifications /> Notifications
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Person /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} className="mb-6">
          {summary.map((item) => (
            <Grid item xs={12} sm={4} key={item.title}>
              <Card className="shadow-md rounded-xl h-full">
                <CardContent className="p-4">
                  <Box className="flex items-center mb-2">
                    <Box className="p-2 rounded-lg" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" className="text-gray-600 ml-2">{item.title}</Typography>
                  </Box>
                  <Typography variant="h5" className="font-bold text-gray-800">{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Left Column - Recent Rides and Actions */}
          <Grid item xs={12} md={8}>
            {/* Tabs */}
            <Box className="mb-4">
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                <Tab label="Recent Rides" id="tab-0" />
                <Tab label="Earnings" id="tab-1" />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              <Card className="shadow-md rounded-xl">
                <CardContent className="p-0">
                  <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Recent Rides</Typography>
                  <Divider />
                  <List>
                    {recentRides.map((ride) => (
                      <React.Fragment key={ride.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              <TwoWheeler className="text-yellow-500" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box className="flex justify-between">
                                <Typography variant="h6" className="font-medium">
                                  {ride.pickup} → {ride.drop}
                                </Typography>
                                <Chip 
                                  label={`₹${ride.fare}`} 
                                  size="small"
                                  style={{ backgroundColor: '#FFF8E1' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box className="flex items-center mt-1">
                                <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                                <Typography variant="body2">{ride.date}</Typography>
                                <Typography variant="body2" className="mx-2">•</Typography>
                                <Typography variant="body2">{ride.time}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                  <Box className="p-4 text-center">
                    <Button variant="outlined" className="w-full">
                      View All Rides
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Card className="shadow-md rounded-xl">
                <CardContent className="p-4">
                  <Typography variant="h6" className="font-bold text-gray-800 mb-4">Weekly Earnings</Typography>
                  <Box className="h-64 flex items-end justify-center">
                    <div className="flex items-end h-48 w-full">
                      {earningsData.map((day, index) => (
                        <Box key={day.day} className="flex-1 flex flex-col items-center">
                          <Typography variant="body2" className="text-gray-600 mb-1">{day.day}</Typography>
                          <Box 
                            className="w-full bg-yellow-400 rounded-t" 
                            style={{ height: `${(day.amount / 2000) * 100}%` }}
                          ></Box>
                          <Typography variant="body2" className="font-medium mt-1">₹{day.amount}</Typography>
                        </Box>
                      ))}
                    </div>
                  </Box>
                  <Box className="flex justify-between mt-4">
                    <Typography variant="h6" className="text-gray-600">Total Earnings</Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">₹10,400</Typography>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>
          </Grid>

          {/* Right Column - Quick Actions and Status */}
          <Grid item xs={12} md={4}>
            {/* Status Card */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-4">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Current Status</Typography>
                <Box className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <Typography variant="body1" className="font-medium">Online</Typography>
                </Box>
                <Box className="flex items-center mb-4">
                  <LocationOn className="text-gray-500 mr-2" />
                  <Typography variant="body2">MG Road, Bangalore</Typography>
                </Box>
                <Box className="flex items-center">
                  <TwoWheeler className="text-gray-500 mr-2" />
                  <Typography variant="body2">Honda Activa</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-4">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Quick Actions</Typography>
                <Box className="space-y-3">
                  <Button 
                    variant="contained" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    startIcon={<TwoWheeler />}
                  >
                    Go Online
                  </Button>
                  <Button 
                    variant="outlined" 
                    className="w-full"
                    startIcon={<AccountBalanceWallet />}
                  >
                    Wallet
                  </Button>
                  <Button 
                    variant="outlined" 
                    className="w-full"
                    startIcon={<History />}
                  >
                    Ride History
                  </Button>
                  <Button 
                    variant="outlined" 
                    className="w-full"
                    startIcon={<Settings />}
                  >
                    Settings
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}