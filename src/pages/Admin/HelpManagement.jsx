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
  Badge,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  MoreVert, 
  Visibility, 
  Edit, 
  CheckCircle,
  Cancel,
  Mail,
  Phone,
  Person,
  Assignment,
  Star,
  TrendingUp,
  AccessTime,
  DoneAll,
  PendingActions
} from '@mui/icons-material';

// Sample data
const helpRequests = [
  { 
    id: 1, 
    user: 'John Doe', 
    email: 'john@example.com', 
    phone: '+91 9876543210',
    issue: 'Payment failed during ride booking', 
    status: 'Open',
    priority: 'High',
    category: 'Payment',
    date: '2023-06-15',
    assignedTo: 'Support Team',
    description: 'I tried to book a ride but the payment failed. Money was deducted from my account but no booking confirmation received.',
    lastUpdated: '2023-06-15 14:30'
  },
  { 
    id: 2, 
    user: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '+91 8765432109',
    issue: 'Ride not found in history', 
    status: 'Resolved',
    priority: 'Medium',
    category: 'Technical',
    date: '2023-06-14',
    assignedTo: 'Alex Johnson',
    description: 'Completed a ride yesterday but it\'s not showing in my ride history.',
    lastUpdated: '2023-06-14 16:45'
  },
  { 
    id: 3, 
    user: 'Robert Brown', 
    email: 'robert@example.com', 
    phone: '+91 7654321098',
    issue: 'Driver behavior complaint', 
    status: 'In Progress',
    priority: 'High',
    category: 'Safety',
    date: '2023-06-13',
    assignedTo: 'Sarah Williams',
    description: 'The driver was driving recklessly and using phone while driving. Felt unsafe during the entire journey.',
    lastUpdated: '2023-06-15 10:20'
  },
  { 
    id: 4, 
    user: 'Emily Davis', 
    email: 'emily@example.com', 
    phone: '+91 6543210987',
    issue: 'Refund not processed', 
    status: 'Open',
    priority: 'Medium',
    category: 'Payment',
    date: '2023-06-12',
    assignedTo: 'Support Team',
    description: 'Cancelled a ride due to long waiting time but refund hasn\'t been processed yet.',
    lastUpdated: '2023-06-12 09:15'
  },
  { 
    id: 5, 
    user: 'Michael Wilson', 
    email: 'michael@example.com', 
    phone: '+91 5432109876',
    issue: 'App login issue', 
    status: 'Resolved',
    priority: 'Low',
    category: 'Technical',
    date: '2023-06-11',
    assignedTo: 'Tech Team',
    description: 'Unable to login to the app. Keeps showing invalid credentials error.',
    lastUpdated: '2023-06-11 13:25'
  }
];

const statusColors = {
  'Open': '#F44336',
  'In Progress': '#FF9800',
  'Resolved': '#4CAF50',
  'Closed': '#9E9E9E'
};

const priorityColors = {
  'High': '#F44336',
  'Medium': '#FF9800',
  'Low': '#4CAF50'
};

const categoryColors = {
  'Payment': '#1976D2',
  'Technical': '#7B1FA2',
  'Safety': '#D32F2F',
  'Service': '#388E3C'
};

