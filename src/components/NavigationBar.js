import { Link as RouterLink, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { useState } from 'react';

const navItems = [
  { label: 'All Tools', to: '/all-tools' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const navLinkStyle = ({ isActive }) => ({
  fontWeight: 600,
  color: isActive ? '#0f766e' : '#244848',
  textDecoration: 'none'
});

export default function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(247, 250, 249, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(16, 42, 42, 0.08)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 74 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            component={RouterLink}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', flexGrow: { xs: 1, md: 0 } }}
          >
            <DescriptionRoundedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              PDF Orbit
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={3}
            sx={{ ml: 5, display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} style={navLinkStyle}>
                {item.label}
              </NavLink>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}>
            <Button variant="text" color="inherit" component={RouterLink} to="/login">
              Sign In
            </Button>
            <Button variant="contained" component={RouterLink} to="/register">
              Start Free
            </Button>
          </Stack>

          <IconButton sx={{ ml: 'auto', display: { md: 'none' } }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 260, p: 2.5 }}>
              <Stack spacing={2.2}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={navLinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button variant="contained" component={RouterLink} to="/register" onClick={() => setOpen(false)}>
                  Start Free
                </Button>
              </Stack>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
