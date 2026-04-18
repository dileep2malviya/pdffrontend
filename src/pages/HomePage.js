import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import usePageSeo from '../hooks/usePageSeo';
import { fetchHomeContent } from '../services/api';
import { toolGroups, trustPoints, stats } from '../data/tools'; // Fallback

export default function HomePage() {
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  usePageSeo({
    title: 'All-in-One PDF Tools',
    description:
      'Convert, merge, split, compress, edit, and protect PDFs with a high-performance modern interface.',
    canonicalPath: '/'
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

  if (loading) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Loading...</Container>;
  if (error && !homeContent) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Error: {error}</Container>;

  const content = homeContent || { toolGroups, trustPoints, stats };
  const { toolGroups: tg, trustPoints: tp, stats: st } = content;

  return (
    <>
      <HeroSection stats={st} />

      <Container maxWidth="xl">
        <Stack spacing={5} sx={{ mt: 1 }}>
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
        </Stack>

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
          <Typography variant="h4">Why teams choose PDF Orbit</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {tp.map((point) => (
              <Grid size={{ xs: 12, md: 6 }} key={point}>
                <Typography sx={{ color: 'text.secondary' }}>• {point}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
