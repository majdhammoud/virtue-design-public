import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  CardMedia,
  Snackbar,
  Alert,
  useMediaQuery,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Divider,
  Fade,
  Zoom,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { 
  UploadFile, 
  Delete, 
  Image, 
  DesignServices,
  PriceCheck,
  Category
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import http from "../../http-common";
import { toast } from "react-toastify";

// ----------- Styled Components ------------

/**
 * Main container for the design generator (paper card).
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  margin: 'auto',
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  }
}));

/**
 * Card displaying image previews in the upload list.
 */
const ImagePreviewCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  height: 100,
  width: '100%',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

/**
 * Button for uploading images (styled for prominence).
 */
const UploadButton = styled(Button)(({ theme }) => ({
  height: 48,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
  }
}));

/**
 * Primary button for generating the design.
 */
const GenerateButton = styled(Button)(({ theme }) => ({
  height: 56,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  }
}));

// ----------- Main Functional Component ------------

const GenerateDesigns = () => {
  // ----------- State Management -----------
  const [prompt, setPrompt] = useState("");              // User's design prompt (not visible in form right now)
  const [images, setImages] = useState([]);              // Uploaded inspiration images (as File objects)
  const [loading, setLoading] = useState(false);         // Loading state for async actions
  const [response, setResponse] = useState(null);        // API response (contains image URL)
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar notification visibility
  const [roomType, setRoomType] = useState(null);        // Selected room type (id)
  const [roomTypes, setRoomTypes] = useState([]);        // List of room type options
  const [price, setPrice] = useState(0);                 // Budget input

  /**
   * Handle image upload change event.
   * Converts file list to array of File objects.
   */
  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  /**
   * Form submit handler: bundles all form data and calls API.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append("prompt", prompt);
    formData.append("roomType", roomType);
    formData.append("price", price);
    images.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token");
      const res = await http.post("/api/designs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(res.data);         // Save the API response
      setOpenSnackbar(true);         // Show snackbar for user feedback
    } catch (error) {
      console.error("Error generating designs:", error);
      toast.error(error.response?.data?.error || "Failed to generate design");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler for selecting a room type from the dropdown.
   */
  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  /**
   * Remove an uploaded image from the preview list.
   */
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /**
   * Fetch available room types (GET /api/room) on mount.
   * The results fill the dropdown options.
   */
  React.useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await http.get("/api/room", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomTypes(res.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  // ----------- UI Rendering ------------

  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <StyledPaper>
            <Stack spacing={4}>
              {/* ---------- Page Title ---------- */}
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Create Your Dream Space Today!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                  Unlock limitless interior design possibilities with our AI-powered tool
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* ---------- Main Form and Output ---------- */}
              <Grid container spacing={4}>
                {/* ---------- Input Form (Left Side) ---------- */}
                <Grid item xs={12} md={6}>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      {/* Room type selection */}
                      <FormControl fullWidth>
                        <InputLabel id="room-type-label">Room Type</InputLabel>
                        <Select
                          labelId="room-type-label"
                          value={roomType}
                          onChange={handleRoomTypeChange}
                          label="Room Type"
                          startAdornment={<Category sx={{ mr: 1, color: 'primary.main' }} />}
                        >
                          {roomTypes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                              {option.RoomName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Budget input */}
                      <TextField
                        label="Budget"
                        type="number"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        inputProps={{
                          min: 0,
                          step: 1,
                          onKeyPress: (event) => {
                            if (event.key === '-' || event.key === '+' || event.key === 'e') {
                              event.preventDefault();
                            }
                          },
                          onInput: (e) => {
                            if (e.target.value < 0) e.target.value = 0;
                          },
                        }}
                        InputProps={{
                          startAdornment: <PriceCheck sx={{ mr: 1, color: 'primary.main' }} />,
                        }}
                        helperText="Any budget works great!"
                      />

                      {/* Image upload button */}
                      <UploadButton
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFile />}
                        disabled={loading}
                      >
                        Add Your Inspiration Photos
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </UploadButton>

                      {/* Uploaded image count / instructions */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Image fontSize="small" />
                        {images.length > 0
                          ? `${images.length} wonderful image(s) ready to inspire!`
                          : "Ready to add your inspiration photos!"}
                      </Typography>

                      {/* Image previews, with remove button */}
                      {images.length > 0 && (
                        <Grid
                          container
                          spacing={1}
                          sx={{
                            maxHeight: 200,
                            overflowY: "auto",
                            p: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                          }}
                        >
                          {images.map((file, index) => (
                            <Grid item xs={4} sm={3} md={2} key={index}>
                              <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                                <ImagePreviewCard>
                                  <CardMedia
                                    component="img"
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    sx={{
                                      height: '100%',
                                      width: '100%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                  {/* Remove image button */}
                                  <IconButton
                                    size="small"
                                    onClick={() => removeImage(index)}
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      right: 4,
                                      bgcolor: 'rgba(255,255,255,0.9)',
                                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </ImagePreviewCard>
                              </Zoom>
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      {/* Generate button (submit) */}
                      <GenerateButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DesignServices />}
                      >
                        {loading ? "Creating Magic..." : "Transform My Space!"}
                      </GenerateButton>
                    </Stack>
                  </form>
                </Grid>

                {/* ---------- Output/Preview Section (Right Side) ---------- */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      p: 2,
                      minHeight: 400,
                    }}
                  >
                    {/* Show generated image if present, else a placeholder */}
                    {response?.imageUrl ? (
                      <Zoom in timeout={500}>
                        <CardMedia
                          component="img"
                          src={`http://localhost:3001${response.imageUrl}`}
                          alt="Your Beautiful Design"
                          sx={{
                            borderRadius: 2,
                            maxHeight: 400,
                            width: '100%',
                            objectFit: 'contain',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          }}
                        />
                      </Zoom>
                    ) : (
                      <Stack spacing={2} alignItems="center" textAlign="center">
                        <DesignServices sx={{ fontSize: 60, color: 'primary.light', opacity: 0.7 }} />
                        <Typography
                          variant="h6"
                          color="primary.main"
                          sx={{ fontWeight: 600 }}
                        >
                          Your amazing design will appear here!
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ opacity: 0.7 }}
                        >
                          Share your inspiration and we'll create something beautiful just for you
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </StyledPaper>
        </Container>

        {/* Snackbar: Shows feedback after a successful design generation */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            sx={{ width: '100%' }}
          >
            Amazing! Your beautiful design is ready!
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default GenerateDesigns;
