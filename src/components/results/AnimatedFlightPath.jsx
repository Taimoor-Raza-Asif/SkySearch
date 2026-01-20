// Animated Flight Path Component
// Shows plane flying from origin to destination with stops and layover times
import { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { calculateLayoverDuration } from '../../utils/formatters';

const AnimatedFlightPath = ({ segments, isReturn = false, carrierCode }) => {
  const theme = useTheme();
  const [currentStop, setCurrentStop] = useState(-1);
  
  if (!segments || segments.length === 0) return null;
  
  const stops = segments.length - 1;
  
  // Calculate total animation duration
  const flyTime = 2000; // ms per segment
  const pauseTime = 2500; // ms per stop
  const totalDuration = (stops + 1) * flyTime + stops * pauseTime;
  
  // Build layover information
  const layovers = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const arrivalTime = segments[i].arrival.at;
    const departureTime = segments[i + 1].departure.at;
    const duration = calculateLayoverDuration(arrivalTime, departureTime);
    layovers.push({
      airport: segments[i].arrival.iataCode,
      duration,
      index: i,
    });
  }

  // SVG dimensions
  const width = 200;
  const height = 60;
  const pathY = 30;
  const curveHeight = 25;

  // Generate path
  const startX = isReturn ? width - 10 : 10;
  const endX = isReturn ? 10 : width - 10;
  const ctrlX = (startX + endX) / 2;
  const ctrlY = pathY - curveHeight;
  const flightPath = `M ${startX},${pathY} Q ${ctrlX},${ctrlY} ${endX},${pathY}`;

  // Calculate bezier point at parameter t
  const getBezierPoint = (t) => {
    const x = (1-t)*(1-t)*startX + 2*(1-t)*t*ctrlX + t*t*endX;
    const y = (1-t)*(1-t)*pathY + 2*(1-t)*t*ctrlY + t*t*pathY;
    return { x, y };
  };

  // Generate keyPoints and keyTimes for animateMotion
  // keyPoints: where along the path (0 to 1)
  // keyTimes: when in the animation (0 to 1)
  const generateAnimationParams = () => {
    if (stops === 0) {
      return {
        keyPoints: '0;1',
        keyTimes: '0;1',
        keySplines: '0.4 0 0.6 1',
      };
    }

    const keyPoints = [];
    const keyTimes = [];
    
    // Total time units: (stops+1) fly segments + stops pauses
    const flyUnits = stops + 1;
    const pauseUnits = stops;
    const totalUnits = flyUnits * 2 + pauseUnits * 1.5; // fly takes 2 units, pause 1.5 units
    
    let currentTimeUnit = 0;
    
    // Start
    keyPoints.push(0);
    keyTimes.push(0);
    
    for (let i = 0; i < stops; i++) {
      const stopPosition = (i + 1) / (stops + 1);
      
      // Arrive at stop
      currentTimeUnit += 2; // fly segment
      keyPoints.push(stopPosition);
      keyTimes.push(currentTimeUnit / totalUnits);
      
      // Pause at stop (same position, time advances)
      currentTimeUnit += 1.5; // pause
      keyPoints.push(stopPosition);
      keyTimes.push(currentTimeUnit / totalUnits);
    }
    
    // Arrive at destination
    keyPoints.push(1);
    keyTimes.push(1);
    
    // Generate keySplines (one less than keyTimes)
    const keySplines = Array(keyPoints.length - 1).fill('0.4 0 0.6 1').join(';');
    
    return {
      keyPoints: keyPoints.join(';'),
      keyTimes: keyTimes.join(';'),
      keySplines,
    };
  };

  const animParams = generateAnimationParams();
  const animDurationSeconds = totalDuration / 1000;

  // Calculate when each stop's badge should show
  const getStopVisibilityTimes = (stopIndex) => {
    if (stops === 0) return { start: 0, end: 0 };
    
    const flyUnits = stops + 1;
    const totalUnits = flyUnits * 2 + stops * 1.5;
    
    let currentTimeUnit = 0;
    for (let i = 0; i <= stopIndex; i++) {
      currentTimeUnit += 2; // fly to this stop
      if (i < stopIndex) {
        currentTimeUnit += 1.5; // pause at previous stops
      }
    }
    
    const startPercent = (currentTimeUnit / totalUnits) * 100;
    const endPercent = ((currentTimeUnit + 1.5) / totalUnits) * 100;
    
    return { start: startPercent, end: endPercent };
  };

  return (
    <Box sx={{ position: 'relative', height: 70, my: 1 }}>
      {/* CSS animations for layover badges */}
      <style>
        {layovers.map((_, idx) => {
          const { start, end } = getStopVisibilityTimes(idx);
          const suffix = isReturn ? 'Return' : '';
          return `
            @keyframes showBadge${idx}${suffix} {
              0%, ${Math.max(0, start - 2).toFixed(1)}% { opacity: 0; transform: translateX(-50%) scale(0.7); }
              ${start.toFixed(1)}%, ${end.toFixed(1)}% { opacity: 1; transform: translateX(-50%) scale(1); }
              ${Math.min(100, end + 2).toFixed(1)}%, 100% { opacity: 0; transform: translateX(-50%) scale(0.7); }
            }
          `;
        }).join('\n')}
      </style>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id={`pathGrad${isReturn ? 'R' : ''}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.4" />
            <stop offset="50%" stopColor={theme.palette.info.main} stopOpacity="0.5" />
            <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity="0.4" />
          </linearGradient>
          
          {/* Define the path for animateMotion */}
          <path id={`motionPath${isReturn ? 'R' : ''}`} d={flightPath} fill="none" />
        </defs>

        {/* Flight path line */}
        <path
          d={flightPath}
          fill="none"
          stroke={`url(#pathGrad${isReturn ? 'R' : ''})`}
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Origin dot */}
        <circle cx={startX} cy={pathY} r="5" fill={theme.palette.primary.main} />

        {/* Destination dot */}
        <circle cx={endX} cy={pathY} r="5" fill={theme.palette.secondary.main} />

        {/* Stop markers */}
        {layovers.map((layover, idx) => {
          const t = (idx + 1) / (stops + 1);
          const point = getBezierPoint(t);
          
          return (
            <g key={idx}>
              <circle cx={point.x} cy={point.y} r="5" fill={theme.palette.warning.main} />
              <text
                x={point.x}
                y={point.y + 16}
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill={theme.palette.warning.main}
              >
                {layover.airport}
              </text>
            </g>
          );
        })}

        {/* Animated plane using SVG animateMotion */}
        <g>
          <animateMotion
            dur={`${animDurationSeconds}s`}
            repeatCount="indefinite"
            rotate="auto"
            calcMode="spline"
            keyPoints={animParams.keyPoints}
            keyTimes={animParams.keyTimes}
            keySplines={animParams.keySplines}
          >
            <mpath href={`#motionPath${isReturn ? 'R' : ''}`} />
          </animateMotion>
          
          {/* Plane icon */}
          <g transform="translate(-8, -6) scale(0.7)">
            <path
              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill={theme.palette.primary.main}
              transform="rotate(90, 12, 12)"
              style={{
                filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.6)})`,
              }}
            />
          </g>
        </g>

        {/* Airline logo badge */}
        {carrierCode && (
          <g>
            <rect
              x={isReturn ? width - 30 : 0}
              y={pathY - 8}
              width="20"
              height="16"
              rx="3"
              fill={theme.palette.primary.main}
            />
            <text
              x={isReturn ? width - 20 : 10}
              y={pathY + 2}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="white"
            >
              {carrierCode}
            </text>
          </g>
        )}
      </svg>

      {/* Layover info overlays */}
      {layovers.map((layover, idx) => {
        const t = (idx + 1) / (stops + 1);
        const point = getBezierPoint(t);
        const leftPercent = (point.x / width) * 100;
        const suffix = isReturn ? 'Return' : '';
        
        return (
          <Box
            key={`badge-${idx}`}
            sx={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: -12,
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              px: 0.8,
              py: 0.3,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.warning.main, 0.15),
              border: '1px solid',
              borderColor: alpha(theme.palette.warning.main, 0.3),
              animation: `showBadge${idx}${suffix} ${animDurationSeconds}s ease-in-out infinite`,
              opacity: 0,
            }}
          >
            <Typography sx={{ fontSize: '10px' }}>🧍</Typography>
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 700,
                color: 'warning.main',
                whiteSpace: 'nowrap',
              }}
            >
              {layover.duration}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default AnimatedFlightPath;
