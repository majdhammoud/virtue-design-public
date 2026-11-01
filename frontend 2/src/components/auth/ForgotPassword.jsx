// --- Import React hooks, router, services, and UI components ---
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { checkEmailExists } from "../../services/loginService"; // Email existence check API

// MUI core components
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  CircularProgress,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// MUI icons
import {
  Email,
  ArrowBack,
  Send,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// --- Styled Components ---
// Card container for the Forgot Password form
const ForgotPasswordCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 500,
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

// Button for submitting the email
const SubmitButton = styled(Button)(({ theme }) => ({
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

// Button for going back to previous page
const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

// --- ForgotPassword Component ---
const ForgotPassword = () => {
  // --- State management for email input and loading ---
  const [email, setEmail] = useState("");       // User's email input
  const [loading, setLoading] = useState(false); // Loading spinner
  const navigate = useNavigate();
  const theme = useTheme();

  // --- Email format validation using regex ---
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // --- Handle forgot password submission ---
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    // Check if the email format is correct
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Check if the email exists in the system before proceeding
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        toast.error("User does not exist!");
        return; // Stop further execution if the email does not exist
      }

      // If email exists, navigate to the verification page with email as state
      navigate("/verification", { state: { email } });
      
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Handler for going back to previous page ---
  const handleGoBack = () => {
    navigate(-1); // Go back in browser history
  };

  // --- Main render ---
  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          py: 4,
        }}
      >
        <Zoom in timeout={500}>
          <ForgotPasswordCard>
            <Stack spacing={3}>
              {/* Title and subtitle */}
              <Box textAlign="center">
                <Typography
                  variant="h4"
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
                  Forgot Password?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter your email to reset your password
                </Typography>
              </Box>

              {/* Email input field */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Action buttons: Submit and Go Back */}
              <Stack spacing={2}>
                <SubmitButton
                  variant="contained"
                  fullWidth
                  onClick={handleForgotPassword}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                >
                  {loading ? "Processing..." : "Submit"}
                </SubmitButton>

                <BackButton
                  variant="outlined"
                  fullWidth
                  onClick={handleGoBack}
                  disabled={loading}
                  startIcon={<ArrowBack />}
                >
                  Go Back
                </BackButton>
              </Stack>
            </Stack>
          </ForgotPasswordCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default ForgotPassword;
