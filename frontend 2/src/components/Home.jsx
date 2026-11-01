import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';

// =============== Styled Components ===============

/**
 * HeroSection:
 * The main banner section at the top, uses a blue gradient overlay.
 * Displays the app title and a description.
 */
const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(8),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(25,118,210,0.9) 0%, rgba(66,165,245,0.9) 100%)',
    zIndex: 1
  }
}));

/**
 * TeamCard:
 * Card to display each team member.
 */
const TeamCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

/**
 * StyledAvatar:
 * Large, circular avatar for team members.
 */
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[4]
}));

// =============== Main Homepage Component ===============

/**
 * Homepage
 * Main landing page of VirtuDesign.
 * Features a hero/banner section, project vision, team intro, and a logout dialog.
 */
function Homepage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Show the logout dialog popup
  const handleLogout = () => setShowLogoutPopup(true);

  // Confirm logout: remove token and redirect to login page
  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Cancel logout dialog
  const cancelLogout = () => setShowLogoutPopup(false);

  // Hardcoded info for each team member
  const teamMembers = [
    {
      name: 'Aya Kobtan',
      image: '/ayakobtan.jpg',
      role: 'Product manager and visionary behind VirtuDesign, aligning the platform with user needs and trends.',
    },
    {
      name: 'Majd Hammoud',
      image: '/majdhammoud.jpg',
      role: 'Lead developer, building and optimizing the backend infrastructure of VirtuDesign.',
    },
    {
      name: 'Cybelle Jabra',
      image: '/cybellejabra.jpg',
      role: 'Creative director, bringing the UI to life through design and user experience expertise.',
    },
  ];

  return (
    <div className="home-background">
    <Fade in timeout={1000}>
      <Box>
        {/* ================== Hero Banner ================== */}
        <HeroSection elevation={0}>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              {/* App Title */}
              <Zoom in timeout={1000}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  Welcome to VirtuDesign
                </Typography>
              </Zoom>
              {/* App Subtitle */}
              <Typography 
                variant="h5" 
                sx={{ 
                  maxWidth: '800px',
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                Transform your space with AI-powered interior design. Get personalized room makeovers with local furniture recommendations.
              </Typography>
            </Stack>
          </Container>
        </HeroSection>

        {/* ================== Mission Section ================== */}
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Why We Created VirtuDesign */}
            <Grid gridColumn={{ xs: 'span 12' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2]
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  fontWeight="bold"
                  color="primary"
                >
                  Why We Created VirtuDesign
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'text.secondary'
                  }}
                >
                  We created VirtuDesign to make beautiful, functional interior design accessible to everyone. 
                  Our AI-powered platform helps users get personalized room makeovers efficiently and affordably, 
                  while supporting local furniture stores and promoting sustainable design choices.
                </Typography>
              </Paper>
            </Grid>

            {/* ========== Team Section ========== */}
            <Grid gridColumn={{ xs: 'span 12' }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                fontWeight="bold"
                color="primary"
                sx={{ mb: 4 }}
              >
                Meet the Team
              </Typography>
              <Grid container spacing={4}>
                {/* Map each team member to a TeamCard */}
                {teamMembers.map((member, index) => (
                  <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }} key={member.name}>
                    <Zoom in timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                      <TeamCard>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3
                          }}
                        >
                          <StyledAvatar
                            src={process.env.PUBLIC_URL + member.image}
                            alt={member.name}
                          />
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              fontWeight="bold"
                              color="primary"
                            >
                              {member.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                lineHeight: 1.6,
                                fontSize: '0.95rem'
                              }}
                            >
                              {member.role}
                            </Typography>
                          </CardContent>
                        </Box>
                      </TeamCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* ================== Logout Confirmation Dialog ================== */}
        <Dialog 
          open={showLogoutPopup} 
          onClose={cancelLogout}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Are you sure you want to log out?
          </DialogTitle>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={cancelLogout} 
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmLogout} 
              variant="contained" 
              color="error"
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
    </div>
  );
}

export default Homepage;
