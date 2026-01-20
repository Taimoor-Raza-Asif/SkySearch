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
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
  
  // Multi-city flight legs
  const [multiCityLegs, setMultiCityLegs] = useState([
    { origin: null, destination: null, date: dayjs().add(7, 'day').format('YYYY-MM-DD') },
    { origin: null, destination: null, date: dayjs().add(10, 'day').format('YYYY-MM-DD') },
  ]);

  const addFlightLeg = () => {
    if (multiCityLegs.length < 6) {
      const lastLeg = multiCityLegs[multiCityLegs.length - 1];
      setMultiCityLegs([
        ...multiCityLegs,
        { 
          origin: lastLeg.destination, 
          destination: null, 
          date: dayjs(lastLeg.date).add(3, 'day').format('YYYY-MM-DD') 
        },
      ]);
    }
  };

  const removeFlightLeg = (index) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index));
    }
  };

  const updateFlightLeg = (index, field, value) => {
    setMultiCityLegs(multiCityLegs.map((leg, i) => 
      i === index ? { ...leg, [field]: value } : leg
    ));
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
            <ToggleButton value="multiCity">🌍 Multi-city</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Multi-city Form */}
        {searchParams.tripType === 'multiCity' ? (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {multiCityLegs.map((leg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr auto',
                  gap: 1.5,
                  mb: 2,
                  alignItems: 'center',
                }}
              >
                {/* Flight number badge */}
                <Box sx={{ gridColumn: isMobile ? '1' : 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  >
                    {index + 1}
                  </Box>
                  
                  {/* FROM */}
                  <Box
                    sx={{
                      flex: 1,
                      pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.6),
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                      FROM
                    </Typography>
                    <AirportAutocomplete
                      value={leg.origin}
                      onChange={(value) => updateFlightLeg(index, 'origin', value)}
                      placeholder="City or airport"
                      type="origin"
                      minimal
                    />
                  </Box>
                </Box>

                {/* TO */}
                <Box
                  sx={{
                    pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                    TO
                  </Typography>
                  <AirportAutocomplete
                    value={leg.destination}
                    onChange={(value) => updateFlightLeg(index, 'destination', value)}
                    placeholder="City or airport"
                    type="destination"
                    minimal
                  />
                </Box>

                {/* DATE */}
                <Box
                  sx={{
                    pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
                    DATE
                  </Typography>
                  <DatePicker
                    value={leg.date ? dayjs(leg.date) : null}
                    onChange={(date) => updateFlightLeg(index, 'date', date ? date.format('YYYY-MM-DD') : null)}
                    minDate={index > 0 && multiCityLegs[index - 1].date ? dayjs(multiCityLegs[index - 1].date) : dayjs()}
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

                {/* Remove button */}
                {multiCityLegs.length > 2 && (
                  <IconButton
                    onClick={() => removeFlightLeg(index)}
                    sx={{
                      color: 'error.main',
                      '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Box>
            ))}

            {/* Add flight button */}
            {multiCityLegs.length < 6 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addFlightLeg}
                sx={{
                  borderStyle: 'dashed',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  mb: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Add another flight
              </Button>
            )}
          </Box>
        ) : (
        /* Main Search Grid - Round Trip / One Way */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : searchParams.tripType === 'roundTrip'
                ? '1fr auto 1fr 1fr 1fr'  // 5 columns for round trip
                : '1.2fr auto 1.2fr 1fr',  // 4 columns for one way (wider FROM/TO)
            gap: 1.5,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* FROM Card */}
          <Box
            sx={{
              pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: errors.origin ? 'error.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`,
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

          {/* Swap Button */}
          <Tooltip title="Swap locations" arrow>
            <IconButton
              onClick={handleSwap}
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'rotate(180deg) scale(1.1)',
                },
                transition: 'all 0.4s ease',
                mx: isMobile ? 'auto' : 0,
              }}
            >
              <SwapHorizIcon sx={{ transform: isMobile ? 'rotate(90deg)' : 'none', fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* TO Card */}
          <Box
            sx={{
              pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: errors.destination ? 'error.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`,
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
        )}

        {/* Bottom Row - Passengers, Class, Search */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr auto',
            gap: 1.5,
            mt: 2,
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Passengers Card */}
          <Box
            sx={{
              pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.25, display: 'block', fontSize: '0.65rem' }}>
              👥 TRAVELERS
            </Typography>
            <PassengerSelector
              passengers={searchParams.passengers}
              onUpdate={updatePassengers}
              minimal
            />
          </Box>

          {/* Class Selector */}
          <Box
            sx={{
              pt: 1,
              pb: 1,
              pl: 2.5,
              pr: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.25, display: 'block', fontSize: '0.65rem' }}>
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


          {/* SEARCH BUTTON - Prominent */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <SearchIcon sx={{ fontSize: 24 }} />
              )
            }
            sx={{
              height: 50,
              px: 4,
              py: 1.5,
              my: 0,
              minWidth: 200,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.3s ease',
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
              Flexible dates? See price calendar
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
