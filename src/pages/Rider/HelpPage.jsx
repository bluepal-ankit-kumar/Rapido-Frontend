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
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { 
  Send, 
  Search, 
  FilterList, 
  Help, 
  ContactSupport, 
  Phone, 
  Email, 
  Message,
  ExpandMore,
  CheckCircle,
  Error,
  Schedule,
  LocationOn,
  Payment,
  DirectionsBike,
  LocalTaxi,
  AirportShuttle
} from '@mui/icons-material';

const initialRequests = [
  { 
    id: 1, 
    issue: 'App crash when booking a ride', 
    status: 'Open', 
    date: '2023-06-15',
    category: 'Technical',
    priority: 'High'
  },
  { 
    id: 2, 
    issue: 'Payment delay during ride completion', 
    status: 'Resolved', 
    date: '2023-06-10',
    category: 'Payment',
    priority: 'Medium'
  },
  { 
    id: 3, 
    issue: 'Driver was rude and unprofessional', 
    status: 'In Progress', 
    date: '2023-06-12',
    category: 'Service',
    priority: 'High'
  },
];

const faqs = [
  {
    question: 'How do I book a ride?',
    answer: 'To book a ride, open the Rapido app, enter your pickup and destination locations, select your preferred vehicle type, and confirm your booking. You can track your ride in real-time through the app.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'Rapido accepts various payment methods including cash, digital wallets, credit/debit cards, and UPI. You can add or change your payment methods in the app settings.'
  },
  {
    question: 'How do I cancel a ride?',
    answer: 'You can cancel a ride through the app before the driver reaches your pickup location. Cancellation fees may apply if you cancel after the driver has already started the trip.'
  },
  {
    question: 'How are fares calculated?',
    answer: 'Fares are calculated based on distance traveled, time taken, and applicable surge pricing during peak hours. You will see the estimated fare before confirming your booking.'
  }
];

const categories = ['All', 'Technical', 'Payment', 'Service', 'Safety', 'Account'];

export default function HelpPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (!issue.trim()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequests([...requests, { 
        id: requests.length + 1, 
        issue, 
        status: 'Open',
        date: new Date().toLocaleDateString(),
        category,
        priority
      }]);
      setIssue('');
      setSubmitting(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleMenuClick = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return '#FF9800';
      case 'In Progress': return '#2196F3';
      case 'Resolved': return '#4CAF50';
      case 'Closed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Help & Support</Typography>
          <Typography variant="body1" className="text-gray-600">
            We're here to help you with any questions or issues you may have with Rapido services
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Contact Options */}
          <Grid item xs={12} md={4}>
            <Card className="shadow-md rounded-xl h-full">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Contact Us</Typography>
                
                <Box className="flex flex-col gap-4">
                  <Card className="bg-blue-50 border border-blue-200">
                    <CardContent className="p-4 flex items-center">
                      <Phone className="text-blue-500 mr-3" />
                      <Box>
                        <Typography variant="body2" className="font-medium">Call Us</Typography>
                        <Typography variant="caption" className="text-gray-600">+91 8067697777</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border border-green-200">
                    <CardContent className="p-4 flex items-center">
                      <Email className="text-green-500 mr-3" />
                      <Box>
                        <Typography variant="body2" className="font-medium">Email Us</Typography>
                        <Typography variant="caption" className="text-gray-600">support@rapido.com</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border border-purple-200">
                    <CardContent className="p-4 flex items-center">
                      <Message className="text-purple-500 mr-3" />
                      <Box>
                        <Typography variant="body2" className="font-medium">Live Chat</Typography>
                        <Typography variant="caption" className="text-gray-600">Available 24/7</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Submit Request and FAQs */}
          <Grid item xs={12} md={8}>
            {/* Submit Request */}
            <Card className="shadow-md rounded-xl mb-4">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Submit a Request</Typography>
                
                {success && (
                  <Alert severity="success" className="mb-4">
                    Your request has been submitted successfully! Our team will get back to you soon.
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    select
                    label="Category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                  
                  <TextField
                    select
                    label="Priority"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </TextField>
                  
                  <TextField
                    label="Describe your issue"
                    value={issue}
                    onChange={e => setIssue(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Frequently Asked Questions</Typography>
                
                <Box className="space-y-2">
                  {faqs.map((faq, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography className="font-medium">{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" className="text-gray-600">
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Your Requests */}
        <Box className="mt-8">
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">Your Requests</Typography>
          
          <Box className="mb-4 flex flex-col sm:flex-row gap-4">
            <TextField
              placeholder="Search requests..."
              variant="outlined"
              size="small"
              className="flex-1"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Status"
              variant="outlined"
              size="small"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full sm:w-40"
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
          
          {filteredRequests.length === 0 ? (
            <Card className="text-center py-8">
              <Help className="text-gray-300" fontSize="large" />
              <Typography variant="body1" className="text-gray-500 mt-2">No requests found</Typography>
              <Typography variant="body2" className="text-gray-400">
                Submit a request using the form above
              </Typography>
            </Card>
          ) : (
            <Paper>
              <List>
                {filteredRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <ListItem>
                      <ListItemText
                        primary={request.issue}
                        secondary={
                          <Box className="flex items-center mt-1">
                            <Chip 
                              label={request.category} 
                              size="small" 
                              className="mr-2"
                              style={{ backgroundColor: '#f0f0f0' }}
                            />
                            <Chip 
                              label={request.status}
                              size="small"
                              style={{ 
                                backgroundColor: `${getStatusColor(request.status)}20`,
                                color: getStatusColor(request.status)
                              }}
                            />
                            <Chip 
                              label={request.priority}
                              size="small"
                              style={{ 
                                backgroundColor: `${getPriorityColor(request.priority)}20`,
                                color: getPriorityColor(request.priority)
                              }}
                            />
                            <Typography variant="caption" className="ml-2 text-gray-500">
                              {request.date}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton 
                        edge="end" 
                        onClick={(e) => handleMenuClick(e, request)}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <CheckCircle className="mr-2" fontSize="small" />
          Mark as Resolved
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Error className="mr-2" fontSize="small" />
          Close Request
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(selectedRequest.id, 'In Progress')}>
          <Schedule className="mr-2" fontSize="small" />
          Mark as In Progress
        </MenuItem>
      </Menu>
    </div>
  );
}