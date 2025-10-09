import React, { useState, useEffect, useRef } from "react";
// Arrow button component
function ScrollArrow({ direction, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: 48,
        height: 48,
        minWidth: 48,
        minHeight: 48,
        borderRadius: '50%',
        mx: 1,
        backgroundColor: '#FFD600', // solid yellow
        color: '#222',
        boxShadow: 2,
        zIndex: 2,
        p: 0,
        fontSize: 28,
        '&:hover': { backgroundColor: '#FFEB3B' }
      }}
    >
      {direction === 'left' ? '←' : '→'}
    </Button>
  );
}
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import Button from "../../components/common/Button";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../assets/ride-3d.json";
import LoadingSpinner from "../../components/common/LoadingSpinner";


export default function HomePage() {
  const { user } = useAuth();
  // Refs for scrollable containers
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // No features/testimonials state needed

  // ...existing code...
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBookRide = () => {
    if (!user || user.role !== 'CUSTOMER') {
      navigate('/login');
      return;
    }
    navigate("/ride-booking");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Box className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-100">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography
                variant="h2"
                className="font-bold mb-6 text-gray-900"
                sx={{
                  fontSize: { xs: "2.2rem", md: "2.8rem", lg: "3.2rem" },
                  lineHeight: 1.2,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1, md: 2 }
                }}
              >
                Your Journey Begins Here
              </Typography>

              <Typography
                variant="h6"
                className="mb-8 text-gray-700"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.7,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1, md: 2 }
                }}
              >
                Experience the freedom of seamless travel. With Rapido, every
                ride is an adventure waiting to happen. Fast, safe, and
                affordable journeys are just a tap away!
              </Typography>

              <Button
                variant="contained"
                className="px-10 py-3 bg-gradient-to-r from-yellow-400 to-yellow-400 hover:from-yellow-600 hover:to-yellow-600 text-gray-900 font-bold rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
                onClick={handleBookRide}
                sx={{ mt: 2, px: 6, py: 2 }}
              >
                Book Your Ride Here
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Rapido Section */}
      <Box className="py-16 px-4 bg-white">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography
              variant="h3"
              className="font-bold mb-4 text-gray-900"
              sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              Why Choose Rapido?
            </Typography>
            <Typography
              variant="h6"
              className="text-gray-600 "
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.7,
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 2 },
                textAlign: 'center'
              }}
            >
              We're not just another ride-hailing service. We're your travel partner committed to making every journey exceptional.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 6 }}>
              <Card sx={{ minWidth: 260, maxWidth: 320, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" className="font-bold mb-2 text-gray-900">⚡ Lightning-Fast Pickups</Typography>
                <Typography variant="body2" className="text-gray-600">Get a ride within minutes, not hours. Our extensive network ensures minimal wait times.</Typography>
              </Card>
              <Card sx={{ minWidth: 260, maxWidth: 320, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" className="font-bold mb-2 text-gray-900">💰 Affordable Pricing</Typography>
                <Typography variant="body2" className="text-gray-600">Transparent fares with no hidden charges. Save up to 30% compared to traditional taxis.</Typography>
              </Card>
              <Card sx={{ minWidth: 260, maxWidth: 320, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" className="font-bold mb-2 text-gray-900">🛡️ Top-Notch Safety</Typography>
                <Typography variant="body2" className="text-gray-600">Verified drivers, real-time tracking, and SOS emergency buttons for your peace of mind.</Typography>
              </Card>
              <Card sx={{ minWidth: 260, maxWidth: 320, p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" className="font-bold mb-2 text-gray-900">🌱 Eco-Friendly Rides</Typography>
                <Typography variant="body2" className="text-gray-600">Choose from our fleet of electric and hybrid vehicles to reduce your carbon footprint.</Typography>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Divider */}
      <Divider className="my-2" />

   

      {/* Final CTA Section */}
      <Box className="py-20 px-4 bg-gradient-to-r from-yellow-400 to-yellow-400">
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography
              variant="h3"
              className="font-bold mb-6 text-gray-900"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, px: { xs: 2, md: 4 }, py: { xs: 1, md: 2 } }}
            >
              Ready to Start Your Journey?
            </Typography>
            <Typography
              variant="h6"
              className="mb-10 text-gray-900 max-w-2xl mx-auto"
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, lineHeight: 1.7, px: { xs: 2, md: 4 }, py: { xs: 1, md: 2 } }}
            >
              Join millions of satisfied riders who've discovered the Rapido
              difference. Your next adventure is just a few taps away!
            </Typography>
            <Button
              variant="contained"
              className="px-12 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              onClick={handleBookRide}
              sx={{ mx: 'auto', px: 6, py: 2 }}
            >
              Start Booking Now
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
}