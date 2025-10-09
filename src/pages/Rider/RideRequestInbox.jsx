// In src/components/driver/RideRequestInbox.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import  { useState ,useEffect} from "react";
import { reverseGeocode } from "../../services/GeocodingService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import {
  LocationOn,
  Directions,
  CurrencyRupee,
  Straighten,
} from "@mui/icons-material";

// This is a single item in our list
const RideRequestItem = ({ request }) => {
  const navigate = useNavigate();
  const [pickupName, setPickupName] = useState(
    `${request.startLatitude.toFixed(4)}, ${request.startLongitude.toFixed(4)}`
  );
  const [dropoffName, setDropoffName] = useState(
    `${request.endLatitude.toFixed(4)}, ${request.endLongitude.toFixed(4)}`
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      // Fetch both addresses in parallel for performance
      const [pName, dName] = await Promise.all([
        reverseGeocode(request.startLatitude, request.startLongitude),
        reverseGeocode(request.endLatitude, request.endLongitude),
      ]);
      setPickupName(pName);
      setDropoffName(dName);
    };

    fetchAddresses();
  }, [
    request.startLatitude,
    request.startLongitude,
    request.endLatitude,
    request.endLongitude,
  ]);

  const handleViewDetails = () => {
    // Navigate to the detailed view page and pass the ride data
    navigate("/rider/accept-ride", {
      state: { rideDetails: { ...request, pickupName, dropoffName } },
    });
  };
  const cost = request.cost?.toFixed(2) ?? "0.00";
  const distance = request.distance?.toFixed(1) ?? "0.0";

  return (
    <Card
      variant="outlined"
      sx={{ mb: 2, borderRadius: 3, "&:hover": { boxShadow: 3 } }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <LocationOn color="primary" sx={{ mr: 1.5 }} />
              <Typography noWrap title={pickupName}>
                Pickup: {pickupName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Directions color="secondary" sx={{ mr: 1.5 }} />
              <Typography noWrap title={dropoffName}>
                Dropoff: {dropoffName}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ textAlign: { xs: "left", sm: "right" } }}
          >
            <Chip
              icon={<CurrencyRupee />}
              label={cost}
              color="success"
              sx={{ mb: 1, fontWeight: "bold" }}
            />
            <Chip
              icon={<Straighten />}
              label={`${distance} km`}
              variant="outlined"
              sx={{ mb: 1, ml: { xs: 1, sm: 0 } }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleViewDetails}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// This is the main component that holds the list
export default function RideRequestInbox({ requests }) {
  if (!requests || requests.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No active ride requests right now.
          </Typography>
          <Typography color="text.secondary">
            You will be notified here when a new ride is available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        Incoming Ride Requests ({requests.length})
      </Typography>
      <List>
        {requests.map((request) => (
          <ListItem key={request.id} sx={{ p: 0 }}>
            <RideRequestItem request={request} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
