// Header Component - Modern minimal design
import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  useMediaQuery,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useThemeMode } from '../contexts/ThemeContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDark, toggleTheme } = useThemeMode();
  
  // Help menu state
  const [helpAnchor, setHelpAnchor] = useState(null);
  const helpOpen = Boolean(helpAnchor);
  
  // Mobile menu state
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const mobileOpen = Boolean(mobileAnchor);

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

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* Help Icon */}
            <Tooltip title="Help & Info" arrow>
              <IconButton 
                onClick={(e) => setHelpAnchor(e.currentTarget)}
                sx={{ 
                  width: 40,
                  height: 40,
                  color: 'text.secondary',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  },
                  transition: 'all 0.2s ease',
                }}
                aria-label="Help"
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            
            {/* Help Menu */}
            <Menu
              anchorEl={helpAnchor}
              open={helpOpen}
              onClose={() => setHelpAnchor(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 280,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  How to use SkySearch
                </Typography>
              </Box>
              <Divider />
              <MenuItem sx={{ py: 1.5 }}>
                <ListItemIcon><SearchIcon fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Search Flights" 
                  secondary="Enter origin, destination & dates"
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }}>
                <ListItemIcon><FilterAltIcon fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Filter Results" 
                  secondary="By stops, price, airlines & time"
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }}>
                <ListItemIcon><CompareArrowsIcon fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Compare Prices" 
                  secondary="Use flexible dates calendar"
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </MenuItem>
              <Divider />
              <MenuItem sx={{ py: 1.5 }} onClick={() => setHelpAnchor(null)}>
                <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                <ListItemText 
                  primary="Version 1.0.0" 
                  secondary="© 2026 SkySearch"
                  primaryTypographyProps={{ fontSize: '0.85rem' }}
                  secondaryTypographyProps={{ fontSize: '0.7rem' }}
                />
              </MenuItem>
            </Menu>

            {/* Mobile App Icon */}
            <Tooltip title="Get Mobile App" arrow>
              <IconButton 
                onClick={(e) => setMobileAnchor(e.currentTarget)}
                sx={{ 
                  width: 40,
                  height: 40,
                  color: 'text.secondary',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: 'success.main',
                  },
                  transition: 'all 0.2s ease',
                }}
                aria-label="Mobile App"
              >
                <PhoneIphoneIcon />
              </IconButton>
            </Tooltip>
            
            {/* Mobile Menu */}
            <Menu
              anchorEl={mobileAnchor}
              open={mobileOpen}
              onClose={() => setMobileAnchor(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 240,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  📱 Get the Mobile App
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Search flights on the go
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto',
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 80, color: 'text.secondary' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Scan to download
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                  Coming Soon on iOS & Android
                </Typography>
              </Box>
            </Menu>

            {/* Theme Toggle */}
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
