// Home Page
import { useState } from 'react';
import { Box, Container, Typography, useMediaQuery, Chip, Switch, FormControlLabel, Collapse, Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import FlightIcon from '@mui/icons-material/Flight';
import SearchForm from '../../components/search/SearchForm';
import FlightList from '../../components/results/FlightList';
import FilterPanel from '../../components/filters/FilterPanel';
import SortDropdown from '../../components/filters/SortDropdown';
import PriceGraph from '../../components/charts/PriceGraph';
import MainLayout from '../../layouts/MainLayout';
import { useSearchContext } from '../../contexts/SearchContext';
import AnimatedJets from '../../components/common/AnimatedJets';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasSearched, filteredFlights } = useSearchContext();
  const [showPriceGraph, setShowPriceGraph] = useState(false);

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: hasSearched ? 'auto' : { xs: 'auto', md: 'auto' },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)'
            : 'linear-gradient(160deg, #1e3a5f 0%, #2d4a6f 30%, #3d5a80 60%, #4a6fa5 100%)',
          py: { xs: 4, md: 5 },
          pt: { xs: 4, md: 5 },
          pb: { xs: 5, md: 6 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Animated Jets Flying Background */}
        <AnimatedJets />

        {/* Subtle floating orbs - toned down */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: { xs: 200, md: 350 },
            height: { xs: 200, md: 350 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: { xs: 150, md: 280 },
            height: { xs: 150, md: 280 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float2 10s ease-in-out infinite',
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(15px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '30%',
            width: { xs: 100, md: 180 },
            height: { xs: 100, md: 180 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float3 9s ease-in-out infinite',
            '@keyframes float3': {
              '0%, 100%': { transform: 'translateX(0)' },
              '50%': { transform: 'translateX(20px)' },
            },
          }}
        />

        {/* Grid pattern overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, ${alpha(theme.palette.common.white, 0.15)} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Hero Text */}
          {!hasSearched && (
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 1.5,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.1,
                  textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                }}
              >
                Discover Amazing{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #06b6d4 0%, #f093fb 50%, #06b6d4 100%)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                    '@keyframes shimmer': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '100%': { backgroundPosition: '200% 50%' },
                    },
                  }}
                >
                  Flight Deals
                </Box>
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  maxWidth: 500,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Compare prices instantly and find the perfect flight
              </Typography>
            </Box>
          )}

          {/* Search Form */}
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <SearchForm />
          </Box>

          {/* Trust badges */}
          {!hasSearched && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                mt: 4,
                flexWrap: 'wrap',
              }}
            >
              {[
                { emoji: '🔒', text: 'Secure Booking' },
                { emoji: '💰', text: 'Best Price Guarantee' },
                { emoji: '⚡', text: 'Instant Results' },
                { emoji: '🛡️', text: 'Free Cancellation' },
              ].map((badge) => (
                <Box
                  key={badge.text}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span>{badge.emoji}</span>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {badge.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {hasSearched && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 4,
            }}
          >
            {/* Filters Sidebar */}
            <Box
              sx={{
                width: isMobile ? '100%' : 280,
                flexShrink: 0,
              }}
            >
              <FilterPanel />
            </Box>

            {/* Results Area */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Control Bar: Price Graph Toggle & Sort */}
              {filteredFlights.length > 0 && (
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={showPriceGraph}
                        onChange={(e) => setShowPriceGraph(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Price Distribution
                      </Typography>
                    }
                  />
                  <SortDropdown />
                </Stack>
              )}

              {/* Collapsible Price Graph */}
              <Collapse in={showPriceGraph}>
                {filteredFlights.length > 0 && <PriceGraph />}
              </Collapse>

              {/* Flight List */}
              <FlightList />
            </Box>
          </Box>
        )}

        {/* Initial state - before search */}
        {!hasSearched && (
          <Box sx={{ py: 4 }}>
            <FlightList />
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default HomePage;
