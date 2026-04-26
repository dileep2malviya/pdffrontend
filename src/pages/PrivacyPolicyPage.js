import { Box, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material';
import usePageSeo from '../hooks/usePageSeo';
import { allTools } from '../data/tools';

export default function PrivacyPolicyPage() {
  usePageSeo({
    title: 'Privacy Policy',
    description:
      'Read the ImageToPDFNow Privacy Policy, including information on data use, cookies, analytics, advertising, and user rights.',
    canonicalPath: '/privacy-policy',
    keywords: 'privacy policy, cookies policy, adsense policy, user data, imagetopdfnow privacy'
  });

  const toolNames = allTools.map((tool) => tool.name).join(', ');

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.2}>
        <Box>
          <Chip label="Policy" color="primary" sx={{ mb: 1.4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.1 }}>
            Effective date: April 26, 2026
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.4, md: 3.2 } }}>
            <Stack spacing={2}>
              <Typography sx={{ color: 'text.secondary' }}>
                Welcome to ImageToPDFNow. This Privacy Policy explains how ImageToPDFNow collects, uses, and protects information when you use
                our website and tools, including: {toolNames}.
              </Typography>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  1. Information We Collect
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We may collect non-personal information such as browser type, device type, pages visited, approximate location, and usage data. If you contact us, we may collect your email address and message content.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  2. How We Use Information
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We use collected data to operate and improve our services, enhance user experience, ensure security, prevent fraud, and respond to inquiries.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  3. Cookies and Analytics
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                 We use cookies to store user preferences and improve website performance. You can disable cookies through your browser settings.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  4. Advertising and Google AdSense
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We use Google AdSense to display advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  5. Data Security
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We implement appropriate security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  6. Data Retention
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We retain information only as long as necessary for the purposes outlined in this policy.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  7. Consent
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  8. Contact Us
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  If you have any questions, contact us at: contact@imagetopdfnow.com.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