export default function HelpManagement() {
  const [requests, setRequests] = useState(helpRequests);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Handle search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || request.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || request.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) setFilterStatus('All');
    else if (newValue === 1) setFilterStatus('Open');
    else if (newValue === 2) setFilterStatus('In Progress');
    else if (newValue === 3) setFilterStatus('Resolved');
  };

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
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus, lastUpdated: new Date().toLocaleString() } : req
    ));
  };

  // Handle menu open
  const handleMenuClick = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  // Handle view request
  const handleView = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  // Handle edit request
  const handleEdit = () => {
    setEditForm(selectedRequest);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  // Handle save edit
  const handleSaveEdit = () => {
    setRequests(requests.map(req => 
      req.id === editForm.id ? { ...editForm, lastUpdated: new Date().toLocaleString() } : req
    ));
    setEditDialogOpen(false);
  };

  // Handle edit form change
  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Help Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage and resolve customer support requests
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="h-full border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-gray-800">Open</Typography>
                  <Typography variant="h4" className="font-bold text-red-500">
                    {requests.filter(r => r.status === 'Open').length}
                  </Typography>
                </Box>
                <PendingActions className="text-red-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="h-full border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-gray-800">In Progress</Typography>
                  <Typography variant="h4" className="font-bold text-orange-500">
                    {requests.filter(r => r.status === 'In Progress').length}
                  </Typography>
                </Box>
                <AccessTime className="text-orange-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="h-full border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-gray-800">Resolved</Typography>
                  <Typography variant="h4" className="font-bold text-green-500">
                    {requests.filter(r => r.status === 'Resolved').length}
                  </Typography>
                </Box>
                <DoneAll className="text-green-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="h-full border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-gray-800">Total</Typography>
                  <Typography variant="h4" className="font-bold text-blue-500">
                    {requests.length}
                  </Typography>
                </Box>
                <Assignment className="text-blue-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card className="mb-6 shadow-md">
        <CardContent>
          <Box className="flex flex-col md:flex-row gap-4 mb-4">
            <TextField
              placeholder="Search requests..."
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
            <Box className="flex gap-2 flex-wrap">
              <TextField
                select
                label="Status"
                variant="outlined"
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-36"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
              <TextField
                select
                label="Priority"
                variant="outlined"
                size="small"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-36"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
              <TextField
                select
                label="Category"
                variant="outlined"
                size="small"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-36"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
              </TextField>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="mb-6 shadow-md">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Requests" />
          <Tab label="Open" />
          <Tab label="In Progress" />
          <Tab label="Resolved" />
        </Tabs>
      </Card>

      {/* Table */}
      <Card className="shadow-lg overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                <TableRow key={request.id} hover className="transition-colors">
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${request.id}`} />
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {request.user}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {request.email}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Typography variant="body2" className="truncate">
                      {request.issue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.category} 
                      size="small" 
                      variant="outlined"
                      style={{ 
                        borderColor: categoryColors[request.category],
                        color: categoryColors[request.category],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.priority}
                      size="small"
                      style={{ 
                        backgroundColor: `${priorityColors[request.priority]}20`,
                        color: priorityColors[request.priority],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status}
                      size="small"
                      style={{ 
                        backgroundColor: `${statusColors[request.status]}20`,
                        color: statusColors[request.status],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>{request.assignedTo}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Box className="flex gap-1">
                      <Button 
                        size="small" 
                        variant="contained"
                        color={request.status === 'Open' ? 'success' : 'primary'}
                        onClick={() => updateStatus(request.id, 'Resolved')}
                        disabled={request.status === 'Resolved'}
                        className="text-xs"
                      >
                        {request.status === 'Open' ? 'Resolve' : 'Resolved'}
                      </Button>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuClick(e, request)}
                        className="text-gray-500 hover:text-gray-700"
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
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t border-gray-200"
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <Visibility className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit className="mr-2" fontSize="small" />
          Edit Request
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          updateStatus(selectedRequest.id, 'In Progress');
          handleMenuClose();
        }}>
          <AccessTime className="mr-2" fontSize="small" />
          Mark In Progress
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRequest.id, 'Resolved');
          handleMenuClose();
        }}>
          <CheckCircle className="mr-2" fontSize="small" />
          Mark Resolved
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRequest.id, 'Closed');
          handleMenuClose();
        }}>
          <Cancel className="mr-2" fontSize="small" />
          Close Request
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Mail className="mr-2" fontSize="small" />
          Email User
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Phone className="mr-2" fontSize="small" />
          Call User
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <Typography variant="h6" className="font-bold text-gray-800">
            Request Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Request ID</Typography>
                <Typography variant="body1" className="font-medium">#{selectedRequest.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Status</Typography>
                <Chip 
                  label={selectedRequest.status}
                  size="small"
                  style={{ 
                    backgroundColor: `${statusColors[selectedRequest.status]}20`,
                    color: statusColors[selectedRequest.status],
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">User</Typography>
                <Box className="flex items-center">
                  <Avatar className="mr-2" src={`https://i.pravatar.cc/150?u=${selectedRequest.id}`} />
                  <Typography variant="body1" className="font-medium">
                    {selectedRequest.user}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Contact</Typography>
                <Typography variant="body1">{selectedRequest.email}</Typography>
                <Typography variant="body2">{selectedRequest.phone}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Category</Typography>
                <Chip 
                  label={selectedRequest.category}
                  size="small"
                  variant="outlined"
                  style={{ 
                    borderColor: categoryColors[selectedRequest.category],
                    color: categoryColors[selectedRequest.category],
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Priority</Typography>
                <Chip 
                  label={selectedRequest.priority}
                  size="small"
                  style={{ 
                    backgroundColor: `${priorityColors[selectedRequest.priority]}20`,
                    color: priorityColors[selectedRequest.priority],
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Assigned To</Typography>
                <Typography variant="body1">{selectedRequest.assignedTo}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Date</Typography>
                <Typography variant="body1">{selectedRequest.date}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" className="text-gray-500">Description</Typography>
                <Typography variant="body1" className="whitespace-pre-line">
                  {selectedRequest.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" className="text-gray-500">Last Updated</Typography>
                <Typography variant="body1">{selectedRequest.lastUpdated}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <Typography variant="h6" className="font-bold text-gray-800">
            Edit Request
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {editForm && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Status</Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={editForm.status}
                  onChange={(e) => handleEditChange('status', e.target.value)}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Priority</Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={editForm.priority}
                  onChange={(e) => handleEditChange('priority', e.target.value)}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Category</Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={editForm.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                >
                  <MenuItem value="Payment">Payment</MenuItem>
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Assigned To</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editForm.assignedTo}
                  onChange={(e) => handleEditChange('assignedTo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" className="text-gray-500">Description</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  value={editForm.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}