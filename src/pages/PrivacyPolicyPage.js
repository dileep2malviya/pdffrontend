import { Box, Button, Card, CardContent, Chip, Container, Link, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import usePageSeo from '../hooks/usePageSeo';
import { allTools } from '../data/tools';
import { resetAdConsent, setAdConsent, useAdConsent } from '../Utils/adConsent';

export default function PrivacyPolicyPage() {
  const adConsent = useAdConsent();

  usePageSeo({
    title: 'Privacy Policy',
    description:
      'Read the ImageToPDFNow Privacy Policy, including information on data use, cookies, analytics, advertising, and user rights.',
    canonicalPath: '/privacy-policy',
    keywords: 'privacy policy, cookies policy, adsense policy, user data, imagetopdfnow privacy'
  });

  const toolNames = useMemo(() => allTools.map((tool) => tool.name).join(', '), []);
  const consentStatusLabel =
    adConsent === 'accepted'
      ? 'Accepted advertising cookies'
      : adConsent === 'rejected'
        ? 'Rejected advertising cookies'
        : 'No ad choice saved yet';

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.2}>
        <Box>
          <Chip label="Policy" color="primary" sx={{ mb: 1.4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.1 }}>
            Effective date: May 3, 2026
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 42, 42, 0.1)',
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(249,115,22,0.08))'
          }}
        >
          <CardContent sx={{ p: { xs: 2.4, md: 3.2 } }}>
            <Stack spacing={1.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Manage Cookie and Ad Consent
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Current status: {consentStatusLabel}. You can accept ad cookies, reject them, or clear the saved choice to show the consent banner again.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button variant="contained" onClick={() => setAdConsent('accepted')}>
                  Accept Ads
                </Button>
                <Button variant="outlined" onClick={() => setAdConsent('rejected')}>
                  Reject Ads
                </Button>
                <Button variant="text" color="inherit" onClick={resetAdConsent}>
                  Reset Choice
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

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
                  We may collect non-personal information such as browser type, device type, pages visited, approximate location, referral source, and usage data. If you contact us, we may collect your email address and the contents of your message so we can respond.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  2. Uploaded Files and Processing
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  When you use a conversion or editing tool, your files are sent to our processing system so the requested job can be completed. Uploaded files and generated outputs are written to server storage during processing and download delivery. We schedule cleanup after completion and also attempt cleanup after successful download, but no system can guarantee immediate deletion in every failure scenario.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  3. How We Use Information
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We use collected information to operate the website, complete document-processing requests, improve reliability, prevent abuse, measure site performance, and respond to support or legal inquiries.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  4. Cookies, Local Storage, and Consent
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We use cookies, local storage, and similar technologies to remember settings, support website performance, and store your ad-consent choice. If you reject ad cookies, we do not intentionally load Google AdSense ad code on pages that rely on this consent setting. For traffic in the EEA, UK, and Switzerland, publishers should use a Google-certified CMP that provides IAB TCF-compliant consent signals. You can also control cookies through your browser settings.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  5. Advertising and Google AdSense
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  If you accept ad cookies, we may load Google AdSense to display advertisements. Google and its partners may use cookies or similar technologies to measure ads and personalize advertising, subject to their own policies. You can learn more about how Google uses data on partner sites at{' '}
                  <Link href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
                    policies.google.com/technologies/partner-sites
                  </Link>
                  .
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  6. Data Retention
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We retain information only for as long as it is reasonably needed to operate the service, complete processing jobs, maintain logs, investigate abuse, or meet legal obligations. We do not guarantee indefinite storage of uploaded or generated files.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  7. Data Security
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We take reasonable steps to protect data in transit and at rest, but no Internet-based service can guarantee absolute security. You should avoid uploading documents unless you are comfortable with online processing risks.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  8. Your Choices
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  You can accept or reject ad cookies using the controls above, change browser cookie settings, and contact us if you need help with privacy or data handling questions.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  9. Contact Us
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  If you have any questions, abuse reports, or privacy requests, contact us at: contact@imagetopdfnow.com.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
