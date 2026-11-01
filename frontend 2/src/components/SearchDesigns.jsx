import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  Typography,
  Button,
  Box,
  MobileStepper,
  Fade,
  Zoom,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Link,
  Container,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Store,
  Language,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { searchGeneratedDesigns } from "../services/userService";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ========================
// Styled Components Section
// ========================

// Card component for each part of design display (model or furniture)
const DesignCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

// Navigation button for carousel/stepper
const NavigationButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

// For design and furniture images
const DesignImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

/**
 * SearchDesigns page: Lets users swipe through available generated furniture designs.
 * Each design includes a model image, a furniture photo, info, and store links.
 */
const SearchDesigns = () => {
  // ========= State Hooks =========
  const [searchDesigns, setSearchDesigns] = useState([]); // Fetched design data
  const [activeStep, setActiveStep] = useState(0); // Which design is currently in view
  const [loading, setLoading] = useState(true); // Loading spinner state
  const maxSteps = searchDesigns.length; // For stepper/controls
  const theme = useTheme();
  const navigate = useNavigate();
  const swiperRef = useRef(null); // To control Swiper from buttons

  // ========= Swiper navigation handlers =========
  const handleNext = () => {
    if (swiperRef.current && activeStep < maxSteps - 1) {
      swiperRef.current.slideNext();
    }
  };
  const handleBack = () => {
    if (swiperRef.current && activeStep > 0) {
      swiperRef.current.slidePrev();
    }
  };

  // ========= Data Fetching =========
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        // Fetch all available generated designs from backend
        const designs = await searchGeneratedDesigns();
        setSearchDesigns(designs);
      } catch (error) {
        console.error("Error fetching designs:", error);
        toast.error("Error fetching designs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, [navigate]);

  // ========= Loading Spinner =========
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // ========= RENDER =========
  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            {/* Header */}
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
                Explore Designs
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Discover our collection of furniture designs
              </Typography>
            </Box>

            {/* If designs exist, show Swiper/Stepper carousel. Else, show a "no results" message. */}
            {searchDesigns.length > 0 ? (
              <Box>
                {/* Swiper for swipeable design carousel */}
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)} // Ref for external navigation
                  onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
                >
                  {searchDesigns.map((design, index) => (
                    <SwiperSlide key={design._id}>
                      <Zoom
                        in
                        timeout={500}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 4,
                            py: 4,
                          }}
                        >
                          {/* Model image card */}
                          <DesignCard>
                            <Stack spacing={2}>
                              <DesignImage
                                src={`http://localhost:3001${design.ModelURL}`}
                                alt="Generated Model"
                              />
                              <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{ fontWeight: 600 }}
                              >
                                Generated Model
                              </Typography>
                            </Stack>
                          </DesignCard>
                          {/* Furniture and store info card */}
                          <DesignCard>
                            <Stack spacing={2}>
                              <DesignImage
                                src={design.FurnitureUsedID?.FurniturePicture}
                                alt="Furniture"
                              />
                              <Stack spacing={1}>
                                <Typography variant="h6" align="center" fontWeight={700}>
                                  {design.FurnitureUsedID?.FurnitureName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  align="center"
                                  color="text.secondary"
                                >
                                  Material: {design.MaterialsUsedID?.MaterialName}
                                </Typography>
                                {/* Show store info if available */}
                                {design?.FurnitureUsedID?.StoreID && (
                                  <Box
                                    sx={{
                                      mt: 2,
                                      p: 2,
                                      bgcolor: "background.paper",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Stack spacing={1}>
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                      >
                                        <Store fontSize="small" color="primary" />
                                        {design?.FurnitureUsedID?.StoreID?.StoreName}
                                      </Typography>
                                      {/* Link to store website if present */}
                                      {design.FurnitureUsedID?.StoreID?.Website && (
                                        <Link
                                          href={design?.FurnitureUsedID?.StoreID?.Website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            color: "primary.main",
                                            "&:hover": {
                                              color: "primary.dark",
                                            },
                                          }}
                                        >
                                          <Language fontSize="small" />
                                          Visit Store Website
                                        </Link>
                                      )}
                                    </Stack>
                                  </Box>
                                )}
                              </Stack>
                            </Stack>
                          </DesignCard>
                        </Box>
                      </Zoom>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Stepper below Swiper for manual navigation */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                      <NavigationButton
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        endIcon={<KeyboardArrowRight />}
                      >
                        Next
                      </NavigationButton>
                    }
                    backButton={
                      <NavigationButton
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<KeyboardArrowLeft />}
                      >
                        Back
                      </NavigationButton>
                    }
                    sx={{
                      width: "fit-content",
                      background: "transparent",
                      "& .MuiMobileStepper-dot": {
                        width: 10,
                        height: 10,
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              // "No designs found" state
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No designs found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search criteria
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default SearchDesigns;
