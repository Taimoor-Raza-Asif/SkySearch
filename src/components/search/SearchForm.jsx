// Search Form Component - Modern Glassmorphic Design
// Features: Glassmorphism, animations, floating labels, creative layout
import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  useMediaQuery,
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';

import { useTheme, alpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

import AirportAutocomplete from './AirportAutocomplete';
import PassengerSelector from './PassengerSelector';
import FlexibleDatesCalendar from './FlexibleDatesCalendar';
import { useSearchContext } from '../../contexts/SearchContext';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { TRAVEL_CLASSES } from '../../utils/constants';

// Glassmorphic card style
const glassStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 41, 59, 0.7)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.5)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(31, 38, 135, 0.15)',
});

const SearchForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    searchParams,
    updateSearchParams,
    updatePassengers,
    swapLocations,
  } = useSearchContext();
  
  const { search, isLoading } = useFlightSearch();
  const [errors, setErrors] = useState({});
  const [showFlexibleCalendar, setShowFlexibleCalendar] = useState(false);

  const handleFlexibleDatesSelect = (departure, returnDate) => {
    updateSearchParams({ 
      departureDate: departure,
      returnDate: searchParams.tripType === 'roundTrip' ? returnDate : null
    });
  };
  


  const validateForm = () => {
    const newErrors = {};
    if (!searchParams.origin) newErrors.origin = 'Select departure';
    if (!searchParams.destination) newErrors.destination = 'Select destination';
    if (!searchParams.departureDate) newErrors.departureDate = 'Select date';
    if (searchParams.tripType === 'roundTrip' && !searchParams.returnDate) {
      newErrors.returnDate = 'Select return';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (validateForm()) await search();
  };

  const handleSwap = () => {
    swapLocations();
    setErrors((prev) => ({ ...prev, origin: null, destination: null }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 5,
          ...glassStyle(theme),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {/* Trip Type Toggle - Pill Style */}
        <Box sx={{ mb: 2.5, position: 'relative', zIndex: 1 }}>
          <ToggleButtonGroup
            value={searchParams.tripType}
            exclusive
            onChange={(e, value) => value && updateSearchParams({ tripType: value })}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              p: 0.5,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 2.5,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'white',
                  color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'white',
                  },
                },
              },
            }}
          >
            <ToggleButton value="roundTrip">✈️ Round Trip</ToggleButton>
            <ToggleButton value="oneWay">🛫 One Way</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Main Search Grid - Round Trip / One Way */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : searchParams.tripType === 'roundTrip'
                ? '2fr 1fr 1fr'  // FROM+TO combined, DEPARTURE, RETURN
                : '2fr 1fr',  // FROM+TO combined, DEPARTURE only
            gap: 1.5,
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* FROM + SWAP + TO Combined Card */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: (errors.origin || errors.destination) ? 'error.main' : 'divider',
              overflow: 'visible',
              transition: 'all 0.3s ease',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {/* FROM Section */}
            <Box
              sx={{
                flex: 1,
                pt: 1,
                pb: 1,
                pl: 2.5,
                pr: 3,
                '&:focus-within': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                  FROM
                </Typography>
              </Box>
              <AirportAutocomplete
                value={searchParams.origin}
                onChange={(value) => {
                  updateSearchParams({ origin: value });
                  setErrors((prev) => ({ ...prev, origin: null }));
                }}
                placeholder="City or airport"
                type="origin"
                error={errors.origin}
                minimal
              />
            </Box>

            {/* Center Divider Line */}
            <Box
              sx={{
                width: '1px',
                bgcolor: 'divider',
                my: 1,
              }}
            />

            {/* Swap Button - Absolutely Positioned on the Wall */}
            <Tooltip title="Swap locations" arrow>
              <IconButton
                onClick={handleSwap}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 38,
                  height: 38,
                  bgcolor: 'primary.main',
                  color: 'white',
                  border: '3px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 1)' : 'white',
                  boxShadow: '0 2px 12px rgba(99, 102, 241, 0.5)',
                  zIndex: 10,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translate(-50%, -50%) rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <SwapHorizIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* TO Section */}
            <Box
              sx={{
                flex: 1,
                pt: 1,
                pb: 1,
                pl: 3,
                pr: 2.5,
                '&:focus-within': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                <FlightLandIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                  TO
                </Typography>
              </Box>
              <AirportAutocomplete
                value={searchParams.destination}
                onChange={(value) => {
                  updateSearchParams({ destination: value });
                  setErrors((prev) => ({ ...prev, destination: null }));
                }}
                placeholder="City or airport"
                type="destination"
                error={errors.destination}
                minimal
              />
            </Box>
          </Box>

          {/* Departure Date Card */}
          <Box
            sx={{
              pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: errors.departureDate ? 'error.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <CalendarMonthIcon sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                DEPARTURE
              </Typography>
            </Box>
            <DatePicker
              value={searchParams.departureDate ? dayjs(searchParams.departureDate) : null}
              onChange={(date) => {
                updateSearchParams({ departureDate: date ? date.format('YYYY-MM-DD') : null });
                setErrors((prev) => ({ ...prev, departureDate: null }));
              }}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                  InputProps: { disableUnderline: true },
                  sx: { '& input': { fontWeight: 600, fontSize: '0.95rem' } },
                },
              }}
            />
          </Box>

          {/* Return Date Card - Only show for round trip */}
          {searchParams.tripType === 'roundTrip' && (
            <Box
              sx={{
                pt: 1,
                pb: 1,
                pl: 2.5,
                pr: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: '1px solid',
                borderColor: errors.returnDate ? 'error.main' : 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                  RETURN
                </Typography>
              </Box>
              <DatePicker
                value={searchParams.returnDate ? dayjs(searchParams.returnDate) : null}
                onChange={(date) => {
                  updateSearchParams({ returnDate: date ? date.format('YYYY-MM-DD') : null });
                  setErrors((prev) => ({ ...prev, returnDate: null }));
                }}
                minDate={searchParams.departureDate ? dayjs(searchParams.departureDate) : dayjs()}
                slotProps={{
                  textField: {
                    variant: 'standard',
                    fullWidth: true,
                    InputProps: { disableUnderline: true },
                    sx: { '& input': { fontWeight: 600, fontSize: '0.95rem' } },
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Bottom Row - Passengers, Class, Search */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : searchParams.tripType === 'roundTrip'
                ? '2fr 1fr 1fr'  // Match top row: Travelers+Class combined, then Search spans 2 cols
                : '2fr 1fr',
            gap: 1.5,
            mt: 1.5,
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Travelers + Class Combined Card */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            {/* Travelers Section */}
            <Box
              sx={{
                flex: 1,
                pt: 1,
                pb: 1,
                pl: 2.5,
                pr: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.25, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.65rem' }}>
                👥 TRAVELERS
              </Typography>
              <PassengerSelector
                passengers={searchParams.passengers}
                onUpdate={updatePassengers}
                minimal
              />
            </Box>

            {/* Class Section */}
            <Box
              sx={{
                flex: 1,
                pt: 1,
                pb: 1,
                pl: 1.5,
                pr: 2.5,
                borderLeft: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.25, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.65rem' }}>
                💺 CLASS
              </Typography>
              <TextField
                select
                value={searchParams.travelClass}
                onChange={(e) => updateSearchParams({ travelClass: e.target.value })}
                variant="standard"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{ '& .MuiSelect-select': { fontWeight: 600 } }}
              >
                {TRAVEL_CLASSES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* SEARCH BUTTON - Spans remaining columns */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SearchIcon sx={{ fontSize: 22 }} />
              )
            }
            sx={{
              gridColumn: isMobile ? 'auto' : (searchParams.tripType === 'roundTrip' ? 'span 2' : 'auto'),
              height: '100%',
              minHeight: 56,
              px: 4,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5558e8 0%, #7c4fed 100%)',
                boxShadow: '0 6px 28px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.25s ease',
            }}
          >
            {isLoading ? 'Searching...' : 'Search Flights'}
          </Button>
        </Box>

        {/* Flexible Dates Button */}
        {searchParams.tripType !== 'multiCity' && (
          <Box sx={{ mt: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Button
              variant="text"
              startIcon={<CalendarMonthIcon />}
              onClick={() => setShowFlexibleCalendar(true)}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Flexible dates & Live Price Graphs
            </Button>
          </Box>
        )}

        {/* Flexible Dates Calendar Dialog */}
        <FlexibleDatesCalendar
          open={showFlexibleCalendar}
          onClose={() => setShowFlexibleCalendar(false)}
          onSelectDates={handleFlexibleDatesSelect}
          departureDate={searchParams.departureDate}
          returnDate={searchParams.returnDate}
          tripType={searchParams.tripType}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SearchForm;
