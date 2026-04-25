import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UploadWorkbench from '../components/UploadWorkbench';
import usePageSeo from '../hooks/usePageSeo';
import { fetchToolBySlug } from '../services/api';
import { allTools } from '../data/tools'; // Fallback
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';


export default function ToolPage() {
  const { toolSlug } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ad blocked or not loaded
    }
  }, [tool]);

  usePageSeo({
    title: tool ? tool.name : 'Tool Not Found',
    description: tool
      ? `${tool.name} online with a modern and optimized workflow. ${tool.description}`
      : 'The requested PDF tool is not available.',
    canonicalPath: tool ? `/tools/${tool.slug}` : '/all-tools'
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
          <UploadWorkbench title={tool.name} toolSlug={tool.slug} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          {/* <Stack spacing={2}>
            <Box sx={{ p: 2.4, borderRadius: 4, bgcolor: 'white', border: '1px solid rgba(16,42,42,0.08)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesomeRoundedIcon color="primary" />
                <Typography variant="h6">Pro Features</Typography>
              </Stack>
              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                <Typography sx={{ color: 'text.secondary' }}>• Batch queue and auto retry</Typography>
                <Typography sx={{ color: 'text.secondary' }}>• Preset profiles for frequent tasks</Typography>
                <Typography sx={{ color: 'text.secondary' }}>• Team sharing and activity logs</Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 2.4, borderRadius: 4, bgcolor: 'white', border: '1px solid rgba(16,42,42,0.08)' }}>
              <Typography variant="h6">Workflow Checklist</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
                  <Typography sx={{ color: 'text.secondary' }}>Upload file(s)</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
                  <Typography sx={{ color: 'text.secondary' }}>Set tool options</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
                  <Typography sx={{ color: 'text.secondary' }}>Export and continue</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack> */}
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-5792545548472697"
                data-ad-slot="9413515265"
              />
            </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
