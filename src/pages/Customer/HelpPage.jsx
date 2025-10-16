import React, { useState, useEffect } from "react";
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
  MenuItem,
  Container,
  useTheme,
} from "@mui/material";
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
  Message,
  CategoryOutlined,
} from "@mui/icons-material";

import * as helpService from "../../services/helpService";
import useAuth from "../../hooks/useAuth";
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const faqs = [
  {
    question: "How do I book a ride?",
    answer:
      "To book a ride, open the Rapido app, enter your pickup and destination location, select your preferred vehicle type, and confirm your booking. You can track your ride in real-time through the app.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Rapido accepts various payment methods including cash, digital wallet, credit/debit cards, and UPI. You can add or change your payment methods in the app settings.",
  },
  {
    question: "How do I cancel a ride?",
    answer:
      "You can cancel a ride through the app before the driver reaches your pickup location. Cancellation fees may apply if you cancel after the driver has already started the trip.",
  },
  {
    question: "How are fares calculated?",
    answer:
      "Fares are calculated based on distance traveled, time taken, and applicable surge pricing during peak hours. You will see the estimated fare before confirming your booking.",
  },
];

export default function HelpPage() {
  const theme = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  
  // Fetch user's help requests on mount
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setFetchError("");
      try {
        const data = await helpService.getHelpRequestById(user.id);
        setRequests(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setFetchError("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);
  
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      setError("Please describe your issue.");
      return;
    }
    setSubmitting(true);
    try {
      await helpService.createHelpRequest({ issue, category });
      setIssue("");
      setError("");
      setSuccess(true);
      // Refresh requests
      const data = await helpService.getHelpRequestById(user.id);
      setRequests(Array.isArray(data) ? data : [data]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    return status === "Open"
      ? theme.palette.warning.main
      : status === "Resolved"
      ? theme.palette.success.main
      : theme.palette.error.main;
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Filter out resolved requests
  const activeRequests = requests.filter(request => 
    request.status !== "Resolved" && request.status !== "CLOSED"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Container maxWidth="lg" className="py-8">
        {/* Header */}
        <Box className="text-center mb-10">
          <Typography variant="h3" className="font-bold text-gray-800 mb-3">
            Help & Support
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 max-w-2xl mx-auto"
          >
            We're here to help you with any questions or issues you may have
            with Rapido services.
          </Typography>
        </Box>

        {/* Contact and Submit Section */}
        <Grid container spacing={4} className="mb-10">
          {/* Contact Options */}
          <Grid item xs={12} md={4}>
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <Box className="flex items-center mb-6">
                  <ContactSupport className="text-blue-500 mr-2" fontSize="large" />
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800"
                  >
                    Contact Us
                  </Typography>
                </Box>

                <Box className="space-y-4">
                  <Box className="flex items-center p-4 bg-blue-50 rounded-lg transition-all duration-200 hover:bg-blue-100">
                    <Phone className="text-blue-500 mr-3" />
                    <Box>
                      <Typography variant="subtitle2" className="font-medium text-gray-800">
                        Call Us
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        +91 8067697777
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center p-4 bg-green-50 rounded-lg transition-all duration-200 hover:bg-green-100">
                    <Email className="text-green-500 mr-3" />
                    <Box>
                      <Typography variant="subtitle2" className="font-medium text-gray-800">
                        Email Us
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        support@rapido.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center p-4 bg-purple-50 rounded-lg transition-all duration-200 hover:bg-purple-100">
                    <Message className="text-purple-500 mr-3" />
                    <Box>
                      <Typography variant="subtitle2" className="font-medium text-gray-800">
                        Live Chat
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Available 24/7
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Request */}
          <Grid item xs={12} md={8}>
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <Box className="flex items-center mb-6">
                  <Help className="text-yellow-500 mr-2" fontSize="large" />
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800"
                  >
                    Submit a Request
                  </Typography>
                </Box>

                {success && (
                  <Alert severity="success" className="mb-4">
                    Your request has been submitted successfully! Our team will
                    get back to you soon.
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    className="mb-3"
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
                    onChange={(e) => setIssue(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                    error={!!error}
                    helperText={error}
                    className="mb-4"
                  />

                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send />
                        )
                      }
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAQs */}
        <Box className="mb-10">
          <Box className="flex items-center mb-6">
            <Help className="text-indigo-500 mr-2" fontSize="large" />
            <Typography variant="h6" className="font-bold text-gray-800">
              Frequently Asked Questions
            </Typography>
          </Box>

          <Box className="space-y-3">
            {faqs.map((faq, index) => (
              <Accordion key={index} className="shadow-sm rounded-lg overflow-hidden">
                <AccordionSummary 
                  expandIcon={<ExpandMore />} 
                  className="bg-gray-50 hover:bg-gray-100"
                >
                  <Typography className="font-medium text-gray-800">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-white">
                  <Typography
                    variant="body2"
                    className="text-gray-600"
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Your Requests */}
        <Box>
          <Box className="flex items-center mb-6">
            <InfoIcon className="text-teal-500 mr-2" fontSize="large" />
            <Typography variant="h6" className="font-bold text-gray-800">
              Your Active Requests
            </Typography>
          </Box>

          {loading && (
            <Box className="mb-6 flex justify-center">
              <CircularProgress />
            </Box>
          )}

          {fetchError && (
            <Alert severity="error" className="mb-6">
              {fetchError}
            </Alert>
          )}

          {activeRequests.length === 0 && !loading ? (
            <Card className="shadow-sm rounded-xl overflow-hidden">
              <CardContent className="text-center py-12">
                <Help className="text-gray-400 mx-auto mb-4" fontSize="large" />
                <Typography variant="h6" className="text-gray-600 mb-2">
                  No active requests.
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Submit a request using the form above.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Paper className="shadow-sm rounded-xl overflow-hidden">
              <List className="divide-y divide-gray-200">
                {activeRequests.map((r) => (
                  <ListItem 
                    key={r.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200"
                    disableGutters
                  >
                    <Box className="w-full">
                      {/* Header with title and status */}
                      <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <Typography 
                          variant="h6" 
                          className="font-semibold text-gray-800 mb-2 sm:mb-0"
                        >
                          {r.issue}
                        </Typography>
                        
                        <Box className="flex flex-wrap gap-2">
                          {r.priority && (
                            <Chip
                              label={r.priority}
                              size="small"
                              style={{
                                backgroundColor: getPriorityColor(r.priority),
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                          <Chip
                            label={r.status}
                            size="small"
                            style={{
                              backgroundColor: `${getStatusColor(r.status)}20`,
                              color: getStatusColor(r.status),
                              fontWeight: '500',
                              border: `1px solid ${getStatusColor(r.status)}40`
                            }}
                          />
                        </Box>
                      </Box>
                      
                      {/* Details grid */}
                      <Grid container spacing={2} className="mb-4">
                        <Grid item xs={12} sm={6} md={3}>
                          <Box className="flex items-center">
                            <CategoryIcon className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">
                              <span className="font-medium">Category:</span> {r.category}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box className="flex items-center">
                            <CalendarTodayIcon className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">
                              <span className="font-medium">Date:</span> {new Date(r.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box className="flex items-center">
                            <InfoIcon className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">
                              <span className="font-medium">Status:</span> {r.status}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box className="flex items-center">
                            <Schedule className="text-gray-500 mr-2" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">
                              <span className="font-medium">Updated:</span> {new Date(r.updatedAt || r.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {/* User information */}
                      {r.user && (
                        <Box className="p-4 bg-gray-50 rounded-lg">
                          <Typography
                            variant="subtitle2"
                            className="text-gray-700 font-medium flex items-center mb-3"
                          >
                            <PersonIcon className="text-gray-500 mr-2" fontSize="small" />
                            User Information
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Box className="flex items-center">
                                <AccountCircleIcon className="text-gray-500 mr-2" fontSize="small" />
                                <Typography variant="body2" className="text-gray-600">
                                  {r.user.username}
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Box className="flex items-center">
                                <EmailIcon className="text-gray-500 mr-2" fontSize="small" />
                                <Typography variant="body2" className="text-gray-600">
                                  {r.user.email}
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Box className="flex items-center">
                                <PhoneIcon className="text-gray-500 mr-2" fontSize="small" />
                                <Typography variant="body2" className="text-gray-600">
                                  {r.user.phone}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Container>
    </div>
  );
}