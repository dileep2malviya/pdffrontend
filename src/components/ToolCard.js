import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { Link as RouterLink } from 'react-router-dom';

export default function ToolCard({ tool, compact = false }) {
  return (
    <Card sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CardActionArea
        component={RouterLink}
        to={`/tools/${tool.slug}`}
        sx={{
          height: '100%',
          p: compact ? 0.6 : 1,
          '&:hover .tool-arrow': { transform: 'translate(3px, -3px)' }
        }}
      >
        <CardContent>
          <Chip
            label={tool.group || 'PDF Tool'}
            size="small"
            sx={{ bgcolor: 'rgba(15, 118, 110, 0.1)', color: 'primary.main', mb: 2 }}
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.2}>
            <Typography variant="h6" sx={{ fontSize: compact ? '1.02rem' : '1.16rem' }}>
              {tool.name}
            </Typography>
            <ArrowOutwardRoundedIcon className="tool-arrow" sx={{ transition: 'transform 200ms ease' }} />
          </Stack>
          <Typography sx={{ mt: 1.1, color: 'text.secondary' }}>{tool.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
