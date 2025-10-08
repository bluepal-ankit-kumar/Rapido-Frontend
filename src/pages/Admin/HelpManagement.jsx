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
  Badge
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
  Person
} from '@mui/icons-material';

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
    assignedTo: 'Support Team'
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
    assignedTo: 'Alex Johnson'
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
    assignedTo: 'Sarah Williams'
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
    assignedTo: 'Support Team'
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
    assignedTo: 'Tech Team'
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

export default function HelpManagement() {
  const [requests, setRequests] = useState(helpRequests);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Handle search
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
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

  // Handle status update
  const updateStatus = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
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
    // Implement view functionality
    handleMenuClose();
  };

  // Handle edit request
  const handleEdit = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Help Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage and resolve customer support requests
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
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
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
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

      {/* Stats Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Paper className="p-4 border-l-4 border-red-500">
          <Typography variant="h6" className="text-gray-800">Open</Typography>
          <Typography variant="h4" className="font-bold text-red-500">
            {requests.filter(r => r.status === 'Open').length}
          </Typography>
        </Paper>
        <Paper className="p-4 border-l-4 border-orange-500">
          <Typography variant="h6" className="text-gray-800">In Progress</Typography>
          <Typography variant="h4" className="font-bold text-orange-500">
            {requests.filter(r => r.status === 'In Progress').length}
          </Typography>
        </Paper>
        <Paper className="p-4 border-l-4 border-green-500">
          <Typography variant="h6" className="text-gray-800">Resolved</Typography>
          <Typography variant="h4" className="font-bold text-green-500">
            {requests.filter(r => r.status === 'Resolved').length}
          </Typography>
        </Paper>
        <Paper className="p-4 border-l-4 border-gray-500">
          <Typography variant="h6" className="text-gray-800">Total</Typography>
          <Typography variant="h4" className="font-bold text-gray-700">
            {requests.length}
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      <Paper className="overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Issues</TableCell>
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
                <TableRow key={request.id} hover>
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-2" src={`https://i.pravatar.cc/150?u=${request.id}`} />
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
                      className="text-xs"
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
                      >
                        {request.status === 'Open' ? 'Resolve' : 'Resolved'}
                      </Button>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuClick(e, request)}
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
          Edit Request
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRequest.id, 'In Progress');
          handleMenuClose();
        }}>
          <CheckCircle className="mr-2" fontSize="small" />
          Mark In Progress
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus(selectedRequest.id, 'Closed');
          handleMenuClose();
        }}>
          <Cancel className="mr-2" fontSize="small" />
          Close Request
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Mail className="mr-2" fontSize="small" />
          Email User
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Phone className="mr-2" fontSize="small" />
          Call User
        </MenuItem>
      </Menu>
    </div>
  );
}