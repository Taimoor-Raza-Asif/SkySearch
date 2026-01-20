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
  Tab
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import PriceTrendGraph from './PriceTrendGraph';

const FlexibleDatesCalendar = ({ 
  open, 
  onClose, 
  onSelectDates, 
  departureDate, 
  returnDate,
  tripType = 'roundTrip' 
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDeparture, setSelectedDeparture] = useState(departureDate ? dayjs(departureDate) : null);
  const [selectedReturn, setSelectedReturn] = useState(returnDate ? dayjs(returnDate) : null);
  const [tripDuration, setTripDuration] = useState(7);

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
    } else {
      // Round trip: first click = departure, second = return
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
      PaperProps={{
        sx: { 
          borderRadius: 3,
          height: '80vh', // Fixed height for consistency
          maxHeight: 800
        }
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarViewMonthIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Flexible Dates
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Compare prices by date
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs value={view} onChange={handleViewChange} sx={{ px: 3 }}>
          <Tab label="Dates" />
          <Tab label="Price graph" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Shared Controls: Trip Duration (for Round Trip) & Month Nav */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
           {/* Trip Duration - Only show in Grid view or let Graph handle its own? 
               Google Layout: Graph view has duration controls inside it. 
               Grid view has duration chips.
           */}
           {view === 0 && tripType === 'roundTrip' ? (
             <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
               {[3, 5, 7, 10, 14, 21].map((days) => (
                <Chip
                  key={days}
                  label={`${days} days`}
                  onClick={() => setTripDuration(days)}
                  sx={{
                    bgcolor: tripDuration === days ? 'primary.main' : 'action.hover',
                    color: tripDuration === days ? 'white' : 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: tripDuration === days ? 'primary.dark' : 'action.selected',
                    },
                  }}
                />
              ))}
             </Box>
           ) : <Box />} {/* Spacer */}

           {/* Month Navigation - Shared */}
           <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
              disabled={currentMonth.isSame(dayjs(), 'month')}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600} sx={{ mx: 2, minWidth: 140, textAlign: 'center' }}>
              {currentMonth.format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {view === 0 ? (
          /* DATES VIEW (GRID) */
          <>
            {/* Price Legend */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: alpha(theme.palette.success.main, 0.3) }} />
                <Typography variant="caption">Low</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: alpha(theme.palette.warning.main, 0.3) }} />
                <Typography variant="caption">Medium</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: alpha(theme.palette.error.main, 0.3) }} />
                <Typography variant="caption">High</Typography>
              </Box>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, overflowY: 'auto' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    {day}
                  </Typography>
                </Box>
              ))}

              {calendarDays.map((day, index) => (
                <Box
                  key={index}
                  onClick={() => handleDateClick(day)}
                  sx={{
                    p: 1,
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
                    '&:hover': day.date && !day.isPast ? {
                      transform: 'scale(1.05)',
                      boxShadow: 2,
                    } : {},
                  }}
                >
                  {day.date && (
                    <>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        color={isSelected(day.date) ? 'white' : 'text.primary'}
                      >
                        {day.date.date()}
                      </Typography>
                      {day.price && !day.isPast && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '0.65rem',
                            color: isSelected(day.date) ? 'rgba(255,255,255,0.8)' : getPriceTextColor(day.price),
                            fontWeight: 600,
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
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ flex: 1, pl: 2 }}>
            {(selectedDeparture || selectedReturn) && (
                <Typography variant="body2">
                    Selected: <b>{selectedDeparture?.format('MMM D')}</b>
                    {selectedReturn && <> - <b>{selectedReturn?.format('MMM D')}</b></>}
                    {' '}
                    ({tripDuration} days)
                </Typography>
            )}
        </Box>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm}
          disabled={!selectedDeparture || (tripType === 'roundTrip' && !selectedReturn)}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlexibleDatesCalendar;
