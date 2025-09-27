import React from 'react';
import { 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  ArrowRightAlt,
  CalendarToday,
  CheckCircle,
  Info
} from '@mui/icons-material';

const rides = [
  { id: 1, pickup: 'MG Road', drop: 'Koramangala', date: '2025-09-20', status: 'Completed', distance: '8.5 km', duration: '25 min', fare: '₹180' },
  { id: 2, pickup: 'Indiranagar', drop: 'HSR Layout', date: '2025-09-22', status: 'Completed', distance: '6.2 km', duration: '20 min', fare: '₹150' },
  { id: 3, pickup: 'Electronic City', drop: 'Whitefield', date: '2025-09-25', status: 'Cancelled', distance: '22.1 km', duration: '45 min', fare: '₹420' },
];

const statusColors = {
  Completed: 'success',
  Cancelled: 'error',
  Scheduled: 'info',
  'In Progress': 'warning'
};

export default function RideHistory() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Box className="mb-6">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ride History
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Your recent ride details and status
        </Typography>
      </Box>
      
      <Paper elevation={2} className="overflow-hidden">
        <List className="py-0">
          {rides.map((ride, index) => (
            <React.Fragment key={ride.id}>
              <ListItem className="py-4 px-6 hover:bg-gray-50 transition-colors">
                <Box className="flex-1">
                  <Box className="flex items-center mb-2">
                    <LocationOn className="text-blue-500 mr-1" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {ride.pickup}
                    </Typography>
                    <ArrowRightAlt className="mx-2 text-gray-400" />
                    <LocationOn className="text-green-500 mr-1" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {ride.drop}
                    </Typography>
                  </Box>
                  
                  <Box className="flex flex-wrap items-center gap-3 mt-3">
                    <Box className="flex items-center">
                      <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                      <Typography variant="body2" color="textSecondary">
                        {ride.date}
                      </Typography>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem className="mx-1" />
                    
                    <Typography variant="body2" color="textSecondary">
                      {ride.distance} • {ride.duration}
                    </Typography>
                    
                    <Divider orientation="vertical" flexItem className="mx-1" />
                    
                    <Typography variant="body2" fontWeight="medium">
                      {ride.fare}
                    </Typography>
                  </Box>
                </Box>
                
                <Box className="flex flex-col items-end">
                  <Chip 
                    label={ride.status}
                    color={statusColors[ride.status] || 'default'}
                    size="small"
                    className="mb-2"
                  />
                  
                  {ride.status === 'Completed' && (
                    <Tooltip title="Ride details">
                      <IconButton size="small" className="text-blue-500">
                        <Info />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </ListItem>
              
              {index < rides.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      
      <Box className="mt-6 text-center">
        <Typography variant="body2" color="textSecondary">
          Showing {rides.length} of 12 rides
        </Typography>
      </Box>
    </div>
  );
}