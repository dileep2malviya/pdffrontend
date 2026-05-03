import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import { featuredBlogArticles } from '../data/blogArticles';
import usePageSeo from '../hooks/usePageSeo';
import { fetchHomeContent } from '../services/api';
import { toolGroups, trustPoints, stats } from '../data/tools';

const homeBenefits = [
  {
    title: 'Free',
    description: 'Convert images to PDF without paying for a basic workflow or creating an account first.'
  },
  {
    title: 'Secure',
    description: 'Keep document handling straightforward with a clear tool flow and transparent policy pages.'
  },
  {
    title: 'Fast',
    description: 'Upload files, arrange page order, and download your PDF in a few direct steps.'
  },
  {
    title: 'No signup',
    description: 'Open the homepage and start working immediately from desktop or mobile.'
  }
];

const homeFaq = [
  {
    question: 'Is it safe to convert images to PDF online?',
    answer:
      'For ordinary document workflows, yes. Start with files you are allowed to process, review the final PDF, and use trusted services with clear policy and contact pages.'
  },
  {
    question: 'Does converting images to PDF reduce quality?',
    answer:
      'Not necessarily. If the original images are clear and you avoid heavy compression, the PDF can remain very close to the source quality.'
  },
  {
    question: 'Can I combine multiple JPG or PNG images into one PDF?',
    answer:
      'Yes. Upload multiple images, arrange them in the correct order, and convert them into a single PDF file.'
  },
  {
    question: 'Do I need to sign up to use the homepage tool?',
    answer:
      'No. The homepage workflow is designed to let users upload, arrange, and convert files without a signup step.'
  },
  {
    question: 'Can I convert images to PDF from my phone?',
    answer:
      'Yes. The tool works from mobile browsers, which makes it useful for receipts, notes, forms, and scanned pages captured on a phone.'
  },
  {
    question: 'What image formats can I use before converting to PDF?',
    answer:
      'JPG and PNG are the most common inputs, and similar image formats can often be handled depending on the workflow.'
  }
];

