// Flexible Dates Calendar - Shows prices for different dates
// Similar to Google Flights price calendar view
import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  useMediaQuery,
  Slide
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import PriceTrendGraph from './PriceTrendGraph';
import React from 'react';

// Slide transition for mobile
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FlexibleDatesCalendar = ({ 
  open, 
  onClose, 
  onSelectDates, 
  departureDate, 
  returnDate,
  tripType = 'roundTrip' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDeparture, setSelectedDeparture] = useState(departureDate ? dayjs(departureDate) : null);
  const [selectedReturn, setSelectedReturn] = useState(returnDate ? dayjs(returnDate) : null);
  // null = manual mode, number = chip-based auto mode
  const [tripDuration, setTripDuration] = useState(7);
  const [isChipSelected, setIsChipSelected] = useState(true); // Track if using chip mode

  // Calculate actual duration between selected dates
  const actualDuration = useMemo(() => {
    if (selectedDeparture && selectedReturn) {
      return selectedReturn.diff(selectedDeparture, 'day');
    }
    return tripDuration;
  }, [selectedDeparture, selectedReturn, tripDuration]);

  // Handle chip click - toggle selection
  const handleChipClick = (days) => {
    if (isChipSelected && tripDuration === days) {
      // Clicking the same chip again deselects it (enable manual mode)
      setIsChipSelected(false);
    } else {
      // Select this chip (enable chip mode)
      setIsChipSelected(true);
      setTripDuration(days);
      // If departure is already selected, auto-set return based on new duration
      if (selectedDeparture) {
        setSelectedReturn(selectedDeparture.add(days, 'day'));
      }
    }
  };

  // Generate mock prices for demo (in real app, would fetch from API)
  const generatePrices = useMemo(() => {
    const prices = {};
    const basePrice = 500;
    const startOfMonth = currentMonth.startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    
    for (let i = 0; i < daysInMonth; i++) {
      const date = startOfMonth.add(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      // Skip past dates
      if (date.isBefore(dayjs(), 'day')) {
        prices[dateStr] = null;
        continue;
      }
      
      // Generate varied prices (weekends more expensive)
      const dayOfWeek = date.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const randomFactor = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
      const weekendMultiplier = isWeekend ? 1.3 : 1;
      const price = Math.round(basePrice * randomFactor * weekendMultiplier);
      prices[dateStr] = price;
    }
    return prices;
  }, [currentMonth]);

  // Find min/max prices for color scaling
  const priceStats = useMemo(() => {
    const validPrices = Object.values(generatePrices).filter(p => p !== null);
    if (validPrices.length === 0) return { min: 0, max: 1000 };
    return {
      min: Math.min(...validPrices),
      max: Math.max(...validPrices),
    };
  }, [generatePrices]);

  // Get color based on price (green = cheap, red = expensive)
  const getPriceColor = (price) => {
    if (price === null) return 'transparent';
    const range = priceStats.max - priceStats.min;
    const normalized = range > 0 ? (price - priceStats.min) / range : 0.5;
    
    if (normalized < 0.33) return alpha(theme.palette.success.main, 0.15);
    if (normalized < 0.66) return alpha(theme.palette.warning.main, 0.12);
    return alpha(theme.palette.error.main, 0.1);
  };

  const getPriceTextColor = (price) => {
    if (price === null) return 'text.disabled';
    const range = priceStats.max - priceStats.min;
    const normalized = range > 0 ? (price - priceStats.min) / range : 0.5;
    
    if (normalized < 0.33) return 'success.main';
    if (normalized < 0.66) return 'warning.dark';
    return 'error.main';
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day(); // 0 = Sunday
    const daysInMonth = currentMonth.daysInMonth();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, price: null });
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.date(i);
      const dateStr = date.format('YYYY-MM-DD');
      days.push({
        date,
        dateStr,
        price: generatePrices[dateStr],
        isPast: date.isBefore(dayjs(), 'day'),
      });
    }
    
    return days;
  }, [currentMonth, generatePrices]);

  const handleDateClick = (day) => {
    if (!day.date || day.isPast) return;
    
    if (tripType === 'oneWay') {
      setSelectedDeparture(day.date);
    } else if (isChipSelected) {
      // Chip mode: clicking any date sets departure, return auto-calculated
      setSelectedDeparture(day.date);
      setSelectedReturn(day.date.add(tripDuration, 'day'));
    } else {
      // Manual mode: first click = departure, second = return
      if (!selectedDeparture || (selectedDeparture && selectedReturn)) {
        setSelectedDeparture(day.date);
        setSelectedReturn(null);
      } else {
        if (day.date.isAfter(selectedDeparture)) {
          setSelectedReturn(day.date);
        } else {
          setSelectedDeparture(day.date);
          setSelectedReturn(null);
        }
      }
    }
  };

  const handleConfirm = () => {
    onSelectDates(
      selectedDeparture?.format('YYYY-MM-DD'),
      selectedReturn?.format('YYYY-MM-DD')
    );
    onClose();
  };

  const isSelected = (date) => {
    if (!date) return false;
    const dateStr = date.format('YYYY-MM-DD');
    return (
      (selectedDeparture && dateStr === selectedDeparture.format('YYYY-MM-DD')) ||
      (selectedReturn && dateStr === selectedReturn.format('YYYY-MM-DD'))
    );
  };

  const isInRange = (date) => {
    if (!date || !selectedDeparture || !selectedReturn) return false;
    return date.isAfter(selectedDeparture) && date.isBefore(selectedReturn);
  };

  const [view, setView] = useState(0); // 0 = Dates, 1 = Graph

  // ... existing helpers ...

  const handleViewChange = (event, newValue) => {
    setView(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: { 
          borderRadius: isMobile ? 0 : 3,
          height: isMobile ? '100%' : '80vh',
          maxHeight: isMobile ? '100%' : 800,
        }
      }}
    >
      {/* Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          pb: 0,
          px: isMobile ? 2 : 3,
          pt: isMobile ? 1.5 : 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarViewMonthIcon color="primary" sx={{ fontSize: isMobile ? 24 : 28 }} />
            <Box>
              <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={700}>
                Flexible Dates
              </Typography>
              {!isMobile && (
                <Typography variant="caption" color="text.secondary">
                  & Live Price Graphs
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} edge="end" size={isMobile ? 'medium' : 'large'}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs 
          value={view} 
          onChange={handleViewChange} 
          sx={{ px: isMobile ? 2 : 3 }}
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab label="Dates" sx={{ fontSize: isMobile ? '0.85rem' : undefined }} />
          <Tab label="Price Graph" sx={{ fontSize: isMobile ? '0.85rem' : undefined }} />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        p: isMobile ? 2 : 3,
        overflow: 'auto',
        minHeight: 400,
      }}>
        {/* Month Navigation - Always at top */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: isMobile ? 1.5 : 2,
        }}>
          <IconButton 
            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            disabled={currentMonth.isSame(dayjs(), 'month')}
            size={isMobile ? 'small' : 'medium'}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography 
            variant={isMobile ? 'subtitle1' : 'h6'} 
            fontWeight={600} 
            sx={{ mx: isMobile ? 1 : 2, minWidth: isMobile ? 120 : 140, textAlign: 'center' }}
          >
            {currentMonth.format('MMMM YYYY')}
          </Typography>
          <IconButton 
            onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            size={isMobile ? 'small' : 'medium'}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Trip Duration Chips - Only for Dates view & Round Trip */}
        {view === 0 && tripType === 'roundTrip' && (
          <Box sx={{ 
            display: 'flex', 
            gap: 0.75, 
            mb: isMobile ? 1.5 : 2,
            overflowX: 'auto',
            pb: 1,
            px: 0.5,
            justifyContent: isMobile ? 'flex-start' : 'center',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
          }}>
            {[3, 5, 7, 10, 14, 21].map((days) => (
              <Chip
                key={days}
                label={`${days} days`}
                onClick={() => handleChipClick(days)}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  flexShrink: 0,
                  bgcolor: isChipSelected && tripDuration === days ? 'primary.main' : 'action.hover',
                  color: isChipSelected && tripDuration === days ? 'white' : 'text.primary',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  border: !isChipSelected ? '1px dashed' : 'none',
                  borderColor: !isChipSelected ? 'text.secondary' : 'transparent',
                  '&:hover': {
                    bgcolor: isChipSelected && tripDuration === days ? 'primary.dark' : 'action.selected',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {view === 0 ? (
          /* DATES VIEW (GRID) */
          <>
            {/* Price Legend - Compact on mobile */}
            <Box sx={{ 
              display: 'flex', 
              gap: isMobile ? 1.5 : 2, 
              mb: isMobile ? 1 : 2, 
              justifyContent: 'center' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: alpha(theme.palette.success.main, 0.3) }} />
                <Typography variant="caption" sx={{ fontSize: isMobile ? '0.65rem' : undefined }}>Low</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: alpha(theme.palette.warning.main, 0.3) }} />
                <Typography variant="caption" sx={{ fontSize: isMobile ? '0.65rem' : undefined }}>Medium</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: alpha(theme.palette.error.main, 0.3) }} />
                <Typography variant="caption" sx={{ fontSize: isMobile ? '0.65rem' : undefined }}>High</Typography>
              </Box>
            </Box>

            {/* Calendar Grid - Responsive */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: isMobile ? 0.25 : 0.5, 
              overflowY: 'auto',
              flex: 1,
            }}>
              {/* Day headers */}
              {(isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((day, i) => (
                <Box key={i} sx={{ textAlign: 'center', py: isMobile ? 0.5 : 1 }}>
                  <Typography 
                    variant="caption" 
                    fontWeight={600} 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
                  >
                    {day}
                  </Typography>
                </Box>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <Box
                  key={index}
                  onClick={() => handleDateClick(day)}
                  sx={{
                    p: isMobile ? 0.5 : 1,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: day.date && !day.isPast ? 'pointer' : 'default',
                    bgcolor: isSelected(day.date)
                      ? 'primary.main'
                      : isInRange(day.date)
                      ? alpha(theme.palette.primary.main, 0.1)
                      : getPriceColor(day.price),
                    border: '1px solid',
                    borderColor: isSelected(day.date) ? 'primary.main' : 'transparent',
                    opacity: day.isPast ? 0.4 : 1,
                    transition: 'all 0.2s',
                    minHeight: isMobile ? 44 : 56,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': day.date && !day.isPast ? {
                      transform: isMobile ? 'none' : 'scale(1.05)',
                      boxShadow: isMobile ? 1 : 2,
                    } : {},
                    '&:active': day.date && !day.isPast ? {
                      transform: 'scale(0.95)',
                    } : {},
                  }}
                >
                  {day.date && (
                    <>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        color={isSelected(day.date) ? 'white' : 'text.primary'}
                        sx={{ fontSize: isMobile ? '0.85rem' : undefined, lineHeight: 1.2 }}
                      >
                        {day.date.date()}
                      </Typography>
                      {day.price && !day.isPast && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: isMobile ? '0.55rem' : '0.65rem',
                            color: isSelected(day.date) ? 'rgba(255,255,255,0.8)' : getPriceTextColor(day.price),
                            fontWeight: 600,
                            lineHeight: 1,
                          }}
                        >
                          ${day.price}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </>
        ) : (
          /* PRICE GRAPH VIEW */
          <PriceTrendGraph
            currentMonth={currentMonth}
            prices={generatePrices}
            tripDuration={tripDuration}
            onTripDurationChange={setTripDuration}
            departureDate={selectedDeparture}
            onSelectDate={(date) => {
              setSelectedDeparture(date);
              if (tripType === 'roundTrip') {
                  setSelectedReturn(date.add(tripDuration, 'day'));
              }
            }}
            maxPrice={priceStats.max}
            minPrice={priceStats.min}
          />
        )}
      </DialogContent>
      
      {/* Footer - Responsive */}
      <DialogActions sx={{ 
        p: isMobile ? 1.5 : 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0,
        alignItems: 'stretch',
      }}>
        {/* Selection info */}
        <Box sx={{ flex: 1, pl: isMobile ? 0 : 2, textAlign: isMobile ? 'center' : 'left' }}>
            {(selectedDeparture || selectedReturn) && (
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.85rem' : undefined }}>
                    Selected: <b>{selectedDeparture?.format('MMM D')}</b>
                    {selectedReturn && <> - <b>{selectedReturn?.format('MMM D')}</b></>}
                    {' '}
                    ({actualDuration} days)
                </Typography>
            )}
        </Box>
        
        {/* Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          justifyContent: isMobile ? 'stretch' : 'flex-end',
          width: isMobile ? '100%' : 'auto',
        }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            sx={{ flex: isMobile ? 1 : 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirm}
            disabled={!selectedDeparture || (tripType === 'roundTrip' && !selectedReturn)}
            sx={{ flex: isMobile ? 1 : 'none' }}
          >
            Done
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FlexibleDatesCalendar;
