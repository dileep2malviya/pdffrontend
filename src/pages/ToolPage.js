import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UploadWorkbench from '../components/UploadWorkbench';
import usePageSeo from '../hooks/usePageSeo';
import { fetchToolBySlug } from '../services/api';
import { allTools } from '../data/tools'; // Fallback
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { generateBreadcrumbSchema } from '../Utils/seoUtils';
import {
  loadAdSenseScript,
  useAdConsent,
  ADSENSE_CLIENT_ID,
  REQUIRE_CERTIFIED_CMP,
  hasCmpSignal,
  canServeAdsWithCurrentSetup
} from '../Utils/adConsent';

const defaultToolContent = {
  howItWorks: [
    'Upload the file that matches this tool type.',
    'Apply the settings shown in the workbench.',
    'Process and download the generated output file.'
  ],
  acceptedFormats: ['Input format depends on selected tool', 'Output generated after processing'],
  limits: ['Maximum file size: 20 MB per file', 'Maximum upload count: 50 files per job'],
  privacy: 'Files are uploaded to our processing service, stored on server storage during conversion, and removed after delivery or retention cleanup.',
  faq: [
    {
      question: 'Is this tool free to use?',
      answer: 'Yes. Core processing is available without account signup for normal usage.'
    },
    {
      question: 'Do I need to install software?',
      answer: 'No. This workflow runs in your browser with server-side processing for conversion tasks.'
    }
  ]
};

const toolDetailsBySlug = {
  'jpg-to-pdf': {
    howItWorks: ['Upload JPG, JPEG, JFIF, or PNG files.', 'Arrange image order for final page sequence.', 'Convert and download one PDF.'],
    acceptedFormats: ['Input: JPG, JPEG, JFIF, PNG', 'Output: PDF'],
    faq: [
      {
        question: 'Will image order be preserved?',
        answer: 'Yes. The final PDF follows the order you set before processing.'
      },
      {
        question: 'Can I combine many images in one PDF?',
        answer: 'Yes. Upload multiple images and generate a single merged PDF output.'
      }
    ]
  },
  'word-to-pdf': {
    howItWorks: ['Upload DOC or DOCX files.', 'Run conversion to build a PDF output.', 'Download the converted PDF document.'],
    acceptedFormats: ['Input: DOC, DOCX', 'Output: PDF']
  },
  'ppt-to-pdf': {
    howItWorks: ['Upload PPT or PPTX files.', 'Process slides into PDF pages.', 'Download the generated PDF.'],
    acceptedFormats: ['Input: PPT, PPTX', 'Output: PDF']
  },
  'excel-to-pdf': {
    howItWorks: ['Upload XLS or XLSX spreadsheets.', 'Generate a PDF view from workbook data.', 'Download the PDF result.'],
    acceptedFormats: ['Input: XLS, XLSX', 'Output: PDF']
  },
  'pdf-to-jpg': {
    howItWorks: ['Upload one PDF file.', 'Convert pages into JPG images.', 'Download a single JPG or a ZIP for multi-page files.'],
    acceptedFormats: ['Input: PDF', 'Output: JPG (or ZIP of JPG files)']
  },
  'merge-pdf': {
    howItWorks: ['Upload two or more PDF files.', 'Set file order before processing.', 'Download one merged PDF.'],
    acceptedFormats: ['Input: PDF', 'Output: PDF']
  },
  'split-pdf': {
    howItWorks: ['Upload a single PDF file.', 'Split pages into separate PDF files.', 'Download the ZIP package.'],
    acceptedFormats: ['Input: PDF', 'Output: ZIP containing split PDF pages']
  },
  'compress-pdf': {
    howItWorks: ['Upload one PDF file.', 'Apply compression profile automatically.', 'Download the reduced-size PDF.'],
    acceptedFormats: ['Input: PDF', 'Output: PDF']
  },
  'protect-pdf': {
    howItWorks: ['Upload one PDF file.', 'Set user and owner password options.', 'Download password-protected PDF output.'],
    acceptedFormats: ['Input: PDF', 'Output: password-protected PDF']
  },
  'edit-pdf': {
    howItWorks: ['Upload one PDF file.', 'Configure overlay text and placement.', 'Download edited PDF output.'],
    acceptedFormats: ['Input: PDF', 'Output: edited PDF']
  },
  'watermark-pdf': {
    howItWorks: ['Upload one PDF file.', 'Set watermark text, style, and page scope.', 'Download watermarked PDF output.'],
    acceptedFormats: ['Input: PDF', 'Output: watermarked PDF']
  },
  'sign-pdf': {
    howItWorks: ['Upload one PDF file.', 'Add signer details and signature input.', 'Download signed PDF output.'],
    acceptedFormats: ['Input: PDF', 'Output: signed PDF']
  }
};


