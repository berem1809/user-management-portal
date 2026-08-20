import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#4338CA',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontWeight: 800, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 700, letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, letterSpacing: '-0.015em' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    body1: {
      color: '#334155',
      lineHeight: 1.6,
    },
    body2: {
      color: '#475569',
      lineHeight: 1.5,
    }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          }
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          backgroundImage: 'none',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#94A3B8',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)',
              '& fieldset': {
                borderColor: '#4F46E5',
                borderWidth: '2px',
              }
            }
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#64748B',
            '&.Mui-focused': {
              color: '#4F46E5',
            }
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backgroundImage: 'none',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F1F5F9',
          padding: '16px 24px',
        },
        head: {
          backgroundColor: '#F8FAFC',
          color: '#64748B',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        }
      }
    }
  },
});

export default theme;
