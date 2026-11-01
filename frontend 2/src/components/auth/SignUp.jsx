import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
  Link,
  Fade,
  Zoom,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  CheckCircle,
  Cancel,
  ArrowForward,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  checkEmailExists,
  checkUsernameExists,
  registerUser,
} from "../../services/loginService";

// ---------- Styled Components ----------

/**
 * SignupCard - Main form wrapper for signup with glassmorphism background.
 */
const SignupCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "100%",
  maxWidth: 480,
  borderRadius: theme.spacing(2),
  background: "rgba(243, 243, 243, 0.79)", // translucent white
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.20)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#222",
  transition: "all 0.3s ease-in-out",
}));

/**
 * SignupButton - Styled button for create account action.
 */
const SignupButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

/**
 * SignupTextField - Rounded input fields for uniform look.
 */
const SignupTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.3s ease",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

/**
 * PasswordCheckItem - For listing password requirements (green/red feedback).
 */
const PasswordCheckItem = styled(ListItem)(({ theme, valid }) => ({
  color: valid ? theme.palette.success.main : theme.palette.error.main,
  transition: "all 0.3s ease",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
  },
}));

// ---------- Main SignUp Component ----------

const SignUp = () => {
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Live validation for password requirements
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const navigate = useNavigate();

  /**
   * Get user's geolocation on component mount (optional for analytics/security).
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  /**
   * Updates passwordChecks as user types, for live validation feedback.
   */
  const validatePassword = (pwd) => {
    setPasswordChecks({
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[@#$%^&*!]/.test(pwd),
    });
  };

  /**
   * Validate form inputs before submit.
   */
  const validateInputs = () => {
    if (!username || !password || !confirmPassword || !email) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!Object.values(passwordChecks).every((check) => check)) {
      toast.error("Password does not meet all the required criteria.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  /**
   * Handles the signup process:
   * - Validates input
   * - Checks for email/username duplication
   * - Calls backend to register user
   * - Navigates to verification page if successful
   */
  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.error("Email is already registered");
        return;
      }

      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        toast.error("Username is already taken");
        return;
      }

      await registerUser(
        email,
        username,
        password,
        confirmPassword,
        location.latitude,
        location.longitude
      );

      // Pass all necessary state to verification page
      navigate("/verification", {
        state: { email, username, password, confirmPassword },
      });
    } catch (error) {
      toast.error(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI Rendering Starts Here ----------

  return (
    <div className="signup-background">
      <Fade in timeout={800}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Zoom in timeout={500}>
            <SignupCard>
              <Stack spacing={1}>
                {/* Title + subtitle */}
                <Box textAlign="center">
                  <Typography
                    variant="h5"
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
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join us and start your design journey
                  </Typography>
                </Box>

                {/* Main form fields */}
                <Stack spacing={1}>
                  {/* Username input */}
                  <SignupTextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Email input */}
                  <SignupTextField
                    fullWidth
                    type="email"
                    label="Email"
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

                  {/* Password input with live validator */}
                  <SignupTextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password requirements */}
                  <Box
                    sx={{
                      background: "rgba(166, 166, 166, 0.11)", // semi-transparent, matches card
                      borderRadius: 1.5,
                      p: 1.2,
                      my: 0.5,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1.5px solid rgba(255,255,255,0.13)",
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Password Requirements:
                    </Typography>
                    <List dense>
                      <PasswordCheckItem valid={passwordChecks.minLength}>
                        {passwordChecks.minLength ? <CheckCircle /> : <Cancel />}
                        Minimum 8 characters
                      </PasswordCheckItem>
                      <PasswordCheckItem valid={passwordChecks.uppercase}>
                        {passwordChecks.uppercase ? <CheckCircle /> : <Cancel />}
                        At least one uppercase letter
                      </PasswordCheckItem>
                      <PasswordCheckItem valid={passwordChecks.lowercase}>
                        {passwordChecks.lowercase ? <CheckCircle /> : <Cancel />}
                        At least one lowercase letter
                      </PasswordCheckItem>
                      <PasswordCheckItem valid={passwordChecks.number}>
                        {passwordChecks.number ? <CheckCircle /> : <Cancel />}
                        At least one number
                      </PasswordCheckItem>
                      <PasswordCheckItem valid={passwordChecks.specialChar}>
                        {passwordChecks.specialChar ? <CheckCircle /> : <Cancel />}
                        At least one special character (@#$%^&*!)
                      </PasswordCheckItem>
                    </List>
                  </Box>

                  {/* Confirm password input */}
                  <SignupTextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                {/* Terms and conditions checkbox */}
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{" "}
                      <Link href="#" color="primary" underline="hover">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  }
                />

                {/* Submit button */}
                <SignupButton
                  variant="contained"
                  fullWidth
                  onClick={handleSignup}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </SignupButton>

                {/* Login link */}
                <Stack spacing={1}>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate("/login")}
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
            </SignupCard>
          </Zoom>
        </Box>
      </Fade>
    </div>
  );
};

export default SignUp;
