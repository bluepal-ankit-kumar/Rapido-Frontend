import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  Avatar,
  Rating,
  Divider,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Star, 
  Send, 
  MoreVert, 
  Person, 
  CalendarToday,
  ThumbUp,
  ThumbDown,
  Delete
} from '@mui/icons-material';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const initialRatings = [
  { 
    id: 1, 
    rating: 5, 
    comment: 'Great ride! The driver was very professional and arrived on time.', 
    date: '2023-06-15',
    driver: 'Rahul Kumar',
    helpful: 12
  },
  { 
    id: 2, 
    rating: 4, 
    comment: 'Smooth experience. Would definitely book again.', 
    date: '2023-06-10',
    driver: 'Vikram Singh',
    helpful: 8
  },
];

export default function RatingPage() {
  const [ratings, setRatings] = useState(initialRatings);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setRatings([...ratings, { 
        id: ratings.length + 1, 
        rating, 
        comment,
        date: new Date().toLocaleDateString(),
        driver: 'Recent Driver',
        helpful: 0
      }]);
      setRating(0);
      setComment('');
      setError('');
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 500);
  };

  const handleMenuClick = (event, rating) => {
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  const handleHelpful = (id) => {
    setRatings(ratings.map(r => 
      r.id === id ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  const handleDelete = (id) => {
    setRatings(ratings.filter(r => r.id !== id));
    handleMenuClose();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onSidebarToggle={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <Box className="mb-8">
              <Typography variant="h4" className="font-bold text-gray-800">Rate Your Experience</Typography>
              <Typography variant="body1" className="text-gray-600">Share your feedback to help us improve our service</Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Rating Form */}
              <Grid item xs={12} md={5}>
                <Card className="shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <Typography variant="h6" className="font-bold text-gray-800 mb-4">Submit Your Rating</Typography>
                    
                    {success && (
                      <Alert severity="success" className="mb-4">
                        Thank you for your feedback!
                      </Alert>
                    )}
                    
                    <Box className="mb-4">
                      <Typography variant="body2" className="text-gray-600 mb-2">How was your ride?</Typography>
                      <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                        size="large"
                        className="text-yellow-500"
                      />
                    </Box>
                    
                    <TextField
                      label="Your Comment"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={4}
                      error={!!error}
                      helperText={error}
                    />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={handleSubmit}
                      startIcon={<Send />}
                    >
                      Submit Rating
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Ratings List */}
              <Grid item xs={12} md={7}>
                <Card className="shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <Typography variant="h6" className="font-bold text-gray-800 mb-4">Your Rating</Typography>
                    
                    {ratings.length === 0 ? (
                      <Box className="text-center py-8">
                        <Star className="text-gray-300" fontSize="large" />
                        <Typography variant="body1" className="text-gray-500 mt-2">No ratings yet</Typography>
                        <Typography variant="body2" className="text-gray-400">Submit your first rating using the form</Typography>
                      </Box>
                    ) : (
                      <List className="space-y-3">
                        {ratings.map((r) => (
                          <React.Fragment key={r.id}>
                            <Paper className="p-4">
                              <Box className="flex justify-between items-start">
                                <Box className="flex items-start">
                                  <Avatar className="mr-3">
                                    <Person />
                                  </Avatar>
                                  <Box>
                                    <Box className="flex items-center mb-1">
                                      <Rating 
                                        value={r.rating} 
                                        readOnly 
                                        size="small" 
                                        className="text-yellow-500"
                                      />
                                      <Chip 
                                        label={`${r.rating}/5`} 
                                        size="small" 
                                        className="ml-2"
                                        style={{ backgroundColor: '#FFF8E1' }}
                                      />
                                    </Box>
                                    <Typography variant="body2" className="text-gray-800">
                                      {r.comment}
                                    </Typography>
                                    <Box className="flex items-center mt-2 text-gray-500">
                                      <CalendarToday className="mr-1" fontSize="small" />
                                      <Typography variant="caption">{r.date}</Typography>
                                      <Typography variant="caption" className="mx-2">•</Typography>
                                      <Typography variant="caption">Driver: {r.driver}</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => handleMenuClick(e, r)}
                                >
                                  <MoreVert />
                                </IconButton>
                              </Box>
                              
                              <Box className="flex justify-end mt-3">
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  startIcon={<ThumbUp />}
                                  onClick={() => handleHelpful(r.id)}
                                >
                                  Helpful ({r.helpful})
                                </Button>
                              </Box>
                            </Paper>
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </main>
      </div>
  <Footer sidebarOpen={sidebarOpen} />
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ThumbUp className="mr-2" fontSize="small" />
          Mark as Helpful
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedRating.id)}>
          <Delete className="mr-2" fontSize="small" />
          Delete Rating
        </MenuItem>
      </Menu>
    </div>
  );
}