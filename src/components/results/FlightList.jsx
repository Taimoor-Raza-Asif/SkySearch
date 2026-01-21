// Flight List Component - Renders paginated list of flight results
import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Pagination, Paper, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlightCard from './FlightCard';
import { FlightCardSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import { useSearchContext } from '../../contexts/SearchContext';
import { formatPrice } from '../../utils/formatters';

const FLIGHTS_PER_PAGE = 6;

const FlightList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { 
    filteredFlights, 
    dictionaries, 
    isLoading, 
    hasSearched, 
    error,
    filteredPriceStats,
    priceStats, // Overall price stats for filtering
    flights,
    updateFilters,
  } = useSearchContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null); // 'cheapest', 'average', 'highest'

  // Reset to page 1 when flights change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredFlights.length]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFlights.length / FLIGHTS_PER_PAGE);
  
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * FLIGHTS_PER_PAGE;
    return filteredFlights.slice(startIndex, startIndex + FLIGHTS_PER_PAGE);
  }, [filteredFlights, currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    // Smooth scroll to top of results
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Handle price filter button clicks
  const handlePriceFilter = (filterType) => {
    const range = priceStats.max - priceStats.min;
    const oneThird = range / 3;
    
    if (selectedPriceFilter === filterType) {
      // Clicking same button again clears the filter
      setSelectedPriceFilter(null);
      updateFilters({ priceRange: { min: priceStats.min, max: priceStats.max } });
    } else {
      setSelectedPriceFilter(filterType);
      
      switch (filterType) {
        case 'cheapest':
          updateFilters({ priceRange: { min: priceStats.min, max: priceStats.min + oneThird } });
          break;
        case 'average':
          updateFilters({ priceRange: { min: priceStats.min + oneThird, max: priceStats.min + oneThird * 2 } });
          break;
        case 'highest':
          updateFilters({ priceRange: { min: priceStats.min + oneThird * 2, max: priceStats.max } });
          break;
        default:
          break;
      }
    }
    setCurrentPage(1);
  };

  // Show loading skeletons
  if (isLoading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Searching flights...
          </Typography>
        </Box>
        {[1, 2, 3, 4].map((i) => (
          <FlightCardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <EmptyState
        type="error"
        title="Search failed"
        message={error}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Show initial state before search
  if (!hasSearched) {
    return (
      <EmptyState
        type="start"
        title="Find your perfect flight"
        message="Search for flights to discover the best prices and routes to your destination."
      />
    );
  }

  // Show no results
  if (flights.length === 0) {
    return (
      <EmptyState
        type="no-results"
        title="No flights found"
        message="We couldn't find any flights matching your search. Try adjusting your dates or airports."
      />
    );
  }

  // Show filtered results with pagination
  return (
    <Box>
      {/* PRICE STATS - RESPONSIVE & CLICKABLE */}
      <Paper
        elevation={2}
        sx={{
          p: 0,
          mb: 3,
          borderRadius: { xs: 2, sm: 4 },
          overflow: 'hidden',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            🎯 Best Deals for Your Search {selectedPriceFilter && <span style={{ opacity: 0.8 }}>• Filtering by {selectedPriceFilter}</span>}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ mb: { xs: 1, sm: 0 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Page {currentPage} of {totalPages || 1} • Click buttons to filter by price
            </Typography>
          </Box>
          
          {/* Price stats - clickable filter buttons */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* CHEAPEST PRICE */}
            <Tooltip title={selectedPriceFilter === 'cheapest' ? 'Click to clear filter' : 'Click to show cheapest flights'} arrow>
              <Box
                onClick={() => handlePriceFilter('cheapest')}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0.5, sm: 1.5 },
                  px: { xs: 1.5, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selectedPriceFilter === 'cheapest' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedPriceFilter === 'cheapest' ? '0 4px 20px rgba(16, 185, 129, 0.5)' : 'none',
                  outline: selectedPriceFilter === 'cheapest' ? '3px solid white' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <LocalOfferIcon sx={{ fontSize: { xs: 16, sm: 28 }, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                    CHEAPEST
                  </Typography>
                  <Typography fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '0.95rem', sm: '1.5rem' } }}>
                    {formatPrice(filteredPriceStats.min)}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
            
            {/* AVERAGE PRICE */}
            <Tooltip title={selectedPriceFilter === 'average' ? 'Click to clear filter' : 'Click to show average-priced flights'} arrow>
              <Box
                onClick={() => handlePriceFilter('average')}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0.5, sm: 1.5 },
                  px: { xs: 1.5, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selectedPriceFilter === 'average' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedPriceFilter === 'average' ? '0 4px 20px rgba(99, 102, 241, 0.5)' : 'none',
                  outline: selectedPriceFilter === 'average' ? '3px solid white' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 28 }, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                    AVERAGE
                  </Typography>
                  <Typography fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '0.95rem', sm: '1.5rem' } }}>
                    {formatPrice(filteredPriceStats.avg)}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            {/* HIGHEST PRICE */}
            <Tooltip title={selectedPriceFilter === 'highest' ? 'Click to clear filter' : 'Click to show premium flights'} arrow>
              <Box
                onClick={() => handlePriceFilter('highest')}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0.5, sm: 1.5 },
                  px: { xs: 1.5, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selectedPriceFilter === 'highest' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedPriceFilter === 'highest' ? '0 4px 20px rgba(249, 115, 22, 0.5)' : 'none',
                  outline: selectedPriceFilter === 'highest' ? '3px solid white' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: { xs: 16, sm: 28 }, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                    HIGHEST
                  </Typography>
                  <Typography fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '0.95rem', sm: '1.5rem' } }}>
                    {formatPrice(filteredPriceStats.max)}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* No filtered results */}
      {filteredFlights.length === 0 && flights.length > 0 && (
        <EmptyState
          type="no-results"
          title="No flights match your filters"
          message="Try adjusting or clearing your filters to see more results."
        />
      )}

      {/* Flight Cards - Paginated */}
      {paginatedFlights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          dictionaries={dictionaries}
        />
      ))}

      {/* Pagination - Compact on mobile */}
      {totalPages > 1 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'large'}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 1}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 500,
                minWidth: isMobile ? 28 : 32,
              },
            }}
          />
        </Box>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Showing {((currentPage - 1) * FLIGHTS_PER_PAGE) + 1} - {Math.min(currentPage * FLIGHTS_PER_PAGE, filteredFlights.length)} of {filteredFlights.length} flights
        </Typography>
      )}
    </Box>
  );
};

export default FlightList;
