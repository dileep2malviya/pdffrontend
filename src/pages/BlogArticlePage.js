import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { blogArticleMap } from '../data/blogArticles';
import usePageSeo from '../hooks/usePageSeo';

function BlogArticleContent({ article }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    mainEntityOfPage: `https://www.imagetopdfnow.com/blog/${article.slug}`,
    author: {
      '@type': 'Organization',
      name: 'ImageToPDFNow'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ImageToPDFNow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.imagetopdfnow.com/logo512.png'
      }
    },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    articleSection: 'PDF Guides'
  };

  usePageSeo({
    title: article.title,
    description: article.description,
    canonicalPath: `/blog/${article.slug}`,
    keywords: `${article.title.toLowerCase()}, pdf guide, pdf tips, online pdf tools`,
    schema: articleSchema
  });

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={3.5}>
        <Breadcrumbs>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/blog" underline="hover" color="inherit">
            Blog
          </Link>
          <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>

        <Box>
          <Chip label={article.readTime} color="primary" sx={{ mb: 1.5 }} />
          <Typography component="h1" variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            {article.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.4, fontSize: '1.05rem' }}>
            {article.description}
          </Typography>
        </Box>

        {article.sections.map((section) => (
          <Box key={section.heading}>
            <Typography component="h2" variant="h4" sx={{ mb: 1.5, fontSize: { xs: '1.55rem', md: '2rem' } }}>
              {section.heading}
            </Typography>
            <Stack spacing={2}>
              {section.paragraphs.map((paragraph) => (
                <Typography key={paragraph} sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {paragraph}
                </Typography>
              ))}
              {section.list ? (
                <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                  {section.list.map((item) => (
                    <Typography component="li" key={item} sx={{ color: 'text.secondary', mb: 0.9 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              ) : null}
            </Stack>
          </Box>
        ))}

        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 42, 42, 0.1)',
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(249,115,22,0.08))'
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.2 } }}>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1.2 }}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={1.7}>
              {article.faq.map((item) => (
                <Box key={item.question}>
                  <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {item.question}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{item.answer}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.2 } }}>
            <Stack spacing={1.4}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Try our free tool here
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Convert JPG and PNG images into a clean PDF in a few steps. Upload, arrange, convert, and download directly from the homepage.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button variant="contained" component={RouterLink} to="/">
                  Go to Homepage Tool
                </Button>
                <Button variant="outlined" component={RouterLink} to="/blog">
                  More Articles
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default function BlogArticlePage() {
  const { articleSlug } = useParams();
  const article = blogArticleMap[articleSlug];

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  return <BlogArticleContent article={article} />;
}