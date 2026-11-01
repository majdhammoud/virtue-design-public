import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Fade,
  Zoom,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn,
  Language,
  Phone,
  Directions,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { getAllStores } from "../services/storeService";

// =========== Styled Components for Consistent UI ============

// Card for each store in the grid
const StoreCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

// Box for store image (with overlay)
const StoreImage = styled(Box)(({ theme }) => ({
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
  },
}));

// Distance chip (top-right overlay on store card)
const DistanceChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

// Button for actions (call, directions, website)
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

/**
 * NearestStores component:
 * Fetches all stores from backend, calculates distance to user,
 * and displays a card for each store sorted by proximity.
 */
const NearestStores = () => {
  // ========= State =========
  const [stores, setStores] = useState([]); // List of all stores from API
  const [loading, setLoading] = useState(true); // Loading spinner

  const theme = useTheme();

  // ========= Data Fetching: Get All Stores on Mount =========
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAllStores();
        setStores(response);
      } catch (error) {
        console.error("Error fetching nearest stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  /**
   * Calculates the distance in kilometers between the user's location (from localStorage)
   * and a given store using the Haversine formula.
   * If user location is missing, defaults to Beirut coordinates.
   * @param {object} store - Store object with Location.Coordinates [lon, lat]
   * @returns {number|null} - Distance in km, or null if data is missing
   */
  const calculateDistance = (store) => {
    // Try to get user's location from localStorage; fallback to Beirut if missing
    const userLocation = JSON.parse(localStorage.getItem("userLocation"));
    const userLat = userLocation ? userLocation.lat : 35.5018; // Latitude (Beirut)
    const userLon = userLocation ? userLocation.lon : 33.8938; // Longitude (Beirut)

    // Check store has coordinates
    if (!store.Location?.Coordinates) {
      return null;
    }

    // Store coordinates: [lon, lat]
    const [storeLon, storeLat] = store.Location.Coordinates;

    // Convert all coordinates from degrees to radians
    const userLatRad = userLat * Math.PI / 180;
    const userLonRad = userLon * Math.PI / 180;
    const storeLatRad = storeLat * Math.PI / 180;
    const storeLonRad = storeLon * Math.PI / 180;

    // Haversine distance formula
    const deltaLat = storeLatRad - userLatRad;
    const deltaLon = storeLonRad - userLonRad;
    const R = 6371; // Radius of Earth in kilometers

    const a = Math.sin(deltaLat/2) ** 2 +
              Math.cos(userLatRad) * Math.cos(storeLatRad) *
              Math.sin(deltaLon/2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return Number(distance.toFixed(1)); // Round to 1 decimal place
  };

  // ========= Loading State =========
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // ========= Render =========
  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            {/* Page header */}
            <Box textAlign="center">
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Nearest Stores
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Find the closest furniture stores to your location
              </Typography>
            </Box>

            {/* Stores grid, sorted by calculated distance */}
            <Grid container spacing={4}>
              {stores
                .sort((a, b) => {
                  const distanceA = calculateDistance(a);
                  const distanceB = calculateDistance(b);
                  return distanceA - distanceB;
                })
                .map((store, index) => (
                  <Grid item xs={12} sm={6} md={4} key={store._id}>
                    <Zoom in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                      <StoreCard>
                        {/* Store image with distance chip */}
                        <StoreImage
                          sx={{
                            backgroundImage: `url(${store.image || "https://source.unsplash.com/random/800x600/?furniture-store"})`,
                          }}
                        >
                          <DistanceChip
                            icon={<LocationOn />}
                            label={`${calculateDistance(store)} km`}
                          />
                        </StoreImage>

                        {/* Store info and actions */}
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="h5" fontWeight={700} gutterBottom>
                                {store.StoreName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <LocationOn fontSize="small" />
                                {store.Address}
                              </Typography>
                            </Box>
                            {/* Action buttons: website, call, directions */}
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {store.Website && (
                                <ActionButton
                                  variant="outlined"
                                  startIcon={<Language />}
                                  href={store.Website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="small"
                                >
                                  Website
                                </ActionButton>
                              )}
                              {store.Phone && (
                                <ActionButton
                                  variant="outlined"
                                  startIcon={<Phone />}
                                  href={`tel:${store.Phone}`}
                                  size="small"
                                >
                                  Call
                                </ActionButton>
                              )}
                              {/* Always show Directions button (Google Maps) */}
                              <ActionButton
                                variant="contained"
                                startIcon={<Directions />}
                                href={`https://www.google.com/maps/dir/?api=1&destination=${store.Location.Coordinates[1]},${store.Location.Coordinates[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                              >
                                Directions
                              </ActionButton>
                            </Box>
                          </Stack>
                        </CardContent>
                      </StoreCard>
                    </Zoom>
                  </Grid>
                ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default NearestStores;
