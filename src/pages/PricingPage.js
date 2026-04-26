import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import usePageSeo from '../hooks/usePageSeo';
import { toolGroups } from '../data/tools';

export default function PricingPage() {
  usePageSeo({
    title: 'Pricing',
    description:
      'All ImageToPDFNow tools are currently free to use, including PDF conversion, organization, editing, and security features.',
    canonicalPath: '/pricing',
    keywords: 'free pdf tools, pricing, image to pdf free, merge split edit sign protect pdf'
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={3.2}>
        <Box>
          <Chip label="Pricing" color="primary" sx={{ mb: 1.4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Simple Pricing: 100% Free
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.2, maxWidth: 920 }}>
            All features on our platform are currently 100% free to use. There are no hidden charges, subscriptions, or sign-ups required.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 42, 42, 0.1)',
            borderRadius: 4,
            background: 'linear-gradient(125deg, rgba(15,118,110,0.10) 0%, rgba(249,115,22,0.10) 100%)'
          }}
        >
          <CardContent sx={{ p: { xs: 2.6, md: 3.2 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              What You Get for Free
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              You can access all tools without any cost, including image conversion, PDF editing, and document management..
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2.2}>
          {toolGroups.map((group) => (
            <Grid size={{ xs: 12, md: 4 }} key={group.title}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                    {group.title}
                  </Typography>
                  <Stack spacing={0.55}>
                    {group.tools.map((tool) => (
                      <Typography key={tool.slug} sx={{ color: 'text.secondary' }}>
                        • {tool.name}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* <Grid container spacing={2.2}> */}
            {/* <Grid size={{ xs: 12, md: 4 }}> */}
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                    Why Choose ImageToPDFNow?
                  </Typography>
                  <Stack spacing={0.55}>
                      <Typography sx={{ color: 'text.secondary' }}>
                        • 100% free PDF tools
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        • No registration required
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        • Fast and secure processing
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        • Works on all devices
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        • Easy-to-use interface
                      </Typography>
                    
                  </Stack>
                </CardContent>
              </Card>
            {/* </Grid> */}
        {/* </Grid> */}

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.4, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
              Future Pricing Updates
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              We may introduce advanced features in the future. Any pricing changes will be clearly communicated on this page before they take effect.
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.4, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>
              Conclusion
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              If you are looking for a free and reliable way to convert images to PDF or manage PDF files online, ImageToPDFNow provides everything you need in one place—completely free.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
