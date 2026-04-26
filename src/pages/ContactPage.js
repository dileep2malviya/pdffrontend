import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import usePageSeo from '../hooks/usePageSeo';

const supportEmail = 'contact@imagetopdfnow.com';

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact ImageToPDFNow',
    description: 'Contact and support details for ImageToPDFNow.',
    url: 'https://www.imagetopdfnow.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'ImageToPDFNow',
      url: 'https://www.imagetopdfnow.com',
      email: supportEmail,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: supportEmail,
        availableLanguage: ['English']
      }
    }
  };

  usePageSeo({
    title: 'Contact Us',
    description:
      'Need help with ImageToPDFNow? Reach our support team at contact@imagetopdfnow.com for account, billing, API, and document workflow questions.',
    canonicalPath: '/contact',
    keywords:
      'contact imagetopdfnow, pdf support, customer support, adsense compliance, website contact page',
    schema: contactSchema
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.5}>
        <Box>
          <Chip label="Support and Business Contact" color="primary" sx={{ mb: 1.5 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Contact ImageToPDFNow
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: 900 }}>
            We are committed to reliable support, transparent policies, and responsible advertising practices.
            For all inquiries, email us and our team will respond as quickly as possible.
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={1.2}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Email Support
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Primary contact email for customer support, feedback, legal notices, and business communication:
              </Typography>
              <Link href={`mailto:${supportEmail}`} sx={{ fontSize: '1.05rem', fontWeight: 700, wordBreak: 'break-all' }}>
                {supportEmail}
              </Link>
              <Typography sx={{ color: 'text.secondary' }}>
                Typical response time: within 24 to 48 business hours.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
                  What We Can Help With
                </Typography>
                <Stack spacing={0.8}>
                  <Typography sx={{ color: 'text.secondary' }}>• PDF conversion and processing issues</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>• Account, subscription, and billing questions</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>• API and integration requests</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>• Copyright, abuse, or policy reports</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
                  Trust and Compliance Details
                </Typography>
                <Stack spacing={0.8}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    • We publish clear policy pages and update them when our practices change.
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    • Advertising may appear on this site, including Google AdSense placements.
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    • We do not support illegal use or copyright infringement.
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    • We review abuse and takedown requests submitted to our support email.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 42, 42, 0.1)',
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(249,115,22,0.08))'
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.2 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Important Site Information
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              For transparency and user protection, please review our policy pages. These pages explain data usage,
              acceptable usage, and legal terms for all users.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4}>
              <Button variant="contained" component={RouterLink} to="/privacy-policy">
                Privacy Policy
              </Button>
              <Button variant="outlined" component={RouterLink} to="/terms">
                Terms and Conditions
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
