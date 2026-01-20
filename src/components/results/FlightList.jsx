// Flight List Component - Renders paginated list of flight results
import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Pagination, Paper } from '@mui/material';
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
  const { 
    filteredFlights, 
    dictionaries, 
    isLoading, 
    hasSearched, 
    error,
    filteredPriceStats, // Use filtered stats that update with filters
    flights,
  } = useSearchContext();

  const [currentPage, setCurrentPage] = useState(1);

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
      {/* PRICE STATS - RESPONSIVE */}
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
            🎯 Best Deals for Your Search
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
              Page {currentPage} of {totalPages || 1} • Prices update with your filters
            </Typography>
          </Box>
          
          {/* Price stats - always in one row */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* CHEAPEST PRICE */}
            <Box
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
            
            {/* AVERAGE PRICE */}
            <Box
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

            {/* HIGHEST PRICE */}
            <Box
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

      {/* Pagination */}
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
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 500,
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
