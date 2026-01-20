// Header Component - Modern minimal design
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  useMediaQuery,
  Container,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FlightIcon from '@mui/icons-material/Flight';
import { useThemeMode } from '../contexts/ThemeContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 }, minHeight: 70 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="/skySearchLogo.png"
              alt="SkySearch Logo"
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'text.primary',
                  lineHeight: 1.1,
                  fontSize: isMobile ? '1.1rem' : '1.35rem',
                  background: isDark 
                    ? 'linear-gradient(90deg, #60a5fa 0%, #38bdf8 100%)'
                    : 'linear-gradient(90deg, #285fa7ff 0%, #38bdf8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SkySearch
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary', 
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                >
                  Find the best flight deals
                </Typography>
              )}
            </Box>
          </Box>

          {/* Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={toggleTheme}
              sx={{ 
                width: 44,
                height: 44,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { 
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.4s ease',
              }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <LightModeIcon sx={{ color: 'warning.main' }} />
              ) : (
                <DarkModeIcon sx={{ color: 'primary.main' }} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
