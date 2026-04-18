import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e'
    },
    secondary: {
      main: '#f97316'
    },
    background: {
      default: '#f7faf9',
      paper: '#ffffff'
    },
    text: {
      primary: '#102a2a',
      secondary: '#446565'
    }
  },
  typography: {
    fontFamily: '"Sora", "Manrope", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.015em'
    },
    h3: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(16, 42, 42, 0.07)',
          boxShadow: '0 14px 34px rgba(15, 118, 110, 0.10)'
        }
      }
    }
  }
});

export default appTheme;
