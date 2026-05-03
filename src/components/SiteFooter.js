import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const quickLinks = [
  { label: 'Merge PDF', to: '/tools/merge-pdf' },
  // { label: 'Compress PDF', to: '/tools/compress-pdf' },
  { label: 'PDF to JPG', to: '/tools/pdf-to-jpg' },
  { label: 'Protect PDF', to: '/tools/protect-pdf' }
];

const companyLinks = [
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms' }
];

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ mt: 10, py: 6, borderTop: '1px solid rgba(16, 42, 42, 0.1)' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ImageToPDFNow
            </Typography>
            <Typography sx={{ mt: 1.2, color: 'text.secondary', maxWidth: 420 }}>
              A modern document workspace for converting, editing, organizing, and securing PDF files with speed and clarity.
            </Typography>
            <Typography sx={{ mt: 1.2, color: 'text.secondary' }}>
              Support: <Link href="mailto:contact@imagetopdfnow.com">contact@imagetopdfnow.com</Link>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Quick Tools</Typography>
            <Stack spacing={1.1}>
              {quickLinks.map((item) => (
                <Link key={item.to} component={RouterLink} to={item.to} underline="hover" color="inherit">
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Company</Typography>
            <Stack spacing={1.1}>
              {companyLinks.map((item) => (
                <Link key={item.to} component={RouterLink} to={item.to} underline="hover" color="inherit">
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Typography sx={{ mt: 5, color: 'text.secondary' }}>
          Copyright {new Date().getFullYear()} ImageToPDFNow.com All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
