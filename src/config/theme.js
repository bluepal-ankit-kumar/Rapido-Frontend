// theme.js
// Centralized theme configuration for Rapido Frontend

const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      main: '#FFD600',    // Rapido yellow
      light: '#FFEB3B',
      dark: '#FBC02D',
      contrastText: '#212121',
    },
    secondary: {
      main: '#212121',    // Dark gray
      light: '#424242',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
      hint: '#9E9E9E',
    },
    // Accent Colors
    accent: {
      main: '#FF9800',    // Orange
      light: '#FFB74D',
      dark: '#F57C00',
    },
    // Status Colors
    success: {
      main: '#388E3C',    // Green
      light: '#81C784',
      dark: '#2E7D32',
    },
    error: {
      main: '#D32F2F',    // Red
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#FFA000',    // Amber
      light: '#FFCA28',
      dark: '#FF8F00',
    },
    info: {
      main: '#1976D2',    // Blue
      light: '#42A5F5',
      dark: '#1565C0',
    },
    // Additional Colors
    divider: '#E0E0E0',
    border: '#EEEEEE',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Typography
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 16, // Base font size in px
    htmlFontSize: 16,
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    // Text variants
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },

  // Spacing
  spacing: {
    unit: 8, // Base spacing unit in px
    px: '1px', // 1px
    0: '0',
    0.5: '4px',
    1: '8px',
    1.5: '12px',
    2: '16px',
    2.5: '20px',
    3: '24px',
    3.5: '28px',
    4: '32px',
    5: '40px',
    6: '48px',
    7: '56px',
    8: '64px',
    9: '72px',
    10: '80px',
    11: '88px',
    12: '96px',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px', // For circular elements
  },

  // Breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    unit: 'px',
  },

  // Shadows
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.2)',
    '0px 1px 5px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 3px 1px rgba(0,0,0,0.2)',
    '0px 1px 8px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 3px 3px rgba(0,0,0,0.2)',
    '0px 2px 4px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 4px 4px rgba(0,0,0,0.2)',
    '0px 3px 5px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 5px 5px rgba(0,0,0,0.2)',
    '0px 3px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 6px 6px rgba(0,0,0,0.2)',
    '0px 4px 5px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 7px 7px rgba(0,0,0,0.2)',
    '0px 5px 5px rgba(0,0,0,0.12), 0px 3px 1px rgba(0,0,0,0.14), 0px 8px 8px rgba(0,0,0,0.2)',
    '0px 5px 6px rgba(0,0,0,0.12), 0px 3px 1px rgba(0,0,0,0.14), 0px 9px 9px rgba(0,0,0,0.2)',
    '0px 6px 6px rgba(0,0,0,0.12), 0px 3px 1px rgba(0,0,0,0.14), 0px 10px 10px rgba(0,0,0,0.2)',
    '0px 6px 7px rgba(0,0,0,0.12), 0px 3px 1px rgba(0,0,0,0.14), 0px 11px 11px rgba(0,0,0,0.2)',
    '0px 7px 8px rgba(0,0,0,0.12), 0px 4px 2px rgba(0,0,0,0.14), 0px 12px 12px rgba(0,0,0,0.2)',
    '0px 7px 8px rgba(0,0,0,0.12), 0px 5px 3px rgba(0,0,0,0.14), 0px 14px 14px rgba(0,0,0,0.2)',
    '0px 8px 9px rgba(0,0,0,0.12), 0px 5px 3px rgba(0,0,0,0.14), 0px 16px 16px rgba(0,0,0,0.2)',
    '0px 8px 10px rgba(0,0,0,0.12), 0px 6px 3px rgba(0,0,0,0.14), 0px 18px 18px rgba(0,0,0,0.2)',
    '0px 9px 11px rgba(0,0,0,0.12), 0px 7px 3px rgba(0,0,0,0.14), 0px 20px 20px rgba(0,0,0,0.2)',
    '0px 9px 12px rgba(0,0,0,0.12), 0px 7px 4px rgba(0,0,0,0.14), 0px 22px 22px rgba(0,0,0,0.2)',
    '0px 10px 13px rgba(0,0,0,0.12), 0px 8px 5px rgba(0,0,0,0.14), 0px 24px 24px rgba(0,0,0,0.2)',
    '0px 10px 13px rgba(0,0,0,0.12), 0px 8px 5px rgba(0,0,0,0.14), 0px 26px 26px rgba(0,0,0,0.2)',
    '0px 11px 14px rgba(0,0,0,0.12), 0px 9px 5px rgba(0,0,0,0.14), 0px 28px 28px rgba(0,0,0,0.2)',
    '0px 11px 15px rgba(0,0,0,0.12), 0px 9px 6px rgba(0,0,0,0.14), 0px 30px 30px rgba(0,0,0,0.2)',
  ],

  // Z-index
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // Transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  // Components
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.colors.primary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    // Add more component overrides as needed
  },
};

export default theme;