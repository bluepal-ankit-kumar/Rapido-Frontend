import React, { useState, useEffect } from 'react';
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
  Chip, 
  Card, 
  CardContent, 
  Grid,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { 
  Send, 
  Help, 
  ContactSupport, 
  ExpandMore, 
  CheckCircle, 
  Error,
  Schedule,
  Phone,
  Email,
  Message
} from '@mui/icons-material';

import * as helpService from '../../services/helpService';

const faqs = [
  {
    question: 'How do I book a ride?',
    answer: 'To book a ride, open the Rapido app, enter your pickup and destination location, select your preferred vehicle type, and confirm your booking. You can track your ride in real-time through the app.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'Rapido accepts various payment methods including cash, digital wallet, credit/debit cards, and UPI. You can add or change your payment methods in the app settings.'
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

export default function HelpPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  // Fetch user's help requests on mount
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setFetchError('');
      try {
        // Optionally filter by user if backend supports
        const data = await helpService.getHelpRequests({ page: 0, size: 10 });
        setRequests(data.content || []);
      } catch (err) {
        setFetchError('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);
  const [issue, setIssue] = useState('');
  // Only allow valid enum values for category
  const validCategories = ['GENERAL', 'PAYMENT', 'TECHNICAL', 'SAFETY', 'SERVICE'];
  const [category, setCategory] = useState('GENERAL');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!issue.trim()) {
      setError('Please describe your issue.');
      return;
    }
    setSubmitting(true);
    try {
      // Get JWT token from localStorage
      const jwt = localStorage.getItem('jwtToken');
      // Send JSON in required format with token
      // Ensure category is a valid enum value
      const safeCategory = validCategories.includes(category.toUpperCase()) ? category.toUpperCase() : 'GENERAL';
      await helpService.createHelpRequest(jwt, {
        issue,
        category: safeCategory
      });
      setIssue('');
      setError('');
      setSuccess(true);
      // Refresh requests
      const data = await helpService.getHelpRequests({ page: 0, size: 10 });
      setRequests(data.content || []);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Open' ? '#FF9800' : status === 'Resolved' ? '#4CAF50' : '#F44336';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">Help & Support</Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions or issues you may have with Rapido services.
          </Typography>
        </Box>

        <Grid  className="mb-4 mr-5 grid grid-cols-[200px_700px]" >
          {/* Contact Options */}
          <Grid item xs={12} md={8}>
            <Card className="h-full mr-5">
              <CardContent>
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Contact Us</Typography>
                
                <Box className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
                  <Phone className="text-blue-500 mr-3" />
                  <Box>
                    <Typography variant="body2" className="font-medium">Call Us</Typography>
                    <Typography variant="caption" className="text-gray-600">+91 8067697777</Typography>
                  </Box>
                </Box>
                
                <Box className="flex items-center mb-4 p-3 bg-green-50 rounded-lg">
                  <Email className="text-green-500 mr-3" />
                  <Box>
                    <Typography variant="body2" className="font-medium">Email Us</Typography>
                    <Typography variant="caption" className="text-gray-600">support@rapido.com</Typography>
                  </Box>
                </Box>
                
                <Box className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <Message className="text-purple-500 mr-3" />
                  <Box>
                    <Typography variant="body2" className="font-medium">Live Chat</Typography>
                    <Typography variant="caption" className="text-gray-600">Available 24/7</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Request */}
          <Grid item xs={12} md={8}>
            <Card className='h-full width-full'>
              <CardContent>
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
                    {validCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</MenuItem>
                    ))}
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
                    error={!!error}
                    helperText={error}
                  />
                  
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAQs */}
        <Box className="mt-8">
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">Frequently Asked Questions</Typography>
          
          <Box className="space-y-2">
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography className="font-medium">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="span" className="text-gray-600">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Your Requests */}
        <Box className="mt-8">
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">Your Requests</Typography>
          {loading && <Box className="mb-4"><CircularProgress /></Box>}
          {fetchError && <Alert severity="error" className="mb-4">{fetchError}</Alert>}
          {requests.length === 0 && !loading ? (
            <Card>
              <CardContent className="text-center py-6">
                <Help className="text-gray-400" fontSize="large" />
                <Typography variant="body1" className="text-gray-600 mt-2">No requests yet.</Typography>
                <Typography variant="body2" className="text-gray-500">
                  Submit a request using the form above.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Paper>
              <List>
                {requests.map(r => (
                  <React.Fragment key={r.id}>
                    <ListItem>
                      <ListItemText
                        primary={r.issue}
                        secondary={
                          <Typography variant="body2" component="span" className="text-gray-500">
                            {r.date || r.createdAt}
                          </Typography>
                        }
                      />
                      <Box className="flex items-center">
                        <Chip 
                          label={r.category} 
                          size="small" 
                          className="mr-2"
                          style={{ backgroundColor: '#f0f0f0' }}
                        />
                        <Chip 
                          label={r.status}
                          size="small"
                          style={{ 
                            backgroundColor: `${getStatusColor(r.status)}20`,
                            color: getStatusColor(r.status)
                          }}
                        />
                      </Box>
                      <IconButton edge="end">
                        {r.status === 'Open' ? <Schedule /> : <CheckCircle />}
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
    </div>
  );
}