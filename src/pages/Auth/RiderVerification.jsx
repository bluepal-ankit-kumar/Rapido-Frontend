import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  MenuItem, 
  CircularProgress, 
  InputAdornment, 
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import DriverService from '../../services/DriverService.js';
import useAuth from '../../hooks/useAuth';
import InfoIcon from '@mui/icons-material/Info';

export default function RiderVerification() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driverProfile, setDriverProfile] = useState(null);
  
  // Validation error states
  const [panError, setPanError] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [vehicleNumberError, setVehicleNumberError] = useState('');

  // Check driver status and redirect if approved
  useEffect(() => {
    async function fetchDriverStatus() {
      if (!user?.id) {
        setError('User data not available. Please log in again.');
        setLoading(false);
        navigate('/login', { state: { message: 'Please log in to continue.' } });
        return;
      }

      setLoading(true);
      setError('');
      try {
        const driverRes = await DriverService.getDriverByUserId(user.id);
        setDriverProfile(driverRes?.data);
        if (driverRes?.data?.verificationStatus === 'APPROVED') {
          localStorage.setItem('isRiderVerified', 'true');
          navigate('/rider/dashboard', { replace: true });
        } else {
          localStorage.setItem('isRiderVerified', 'false');
        }
      } catch (err) {
        setDriverProfile(null);
      } finally {
        setLoading(false);
      }
    }

    const isRiderVerified = localStorage.getItem('isRiderVerified') === 'true';
    if (isRiderVerified) {
      navigate('/rider/dashboard', { replace: true });
      return;
    }

    if (!user) {
      navigate('/login', { state: { message: 'You must be logged in to register as a driver.' } });
    } else if (user.role !== 'RIDER') {
      navigate('/', { state: { message: 'Only riders can access this page.' } });
    } else {
      fetchDriverStatus();
    }
  }, [user, navigate]);

  // Auto-poll while application is pending
  useEffect(() => {
    let intervalId;
    if (user?.id && driverProfile?.verificationStatus === 'PENDING') {
      intervalId = setInterval(async () => {
        try {
          const latest = await DriverService.getDriverByUserId(user.id);
          if (latest?.data?.verificationStatus === 'APPROVED') {
            localStorage.setItem('isRiderVerified', 'true');
            navigate('/rider/dashboard', { replace: true });
          }
        } catch (err) {
          // ignore transient errors during polling
        }
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user?.id, driverProfile?.verificationStatus, navigate]);

  // Validation functions
  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan.toUpperCase())) {
      return 'Invalid PAN format. Example: ABCDE1234F';
    }
    return '';
  };

  const validateLicense = (license) => {
    const licenseRegex = /^[A-Z0-9]{10,15}$/;
    if (!licenseRegex.test(license.toUpperCase())) {
      return 'Invalid license number. Must be 10-15 alphanumeric characters';
    }
    return '';
  };

  const validateVehicleNumber = (vehicleNumber) => {
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/;
    if (!vehicleRegex.test(vehicleNumber.toUpperCase())) {
      return 'Invalid vehicle number. Example: MH01AB1234';
    }
    return '';
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must not exceed 5MB.');
        setLicenseFile(null);
        e.target.value = null;
      } else {
        setLicenseFile(file);
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields before submission
    const panErr = validatePAN(pan);
    const licenseErr = validateLicense(licenseNumber);
    const vehicleErr = validateVehicleNumber(vehicleNumber);
    
    setPanError(panErr);
    setLicenseError(licenseErr);
    setVehicleNumberError(vehicleErr);

    if (panErr || licenseErr || vehicleErr) {
      setError('Please fix validation errors before submitting.');
      return;
    }

    if (!user || !user.id) {
      setError('Your user data could not be loaded. Please try logging in again.');
      return;
    }

    if (!dob || !pan || !licenseNumber || !licenseFile || !vehicleModel || !vehicleNumber) {
      setError('All fields, including the license image, are required.');
      return;
    }

    const age = Math.floor((new Date() - new Date(dob)) / 31557600000);
    if (age < 18) {
      setError('You must be at least 18 years old to register as a driver.');
      return;
    }

    const driverRequest = {
      userId: user.id,
      pan,
      dob,
      licenseNumber,
      vehicleModel,
      vehicleNumber,
      status: 'PENDING',
    };

    setIsSubmitting(true);
    try {
      const response = await DriverService.registerDriver(driverRequest, licenseFile);
      if (response.success) {
        setSuccess('Verification submitted successfully! An admin will review your application.');
        setDriverProfile(response.data);
      } else {
        setError(response.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== 'RIDER') {
    return null;
  }

  if (driverProfile?.verificationStatus === 'PENDING') {
    return (
      <Box sx={{ maxWidth: '500px', mx: 'auto', p: 4, my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            Application Under Review
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Your application has been submitted and is currently being reviewed by our team. We will notify you once it's approved.
          </Typography>
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2, py: 1.5 }}
            fullWidth
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '500px', mx: 'auto', p: 3, my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Driver Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Please provide your details for driver verification. All fields are required.
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />
          
          <TextField
            label="PAN Number"
            value={pan}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setPan(value);
              setPanError('');
            }}
            onBlur={(e) => setPanError(validatePAN(e.target.value))}
            fullWidth
            margin="normal"
            required
            error={!!panError}
            helperText={panError || "Format: ABCDE1234F"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="small">
                    <InfoIcon fontSize="small" color="info" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Driver's License Number"
            value={licenseNumber}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setLicenseNumber(value);
              setLicenseError('');
            }}
            onBlur={(e) => setLicenseError(validateLicense(e.target.value))}
            fullWidth
            margin="normal"
            required
            error={!!licenseError}
            helperText={licenseError || "10-15 alphanumeric characters"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="small">
                    <InfoIcon fontSize="small" color="info" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Vehicle Registration Number"
            value={vehicleNumber}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setVehicleNumber(value);
              setVehicleNumberError('');
            }}
            onBlur={(e) => setVehicleNumberError(validateVehicleNumber(e.target.value))}
            fullWidth
            margin="normal"
            required
            error={!!vehicleNumberError}
            helperText={vehicleNumberError || "Format: MH01AB1234"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="small">
                    <InfoIcon fontSize="small" color="info" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Vehicle Type"
            select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value=""><em>Select Vehicle Type</em></MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Auto">Auto</MenuItem>
          </TextField>
          
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            {licenseFile ? `File: ${licenseFile.name}` : 'Upload License Image'}
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}