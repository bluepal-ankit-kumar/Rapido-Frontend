import React, { useState } from 'react';
import { WeeklyRideTrendsChart, RevenuePieChart } from './ReportCharts.jsx';
import { 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Menu,
  MenuItem,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Download, 
  Visibility,
  MoreVert,
  TrendingUp,
  TrendingDown,
  DirectionsBike,
  People,
  AttachMoney,
  Star,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';

const reports = [
  { 
    id: 1, 
    title: 'System Health', 
    details: 'All systems operational.',
    category: 'System',
    date: '2023-06-15',
    status: 'Completed',
    author: 'System Admin',
    size: '2.4 MB'
  },
  { 
    id: 2, 
    title: 'Ride Summary', 
    details: '350 rides completed this week.',
    category: 'Operations',
    date: '2023-06-14',
    status: 'Completed',
    author: 'Operations Team',
    size: '1.8 MB'
  },
  { 
    id: 3, 
    title: 'Revenue Analysis', 
    details: 'Monthly revenue increased by 12%.',
    category: 'Finance',
    date: '2023-06-13',
    status: 'Processing',
    author: 'Finance Team',
    size: '3.2 MB'
  },
  { 
    id: 4, 
    title: 'Customer Satisfaction', 
    details: 'Average rating improved to 4.2 stars.',
    category: 'Customer',
    date: '2023-06-12',
    status: 'Completed',
    author: 'Customer Support',
    size: '2.1 MB'
  },
  { 
    id: 5, 
    title: 'Driver Performance', 
    details: 'Top 10 drivers identified.',
    category: 'Operations',
    date: '2023-06-11',
    status: 'Completed',
    author: 'Operations Team',
    size: '1.5 MB'
  }
];

const statusColors = {
  'Completed': '#4CAF50',
  'Processing': '#FF9800',
  'Pending': '#9E9E9E',
  'Failed': '#F44336'
};

const categoryColors = {
  'System': '#2196F3',
  'Operations': '#FF9800',
  'Finance': '#4CAF50',
  'Customer': '#9C27B0'
};

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

export default function Reports() {
  const [reportsData, setReportsData] = useState(reports);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Handle search and filters
  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || report.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || report.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
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

  // Handle menu open
  const handleMenuClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle download
  const handleDownload = () => {
    // Implement download functionality
    handleMenuClose();
  };

  // Handle view
  const handleView = () => {
    // Implement view functionality
    handleMenuClose();
  };

  // Statistics data
  const stats = {
    totalRides: 1250,
    revenue: 284000,
    activeUsers: 890,
    avgRating: 4.2
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Reports & Analytics
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Generate and view reports to track performance and make data-driven decision
        </Typography>
      </Box>

      {/* Tabs */}
      <Box className="mb-6">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="Dashboard" id="tab-0" />
          <Tab label="Reports" id="tab-1" />
          <Tab label="Generate New" id="tab-2" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Statistics Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-yellow-500">
              <CardContent>
                <Box className="flex items-center">
                  <DirectionsBike className="text-yellow-500 mr-2" />
                  <Typography variant="h6" className="text-gray-600">Total Rides</Typography>
                </Box>
                <Typography variant="h4" className="font-bold text-yellow-500">
                  {stats.totalRides}
                </Typography>
                <Box className="flex items-center mt-1">
                  <TrendingUp className="text-green-500 mr-1" fontSize="small" />
                  <Typography variant="body2" className="text-green-500">12% from last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-yellow-500">
              <CardContent>
                <Box className="flex items-center">
                  <AttachMoney className="text-yellow-500 mr-2" />
                  <Typography variant="h6" className="text-gray-600">Revenue</Typography>
                </Box>
                <Typography variant="h4" className="font-bold text-yellow-500">
                  ₹{stats.revenue.toLocaleString()}
                </Typography>
                <Box className="flex items-center mt-1">
                  <TrendingUp className="text-green-500 mr-1" fontSize="small" />
                  <Typography variant="body2" className="text-green-500">8% from last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-yellow-500">
              <CardContent>
                <Box className="flex items-center">
                  <People className="text-yellow-500 mr-2" />
                  <Typography variant="h6" className="text-gray-600">Active Users</Typography>
                </Box>
                <Typography variant="h4" className="font-bold text-yellow-500">
                  {stats.activeUsers}
                </Typography>
                <Box className="flex items-center mt-1">
                  <TrendingUp className="text-green-500 mr-1" fontSize="small" />
                  <Typography variant="body2" className="text-green-500">5% from last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-yellow-500">
              <CardContent>
                <Box className="flex items-center">
                  <Star className="text-yellow-500 mr-2" />
                  <Typography variant="h6" className="text-gray-600">Avg. Rating</Typography>
                </Box>
                <Typography variant="h4" className="font-bold text-yellow-500">
                  {stats.avgRating}
                </Typography>
                <Box className="flex items-center mt-1">
                  <TrendingUp className="text-green-500 mr-1" fontSize="small" />
                  <Typography variant="body2" className="text-green-500">0.2 from last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={8} width={800} height={550}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                  Weekly Ride Trend
                </Typography>
                {/* Weekly Ride Trends Chart */}
                <Box className="bg-gray-100 rounded-lg h-full flex items-center justify-center mt-10">
                  <div className="w-full h-full">
                    <WeeklyRideTrendsChart />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} width={500} height={550}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                  Revenue by Vehicle Type
                </Typography>
                {/* Revenue by Vehicle Type Pie Chart */}
                <Box className="bg-gray-100 rounded-lg h-70 flex items-center justify-center">
                  <div className="w-full h-full">
                    <RevenuePieChart />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel value={tabValue} index={1}>
        {/* Filters and Search */}
        <Box className="mb-6 flex flex-col sm:flex-row gap-4">
          <TextField
            placeholder="Search reports..."
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
              label="Category"
              variant="outlined"
              size="small"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-40"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="System">System</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              variant="outlined"
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-32"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
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

        {/* Reports Table */}
        <Paper className="overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell className="font-medium">#{report.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {report.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {report.details}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.category}
                        size="small"
                        style={{ 
                          backgroundColor: `${categoryColors[report.category]}20`,
                          color: categoryColors[report.category],
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{report.author}</TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <CalendarToday className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2">{report.date}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status}
                        size="small"
                        style={{ 
                          backgroundColor: `${statusColors[report.status]}20`,
                          color: statusColors[report.status],
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <Box className="flex gap-1">
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<Visibility />}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<Download />}
                        >
                          Download
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, report)}
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
            count={filteredReports.length}
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
            View Report
          </MenuItem>
          <MenuItem onClick={handleDownload}>
            <Download className="mr-2" fontSize="small" />
            Download Report
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <AccessTime className="mr-2" fontSize="small" />
            Schedule Report
          </MenuItem>
        </Menu>
      </TabPanel>

      {/* Generate New Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <Typography variant="h5" className="font-bold text-gray-800 mb-4">
              Generate New Report
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Name"
                  variant="outlined"
                  placeholder="Enter report name"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Report Type"
                  variant="outlined"
                  defaultValue=""
                >
                  <MenuItem value="ride-summary">Ride Summary</MenuItem>
                  <MenuItem value="revenue">Revenue Analysis</MenuItem>
                  <MenuItem value="customer-satisfaction">Customer Satisfaction</MenuItem>
                  <MenuItem value="driver-performance">Driver Performance</MenuItem>
                  <MenuItem value="system-health">System Health</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Range"
                  variant="outlined"
                  placeholder="Select date range"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Format"
                  variant="outlined"
                  defaultValue="pdf"
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Schedule"
                  variant="outlined"
                  placeholder="Schedule report (optional)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter report description (optional)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box className="flex justify-end gap-2">
                  <Button variant="outlined">Cancel</Button>
                  <Button variant="contained">Generate Report</Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </div>
  );
}