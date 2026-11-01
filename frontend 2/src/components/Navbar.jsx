import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography
} from '@mui/material';

/**
 * Sidebar navigation component.
 * 
 * Renders the main sidebar menu, logout logic, and current geolocation.
 * Props:
 *   - setIsLoggedIn: Function to update login state (for parent App)
 */
const Sidebar = ({ setIsLoggedIn }) => {
  // ====== STATE HOOKS ======
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Dialog for logout confirmation
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null }); // User's coordinates
  const [locationError, setLocationError] = useState(null); // Location fetch error

  // ====== LOGOUT FUNCTIONS ======
  // Show confirmation dialog
  const handleLogout = () => setShowLogoutPopup(true);

  // Actually log out the user after confirmation
  const confirmLogout = () => {
    toast.success('Logging out...', { autoClose: 2000 }); // Show notification
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/login')
      setIsLoggedIn(false);
    }, 2500); // Slight delay for UX
  };

  // Cancel the logout dialog
  const cancelLogout = () => setShowLogoutPopup(false);

  // ====== GEOLOCATION HOOK ======
  // Get user coordinates on mount, store in state and localStorage
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });

          // Save to localStorage for other parts of the app if needed
          localStorage.setItem('userLocation', JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }));
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  }, []); // Only run once on mount

  // ====== SIDEBAR MENU ITEMS ======
  const menuItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'My Profile', path: '/profile' },
    { label: 'Search Designs', path: '/search-designs' },
    { label: 'Generate Designs', path: '/generate-designs' },
    { label: 'Nearest Stores', path: '/nearest-stores' },
    { label: 'Contact Us', path: '/contactus' },
    { label: 'AR Modeling', path: '/image-3d-viewer' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      {/* ==== SIDEBAR DRAWER ==== */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1E1E2F',
            color: 'white',
          },
        }}
      >
        <List>
          {/* Logo at the top of the sidebar */}
          <Typography variant="h6" sx={{ color: 'white', padding: '16px 0 16px 16px' }}>
            <img src={process.env.PUBLIC_URL + 'logo.png'} alt="Logo" style={{ width: '150px', marginBottom: '16px' }} />
          </Typography>
          {/* Dynamic navigation menu */}
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? '#333' : 'transparent',
                '&:hover': { backgroundColor: '#444' },
              }}
            >
              <ListItemText primary={item.label} sx={{ color: location.pathname === item.path ? 'white' : '#ccc' }} />
            </ListItem>
          ))}
          <Divider sx={{ backgroundColor: '#ccc' }} />

          {/* Logout Button */}
          <ListItem button onClick={handleLogout} sx={{ backgroundColor: '#e57373', color: '#fff' }}>
            <ListItemText primary="Logout" />
          </ListItem>

          {/* Display user's geolocation or error */}
          <ListItem>
            {userLocation.lat && userLocation.lon ? (
              <Typography variant="body2" color="white">
                📍 You are at {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                ⚠️ {locationError}
              </Typography>
            )}
          </ListItem>
        </List>
      </Drawer>

      {/* ==== LOGOUT CONFIRMATION DIALOG ==== */}
      <Dialog open={showLogoutPopup} onClose={cancelLogout}>
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogActions>
          <Button onClick={confirmLogout} variant="contained" color="error">
            Yes
          </Button>
          <Button onClick={cancelLogout} variant="outlined">
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast notification container (popups for info/errors) */}
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
