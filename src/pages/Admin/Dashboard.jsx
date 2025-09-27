import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  People, 
  DirectionsBike, 
  Assessment, 
  StarRate, 
  Help,
  TrendingUp,
  MoreVert,
  Refresh
} from '@mui/icons-material';

const summary = [
  { 
    title: 'Users', 
    value: 1200, 
    link: '/admin/usermanagement',
    icon: <People />,
    color: '#4CAF50',
    trend: 12,
    description: 'Active users'
  },
  { 
    title: 'Rides', 
    value: 350, 
    link: '/admin/ridemanagement',
    icon: <DirectionsBike />,
    color: '#2196F3',
    trend: 8,
    description: 'Completed rides'
  },
  { 
    title: 'Reports', 
    value: 15, 
    link: '/admin/reports',
    icon: <Assessment />,
    color: '#FF9800',
    trend: -3,
    description: 'Pending review'
  },
  { 
    title: 'Ratings', 
    value: 98, 
    link: '/admin/ratingsreview',
    icon: <StarRate />,
    color: '#9C27B0',
    trend: 5,
    description: 'Average rating'
  },
  { 
    title: 'Help', 
    value: 22, 
    link: '/admin/helpmanagement',
    icon: <Help />,
    color: '#F44336',
    trend: 15,
    description: 'Open tickets'
  },
];

const recentActivities = [
  { id: 1, action: 'New user registration', time: '2 mins ago' },
  { id: 2, action: 'Ride completed', time: '15 mins ago' },
  { id: 3, action: 'Payment processed', time: '1 hour ago' },
  { id: 4, action: 'Support ticket resolved', time: '3 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">Admin Dashboard</Typography>
            <Typography variant="subtitle1" className="text-gray-600">Welcome back, Administrator</Typography>
          </div>
          <div className="flex items-center space-x-3">
            <Chip 
              label="Last updated: Just now" 
              variant="outlined" 
              size="small"
              className="text-gray-600"
            />
            <IconButton size="small" className="bg-white shadow-sm">
              <Refresh />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-8">
        {summary.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.title}>
            <Link to={item.link} style={{ textDecoration: 'none' }}>
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0"
                sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div 
                      className="p-2 rounded-lg" 
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <IconButton size="small" className="text-gray-400">
                      <MoreVert />
                    </IconButton>
                  </div>
                  
                  <Typography variant="h4" className="font-bold text-gray-800 mb-1">
                    {item.value}
                  </Typography>
                  
                  <Typography variant="h6" className="text-gray-700 mb-1">
                    {item.title}
                  </Typography>
                  
                  <Typography variant="body2" className="text-gray-500 mb-2">
                    {item.description}
                  </Typography>
                  
                  <div className="flex items-center">
                    <TrendingUp 
                      className={`mr-1 ${item.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      style={{ transform: item.trend < 0 ? 'rotate(180deg)' : 'none' }}
                    />
                    <Typography 
                      variant="body2" 
                      className={item.trend >= 0 ? 'text-green-500' : 'text-red-500'}
                    >
                      {Math.abs(item.trend)}% from last week
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Recent Activities */}
      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} lg={8}>
          <Card 
            className="h-full border-0"
            sx={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)'
            }}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-gray-800">
                  Ride Statistics
                </Typography>
                <Chip label="Last 7 days" size="small" />
              </div>
              
              {/* Chart Placeholder */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <Typography variant="body1" className="text-gray-500 mb-2">
                    Ride Statistics Chart
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    Visual representation of ride data
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card 
            className="h-full border-0"
            sx={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)'
            }}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-gray-800">
                  Recent Activities
                </Typography>
                <IconButton size="small" className="text-gray-400">
                  <MoreVert />
                </IconButton>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <Typography variant="body2" className="text-gray-800">
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {activity.time}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
              
              <Box mt={3} pt={3} className="border-t border-gray-200">
                <Link to="/admin/activities" style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    className="text-blue-500 font-medium hover:text-blue-700"
                  >
                    View all activities →
                  </Typography>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}