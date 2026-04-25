import { Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ToolCard from '../components/ToolCard';
import usePageSeo from '../hooks/usePageSeo';
import { fetchTools } from '../services/api';
import { allTools } from '../data/tools'; // Fallback
import { generateBreadcrumbSchema } from '../utils/seoUtils';

export default function AllToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: 'Home', path: '/' },
    { label: 'All Tools', path: '/all-tools' }
  ]);

  usePageSeo({
    title: 'All PDF Tools',
    description: 'Browse all 15+ PDF conversion, editing, optimization, and security tools. Convert, merge, split, compress, edit and protect PDFs online for free.',
    canonicalPath: '/all-tools',
    keywords: 'pdf tools, convert, merge, split, compress, edit, protect, rotate, watermark, unlock, pdf converter, free pdf tools',
    schema: breadcrumbSchema
  });

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchTools();
        setTools(data);
      } catch (err) {
        console.warn('API not available, using fallback data:', err.message);
        setTools(allTools);
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);

  if (loading) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Loading...</Container>;
  if (error && tools.length === 0) return <Container maxWidth="xl" sx={{ py: 7, textAlign: 'center' }}>Error: {error}</Container>;

  const displayTools = tools.length > 0 ? tools : allTools;

  return (
    <Container maxWidth="xl" sx={{ py: 7 }}>
      <Stack spacing={1} sx={{ mb: 3.5 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>
          All PDF Tools
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Everything you need to work with PDFs, built in reusable modular flows.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {displayTools.map((tool) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tool.slug}>
            <ToolCard tool={tool} compact />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
