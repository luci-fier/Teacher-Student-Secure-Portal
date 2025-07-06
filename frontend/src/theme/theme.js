import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#BF0C4F',
      light: '#D06168',
      dark: '#8B0A3D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#BF0C4F',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 22px',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: '#BF0C4F',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#D06168',
          },
        },
        outlined: {
          borderColor: '#BF0C4F',
          color: '#BF0C4F',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#EEF0F8',
            },
            '&:hover fieldset': {
              borderColor: '#BF0C4F',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#BF0C4F',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#333333',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#BF0C4F',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#000000',
    },
    h6: {
      fontWeight: 500,
      color: '#000000',
    },
    body1: {
      color: '#333333',
    },
    body2: {
      color: '#666666',
    },
  },
});