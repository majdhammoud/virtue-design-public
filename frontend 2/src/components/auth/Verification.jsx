import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { sendVerificationCode, verifyUser } from "../../services/loginService";
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
  Alert,
} from "@mui/material";
import {
  Email,
  ArrowBack,
  Send,
  VerifiedUser,
  Timer,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// ---------- Styled Components ----------

/**
 * Main wrapper card for the verification form, with glassmorphism style.
 */
const VerificationCard = styled(Paper)(({ theme }) => ({
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

/**
 * Styled button for main verification actions.
 */
const VerifyButton = styled(Button)(({ theme }) => ({
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

/**
 * Outlined back button (returns user to previous page).
 */
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

/**
 * CodeTextField - Large, spaced input for verification code.
 */
const CodeTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontSize: "1.5rem",
    letterSpacing: "0.5em",
    textAlign: "center",
    "& input": {
      textAlign: "center",
    },
  },
}));

// ---------- Main Component ----------

const Verification = () => {
  // Get state from navigation (email, etc.)
  const { state } = useLocation();
  const { email, username, password, confirmPassword } = state || {};

  // State variables
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [lockTime, setLockTime] = useState(null);   // Unix timestamp when lockout ends
  const [timeLeft, setTimeLeft] = useState(null);   // Lockout countdown in seconds
  const navigate = useNavigate();
  const theme = useTheme();

  // ------------- Lockout and Attempts (on mount) -------------
  useEffect(() => {
    const storedLockTime = localStorage.getItem("lockTime");
    const storedAttemptsLeft = localStorage.getItem("attemptsLeft");

    if (storedLockTime && storedAttemptsLeft) {
      const lockTime = parseInt(storedLockTime);
      const attemptsLeft = parseInt(storedAttemptsLeft);
      const timeLeft = lockTime - Date.now();

      if (timeLeft > 0) {
        setLockTime(lockTime);
        setAttemptsLeft(attemptsLeft);
        setTimeLeft(Math.ceil(timeLeft / 1000));
      } else {
        // Reset lockout and attempts
        localStorage.removeItem("lockTime");
        localStorage.removeItem("attemptsLeft");
        setLockTime(null);
        setAttemptsLeft(5);
        setTimeLeft(null);
      }
    }
  }, []);

  // ------------- Countdown Timer for Lockout -------------
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  /**
   * Formats seconds to MM:SS for display in lockout warning.
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // ------------- Handle Sending Verification Code -------------
  const handleSendVerificationCode = async () => {
    if (!email) {
      toast.error("Email is missing!");
      return;
    }

    // If locked, block action
    if (attemptsLeft === 0) {
      const remainingTime = Math.ceil((lockTime - Date.now()) / 1000);
      toast.error(`Please retry in ${formatTime(remainingTime)}.`);
      return;
    }

    setLoading(true);
    try {
      const response = await sendVerificationCode({ email });
      toast.success(response.message || "Verification code sent!");

      // Reduce attempts, store in localStorage for persistence
      setAttemptsLeft(attemptsLeft - 1);
      localStorage.setItem("attemptsLeft", attemptsLeft - 1);

      // If no attempts left, start lockout (10 min)
      if (attemptsLeft - 1 === 0) {
        const lockTime = Date.now() + 10 * 60 * 1000;
        setLockTime(lockTime);
        localStorage.setItem("lockTime", lockTime);
        setTimeLeft(10 * 60);
      }
    } catch (error) {
      toast.error(`Failed to send verification code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ------------- Handle Verifying Code -------------
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyUser(email, verificationCode);
      toast.success(result.message || "Verification successful!");
      navigate("/login");
    } catch (error) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ------------- Navigation Handler -------------
  const handleGoBack = () => {
    navigate(-1);
  };

  // ------------- Restricts Code Input to 6 Digits, Numeric Only -------------
  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
    }
  };

  // ---------- Render UI ----------
  return (
     <div className="verification-background">
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
          <VerificationCard>
            <Stack spacing={3}>
              {/* Title & Email Info */}
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
                  Verify Your Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter the verification code sent to:
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Email fontSize="small" />
                  {email}
                </Typography>
              </Box>

              {/* If locked out, show warning */}
              {attemptsLeft === 0 && (
                <Alert
                  severity="warning"
                  icon={<Timer />}
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  Please wait {formatTime(timeLeft)} before trying again
                </Alert>
              )}

              <Stack spacing={2}>
                {/* Button: Send Verification Code */}
                <VerifyButton
                  variant="contained"
                  fullWidth
                  onClick={handleSendVerificationCode}
                  disabled={loading || attemptsLeft === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </VerifyButton>

                {/* 6-digit Code Input */}
                <CodeTextField
                  fullWidth
                  label="Verification Code"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  disabled={loading}
                  inputProps={{
                    maxLength: 6,
                    pattern: "[0-9]*",
                    inputMode: "numeric",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {verificationCode.length}/6
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Attempts info */}
                <Typography variant="caption" color="text.secondary" align="center">
                  {attemptsLeft > 0
                    ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining`
                    : "No attempts remaining"}
                </Typography>

                {/* Button: Submit Verification */}
                <VerifyButton
                  variant="contained"
                  fullWidth
                  onClick={handleVerifyCode}
                  disabled={loading || !verificationCode}
                  endIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </VerifyButton>

                {/* Button: Go Back */}
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
          </VerificationCard>
        </Zoom>
      </Box>
    </Fade>
    </div>
  );
};

export default Verification;
