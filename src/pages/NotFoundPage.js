import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import usePageSeo from '../hooks/usePageSeo';

export default function NotFoundPage() {
  usePageSeo({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    canonicalPath: '/404'
  });

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Stack spacing={1.6} alignItems="center">
        <Typography variant="h2">404</Typography>
        <Typography variant="h5">Page Not Found</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          The URL may be outdated or the page may have moved.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Back to Homepage
        </Button>
      </Stack>
    </Container>
  );
}
