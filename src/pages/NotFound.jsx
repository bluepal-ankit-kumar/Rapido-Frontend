import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ErrorOutline, 
  Home, 
  Refresh, 
  HelpOutline,
  ArrowBack
} from '@mui/icons-material';

export default function NotFound() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="overflow-hidden rounded-xl">
        <Grid container>
          {/* Left side - Image/Illustration */}
          <Grid className="bg-blue-50 flex items-center justify-center p-8" columns={12} md={5}>
            <Box className="text-center">
              <ErrorOutline className="text-blue-500" style={{ fontSize: '8rem' }} />
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                fontWeight="bold" 
                className="text-blue-600 mt-4"
              >
                404
              </Typography>
            </Box>
          </Grid>
          
          {/* Right side - Content */}
          <Grid className="p-8" columns={12} md={7}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              className="mb-4"
            >
              Oops! Page Not Found
            </Typography>
            
            <Typography variant="body1" color="textSecondary" className="mb-6">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </Typography>
            
            <Typography variant="body2" color="textSecondary" className="mb-8">
              Don't worry though, we've got plenty of other options to get you back on track!
            </Typography>
            
            <Box className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Home />}
                size="large"
                className="flex-1"
              >
                Go to Homepage
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ArrowBack />}
                size="large"
                className="flex-1"
              >
                Go Back
              </Button>
            </Box>
            
            <Box className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="text" 
                color="primary" 
                startIcon={<Refresh />}
                size="large"
                className="flex-1"
              >
                Reload Page
              </Button>
              
              <Button 
                variant="text" 
                color="primary" 
                startIcon={<HelpOutline />}
                size="large"
                className="flex-1"
              >
                Contact Support
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box className="mt-8 text-center">
        <Typography variant="body2" color="textSecondary">
          Looking for something specific? Try searching or browsing our help center.
        </Typography>
      </Box>
    </Container>
  );
}