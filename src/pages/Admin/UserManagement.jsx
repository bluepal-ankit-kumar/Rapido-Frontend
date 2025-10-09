import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button,
  Chip, Box, TextField, InputAdornment, IconButton, Menu, MenuItem, TablePagination, Avatar,
  Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  CircularProgress, Alert
} from '@mui/material';
import { 
  Search, FilterList, MoreVert, Visibility, Edit, Delete, PersonAdd, Block, CheckCircle,
  Email, Phone, CalendarToday, AdminPanelSettings, Person, TwoWheeler
} from '@mui/icons-material';
import { GetApp } from '@mui/icons-material';
// import UserService if needed

import UserService from '../../services/UserService';
// ...existing code...

const statusColors = { 'Active': '#4CAF50', 'Inactive': '#F44336', 'Pending': '#FF9800', 'Suspended': '#9E9E9E' };
const roleIcons = { 'Customer': <Person className="text-blue-500" />, 'Rider': <TwoWheeler className="text-yellow-500" />, 'Admin': <AdminPanelSettings className="text-purple-500" /> };
const roleColors = { 'Customer': '#2196F3', 'Rider': '#FFC107', 'Admin': '#9C27B0' };

export default function UserManagement() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      setLoading(true);
      setFetchError('');
      try {
        const res = await UserService.getAllUsers(0, 1000);
        // Normalize response into an array of users regardless of backend shape
        const payload = res && res.data !== undefined ? res.data : res;
        // Debug log to help track payload shapes
        console.debug('UserService.getAllUsers payload:', payload);

        let usersArray = [];
        if (Array.isArray(payload)) {
          usersArray = payload;
        } else if (payload && Array.isArray(payload.data)) {
          usersArray = payload.data;
        } else if (payload && payload.data && Array.isArray(payload.data.content)) {
          // Handle paginated response: { success, message, data: { content: [...], ... } }
          usersArray = payload.data.content;
          console.debug('Normalized users from payload.data.content, count=', usersArray.length);
        } else if (payload && Array.isArray(payload.users)) {
          usersArray = payload.users;
        } else if (payload && Array.isArray(payload.items)) {
          usersArray = payload.items;
        } else {
          // If payload contains a single user object, wrap it into array
          if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
            // no obvious array found - log and fallback to empty
            console.warn('UserService.getAllUsers returned unexpected payload format, defaulting to empty list', payload);
          }
          usersArray = [];
        }

        if (mounted) setUsersData(usersArray);
      } catch (err) {
        console.error('Failed to fetch users for admin user management:', err);
        setFetchError(err.message || 'Failed to load users');
        // keep usersData as empty array
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUsers();
    return () => { mounted = false; };
  }, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Customer', status: 'Active' });

  // Keep only customers in this view
  const customers = usersData.filter(u => (u.userType || u.role || '').toString().toUpperCase() === 'CUSTOMER');
  const totalUsers = customers.length;
  const activeUsers = customers.filter(u => (u.status || '').toString().toLowerCase() === 'active').length;
  const riderUsers = usersData.filter(u => (u.userType || u.role || '').toString().toUpperCase() === 'RIDER').length;
  const customerUsers = customers.length;

  // Filter users based on search and filters
  // Work on customers array only
  const filteredUsers = customers.filter(user => {
    const name = (user.fullName || user.username || '').toString();
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (user.email || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone || '').toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || (user.status || '').toString() === filterStatus;
    const matchesRole = filterRole === 'All' || (user.userType || user.role || '').toString() === filterRole;
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

  // Immediately opens confirmation for deletion
  const handleDelete = () => {
    if (selectedUser) {
      setConfirmDeleteOpen(true);
    }
  };

  // Perform deletion (call backend)
  const performDelete = async () => {
    if (!selectedUser || !selectedUser.id) {
      setDeleteError('Invalid user selected');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await UserService.deleteUser(selectedUser.id);
      // remove from local state
      setUsersData(prev => prev.filter(u => u.id !== selectedUser.id));
      setConfirmDeleteOpen(false);
      setSelectedUser(null);
      // close menu if open
      setAnchorEl(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
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

  // PDF preview & download animation
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [animatingDownload, setAnimatingDownload] = useState(false);

  const openPdfPreviewFor = async (userType = '') => {
    setPreviewLoading(true);
    try {
      const res = await UserService.downloadUsersPdf(userType);
      // res.data is a blob
      const blob = new Blob([res.data], { type: res.headers?.['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      // small animation to indicate download
      setAnimatingDownload(true);
      setTimeout(() => setAnimatingDownload(false), 1400);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const savePreviewToDisk = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `users-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      )}
      {!loading && fetchError && (
        <Box sx={{ mb: 2 }}><Alert severity="error">{fetchError}</Alert></Box>
      )}
      {/* Header */}
      <Box className="mb-6 flex justify-between items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">User Management</Typography>
          {/* <Typography variant="body1" className="text-gray-600">Manage all users in the system</Typography> */}
        </div>
        <Button variant="contained" startIcon={<GetApp />} onClick={() => openPdfPreviewFor('CUSTOMER')} className="bg-yellow-500 hover:bg-yellow-600">
          Download PDF
        </Button>
      </Box>

      {/* Statistics Cards */}
      {/* <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Total Users</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Active User</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">{activeUsers}</Typography>
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
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <Typography variant="h6" className="text-gray-600">Customers</Typography>
              <Typography variant="h4" className="font-bold text-yellow-500">{customerUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      

      {/* Table */}
      <Paper className="overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Emali</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell>Created On</TableCell>
                {/* <TableCell>Activity</TableCell> */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, idx) => (
                <TableRow key={user.id || idx} hover>
                  <TableCell className="font-medium">{page * rowsPerPage + idx + 1}.</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                        <Typography variant="body2" className="font-medium">{user.fullName || user.username || '—'}</Typography>  
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                        <Typography variant="body2" className="text-gray-600">{user.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center" sx={{ gap: 1 }}>
                      <Phone className="text-gray-500" fontSize="small" />
                      <Typography variant="body2">{user.phone || '—'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={(user.userType || user.role || 'N/A').toString()} size="small" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  {/* <TableCell>
                    <Chip label={user.status} size="small" style={{ 
                      backgroundColor: `${statusColors[user.status]}20`,
                      color: statusColors[user.status],
                      fontWeight: 'bold'
                    }} />
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="body2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.rating != null ? user.rating : '—'}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>rating</Typography>
                    </Box>
                  </TableCell> */}
                  <TableCell>
                    <Box className="flex gap-1">
                      <IconButton size="small" color="error" onClick={() => { setSelectedUser(user); setConfirmDeleteOpen(true); }}>
                        <Delete />
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

          {/* PDF Preview Dialog */}
          <Dialog open={previewOpen} onClose={closePreview} maxWidth="lg" fullWidth>
            <DialogTitle>Users PDF Preview</DialogTitle>
            <DialogContent sx={{ height: '80vh' }}>
              {previewLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box> : (
                previewUrl ? <iframe title="users-pdf" src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} /> : <Box sx={{ p: 2 }}>No preview available</Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closePreview}>Close</Button>
              <Button onClick={savePreviewToDisk} variant="contained">Download</Button>
            </DialogActions>
          </Dialog>

          {/* simple download animation indicator */}
          {animatingDownload && (
            <Box sx={{ position: 'fixed', right: 24, bottom: 24, width: 80, height: 80, borderRadius: '50%', bgcolor: 'background.paper', boxShadow: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'flyToDownloads 1.2s ease-in-out' }}>
              <GetApp />
            </Box>
          )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleDelete(); handleMenuClose(); }}><Delete className="mr-2" fontSize="small" />Delete User</MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete <strong>{selectedUser?.fullName || selectedUser?.username}</strong>?</Typography>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>Cancel</Button>
          <Button onClick={performDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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