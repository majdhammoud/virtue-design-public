import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  MobileStepper,
  Fade,
  Zoom,
  Stack,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Palette,
  Style,
  Update,
  CalendarToday,
  Email,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { updateUserPreferences } from "../services/userService";
import {
  getUserByUsername,
  getUserPreferences,
  recommendDesigns,
} from "../services/userService";
import SwipeableViews from "react-swipeable-views";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

// ========================
// Styled Components Section
// ========================

// Card for profile display
const ProfileCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  borderRadius: theme.spacing(2),
  background: "transparent",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

// Custom FormControl for selects
const PreferenceSelect = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

// Custom button for updates
const UpdateButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

// For displaying images of recommendations
const ImageCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

/**
 * Profile page component.
 * Shows user's info, lets them update their "vibe" and "color" preferences, and displays generated design recommendations.
 */
const Profile = () => {
  // ===== STATE HOOKS =====
  const [user, setUser] = useState(null); // User object (from backend)
  const [vibePreference, setVibePreference] = useState("None"); // User's design style
  const [colorPreference, setColorPreference] = useState("None"); // User's preferred color style
  const [error, setError] = useState(null); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [recommendations, setRecommendations] = useState([]); // Array of recommended designs
  const [activeStep, setActiveStep] = useState(0); // Index of current swipe in recommendations
  const maxSteps = recommendations.length; // Total recommendation slides
  const theme = useTheme();

  // ========== HANDLERS ==========
  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // ========== DROPDOWN OPTIONS ==========
  const vibeOptions = [
    "None",
    "Minimalist",
    "Rustic",
    "Modern",
    "Bohemian",
    "Industrial",
    "Traditional",
  ];
  const colorOptions = [
    "None",
    "Neutral",
    "Bold",
    "Pastel",
    "Monochromatic",
    "Earthy",
    "Vibrant",
  ];
  const navigate = useNavigate();

  // ========== DATA FETCHING ==========
  // On mount: fetch user, preferences, and design recommendations
  useEffect(() => {
    // Get user data from JWT token & backend
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        const user = await getUserByUsername(username);
        if (user) {
          setUser(user);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        setError("An error occurred while fetching user data.");
      }
    };

    // Get user preference settings
    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      try {
        const settings = await getUserPreferences(username);
        if (settings) {
          setVibePreference(settings.VibePreference || "None");
          setColorPreference(settings.ColorPreferences || "None");
        }
      } catch (error) {
        setVibePreference("None");
        setColorPreference("None");
      }
    };

    // Fetch recommended designs from backend (AI or rule-based)
    const recommendedDesigns = async () => {
      try {
        const designs = await recommendDesigns();
        setRecommendations(designs);
      } catch (error) {
        setVibePreference("None");
        setColorPreference("None");
      }
    };

    fetchPreferences();
    fetchUser();
    recommendedDesigns();
  }, [navigate]);

  // ========== HANDLER: Update preferences ==========
  const handleUpdate = async () => {
    try {
      await updateUserPreferences(user.Username, {
        VibePreference: vibePreference,
        ColorPreferences: colorPreference,
      });
      setSuccess("Preferences updated successfully!");
    } catch (err) {
      setError("Failed to update preferences.");
    }
  };

  // ========== RENDER ==========
  return (
     <div className="profile-background">
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "transparent", py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            {/* Header section */}
            <Box textAlign="center">
              <Typography
                variant="h2"
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
                Profile
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Manage your preferences and view your generated designs
              </Typography>
            </Box>

            {/* Main user info + preference update section */}
            {user ? (
              <Zoom in timeout={500}>
                <ProfileCard>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                      {/* Avatar + user info */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "primary.main",
                            fontSize: "2rem",
                          }}
                        >
                          {user.Username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight={700}>
                            {user.Username}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                            >
                              <Email fontSize="small" />
                              {user.Email}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                            >
                              <CalendarToday fontSize="small" />
                              {new Date(user.JoinDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>

                      {/* Preference dropdowns */}
                      <Stack spacing={3}>
                        {/* Vibe preference */}
                        <PreferenceSelect fullWidth variant="outlined">
                          <InputLabel>Vibe Preference</InputLabel>
                          <Select
                            value={vibePreference}
                            onChange={(e) => setVibePreference(e.target.value)}
                            label="Vibe Preference"
                            startAdornment={
                              <Style sx={{ mr: 1, color: "primary.main" }} />
                            }
                          >
                            {vibeOptions.map((vibe) => (
                              <MenuItem key={vibe} value={vibe}>
                                {vibe}
                              </MenuItem>
                            ))}
                          </Select>
                        </PreferenceSelect>
                        {/* Color preference */}
                        <PreferenceSelect fullWidth variant="outlined">
                          <InputLabel>Color Preference</InputLabel>
                          <Select
                            value={colorPreference}
                            onChange={(e) => setColorPreference(e.target.value)}
                            label="Color Preference"
                            startAdornment={
                              <Palette sx={{ mr: 1, color: "primary.main" }} />
                            }
                          >
                            {colorOptions.map((color) => (
                              <MenuItem key={color} value={color}>
                                {color}
                              </MenuItem>
                            ))}
                          </Select>
                        </PreferenceSelect>

                        {/* Update preferences button */}
                        <UpdateButton
                          variant="contained"
                          fullWidth
                          startIcon={<Update />}
                          onClick={handleUpdate}
                        >
                          Update Preferences
                        </UpdateButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </ProfileCard>
              </Zoom>
            ) : (
              // Show loading spinner if user info is not yet fetched
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            )}

            {/* Recommendation carousel, only show if user & designs exist */}
            {user && recommendations.length > 0 && (
              <Box>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Generated Designs
                </Typography>
                {/* Swipable designs carousel */}
                <SwipeableViews
                  index={activeStep}
                  onChangeIndex={setActiveStep}
                  enableMouseEvents
                >
                  {recommendations.map((rec, index) => (
                    <Zoom
                      in
                      timeout={500}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      key={rec._id}
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
                        {/* Generated model image */}
                        <ImageCard>
                          <img
                            src={`http://localhost:3001${rec.ModelURL}`}
                            alt="Generated Model"
                            style={{
                              width: "320px",
                              height: "320px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{ mt: 2, fontWeight: 600 }}
                          >
                            Generated Model
                          </Typography>
                        </ImageCard>
                        {/* Furniture info image */}
                        <ImageCard>
                          <img
                            src={rec.FurnitureUsedID?.FurniturePicture}
                            alt="Furniture"
                            style={{
                              width: "320px",
                              height: "320px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                          <Stack spacing={1} sx={{ mt: 2 }}>
                            <Typography variant="h6" align="center" fontWeight={700}>
                              {rec.FurnitureUsedID?.FurnitureName}
                            </Typography>
                            <Typography
                              variant="body2"
                              align="center"
                              color="text.secondary"
                            >
                              Material: {rec.MaterialsUsedID?.MaterialName}
                            </Typography>
                          </Stack>
                        </ImageCard>
                      </Box>
                    </Zoom>
                  ))}
                </SwipeableViews>

                {/* Stepper for the carousel */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                      <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        sx={{ minWidth: "auto", px: 2, fontWeight: 600 }}
                      >
                        Next <KeyboardArrowRight />
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{ minWidth: "auto", px: 2, fontWeight: 600 }}
                      >
                        <KeyboardArrowLeft />
                        Back
                      </Button>
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
            )}

            {/* Show error/success messages if any */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 28 },
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 28 },
                }}
              >
                {success}
              </Alert>
            )}
          </Stack>
        </Container>
      </Box>
    </Fade>
    </div>
  );
};

export default Profile;
