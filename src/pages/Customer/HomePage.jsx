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

// Features mock data
const initialFeatures = [
  {
    title: "Lightning-Fast Pickups",
    description:
      "Get a ride within minutes, not hours. Our extensive network ensures minimal wait times.",
    icon: "⚡",
  },
  {
    title: "Affordable Pricing",
    description:
      "Transparent fares with no hidden charges. Save up to 30% compared to traditional taxis.",
    icon: "💰",
  },
  {
    title: "Top-Notch Safety",
    description:
      "Verified drivers, real-time tracking, and SOS emergency buttons for your peace of mind.",
    icon: "🛡️",
  },
  {
    title: "Eco-Friendly Rides",
    description:
      "Choose from our fleet of electric and hybrid vehicles to reduce your carbon footprint.",
    icon: "🌱",
  },
];

// Testimonials mock data
const initialTestimonials = [
  {
    name: "Priya Sharma",
    role: "Daily Commuter",
    text: "Rapido has transformed my daily commute. I save time and money every single day!",
  },
  {
    name: "Raj Patel",
    role: "Business Traveler",
    text: "The reliability and comfort of Rapido rides are unmatched. My go-to for all business trips.",
  },
  {
    name: "Ananya Reddy",
    role: "Student",
    text: "As a student, I love the affordable pricing and safety features. Highly recommended!",
  },
  {
    name: "Vikram Singh",
    role: "Entrepreneur",
    text: "Convenience and peace of mind every time I book. Rapido is my first choice always!",
  },
];

export default function HomePage() {
  // Refs for scrollable containers
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // State for looping carousels
  const [features, setFeatures] = useState(initialFeatures);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const scrollByAmount = 340; // Card width + gap

  // Looping scroll for carousel (infinite)
  const scrollLoop = (ref, dir, items, setItems) => {
    if (!ref.current) return;
    const container = ref.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const current = container.scrollLeft;
    let next = current + dir * scrollByAmount;

    // If scrolling right past end, move first item to end and reset scroll
    if (dir > 0 && next > maxScroll - 10) {
      setItems(prev => {
        const arr = [...prev];
        arr.push(arr.shift());
        return arr;
      });
      container.scrollTo({ left: current, behavior: 'auto' });
      setTimeout(() => {
        container.scrollTo({ left: current, behavior: 'auto' });
      }, 0);
      return;
    }
    // If scrolling left past start, move last item to start and reset scroll
    if (dir < 0 && next < 0) {
      setItems(prev => {
        const arr = [...prev];
        arr.unshift(arr.pop());
        return arr;
      });
      container.scrollTo({ left: current + scrollByAmount, behavior: 'auto' });
      setTimeout(() => {
        container.scrollTo({ left: current + scrollByAmount, behavior: 'auto' });
      }, 0);
      return;
    }
    container.scrollTo({ left: next, behavior: 'smooth' });
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBookRide = () => {
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
                className="px-10 py-3 bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-yellow-600 hover:to-yellow-600 text-gray-900 font-bold rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
                onClick={handleBookRide}
                sx={{ mt: 2, px: 6, py: 2 }}
              >
                Book Your Adventure Now
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
              className="text-gray-600 max-w-3xl mx-auto"
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.6 }}
            >
              We're not just another ride-hailing service. We're your travel
              partner committed to making every journey exceptional.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ScrollArrow direction="left" onClick={() => scrollLoop(featuresRef, -1, features, setFeatures)} />
            <Box
              ref={featuresRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                width: '100%',
                py: 2,
                '::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-md hover:shadow-lg transition-all duration-300 flex flex-row"
                  sx={{
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "row",
                    minHeight: 320,
                    minWidth: 320,
                    aspectRatio: '1/1',
                    height: 320,
                    width: 320,
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <Box className="bg-gradient-to-b from-yellow-400 to-yellow-500 flex items-center justify-center" sx={{ width: 80, minHeight: 320, height: '100%' }}>
                    <span className="text-3xl">{feature.icon}</span>
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography
                      variant="h6"
                      className="font-bold mb-3 text-gray-900"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <ScrollArrow direction="right" onClick={() => scrollLoop(featuresRef, 1, features, setFeatures)} />
          </Box>
        </Container>
      </Box>

      {/* Divider */}
      <Divider className="my-2" />

      {/* Testimonials Section */}
      <Box className="py-16 px-4 bg-gray-50">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Typography
              variant="h4"
              className="font-bold mb-4 text-gray-900"
              sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              What Our Riders Say
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ScrollArrow direction="left"  onClick={() => scrollLoop(testimonialsRef, -1, testimonials, setTestimonials)} />
            <Box
              ref={testimonialsRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                width: '100%',
                py: 2,
                '::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  sx={{
                    borderRadius: "16px",
                    minHeight: 320,
                    minWidth: 320,
                    aspectRatio: '1/1',
                    height: 320,
                    width: 320,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 3
                  }}
                >
                  <Typography
                    variant="body1"
                    className="italic mb-6 text-gray-700 text-center"
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box className="text-center mt-auto">
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900"
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
            <ScrollArrow direction="right" onClick={() => scrollLoop(testimonialsRef, 1, testimonials, setTestimonials)} />
          </Box>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-yellow-500">
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