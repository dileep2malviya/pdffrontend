import { Box, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material';
import usePageSeo from '../hooks/usePageSeo';
import { allTools } from '../data/tools';

export default function TermsPage() {
  usePageSeo({
    title: 'Terms and Conditions',
    description:
      'Review ImageToPDFNow Terms and Conditions for acceptable use, user responsibilities, intellectual property, and disclaimers.',
    canonicalPath: '/terms',
    keywords: 'terms and conditions, acceptable use policy, pdf tools terms, imagetopdfnow terms'
  });

  const toolSummary = allTools.map((tool) => tool.name).join(', ');

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.2}>
        <Box>
          <Chip label="Legal" color="primary" sx={{ mb: 1.4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Terms and Conditions
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.1 }}>
            Effective date: April 26, 2026
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.4, md: 3.2 } }}>
            <Stack spacing={2}>
              <Typography sx={{ color: 'text.secondary' }}>
                By using ImageToPDFNow and its tools ({toolSummary}), you agree to these Terms and Conditions.
              </Typography>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  1. Acceptable Use
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  You agree to use this website only for lawful purposes and only with content you own or are authorized
                  to process. You must not use the service to violate copyrights, privacy rights, or any applicable laws.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  2. User Responsibility
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  You are responsible for the documents and files you upload, convert, edit, or share. Please verify
                  output files before external distribution or legal use.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  3. Intellectual Property
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  ImageToPDFNow and its branding, interface, and software components are protected by applicable
                  intellectual property laws. Users retain ownership of their own documents.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  4. Service Availability
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We work to maintain reliable availability but do not guarantee uninterrupted or error-free access at
                  all times. Features may be updated, added, or removed as the platform evolves.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  5. Limitation of Liability
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  To the fullest extent permitted by law, ImageToPDFNow is not liable for indirect, incidental, or
                  consequential losses arising from your use of the service.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
                  6. Contact
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  For legal notices, copyright concerns, or general questions, contact contact@imagetopdfnow.com.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
