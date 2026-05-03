import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  loadAdSenseScript,
  setAdConsent,
  useAdConsent
} from '../Utils/adConsent';

export default function CookieConsentBanner() {
  const adConsent = useAdConsent();

  const handleAccept = async () => {
    setAdConsent('accepted');
    await loadAdSenseScript();
  };

  const handleDecline = () => {
    setAdConsent('rejected');
  };

  if (adConsent) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        left: { xs: 12, md: 24 },
        right: { xs: 12, md: 24 },
        bottom: { xs: 12, md: 24 },
        zIndex: 1400
      }}
    >
      <Card elevation={6} sx={{ borderRadius: 4, border: '1px solid rgba(16, 42, 42, 0.12)' }}>
        <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Cookie and Ad Consent
              </Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 860 }}>
                We use cookies and similar technologies to measure traffic and, if you allow it, load Google AdSense ads. For users in the EEA, UK, and Switzerland, a Google-certified CMP flow should be used. You can still set or update this site-level ad choice on the Privacy Policy page.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Button variant="outlined" component={RouterLink} to="/privacy-policy">
                Privacy Policy
              </Button>
              <Button variant="text" color="inherit" onClick={handleDecline}>
                Reject Ads
              </Button>
              <Button variant="contained" onClick={handleAccept}>
                Accept Ads
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}