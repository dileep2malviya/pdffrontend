import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import blogArticles from '../data/blogArticles';
import usePageSeo from '../hooks/usePageSeo';

export default function BlogIndexPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ImageToPDFNow Blog',
    url: 'https://www.imagetopdfnow.com/blog',
    description:
      'Guides and tutorials for converting images to PDF, reducing file size, editing PDFs, and improving document workflows.',
    blogPost: blogArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      url: `https://www.imagetopdfnow.com/blog/${article.slug}`
    }))
  };

  usePageSeo({
    title: 'Blog',
    description:
      'Read practical guides about JPG to PDF conversion, PDF editing, compression, security, and everyday document workflows.',
    canonicalPath: '/blog',
    keywords:
      'pdf blog, jpg to pdf guide, pdf tips, online pdf tools, reduce pdf size, edit pdf free',
    schema: blogSchema
  });

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={4.5}>
        <Box>
          <Chip label="Guides and Tutorials" color="primary" sx={{ mb: 1.5 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            PDF Blog
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.3, maxWidth: 900 }}>
            Learn how to convert images to PDF, reduce file size, improve document quality, and handle common PDF tasks with simple step-by-step guidance.
          </Typography>
        </Box>

        <Grid container spacing={2.4}>
          {blogArticles.map((article) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={article.slug}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid rgba(16, 42, 42, 0.1)'
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Stack spacing={1.4} sx={{ height: '100%' }}>
                    <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>{article.readTime}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {article.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', flexGrow: 1 }}>{article.description}</Typography>
                    <Button component={RouterLink} to={`/blog/${article.slug}`} variant="outlined" sx={{ alignSelf: 'flex-start' }}>
                      Read Article
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}