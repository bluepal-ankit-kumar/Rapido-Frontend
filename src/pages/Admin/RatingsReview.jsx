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
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  MoreVert, 
  Star, 
  StarBorder,
  Visibility,
  Publish,
  Delete,
  Person,
  CalendarToday,
  DirectionsBike,
  Block
} from '@mui/icons-material';

const ratings = [
  { 
    id: 1, 
    user: 'John Doe', 
    email: 'john@example.com',
    rating: 5, 
    comment: 'Great ride! The driver was very professional and arrived on time.', 
    status: 'Published',
    date: '2023-06-15',
    rideId: 'RID-2023-001',
    driver: 'Rahul Kumar'
  },
  { 
    id: 2, 
    user: 'Jane Smith', 
    email: 'jane@example.com',
    rating: 2, 
    comment: 'Driver was late and the vehicle was not clean.', 
    status: 'Pending',
    date: '2023-06-14',
    rideId: 'RID-2023-002',
    driver: 'Vikram Singh'
  },
  { 
    id: 3, 
    user: 'Robert Brown', 
    email: 'robert@example.com',
    rating: 4, 
    comment: 'Good experience overall. Would recommend.', 
    status: 'Published',
    date: '2023-06-13',
    rideId: 'RID-2023-003',
    driver: 'Amit Sharma'
  },
  { 
    id: 4, 
    user: 'Emily Davis', 
    email: 'emily@example.com',
    rating: 1, 
    comment: 'Terrible service. Driver was rude and took a longer route.', 
    status: 'Rejected',
    date: '2023-06-12',
    rideId: 'RID-2023-004',
    driver: 'Sanjay Patel'
  },
  { 
    id: 5, 
    user: 'Michael Wilson', 
    email: 'michael@example.com',
    rating: 3, 
    comment: 'Average experience. Nothing special.', 
    status: 'Published',
    date: '2023-06-11',
    rideId: 'RID-2023-005',
    driver: 'Rajesh Kumar'
  }
];

const statusColors = {
  'Published': '#4CAF50',
  'Pending': '#FF9800',
  'Rejected': '#F44336',
  'Draft': '#9E9E9E'
};

export default function RatingsReview() {
  const [ratingsData, setRatingsData] = useState(ratings);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  // Calculate statistics
  const averageRating = ratingsData.reduce((sum, rating) => sum + rating.rating, 0) / ratingsData.length;
  const totalRatings = ratingsData.length;
  const publishedRatings = ratingsData.filter(r => r.status === 'Published').length;
  const pendingRatings = ratingsData.filter(r => r.status === 'Pending').length;

  // Handle search and filters
  const filteredRatings = ratingsData.filter(rating => {
    const matchesSearch = rating.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || rating.status === filterStatus;
    const matchesRating = filterRating === 'All' || rating.rating.toString() === filterRating;
    return matchesSearch && matchesStatus && matchesRating;
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
    setRatingsData(ratingsData.map(rating => 
      rating.id === id ? { ...rating, status: newStatus } : rating
    ));
  };

  // Handle menu open
  const handleMenuClick = (event, rating) => {
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  // Handle view rating
  const handleView = () => {
    // Implement view functionality
    handleMenuClose();
  };

  // Handle delete rating
  const handleDelete = () => {
    setRatingsData(ratingsData.filter(r => r.id !== selectedRating.id));
    handleMenuClose();
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <Box className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <Star key={star} className="text-yellow-500" fontSize="small" />
          ) : (
            <StarBorder key={star} className="text-yellow-500" fontSize="small" />
          )
        ))}
      </Box>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Ratings & Reviews
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage and moderate customer ratings and reviews
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Average Rating</Typography>
              <Box className="flex items-center">
                <Typography variant="h4" className="font-bold text-yellow-500 mr-2">
                  {averageRating.toFixed(1)}
                </Typography>
                {renderStars(Math.round(averageRating))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Total Reviews</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {totalRatings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Published</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {publishedRatings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Pending</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">
                {pendingRatings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search reviews..."
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
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
          </TextField>
          <TextField
            select
            label="Rating"
            variant="outlined"
            size="small"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-32"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
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
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRatings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rating) => (
                <TableRow key={rating.id} hover>
                  <TableCell className="font-medium">#{rating.id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-2" src={`https://i.pravatar.cc/150?u=${rating.id}`} />
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {rating.user}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {rating.email}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <DirectionsBike className="text-yellow-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{rating.driver}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      {renderStars(rating.rating)}
                      <Typography variant="body2" className="ml-1 font-medium">
                        {rating.rating}.0
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Tooltip title={rating.comment}>
                      <Typography variant="body2" className="truncate">
                        {rating.comment}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{rating.date}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rating.status}
                      size="small"
                      style={{ 
                        backgroundColor: `${statusColors[rating.status]}20`,
                        color: statusColors[rating.status],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-1">
                      {rating.status === 'Pending' && (
                        <Button 
                          size="small" 
                          variant="contained"
                          color="success"
                          onClick={() => updateStatus(rating.id, 'Published')}
                        >
                          Publish
                        </Button>
                      )}
                      {rating.status === 'Published' && (
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="warning"
                          onClick={() => updateStatus(rating.id, 'Pending')}
                        >
                          Unpublish
                        </Button>
                      )}
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuClick(e, rating)}
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
          count={filteredRatings.length}
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
        <MenuItem onClick={() => {
          updateStatus(selectedRating.id, 'Published');
          handleMenuClose();
        }}>
          <Publish className="mr-2" fontSize="small" />
          Publish Review
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRating.id, 'Pending');
          handleMenuClose();
        }}>
          <Block className="mr-2" fontSize="small" />
          Unpublish Review
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRating.id, 'Rejected');
          handleMenuClose();
        }}>
          <Delete className="mr-2" fontSize="small" />
          Reject Review
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <Delete className="mr-2" fontSize="small" />
          Delete Permanently
        </MenuItem>
      </Menu>
    </div>
  );
}