import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Fade,
  Zoom,
  Stack,
  Button,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Email,
  Phone,
  WhatsApp,
  LinkedIn,
  GitHub,
  LocationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// --------- Styled Components ----------

/**
 * Main card for contact sections (company and team).
 * Uses a soft white gradient background, rounded corners, and subtle shadow.
 */
const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

/**
 * Button for contact actions (WhatsApp, email, etc.).
 */
const ContactButton = styled(Button)(({ theme }) => ({
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
 * Circular icon background for each contact method.
 */
const ContactIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: theme.palette.primary.dark,
  },
}));

/**
 * Main Contact Us page/component.
 * Displays company contact info and the project creators/team members.
 */
const ContactUs = () => {
  // Static contact information
  const contactInfo = {
    company: {
      phone: "+961 79152217",
      email: "virtudesign2025@outlook.com",
      location: "Beirut, Lebanon",
    },
    creators: [
      {
        name: "Aya Kobtan",
        role: "Product Manager",
        email: "kobtanaya@gmail.com",
        linkedin: "https://linkedin.com/in/aya-kobtan",
        github: "https://github.com/AyaKobtan5",
      },
      {
        name: "Majd Hammoud",
        role: "Lead Developer",
        email: "majdhammoud016@gmail.com",
        linkedin: "https://linkedin.com/in/majd-hammoud",
        github: "https://github.com/majdh04",
      },
      {
        name: "Cybelle Jabra",
        role: "Creative Director",
        email: "cjabra217@outlook.com",
        linkedin: "https://linkedin.com/in/cybelle-jabra",
        github: "https://github.com/cybellejabra",
      },
    ],
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            {/* ----------- Title & Subtitle ----------- */}
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
                Contact Us
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Get in touch with our team
              </Typography>
            </Box>

            {/* ----------- Main Contact Grid ----------- */}
            <Grid container spacing={4}>
              {/* --- Company Contact Information --- */}
              <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                <Zoom in timeout={500}>
                  <ContactCard>
                    <Stack spacing={3}>
                      {/* Section Title */}
                      <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Company Contact
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          We're here to help and answer any questions you might have
                        </Typography>
                      </Box>

                      {/* Phone, Email, Location */}
                      <Stack spacing={2}>
                        {/* Phone/WhatsApp */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <Phone />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Phone
                            </Typography>
                            <ContactButton
                              variant="outlined"
                              startIcon={<WhatsApp />}
                              href={`https://wa.me/96179152217`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {contactInfo.company.phone}
                            </ContactButton>
                          </Box>
                        </Box>

                        {/* Email */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <Email />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Email
                            </Typography>
                            <ContactButton
                              variant="outlined"
                              startIcon={<Email />}
                              href={`mailto:${contactInfo.company.email}`}
                            >
                              {contactInfo.company.email}
                            </ContactButton>
                          </Box>
                        </Box>

                        {/* Location */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <LocationOn />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Location
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {contactInfo.company.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Stack>
                  </ContactCard>
                </Zoom>
              </Grid>

              {/* --- Creator/Team Member Information --- */}
              <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                <Zoom in timeout={500} style={{ transitionDelay: "200ms" }}>
                  <ContactCard>
                    <Stack spacing={3}>
                      {/* Section Title */}
                      <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Meet the Team
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Get in touch with our talented creators
                        </Typography>
                      </Box>

                      {/* Creator cards */}
                      <Stack spacing={3}>
                        {contactInfo.creators.map((creator, index) => (
                          <Box key={creator.name}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {creator.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {creator.role}
                            </Typography>
                            {/* Contact icons: Email, LinkedIn, GitHub */}
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <IconButton
                                size="small"
                                href={`mailto:${creator.email}`}
                                sx={{ color: "primary.main" }}
                              >
                                <Email />
                              </IconButton>
                              <IconButton
                                size="small"
                                href={creator.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "primary.main" }}
                              >
                                <LinkedIn />
                              </IconButton>
                              <IconButton
                                size="small"
                                href={creator.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "primary.main" }}
                              >
                                <GitHub />
                              </IconButton>
                            </Stack>
                            {/* Divider between creators */}
                            {index < contactInfo.creators.length - 1 && (
                              <Divider sx={{ my: 2 }} />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </ContactCard>
                </Zoom>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default ContactUs;
