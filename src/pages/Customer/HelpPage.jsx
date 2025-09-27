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

const initialRequests = [
  { id: 1, issue: 'Payment failed during ride booking', status: 'Open', date: '2023-06-15', category: 'Payment' },
  { id: 2, issue: 'Driver was late for pickup', status: 'Resolved', date: '2023-06-10', category: 'Service' },
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

export default function HelpPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (!issue.trim()) {
      setError('Please describe your issue.');
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
        category
      }]);
      setIssue('');
      setError('');
      setSubmitting(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
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

        <Grid container spacing={4}>
          {/* Contact Options */}
          <Grid item xs={12} md={4}>
            <Card className="h-full">
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
            <Card>
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
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Payment">Payment</MenuItem>
                    <MenuItem value="Service">Service</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Safety">Safety</MenuItem>
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
                  
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
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
          
          {requests.length === 0 ? (
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
                            {r.date}
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