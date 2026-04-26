import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import usePageSeo from '../hooks/usePageSeo';
import { toolGroups } from '../data/tools';

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ImageToPDFNow',
    url: 'https://www.imagetopdfnow.com',
    email: 'contact@imagetopdfnow.com',
    description:
      'ImageToPDFNow provides online PDF conversion, organization, and editing tools for individuals, teams, and businesses.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'contact@imagetopdfnow.com',
      availableLanguage: ['English']
    }
  };

  usePageSeo({
    title: 'About ImageToPDFNow',
    description:
      'Learn about ImageToPDFNow, our mission, and all available PDF features including conversion, editing, security, and document workflow tools.',
    canonicalPath: '/about',
    keywords:
      'about imagetopdfnow, pdf platform, pdf converter tools, merge split edit sign protect pdf online',
    schema: aboutSchema
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.5}>
        <Box>
          <Chip label="About Us" color="primary" sx={{ mb: 1.4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            About ImageToPDFNow
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.2, maxWidth: 920 }}>
            ImageToPDFNow is an online PDF workspace built to help users convert, organize, and edit documents in a
            fast and reliable way. We focus on clear workflows, practical tools, and transparent support for all users.
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.4, md: 3.2 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.2 }}>
              Features Available on This Website
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              The following tool categories and features are currently available on ImageToPDFNow.
            </Typography>

            <Grid container spacing={2}>
              {toolGroups.map((group) => (
                <Grid size={{ xs: 12, md: 4 }} key={group.title}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15, 118, 110, 0.06)' }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{group.title}</Typography>
                    <Stack spacing={0.5}>
                      {group.tools.map((tool) => (
                        <Typography key={tool.slug} sx={{ color: 'text.secondary' }}>
                          • {tool.name}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                  Our Mission
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  To provide accessible, easy-to-use PDF tools that work across devices and help users complete
                  document tasks without unnecessary complexity.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                  Support and Contact
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  For support, legal notices, policy questions, and business inquiries, contact our team at
                  contact@imagetopdfnow.com.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
