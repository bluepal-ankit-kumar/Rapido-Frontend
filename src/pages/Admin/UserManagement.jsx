import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button,
  Chip, Box, TextField, InputAdornment, IconButton, Menu, MenuItem, TablePagination, Avatar,
  Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select
} from '@mui/material';
import { 
  Search, FilterList, MoreVert, Visibility, Edit, Delete, PersonAdd, Block, CheckCircle,
  Email, Phone, CalendarToday, AdminPanelSettings, Person, TwoWheeler
} from '@mui/icons-material';
import { mockUsers } from '../../data/mockData';

// ...existing code...

const statusColors = { 'Active': '#4CAF50', 'Inactive': '#F44336', 'Pending': '#FF9800', 'Suspended': '#9E9E9E' };
const roleIcons = { 'Customer': <Person className="text-blue-500" />, 'Rider': <TwoWheeler className="text-yellow-500" />, 'Admin': <AdminPanelSettings className="text-purple-500" /> };
const roleColors = { 'Customer': '#2196F3', 'Rider': '#FFC107', 'Admin': '#9C27B0' };

export default function UserManagement() {
  const [usersData, setUsersData] = useState(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Customer', status: 'Active' });

  // Calculate statistics
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(u => u.status === 'Active').length;
  const riderUsers = usersData.filter(u => u.role === 'Rider').length;
  const customerUsers = usersData.filter(u => u.role === 'Customer').length;

  // Filter users based on search and filters
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.phone || '').includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handle page change
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Menu actions
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // User actions
  const handleView = () => handleMenuClose();
  
  const handleEdit = () => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
        status: selectedUser.status
      });
      setEditMode(true);
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setUsersData(usersData.filter(u => u.id !== selectedUser.id));
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    const newStatus = selectedUser.status === 'Active' ? 'Inactive' : 'Active';
    setUsersData(usersData.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
    handleMenuClose();
  };

  // Add user
  const handleAddUser = () => {
    setFormData({ name: '', email: '', phone: '', role: 'Customer', status: 'Active' });
    setEditMode(false);
    setOpenDialog(true);
  };

  // Dialog actions
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editMode && selectedUser) {
      setUsersData(usersData.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser = {
        id: usersData.length + 1,
        ...formData,
        lastLogin: 'Never',
        registeredDate: new Date().toISOString().split('T')[0],
        totalRides: 0,
        totalSpent: 0
      };
      setUsersData([...usersData, newUser]);
    }
    handleDialogClose();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6 flex justify-between items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">User Management</Typography>
          <Typography variant="body1" className="text-gray-600">Manage all users in the system</Typography>
        </div>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={handleAddUser} className="bg-yellow-500 hover:bg-yellow-600">
          Add User
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-blue-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Total Users</Typography>
              <Typography variant="h4" className="font-bold text-blue-500">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-green-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Active Users</Typography>
              <Typography variant="h4" className="font-bold text-green-500">{activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Riders</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">{riderUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-purple-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Customers</Typography>
              <Typography variant="h4" className="font-bold text-purple-500">{customerUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
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
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
          <TextField
            select
            label="Role"
            variant="outlined"
            size="small"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-32"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Rider">Rider</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
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
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell className="font-medium">#{user.id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Avatar className="mr-3" src={`https://i.pravatar.cc/150?u=${user.id}`} />
                      <div>
                        <Typography variant="body2" className="font-medium">{user.name}</Typography>
                        <Typography variant="caption" className="text-gray-500">{user.email}</Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex flex-col">
                      <Box className="flex items-center">
                        <Phone className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{user.phone}</Typography>
                      </Box>
                      <Box className="flex items-center">
                        <Email className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      {roleIcons[user.role]}
                      <Chip label={user.role} size="small" style={{ 
                        backgroundColor: `${roleColors[user.role]}20`,
                        color: roleColors[user.role],
                        fontWeight: 'bold',
                        marginLeft: '8px'
                      }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status} size="small" style={{ 
                      backgroundColor: `${statusColors[user.status]}20`,
                      color: statusColors[user.status],
                      fontWeight: 'bold'
                    }} />
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{user.lastLogin}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex flex-col">
                      <Typography variant="body2"><span className="font-medium">{user.totalRides}</span> rides</Typography>
                      <Typography variant="body2"><span className="font-medium">₹{user.totalSpent}</span> spent</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-1">
                      <Button size="small" variant="outlined" startIcon={<Visibility />}>View</Button>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, user)}>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}><Visibility className="mr-2" fontSize="small" />View Details</MenuItem>
        <MenuItem onClick={handleEdit}><Edit className="mr-2" fontSize="small" />Edit User</MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedUser && selectedUser.status === 'Active' ? (
            <><Block className="mr-2" fontSize="small" />Deactivate User</>
          ) : (
            <><CheckCircle className="mr-2" fontSize="small" />Activate User</>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete}><Delete className="mr-2" fontSize="small" />Delete User</MenuItem>
      </Menu>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box className="mt-2" component="form">
            <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name" value={formData.name} onChange={handleFormChange} />
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" type="email" value={formData.email} onChange={handleFormChange} />
            <TextField margin="normal" required fullWidth id="phone" label="Phone Number" name="phone" value={formData.phone} onChange={handleFormChange} />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select labelId="role-label" id="role" name="role" value={formData.role} onChange={handleFormChange} label="Role">
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Rider">Rider</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select labelId="status-label" id="status" name="status" value={formData.status} onChange={handleFormChange} label="Status">
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" className="bg-yellow-500 hover:bg-yellow-600">
            {editMode ? 'Update' : 'Add'} User
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}