import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import usePageSeo from '../hooks/usePageSeo';

export default function StaticPage({ title, description, canonicalPath }) {
  usePageSeo({ title, description, canonicalPath });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={2}>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
          {title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 860 }}>{description}</Typography>

        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px solid rgba(16, 42, 42, 0.08)'
          }}
        >
          <Typography sx={{ color: 'text.secondary' }}>
            This section is production-ready for content expansion. You can connect APIs, authentication, billing, and CMS data without changing the core UI architecture.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4}>
          <Button variant="contained" component={RouterLink} to="/all-tools">
            Explore Tools
          </Button>
          <Button variant="outlined" component={RouterLink} to="/">
            Go Home
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
