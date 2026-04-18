import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import SiteFooter from './SiteFooter';

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavigationBar />
      <Outlet />
      <SiteFooter />
    </Box>
  );
}
