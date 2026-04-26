import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import { Link as RouterLink } from 'react-router-dom';

const bullets = [
  { label: 'Fast Pipeline', icon: <RocketLaunchRoundedIcon fontSize="small" /> },
  // { label: 'Cloud Sync', icon: <CloudDoneRoundedIcon fontSize="small" /> },
  { label: 'Private by Design', icon: <SecurityRoundedIcon fontSize="small" /> }
];

export default function HeroSection({ stats }) {
  return (
    <Box
      sx={{
        pt: { xs: 7, md: 10 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 12% 18%, rgba(15,118,110,0.2), transparent 34%), radial-gradient(circle at 88% 10%, rgba(249,115,22,0.2), transparent 35%), linear-gradient(180deg, #f3fbf8 0%, #f7faf9 100%)'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {bullets.map((item) => (
                <Chip key={item.label} icon={item.icon} label={item.label} sx={{ bgcolor: 'white' }} />
              ))}
            </Stack>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.8rem' }, lineHeight: 1.1 }}>
              Convert Image to PDF Online for Free
            </Typography>
            <Typography sx={{ mt: 2.5, color: 'text.secondary', fontSize: '1.1rem', maxWidth: 680 }}>
              ImageToPDFNow is a free online tool that allows you to convert images to PDF quickly and securely.
              Whether you are working with JPG, PNG, or other formats, you can easily turn your images into
              high-quality PDF files in seconds.
            </Typography>
            <Typography sx={{ mt: 1.6, color: 'text.secondary', fontSize: '1.02rem', maxWidth: 680 }}>
              Our platform is designed to be simple, fast, and accessible on all devices without requiring any
              registration or installation.
            </Typography>

            <Box
              sx={{
                mt: 2.4,
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(16, 42, 42, 0.08)',
                maxWidth: 680
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 0.7 }}>How to Convert Image to PDF</Typography>
              <Typography sx={{ color: 'text.secondary' }}>1. Upload your image files (JPG, PNG, etc.)</Typography>
              {/* <Typography sx={{ color: 'text.secondary' }}>2. Arrange or adjust them as needed</Typography> */}
              <Typography sx={{ color: 'text.secondary' }}>2. Click on "Convert to PDF"</Typography>
              <Typography sx={{ color: 'text.secondary' }}>3. Download your PDF instantly</Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.6} sx={{ mt: 3.5 }}>
              <Button variant="contained" size="large" component={RouterLink} to="/all-tools">
                Explore All Tools
              </Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/tools/merge-pdf">
                Try Merge PDF
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1.4}>
              {stats.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    bgcolor: 'white',
                    border: '1px solid rgba(16, 42, 42, 0.08)'
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{item.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
