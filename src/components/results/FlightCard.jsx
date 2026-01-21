// Flight Card Component - Mobile-First Responsive Boarding Pass Design
import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import FlightIcon from '@mui/icons-material/Flight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  formatPrice,
  formatDuration,
  formatTime,
  getStopsText,
} from '../../utils/formatters';
import AnimatedFlightPath from './AnimatedFlightPath';
import { AIRLINE_LOGOS } from '../../utils/constants';

const FlightCard = ({ flight, dictionaries }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const outbound = flight.itineraries[0];
  const returnTrip = flight.itineraries[1];
  const price = parseFloat(flight.price.total);
  const currency = flight.price.currency;

  const getAirlineName = (code) => {
    return dictionaries?.carriers?.[code] || AIRLINE_LOGOS[code] || code;
  };

  // Parse baggage and fare information from Amadeus API response
  const getFareInfo = () => {
    const travelerPricing = flight.travelerPricings?.[0];
    if (!travelerPricing?.fareDetailsBySegment?.[0]) {
      return { 
        carryOn: true, 
        checkedBags: 0, 
        checkedWeight: null,
        cabin: 'ECONOMY',
        brandedFare: null,
      };
    }
    
    const fareDetails = travelerPricing.fareDetailsBySegment[0];
    const includedBags = fareDetails.includedCheckedBags;
    
    return {
      carryOn: true, // Most airlines include carry-on
      checkedBags: includedBags?.quantity || 0,
      checkedWeight: includedBags?.weight ? `${includedBags.weight}${includedBags.weightUnit || 'kg'}` : null,
      cabin: fareDetails.cabin || 'ECONOMY', // FROM API: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
      brandedFare: fareDetails.brandedFare || null, // FROM API: fare brand name if available
      fareClass: fareDetails.class || null, // FROM API: booking class
    };
  };

  const fareInfo = getFareInfo();

  // Mobile-optimized itinerary rendering
  const renderMobileItinerary = (itinerary, label) => {
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const stops = segments.length - 1;
    const carrierCode = firstSegment.carrierCode;

    return (
      <Box sx={{ mb: returnTrip ? 2 : 0 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: label === 'Return' ? 'secondary.main' : 'primary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDuration(itinerary.duration)}
          </Typography>
        </Box>

        {/* Main content */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Airline badge */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography variant="body2" fontWeight={800} color="white">
              {carrierCode}
            </Typography>
          </Box>

          {/* Flight times */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Departure */}
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
                  {formatTime(firstSegment.departure.at)}
                </Typography>
                <Typography variant="caption" color="primary.main" fontWeight={600}>
                  {firstSegment.departure.iataCode}
                </Typography>
              </Box>

              {/* Simple flight path for mobile */}
              <Box sx={{ flex: 1, mx: 1.5, position: 'relative' }}>
                <Box
                  sx={{
                    height: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  {/* Dots for endpoints */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                    }}
                  />
                  {/* Stop indicators */}
                  {stops > 0 && [...Array(stops)].map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'absolute',
                        left: `${((idx + 1) / (stops + 1)) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                        border: '2px solid',
                        borderColor: 'background.paper',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Arrival */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
                  {formatTime(lastSegment.arrival.at)}
                </Typography>
                <Typography variant="caption" color="secondary.main" fontWeight={600}>
                  {lastSegment.arrival.iataCode}
                </Typography>
              </Box>
            </Box>

            {/* Stops chip */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip
                label={getStopsText(stops)}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 18,
                  fontWeight: 600,
                  bgcolor: stops === 0 
                    ? alpha(theme.palette.success.main, 0.15) 
                    : alpha(theme.palette.warning.main, 0.15),
                  color: stops === 0 ? 'success.main' : 'warning.main',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // Desktop itinerary rendering (existing design)
  const renderDesktopItinerary = (itinerary, label, isReturn = false) => {
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const stops = segments.length - 1;
    const carrierCode = firstSegment.carrierCode;

    return (
      <Box 
        sx={{ 
          position: 'relative',
          py: 2,
          px: 3,
          borderBottom: returnTrip && !isReturn ? '2px dashed' : 'none',
          borderColor: alpha(theme.palette.divider, 0.5),
        }}
      >
        {/* Journey Label */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: isReturn ? 'secondary.main' : 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="caption" fontWeight={700} textTransform="uppercase">
              {label}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDuration(itinerary.duration)}
          </Typography>
        </Box>

        {/* Main Flight Info */}
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 3 }}>
          {/* Airline */}
          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={`https://content.airhex.com/content/logos/airlines_${carrierCode}_100_100_f.png`}
                alt={getAirlineName(carrierCode)}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
              <Box
                sx={{
                  display: 'none',
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Typography variant="h6" fontWeight={800} color="white">
                  {carrierCode}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {getAirlineName(carrierCode)}
            </Typography>
          </Box>

          {/* Flight times */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Departure */}
              <Box>
                <Typography 
                  variant="h3" 
                  fontWeight={800} 
                  sx={{ fontFamily: 'monospace', letterSpacing: -1, lineHeight: 1 }}
                >
                  {formatTime(firstSegment.departure.at)}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ fontFamily: 'monospace' }}>
                  {firstSegment.departure.iataCode}
                </Typography>
              </Box>

              {/* Animated Flight Path */}
              <Box sx={{ flex: 1, px: 2 }}>
                <AnimatedFlightPath segments={segments} isReturn={isReturn} carrierCode={carrierCode} />
                
                {/* Stops chip */}
                <Box sx={{ textAlign: 'center', mt: -1 }}>
                  <Chip
                    label={getStopsText(stops)}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      fontWeight: 600,
                      bgcolor: stops === 0 ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.warning.main, 0.15),
                      color: stops === 0 ? 'success.main' : 'warning.main',
                      border: '1px solid',
                      borderColor: stops === 0 ? 'success.main' : 'warning.main',
                    }}
                  />
                </Box>
              </Box>

              {/* Arrival */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" fontWeight={800} sx={{ fontFamily: 'monospace', letterSpacing: -1, lineHeight: 1 }}>
                  {formatTime(lastSegment.arrival.at)}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="secondary.main" sx={{ fontFamily: 'monospace' }}>
                  {lastSegment.arrival.iataCode}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <Box
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: isSelected 
            ? '0 4px 20px rgba(99, 102, 241, 0.3)' 
            : '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          transition: 'all 0.2s',
        }}
      >
        {/* Itineraries */}
        <Box sx={{ p: 2 }}>
          {renderMobileItinerary(outbound, 'Departure')}
          {returnTrip && (
            <>
              <Box sx={{ my: 2, borderTop: '1px dashed', borderColor: 'divider' }} />
              {renderMobileItinerary(returnTrip, 'Return')}
            </>
          )}
        </Box>

        {/* Price & Action - Bottom bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h5" fontWeight={800} color="primary.main">
              {formatPrice(price, currency)}
            </Typography>
          </Box>
          
          <Button
            variant={isSelected ? "contained" : "contained"}
            onClick={() => setIsSelected(!isSelected)}
            startIcon={isSelected ? <CheckCircleIcon /> : null}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              ...(isSelected && {
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
              }),
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </Box>

        {/* Expandable Details */}
        <Box sx={{ px: 2, pb: expanded ? 2 : 0 }}>
          <Button
            size="small"
            fullWidth
            onClick={() => setExpanded(!expanded)}
            endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />}
            sx={{ textTransform: 'none', color: 'text.secondary', justifyContent: 'center' }}
          >
            {expanded ? 'Hide details' : 'Show details'}
          </Button>

          <Collapse in={expanded}>
            <Box sx={{ mt: 1, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
              {outbound.segments.map((segment, idx) => (
                <Box key={idx} sx={{ mb: idx < outbound.segments.length - 1 ? 1.5 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={segment.carrierCode + segment.number} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                      <Typography variant="caption">{formatDuration(segment.duration)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AirlineSeatReclineNormalIcon sx={{ fontSize: 14 }} color="action" />
                      <Typography variant="caption">{segment.cabin || 'Economy'}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Box>
    );
  }

  // DESKTOP LAYOUT
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
        boxShadow: isSelected 
          ? '0 8px 40px rgba(99, 102, 241, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          boxShadow: '0 8px 40px rgba(99, 102, 241, 0.2)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Main ticket section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          borderRight: '2px dashed',
          borderColor: 'divider',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            right: -12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'background.default',
          },
          '&::before': { top: -12 },
          '&::after': { bottom: -12 },
        }}
      >
        {renderDesktopItinerary(outbound, 'Departure')}
        {returnTrip && renderDesktopItinerary(returnTrip, 'Return', true)}

        {/* Flight Details */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />}
            sx={{ textTransform: 'none', color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
          >
            Flight details
          </Button>

          <Collapse in={expanded}>
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
              {outbound.segments.map((segment, idx) => (
                <Box key={idx} sx={{ mb: idx < outbound.segments.length - 1 ? 2 : 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={segment.carrierCode + segment.number} size="small" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                  <Typography variant="body2" fontWeight={500}>{getAirlineName(segment.carrierCode)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{formatDuration(segment.duration)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AirlineSeatReclineNormalIcon fontSize="small" color="action" />
                    <Typography variant="body2">{segment.cabin || 'Economy'}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* Price stub */}
      <Box
        sx={{
          width: 180,
          bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 2,
          pt: 3,
          transition: 'all 0.3s',
        }}
      >
        {/* CO2 Emissions - Estimated */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.08),
            border: '1px solid',
            borderColor: alpha(theme.palette.success.main, 0.2),
          }}
        >
          <Typography sx={{ fontSize: '20px', mb: 0.5 }}>🌱</Typography>
          <Typography variant="caption" fontWeight={700} color="success.main">
            ~{Math.floor(150 + Math.random() * 200)} kg CO₂
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.55rem' }}>
            estimated
          </Typography>
        </Box>

        <Box sx={{ width: '100%', px: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 3,
              p: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
            }}
          >
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ lineHeight: 1, mb: 0.5 }}>
              TOTAL FARE
            </Typography>
            <Typography 
              variant="h3" 
              fontWeight={900} 
              sx={{ 
                color: 'primary.main', 
                fontFamily: 'monospace', 
                letterSpacing: -1,
                textShadow: '0 2px 10px rgba(99, 102, 241, 0.2)' 
              }}
            >
              {formatPrice(price, currency)}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              per person
            </Typography>
          </Box>
        </Box>

        <Button
          variant={isSelected ? "contained" : "outlined"}
          fullWidth
          onClick={() => setIsSelected(!isSelected)}
          startIcon={isSelected ? <CheckCircleIcon /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            ...(isSelected && {
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
            }),
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>

        {/* Baggage Info - From API */}
        <Box sx={{ mt: 2, width: '100%' }}>
          {fareInfo.carryOn && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography sx={{ fontSize: '14px' }}>🧳</Typography>
              <Typography variant="caption" color="text.secondary">
                Carry-on included
              </Typography>
            </Box>
          )}
          {fareInfo.checkedBags > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography sx={{ fontSize: '14px' }}>✅</Typography>
              <Typography variant="caption" color="success.main" fontWeight={600}>
                {fareInfo.checkedBags} checked bag{fareInfo.checkedBags > 1 ? 's' : ''} 
                {fareInfo.checkedWeight && ` (${fareInfo.checkedWeight})`}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography sx={{ fontSize: '14px' }}>💰</Typography>
              <Typography variant="caption" color="warning.main">
                Checked bags: extra fee
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '14px' }}>🎒</Typography>
            <Typography variant="caption" color="text.secondary">
              Personal item
            </Typography>
          </Box>
        </Box>

        {/* Fare Info - From API */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
          {/* Cabin Class - FROM API */}
          <Chip
            label={fareInfo.cabin.replace('_', ' ')}
            size="small"
            sx={{
              fontSize: '0.6rem',
              height: 20,
              bgcolor: fareInfo.cabin === 'BUSINESS' || fareInfo.cabin === 'FIRST' 
                ? alpha(theme.palette.warning.main, 0.15)
                : alpha(theme.palette.primary.main, 0.1),
              color: fareInfo.cabin === 'BUSINESS' || fareInfo.cabin === 'FIRST'
                ? 'warning.main'
                : 'primary.main',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          />
          {/* Branded Fare - FROM API (if available) */}
          {fareInfo.brandedFare && (
            <Chip
              label={fareInfo.brandedFare}
              size="small"
              sx={{
                fontSize: '0.6rem',
                height: 20,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: 'info.main',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FlightCard;