export default function HomePage() {
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'ImageToPDFNow',
        url: 'https://www.imagetopdfnow.com',
        logo: 'https://www.imagetopdfnow.com/logo512.png',
        description: 'Free online PDF tools for conversion, editing, and document management',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          url: 'https://www.imagetopdfnow.com/contact'
        },
        sameAs: []
      },
      {
        '@type': 'FAQPage',
        mainEntity: homeFaq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    ]
  };

  usePageSeo({
    title: 'Free Online PDF Tools',
    description:
      'Convert images to PDF online for free, arrange pages, and download a clean document in seconds. Explore PDF guides, FAQs, and tools for merge, edit, and file optimization.',
    canonicalPath: '/',
    keywords:
      'image to pdf, jpg to pdf, png to pdf, convert images to pdf online, free pdf tools, merge pdf, edit pdf, pdf blog',
    schema: organizationSchema,
    ogImage: 'https://www.imagetopdfnow.com/logo512.png'
  });

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const data = await fetchHomeContent();
        setHomeContent(data);
      } catch (err) {
        console.warn('API not available, using fallback data:', err.message);
        setHomeContent({ toolGroups, trustPoints, stats });
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>
        Loading...
      </Container>
    );
  }

  if (error && !homeContent) {
    return (
      <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>
        Error: {error}
      </Container>
    );
  }

  const content = homeContent || { toolGroups, trustPoints, stats };
  const { toolGroups: tg, trustPoints: tp, stats: st } = content;

  return (
    <>
      <HeroSection stats={st} />

      <Container maxWidth="xl">
        <Stack spacing={5} sx={{ mt: 1 }}>
          <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 5 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack spacing={2}>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.55rem', md: '2rem' } }}>
                  Convert Images to PDF Online in a Few Steps
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  ImageToPDFNow helps you convert JPG and PNG images into one clean PDF without a complicated workflow. You can upload image files from your computer or phone, arrange them in the right order, and create a PDF that is easier to share, print, and store than separate images. This is useful for receipts, scanned notes, assignments, application forms, invoices, and everyday document bundles. The homepage keeps the process simple for users who want fast results, while the rest of the site adds extra tools for merging, editing, protecting, and organizing PDFs. If you need a free image to PDF converter that works across devices, this homepage is built to get you from upload to download quickly.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2.4}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 5 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.55rem', md: '2rem' } }}>
                      How It Works
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      The homepage workflow is designed for quick image to PDF conversion with minimal setup.
                    </Typography>
                    <Stack spacing={1.2}>
                      <Typography sx={{ color: 'text.secondary' }}>1. Upload images from your device.</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        2. Arrange the order so each image becomes the correct PDF page.
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>3. Click convert and download your finished PDF.</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(16, 42, 42, 0.1)',
                  borderRadius: 5,
                  background:
                    'linear-gradient(145deg, rgba(15,118,110,0.08), rgba(249,115,22,0.08))'
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Stack spacing={1.4}>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.55rem', md: '2rem' } }}>
                      Benefits
                    </Typography>
                    {homeBenefits.map((benefit) => (
                      <Box key={benefit.title}>
                        <Typography sx={{ fontWeight: 700 }}>{benefit.title}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{benefit.description}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {tg.map((group) => (
            <Box key={group.title}>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {group.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.6 }}>{group.subtitle}</Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {group.tools.map((tool) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tool.slug}>
                    <ToolCard tool={{ ...tool, group: group.title }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Box
            sx={{
              mt: 8,
              p: { xs: 2.2, md: 4 },
              borderRadius: 5,
              background:
                'linear-gradient(125deg, rgba(15,118,110,0.11) 0%, rgba(249,115,22,0.10) 100%)',
              border: '1px solid rgba(16, 42, 42, 0.1)'
            }}
          >
            <Typography variant="h4">Why teams choose ImageToPDFNow</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {tp.map((point) => (
                <Grid size={{ xs: 12, md: 6 }} key={point}>
                  <Typography sx={{ color: 'text.secondary' }}>• {point}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.55rem', md: '2rem' } }}>
                  Learn More on the Blog
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.8, maxWidth: 780 }}>
                  Read practical guides about JPG to PDF conversion, quality, file size, editing, and document workflows.
                </Typography>
              </Box>
              <Button variant="outlined" component={RouterLink} to="/blog">
                View All Articles
              </Button>
            </Stack>

            <Grid container spacing={2.2} sx={{ mt: 1 }}>
              {featuredBlogArticles.slice(0, 3).map((article) => (
                <Grid size={{ xs: 12, md: 4 }} key={article.slug}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={1.2} sx={{ height: '100%' }}>
                        <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>{article.readTime}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {article.title}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', flexGrow: 1 }}>{article.description}</Typography>
                        <Button
                          variant="text"
                          component={RouterLink}
                          to={`/blog/${article.slug}`}
                          sx={{ alignSelf: 'flex-start', px: 0 }}
                        >
                          Learn more
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.55rem', md: '2rem' }, mb: 1.5 }}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={1.1}>
              {homeFaq.map((item) => (
                <Accordion
                  key={item.question}
                  elevation={0}
                  sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: '18px !important' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: 'text.secondary' }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 8,
            mb: 2,
            p: { xs: 2.4, md: 3.6 },
            borderRadius: 5,
            border: '1px solid rgba(16, 42, 42, 0.1)'
          }}
        >
          <Stack spacing={1.4}>
            <Typography variant="h4">Start Converting Now</Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 760 }}>
              Upload images, arrange the page order, convert them into one PDF, and download the file when it is ready. If you want deeper guidance first, browse the blog and learn more before you convert.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3}>
              <Button variant="contained" component={RouterLink} to="/">
                Use Homepage Tool
              </Button>
              <Button variant="outlined" component={RouterLink} to="/blog">
                Read Blog Guides
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
