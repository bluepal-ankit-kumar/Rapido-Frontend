// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#FFC107' }, // Rapido yellow
    secondary: { main: '#4CAF50' },
    background: { default: '#F5F5F5' },
    text: { primary: '#333333' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: { textTransform: 'capitalize' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: { 
          color: '#757575',
          '&.Mui-selected': { color: '#FFC107' }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: { 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          backgroundColor: '#FFFFFF'
        }
      }
    }
  }
});

export default theme;