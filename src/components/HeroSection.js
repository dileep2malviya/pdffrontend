import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import { Link as RouterLink } from 'react-router-dom';

const bullets = [
  { label: 'Fast Pipeline', icon: <RocketLaunchRoundedIcon fontSize="small" /> },
  { label: 'Cloud Sync', icon: <CloudDoneRoundedIcon fontSize="small" /> },
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
              Build, convert, and organize PDFs in one beautiful workspace.
            </Typography>
            <Typography sx={{ mt: 2.5, color: 'text.secondary', fontSize: '1.1rem', maxWidth: 680 }}>
              ImageToPDFNow brings every document tool together with a modern flow, reusable modules, and scalable architecture ready for growth.
            </Typography>
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
