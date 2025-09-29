import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Typography, Box, Grid, Card, CardContent, Container, Divider } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from '../../assets/ride-3d.json';

// Features and testimonials arrays defined locally to fix import error
const features = [
  {
    title: "Lightning-Fast Pickups",
    description: "Get a ride within minutes, not hours. Our extensive network ensures minimal wait times.",
    icon: "⚡"
  },
  {
    title: "Affordable Pricing",
    description: "Transparent fares with no hidden charges. Save up to 30% compared to traditional taxis.",
    icon: "💰"
  },
  {
    title: "Top-Notch Safety",
    description: "Verified drivers, real-time tracking, and SOS emergency buttons for your peace of mind.",
    icon: "🛡️"
  },
  {
    title: "Eco-Friendly Rides",
    description: "Choose from our fleet of electric and hybrid vehicles to reduce your carbon footprint.",
    icon: "🌱"
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Daily Commuter",
    text: "Rapido has transformed my daily commute. I save time and money every single day!"
  },
  {
    name: "Raj Patel",
    role: "Business Traveler",
    text: "The reliability and comfort of Rapido rides are unmatched. My go-to for all business trips."
  },
  {
    name: "Ananya Reddy",
    role: "Student",
    text: "As a student, I love the affordable pricing and safety features. Highly recommended!"
  }
];
import LoadingSpinner from '../../components/common/LoadingSpinner';



export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBookRide = () => {
    navigate('/ride-booking');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Box className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-100">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                className="font-bold mb-6 text-gray-900"
                sx={{ 
                  fontSize: { xs: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                  lineHeight: 1.2
                }}
              >
                Your Journey Begins Here
              </Typography>
              
              <Typography 
                variant="h6" 
                className="mb-8 text-gray-700"
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7
                }}
              >
                Experience the freedom of seamless travel. With Rapido, every ride is an adventure waiting to happen. Fast, safe, and affordable journeys are just a tap away!
              </Typography>
              
              <Button
                variant="contained"
                className="px-10 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
                onClick={handleBookRide}
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  px: 6,
                  borderRadius: '50px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                }}
              >
                Book Your Adventure Now
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6} className="flex justify-center">
              <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px]">
                <Lottie animationData={animationData} loop={true} />
              </div>
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
              sx={{ 
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Why Choose Rapido?
            </Typography>
            
            <Typography 
              variant="h6" 
              className="text-gray-600 max-w-3xl mx-auto"
              sx={{ 
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              We're not just another ride-hailing service. We're your travel partner committed to making every journey exceptional.
            </Typography>
          </Box>
          
          {/* Features Grid - 2 cards per row */}
          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card 
                  className="h-full shadow-md hover:shadow-lg transition-all duration-300"
                  sx={{ 
                    borderRadius: '16px',
                    display: 'flex',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <Box className="w-1/4 bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center">
                    <div className="text-4xl text-white">{feature.icon}</div>
                  </Box>
                  <CardContent className="w-3/4 p-6">
                    <Typography 
                      variant="h6" 
                      className="font-bold mb-3 text-gray-900"
                      sx={{ fontSize: '1.2rem' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="text-gray-600"
                      sx={{ 
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Divider */}
      <Divider className="my-2" />

      {/* Testimonials */}
      <Box className="py-16 px-4 bg-gray-50">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Typography 
              variant="h4" 
              className="font-bold mb-4 text-gray-900"
              sx={{ 
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              What Our Riders Say
            </Typography>
          </Box>
          
          <Grid container spacing={6}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                  sx={{ 
                    borderRadius: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Box className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-white text-xl">"</span>
                  </Box>
                  <CardContent className="p-6 pt-8 flex flex-col h-full">
                    <Typography 
                      variant="body1" 
                      className="italic mb-6 text-gray-700 flex-grow text-center"
                      sx={{ 
                        fontSize: '1rem',
                        lineHeight: 1.6
                      }}
                    >
                      {testimonial.text}
                    </Typography>
                    <div className="text-center mt-auto">
                      <Typography 
                        variant="h6" 
                        className="font-bold text-gray-900"
                        sx={{ fontSize: '1.1rem' }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className="text-gray-600"
                        sx={{ fontSize: '0.9rem' }}
                      >
                        {testimonial.role}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-orange-500">
        <Container maxWidth="md">
          <Box className="text-center">
            <Typography 
              variant="h3" 
              className="font-bold mb-6 text-gray-900"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            
            <Typography 
              variant="h6" 
              className="mb-10 text-gray-900 max-w-2xl mx-auto"
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                lineHeight: 1.7
              }}
            >
              Join millions of satisfied riders who've discovered the Rapido difference. Your next adventure is just a few taps away!
            </Typography>
            
            <Button
              variant="contained"
              className="px-12 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              onClick={handleBookRide}
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                py: 2,
                px: 8,
                borderRadius: '50px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              Start Booking Now
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
}