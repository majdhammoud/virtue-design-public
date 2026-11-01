// src/App.js

// React imports
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

// App pages & components
import Login from "./components/auth/Login";
import Signup from "./components/auth/SignUp";
import Homepage from "./components/Home";
import Verification from "./components/auth/Verification";
import ContactUs from "./components/ContactUs";
import GenerateDesigns from "./components/create-design/GenerateDesigns";
import Profile from "./components/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import NearestStores from "./components/Store";
import SearchDesigns from "./components/SearchDesigns";
import Image3dViewer from "./components/model-viewer/Image3dViewer";
import Navbar from "./components/Navbar";

// UI and styling
import { 
  Container, 
  Box, 
  ThemeProvider, 
  createTheme,
  CssBaseline
} from "@mui/material";

// Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. Define a custom MUI theme for consistent styling throughout the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',     // Main blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',     // Purple accents
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',  // Light background for the entire app
      paper: '#ffffff',    // Cards, dialogs, etc.
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  // 2. State for tracking login status (used to conditionally show the sidebar/Navbar)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 3. On initial mount, check for token in localStorage to determine login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    setIsLoggedIn(!!token);
  }, []);

  return (
    // 4. Wrap the entire app in ThemeProvider for MUI theming
    <ThemeProvider theme={theme}>
      {/* 5. Reset browser CSS for consistency */}
      <CssBaseline />

      {/* 6. Main App Layout: Sidebar (Navbar) + Content */}
      <Box 
        sx={{ 
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* 7. Show Navbar/sidebar only when user is logged in */}
        {isLoggedIn && (
          <Box
            sx={{
              width: { xs: '100%', md: 'auto' },
              position: { xs: 'fixed', md: 'sticky' },
              top: 0,
              left: 0,
              height: { xs: 'auto', md: '100vh' },
              zIndex: 1200,
              bgcolor: 'background.paper',
              boxShadow: { xs: 2, md: 1 },
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
            }}
          >
            {/* Navbar accepts setIsLoggedIn to allow for logging out from sidebar */}
            <Navbar setIsLoggedIn={setIsLoggedIn} />
          </Box>
        )}

        {/* 8. Main content area, shifts width if sidebar is present */}
        <Box 
          sx={{ 
            flexGrow: 1,
            width: { xs: '100%', md: isLoggedIn ? 'calc(100% - 280px)' : '100%' },
            transition: 'margin 0.2s ease-in-out',
          }}
        >
          <Container 
            maxWidth="xl" 
            sx={{ 
              py: 3,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* 9. Define all app routes (pages) */}
            <Routes>
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/generate-designs" element={<GenerateDesigns />} />
              <Route path="/search-designs" element={<SearchDesigns />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/nearest-stores" element={<NearestStores />} />
              <Route path="/image-3d-viewer" element={<Image3dViewer />} />
            </Routes>
          </Container>
          
          {/* 10. Global notification container for all toasts */}
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