export default function ToolPage() {
  const { toolSlug } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const adConsent = useAdConsent();
  const isCmpDetected = hasCmpSignal();
  const canServeAds = canServeAdsWithCurrentSetup(adConsent);

  const navigate = useNavigate();

  // Generate breadcrumb schema
  const breadcrumbSchema = tool ? generateBreadcrumbSchema([
    { label: 'Home', path: '/' },
    { label: 'Tools', path: '/all-tools' },
    { label: tool.name, path: `/tools/${tool.slug}` }
  ]) : null;

  useEffect(() => {
    let timer;
    let isActive = true;

    if (tool && canServeAds) {
      loadAdSenseScript().then((isLoaded) => {
        if (!isLoaded || !isActive) {
          return;
        }

        timer = setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            // ad blocked or not loaded
          }
        }, 500);
      });
    }

    return () => {
      isActive = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tool, canServeAds]);

  usePageSeo({
    title: tool ? tool.name : 'Tool Not Found',
    description: tool
      ? `${tool.name}: ${tool.description}`
      : 'The requested PDF tool is not available.',
    canonicalPath: tool ? `/tools/${tool.slug}` : '/all-tools',
    keywords: tool ? `${tool.name.toLowerCase()}, pdf, ${tool.group.toLowerCase()}` : '',
    schema: breadcrumbSchema
  });

  useEffect(() => {
    const loadTool = async () => {
      try {
        const data = await fetchToolBySlug(toolSlug);
        setTool(data);
      } catch (err) {
        console.warn('API not available, using fallback data:', err.message);
        const fallbackTool = allTools.find((item) => item.slug === toolSlug);
        setTool(fallbackTool || null);
      } finally {
        setLoading(false);
      }
    };
    loadTool();
  }, [toolSlug]);

  if (loading) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Loading...</Container>;
  if (error && !tool) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Error: {error}</Container>;

  if (!tool) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3">Tool Not Found</Typography>
        <Button sx={{ mt: 2 }} variant="contained" component={RouterLink} to="/all-tools">
          Browse All Tools
        </Button>
      </Container>
    );
  }

  const handleBackClick = () => {
    navigate('/all-tools');
  };

  const toolContent = {
    ...defaultToolContent,
    ...(toolDetailsBySlug[tool.slug] || {})
  };

  return (
    <Container maxWidth="xl" sx={{ py: 7 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Button variant="text" color="inherit" size="large" onClick={handleBackClick} startIcon={<ArrowBackRoundedIcon />}>
            Back
          </Button>
          <Chip label={tool.group} sx={{ bgcolor: 'rgba(15, 118, 110, 0.1)', color: 'primary.main' }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mt: 1.5 }}>
            {tool.name}
          </Typography>
          <Typography sx={{ mt: 1.2, color: 'text.secondary', maxWidth: 760 }}>{tool.description}</Typography>

          <Grid container spacing={2.2} sx={{ mt: 0.4, mb: 1.2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 2.4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                    How This Tool Works
                  </Typography>
                  <Stack spacing={0.9}>
                    {toolContent.howItWorks.map((step, index) => (
                      <Typography key={step} sx={{ color: 'text.secondary' }}>
                        {index + 1}. {step}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 2.4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1 }}>
                    Accepted Formats and Limits
                  </Typography>
                  <Stack spacing={0.8}>
                    {toolContent.acceptedFormats.map((item) => (
                      <Typography key={item} sx={{ color: 'text.secondary' }}>
                        • {item}
                      </Typography>
                    ))}
                    {toolContent.limits.map((limit) => (
                      <Typography key={limit} sx={{ color: 'text.secondary' }}>
                        • {limit}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4, mb: 1.4 }}>
            <CardContent sx={{ p: 2.4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.9 }}>
                Privacy and Data Handling Note
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{toolContent.privacy}</Typography>
            </CardContent>
          </Card>

          <UploadWorkbench title={tool.name} toolSlug={tool.slug} />

          <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4, mt: 2.2 }}>
            <CardContent sx={{ p: 2.4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.2 }}>
                FAQ
              </Typography>
              <Stack spacing={1.2}>
                {toolContent.faq.map((item) => (
                  <Box key={item.question}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.4 }}>
                      {item.question}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.answer}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          {canServeAds ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client={ADSENSE_CLIENT_ID}
                data-ad-slot="9413515265"
              >
              </ins>
            </Box>
          ) : (
            <Card elevation={0} sx={{ border: '1px solid rgba(16, 42, 42, 0.1)', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Ad Preference
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {REQUIRE_CERTIFIED_CMP && adConsent === 'accepted' && !isCmpDetected
                      ? 'Ads are currently disabled because a certified CMP signal was not detected. Configure a Google-certified CMP for EEA/UK/CH traffic and then retry.'
                      : 'Ads are shown only after you accept advertising cookies. You can keep using this tool without ads or update your choice on the Privacy Policy page.'}
                  </Typography>
                  <Button variant="outlined" component={RouterLink} to="/privacy-policy" sx={{ alignSelf: 'flex-start' }}>
                    Manage Cookie Choice
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
