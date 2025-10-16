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
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Avatar,
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
  Divider,
  CircularProgress
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
  PendingActions,
  CategoryOutlined
} from '@mui/icons-material';

import * as helpService from '../../services/helpService';

const statusColors = {
  'OPEN': '#F44336',
  'IN_PROGRESS': '#FF9800',
  'RESOLVED': '#4CAF50',
  'CLOSED': '#9E9E9E'
};

const priorityColors = {
  'HIGH': '#F44336',
  'MEDIUM': '#FF9800',
  'LOW': '#4CAF50'
};

const categoryColors = {
  'GENERAL': '#1976D2',
  'PAYMENT': '#1976D2',
  'TECHNICAL': '#7B1FA2',
  'SAFETY': '#D32F2F',
  'SERVICE': '#388E3C'
};

export default function HelpManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');

  // Fetch help requests from backend
  useEffect(() => {
    // Get token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      setToken(jwtToken);
    }
    fetchRequests();
  }, [searchTerm, filterStatus, filterPriority, filterCategory, page, rowsPerPage]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      // Pass token to the service function
      const data = await helpService.getHelpRequests(token);
      
      // Format the data to match component structure
      const formattedData = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        user: item.user?.username || 'Unknown',
        email: item.user?.email || '',
        phone: item.user?.phone || '',
        issue: item.issue,
        description: item.issue,
        category: item.category,
        priority: item.priority || 'MEDIUM',
        status: item.status,
        assignedTo: item.assignedTo || 'Unassigned',
        date: new Date(item.createdAt).toLocaleDateString(),
        lastUpdated: new Date(item.updatedAt || item.createdAt).toLocaleString(),
      })) : [];
      
      // Sort the data: resolved/closed requests go to the end
      const sortedData = [...formattedData].sort((a, b) => {
        // Both are resolved/closed - sort by date (newest first)
        if ((a.status === 'RESOLVED' || a.status === 'CLOSED') && 
            (b.status === 'RESOLVED' || b.status === 'CLOSED')) {
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        }
        // a is resolved/closed, b is not - a goes after b
        if (a.status === 'RESOLVED' || a.status === 'CLOSED') {
          return 1;
        }
        // b is resolved/closed, a is not - b goes after a
        if (b.status === 'RESOLVED' || b.status === 'CLOSED') {
          return -1;
        }
        // Neither is resolved/closed - sort by priority then date
        const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
      
      setRequests(sortedData);
    } catch (err) {
      console.error('Error fetching requests:', err);
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied. Please log in with proper permissions.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Handle search and filters
  const filteredRequests = requests.filter(request => {
    const user = request.user || '';
    const issue = request.issue || '';
    const assignedTo = request.assignedTo || '';

    const matchesSearch = user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || request.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || request.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) setFilterStatus('All');
    else if (newValue === 1) setFilterStatus('OPEN');
    else if (newValue === 2) setFilterStatus('IN_PROGRESS');
    else if (newValue === 3) setFilterStatus('RESOLVED');
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

  // Helper function to update request in the local state
  const updateRequestInState = (id, updatedData) => {
    setRequests(prevRequests => {
      const updatedRequests = prevRequests.map(request => 
        request.id === id 
          ? { ...request, ...updatedData } 
          : request
      );
      
      // Re-sort the list to ensure resolved items stay at the end
      return [...updatedRequests].sort((a, b) => {
        // Both are resolved/closed - sort by date (newest first)
        if ((a.status === 'RESOLVED' || a.status === 'CLOSED') && 
            (b.status === 'RESOLVED' || b.status === 'CLOSED')) {
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        }
        // a is resolved/closed, b is not - a goes after b
        if (a.status === 'RESOLVED' || a.status === 'CLOSED') {
          return 1;
        }
        // b is resolved/closed, a is not - b goes after a
        if (b.status === 'RESOLVED' || b.status === 'CLOSED') {
          return -1;
        }
        // Neither is resolved/closed - sort by priority then date
        const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
    });
  };

  // Handle status update
  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    setError('');
    
    // Find the current request to get its details
    const currentRequest = requests.find(r => r.id === id);
    if (!currentRequest) {
      setError('Request not found');
      setLoading(false);
      return;
    }

    // Optimistically update the UI
    const originalStatus = currentRequest.status;
    updateRequestInState(id, { status: newStatus });

    try {
      // Prepare the update payload with only the status field
      const updatePayload = {
        status: newStatus
      };

      // Pass token to the service function
      const response = await helpService.updateHelpRequest(id, updatePayload, token);
      
      // Update the local state with the response data
      if (response) {
        updateRequestInState(id, {
          status: response.status,
          priority: response.priority,
          category: response.category,
          lastUpdated: new Date(response.updatedAt || new Date()).toLocaleString()
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      // Revert the optimistic update
      updateRequestInState(id, { status: originalStatus });
      
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied. Please log in with proper permissions.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle priority update
  const updatePriority = async (id, newPriority) => {
    setLoading(true);
    setError('');
    try {
      // Find the current request to get its details
      const currentRequest = requests.find(r => r.id === id);
      if (!currentRequest) {
        throw new Error('Request not found');
      }

      // Optimistically update the UI
      const originalPriority = currentRequest.priority;
      updateRequestInState(id, { priority: newPriority });

      // Prepare the update payload with only the priority field
      const updatePayload = {
        priority: newPriority
      };

      // Pass token to the service function
      const response = await helpService.updateHelpRequest(id, updatePayload, token);
      
      // Update the local state with the response data
      if (response) {
        updateRequestInState(id, {
          priority: response.priority,
          status: response.status,
          lastUpdated: new Date(response.updatedAt || new Date()).toLocaleString()
        });
      }
    } catch (err) {
      console.error('Error updating priority:', err);
      // Revert the optimistic update
      const currentRequest = requests.find(r => r.id === id);
      if (currentRequest) {
        updateRequestInState(id, { priority: currentRequest.priority });
      }
      
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied. Please log in with proper permissions.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle category update
  const updateCategory = async (id, newCategory) => {
    setLoading(true);
    setError('');
    try {
      // Find the current request to get its details
      const currentRequest = requests.find(r => r.id === id);
      if (!currentRequest) {
        throw new Error('Request not found');
      }

      // Optimistically update the UI
      const originalCategory = currentRequest.category;
      updateRequestInState(id, { category: newCategory });

      // Prepare the update payload with only the category field
      const updatePayload = {
        category: newCategory
      };

      // Pass token to the service function
      const response = await helpService.updateHelpRequest(id, updatePayload, token);
      
      // Update the local state with the response data
      if (response) {
        updateRequestInState(id, {
          category: response.category,
          status: response.status,
          lastUpdated: new Date(response.updatedAt || new Date()).toLocaleString()
        });
      }
    } catch (err) {
      console.error('Error updating category:', err);
      // Revert the optimistic update
      const currentRequest = requests.find(r => r.id === id);
      if (currentRequest) {
        updateRequestInState(id, { category: currentRequest.category });
      }
      
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied. Please log in with proper permissions.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
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
  const handleSaveEdit = async () => {
    setLoading(true);
    setError('');
    try {
      // Prepare the update payload with only the fields that changed
      const currentRequest = requests.find(r => r.id === editForm.id);
      const updatePayload = {};
      
      if (currentRequest.status !== editForm.status) {
        updatePayload.status = editForm.status;
      }
      if (currentRequest.priority !== editForm.priority) {
        updatePayload.priority = editForm.priority;
      }
      if (currentRequest.category !== editForm.category) {
        updatePayload.category = editForm.category;
      }
      if (currentRequest.issue !== editForm.issue) {
        updatePayload.issue = editForm.issue;
      }

      // Pass token to the service function
      const response = await helpService.updateHelpRequest(editForm.id, updatePayload, token);
      
      // Update the local state with the response data
      if (response) {
        updateRequestInState(editForm.id, {
          status: response.status,
          priority: response.priority,
          category: response.category,
          issue: response.issue,
          lastUpdated: new Date(response.updatedAt || new Date()).toLocaleString()
        });
      }
      
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error saving edit:', err);
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied. Please log in with proper permissions.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form change
  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  // Handle status change from action menu
  const handleStatusChange = (newStatus) => {
    if (selectedRequest) {
      updateStatus(selectedRequest.id, newStatus);
    }
    handleMenuClose();
  };

  // Handle priority change from action menu
  const handlePriorityChange = (newPriority) => {
    if (selectedRequest) {
      updatePriority(selectedRequest.id, newPriority);
    }
    handleMenuClose();
  };

  // Handle category change from action menu
  const handleCategoryChange = (newCategory) => {
    if (selectedRequest) {
      updateCategory(selectedRequest.id, newCategory);
    }
    handleMenuClose();
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {loading && <Box className="mb-4"><CircularProgress /></Box>}
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      
      {/* Header */}
      <Box className="mb-6 md:mb-8">
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
                    {requests.filter(r => r.status === 'OPEN').length}
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
                    {requests.filter(r => r.status === 'IN_PROGRESS').length}
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
                    {requests.filter(r => r.status === 'RESOLVED').length}
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
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
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
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
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
                <MenuItem value="GENERAL">General</MenuItem>
                <MenuItem value="PAYMENT">Payment</MenuItem>
                <MenuItem value="TECHNICAL">Technical</MenuItem>
                <MenuItem value="SAFETY">Safety</MenuItem>
                <MenuItem value="SERVICE">Service</MenuItem>
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
          variant="scrollable"
          scrollButtons="auto"
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
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Category</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Assigned To</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={request.id} hover className="transition-colors">
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} className="font-medium">#{request.id}</TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${request.id}`} />
                        <div>
                          <Typography variant="body2" className="font-medium">
                            {request.user}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500 hidden sm:block">
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
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        label={request.category}
                        size="small"
                        variant="outlined"
                        style={{
                          borderColor: categoryColors[request.category] || '#1976D2',
                          color: categoryColors[request.category] || '#1976D2',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        label={request.priority}
                        size="small"
                        style={{
                          backgroundColor: `${priorityColors[request.priority] || '#FF9800'}20`,
                          color: priorityColors[request.priority] || '#FF9800',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        size="small"
                        style={{
                          backgroundColor: `${statusColors[request.status] || '#9E9E9E'}20`,
                          color: statusColors[request.status] || '#9E9E9E',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{request.assignedTo}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{request.date}</TableCell>
                    <TableCell>
                      <Box className="flex gap-1">
                        <Button
                          size="small"
                          variant="contained"
                          color={request.status === 'OPEN' ? 'success' : 'primary'}
                          onClick={() => updateStatus(request.id, 'RESOLVED')}
                          disabled={request.status === 'RESOLVED'}
                          className="text-xs"
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          {request.status === 'OPEN' ? 'Resolve' : 'Resolved'}
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
        <MenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
          <AccessTime className="mr-2" fontSize="small" />
          Mark In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('RESOLVED')}>
          <CheckCircle className="mr-2" fontSize="small" />
          Mark Resolved
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('CLOSED')}>
          <Cancel className="mr-2" fontSize="small" />
          Close Request
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handlePriorityChange('HIGH')}>
          <Star className="mr-2" fontSize="small" />
          Set High Priority
        </MenuItem>
        <MenuItem onClick={() => handlePriorityChange('MEDIUM')}>
          <Star className="mr-2" fontSize="small" />
          Set Medium Priority
        </MenuItem>
        <MenuItem onClick={() => handlePriorityChange('LOW')}>
          <Star className="mr-2" fontSize="small" />
          Set Low Priority
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleCategoryChange('GENERAL')}>
          <CategoryOutlined className="mr-2" fontSize="small" />
          Set to General
        </MenuItem>
        <MenuItem onClick={() => handleCategoryChange('PAYMENT')}>
          <CategoryOutlined className="mr-2" fontSize="small" />
          Set to Payment
        </MenuItem>
        <MenuItem onClick={() => handleCategoryChange('TECHNICAL')}>
          <CategoryOutlined className="mr-2" fontSize="small" />
          Set to Technical
        </MenuItem>
        <MenuItem onClick={() => handleCategoryChange('SAFETY')}>
          <CategoryOutlined className="mr-2" fontSize="small" />
          Set to Safety
        </MenuItem>
        <MenuItem onClick={() => handleCategoryChange('SERVICE')}>
          <CategoryOutlined className="mr-2" fontSize="small" />
          Set to Service
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
                <Typography variant="body1" className="font-medium">{selectedRequest.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="text-gray-500">Status</Typography>
                <Chip
                  label={selectedRequest.status}
                  size="small"
                  style={{
                    backgroundColor: `${statusColors[selectedRequest.status] || '#9E9E9E'}20`,
                    color: statusColors[selectedRequest.status] || '#9E9E9E',
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
                    borderColor: categoryColors[selectedRequest.category] || '#1976D2',
                    color: categoryColors[selectedRequest.category] || '#1976D2',
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
                    backgroundColor: `${priorityColors[selectedRequest.priority] || '#FF9800'}20`,
                    color: priorityColors[selectedRequest.priority] || '#FF9800',
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
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
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
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
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
                  <MenuItem value="GENERAL">General</MenuItem>
                  <MenuItem value="PAYMENT">Payment</MenuItem>
                  <MenuItem value="TECHNICAL">Technical</MenuItem>
                  <MenuItem value="SAFETY">Safety</MenuItem>
                  <MenuItem value="SERVICE">Service</MenuItem>
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