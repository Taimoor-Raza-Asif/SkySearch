// Filter Panel Component - Complex filtering with real-time updates
// Implements: Shneiderman's #6 (Easy Reversal), Nielsen's #3 (User Control)
import {
  Box,
  Paper,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Divider,
  Chip,
  Collapse,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useSearchContext } from '../../contexts/SearchContext';
import { formatPrice } from '../../utils/formatters';
import { STOP_OPTIONS } from '../../utils/constants';

const FilterPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    stops: true,
    price: true,
    airlines: true,
    departureTime: true,
    duration: true,
  });

  const {
    filters,
    updateFilters,
    resetFilters,
    availableAirlines,
    priceStats,
    flights,
    filteredFlights,
  } = useSearchContext();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleStopsChange = (value) => {
    updateFilters({ stops: value });
  };

  const handlePriceChange = (event, newValue) => {
    updateFilters({ priceRange: { min: newValue[0], max: newValue[1] } });
  };

  const handleAirlineToggle = (code) => {
    const currentAirlines = filters.airlines;
    const newAirlines = currentAirlines.includes(code)
      ? currentAirlines.filter((c) => c !== code)
      : [...currentAirlines, code];
    updateFilters({ airlines: newAirlines });
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.stops !== 'any') count++;
    if (filters.priceRange.min > priceStats.min || filters.priceRange.max < priceStats.max) count++;
    if (filters.airlines.length > 0) count++;
    return count;
  };

  const filterContent = (
    <>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {activeFilterCount() > 0 && (
            <Chip 
              label={activeFilterCount()} 
              size="small" 
              color="primary"
              sx={{ height: 20, fontSize: '0.75rem' }}
            />
          )}
        </Box>
        {activeFilterCount() > 0 && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<ClearAllIcon />}
            onClick={resetFilters}
            sx={{ 
              textTransform: 'none',
              borderColor: 'error.main',
              color: 'error.main',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
                borderColor: 'error.main',
              },
            }}
          >
            Clear all
          </Button>
        )}
      </Box>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing {filteredFlights.length} of {flights.length} flights
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Stops Filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('stops')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Stops
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: expandedSections.stops ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
        <Collapse in={expandedSections.stops}>
          <FormGroup>
            {STOP_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.stops === option.value}
                    onChange={() => handleStopsChange(option.value)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">{option.label}</Typography>
                }
              />
            ))}
          </FormGroup>
        </Collapse>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('price')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Price Range
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: expandedSections.price ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
        <Collapse in={expandedSections.price}>
          <Box sx={{ px: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatPrice(filters.priceRange.min)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatPrice(filters.priceRange.max)}
              </Typography>
            </Box>
            <Slider
              value={[filters.priceRange.min, filters.priceRange.max]}
              onChange={handlePriceChange}
              min={priceStats.min || 0}
              max={priceStats.max || 10000}
              step={Math.max(1, Math.floor((priceStats.max - priceStats.min) / 100))}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatPrice(value)}
              sx={{ mt: 1 }}
            />
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Airlines Filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('airlines')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Airlines
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: expandedSections.airlines ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
        <Collapse in={expandedSections.airlines}>
          {availableAirlines.length > 0 ? (
            <FormGroup>
              {availableAirlines.map((airline) => (
                <FormControlLabel
                  key={airline.code}
                  control={
                    <Checkbox
                      checked={filters.airlines.includes(airline.code)}
                      onChange={() => handleAirlineToggle(airline.code)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={airline.code} 
                        size="small"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }} 
                      />
                      <Typography variant="body2" noWrap>
                        {airline.name}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Search for flights to see available airlines
            </Typography>
          )}
        </Collapse>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Departure Time Filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('departureTime')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Departure Time
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: expandedSections.departureTime ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
        <Collapse in={expandedSections.departureTime !== false}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
            {[
              { label: '🌅 Morning', value: 'morning', range: '6am - 12pm' },
              { label: '☀️ Afternoon', value: 'afternoon', range: '12pm - 6pm' },
              { label: '🌆 Evening', value: 'evening', range: '6pm - 12am' },
              { label: '🌙 Night', value: 'night', range: '12am - 6am' },
            ].map((time) => (
              <Box
                key={time.value}
                onClick={() => {
                  const current = filters.departureTimeSlots || [];
                  const newSlots = current.includes(time.value)
                    ? current.filter((t) => t !== time.value)
                    : [...current, time.value];
                  updateFilters({ departureTimeSlots: newSlots });
                }}
                sx={{
                  py: 1.5,
                  px: 1,
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: (filters.departureTimeSlots || []).includes(time.value)
                    ? 'primary.main'
                    : 'action.hover',
                  color: (filters.departureTimeSlots || []).includes(time.value)
                    ? 'white'
                    : 'text.primary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: (filters.departureTimeSlots || []).includes(time.value)
                      ? 'primary.dark'
                      : 'action.selected',
                  },
                }}
              >
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, fontSize: '0.8rem' }}>
                  {time.label}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.7 }}>
                  {time.range}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Duration Filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('duration')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Max Duration
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: expandedSections.duration ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
        <Collapse in={expandedSections.duration !== false}>
          <Box sx={{ px: 1, mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {filters.maxDuration ? `Up to ${filters.maxDuration} hours` : 'Any duration'}
            </Typography>
            <Slider
              value={filters.maxDuration || 48}
              onChange={(e, val) => updateFilters({ maxDuration: val })}
              min={2}
              max={48}
              step={1}
              marks={[
                { value: 6, label: '6h' },
                { value: 12, label: '12h' },
                { value: 24, label: '24h' },
                { value: 48, label: '48h' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val}h`}
            />
          </Box>
        </Collapse>
      </Box>
    </>
  );

  // Mobile: Collapsible drawer-style filter
  if (isMobile) {
    return (
      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterListIcon />}
          endIcon={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {activeFilterCount() > 0 && (
                <Chip 
                  label={activeFilterCount()} 
                  size="small" 
                  color="primary"
                  sx={{ height: 20 }}
                />
              )}
              <ExpandMoreIcon
                sx={{
                  transform: mobileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </Box>
          }
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ 
            justifyContent: 'space-between',
            textTransform: 'none',
          }}
        >
          Filters
        </Button>
        <Collapse in={mobileOpen}>
          <Paper sx={{ mt: 2, p: 2, borderRadius: 2, maxHeight: '60vh', overflowY: 'auto' }}>
            {filterContent}
          </Paper>
        </Collapse>
      </Box>
    );
  }

  // Desktop: Sidebar filter panel with scrolling
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 80,
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'hidden', // Clip the scrollbar to rounded corners
      }}
    >
      <Box
        sx={{
          p: 3,
          height: '100%',
          maxHeight: 'calc(100vh - 102px)',
          overflowY: 'auto',
          // Custom scrollbar
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.action.hover,
          },
        }}
      >
        {filterContent}
      </Box>
    </Paper>
  );
};

export default FilterPanel;
