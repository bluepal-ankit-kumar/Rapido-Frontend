import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockData';

export default function RiderVerification() {
  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [license, setLicense] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    // Age validation
    const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
    if (!dob || !pan || !license || !licenseFile || !vehicleType || !vehicleReg) {
      setError('All fields are required');
      return;
    }
    if (age < 18) {
      setError('You must be at least 18 years old');
      return;
    }
    // Simulate verification and update mockUsers (in real app, update DB)
    // Assume last registered rider is the one verifying
    const lastRider = mockUsers.filter(u => u.role === 'rider' && !u.verified).slice(-1)[0];
    if (lastRider) {
      lastRider.verified = true;
      lastRider.dob = dob;
      lastRider.pan = pan;
      lastRider.license = license;
      lastRider.licenseFile = licenseFile.name;
      lastRider.vehicleType = vehicleType;
      lastRider.vehicleReg = vehicleReg;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <Box className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <Typography variant="h5" className="mb-4 font-bold">Rider Verification</Typography>
      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      {success && <Alert severity="success" className="mb-3">Verification successful! Redirecting to login...</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="PAN Number" value={pan} onChange={e => setPan(e.target.value)} fullWidth margin="normal" />
        <TextField label="Driver's License Number" value={license} onChange={e => setLicense(e.target.value)} fullWidth margin="normal" />
        <Button variant="outlined" component="label" fullWidth className="my-2">
          Upload License Scan
          <input type="file" hidden onChange={e => setLicenseFile(e.target.files[0])} />
        </Button>
        <TextField label="Vehicle Type" select SelectProps={{ native: true }} value={vehicleType} onChange={e => setVehicleType(e.target.value)} fullWidth margin="normal">
          <option value="">Select Vehicle Type</option>
          <option value="Bike">Bike</option>
          <option value="Car">Car</option>
          <option value="Auto">Auto</option>
        </TextField>
        <TextField label="Vehicle Registration Number" value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" className="mt-4 w-full">Verify & Complete Registration</Button>
      </form>
    </Box>
  );
}
