// Animated Jets Background Component
// Features: Multiple jets flying along curved paths, properly oriented, bidirectional flights
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Airport positions
const airports = [
  { id: 'A', x: 5, y: 15 },
  { id: 'B', x: 20, y: 45 },
  { id: 'C', x: 35, y: 10 },
  { id: 'D', x: 50, y: 30 },
  { id: 'E', x: 65, y: 18 },
  { id: 'F', x: 80, y: 40 },
  { id: 'G', x: 95, y: 12 },
  { id: 'H', x: 75, y: 8 },
  { id: 'I', x: 25, y: 28 },
  { id: 'J', x: 55, y: 50 },
];

// Flight paths
const flightPaths = [
  // LEFT TO RIGHT flights
  {
    id: 'flightLR1',
    path: 'M 5,15 Q 25,5, 50,30 Q 70,45, 95,12',
    duration: 14,
    delay: 0,
    size: 0.28,
    color: 'rgba(255, 255, 255, 0.95)',
    direction: 'ltr',
  },
  {
    id: 'flightLR2',
    path: 'M 5,50 Q 30,30, 50,35 Q 75,40, 95,25',
    duration: 16,
    delay: 4,
    size: 0.22,
    color: 'rgba(99, 102, 241, 0.9)',
    direction: 'ltr',
  },
  {
    id: 'flightLR3',
    path: 'M 5,32 Q 35,15, 65,20 Q 85,25, 95,38',
    duration: 12,
    delay: 8,
    size: 0.2,
    color: 'rgba(6, 182, 212, 0.9)',
    direction: 'ltr',
  },
  
  // RIGHT TO LEFT flights
  {
    id: 'flightRL1',
    path: 'M 95,28 Q 70,15, 50,22 Q 25,32, 5,18',
    duration: 15,
    delay: 2,
    size: 0.24,
    color: 'rgba(236, 72, 153, 0.9)',
    direction: 'rtl',
  },
  {
    id: 'flightRL2',
    path: 'M 95,48 Q 65,35, 45,42 Q 20,50, 5,38',
    duration: 18,
    delay: 6,
    size: 0.18,
    color: 'rgba(251, 191, 36, 0.85)',
    direction: 'rtl',
  },
  {
    id: 'flightRL3',
    path: 'M 95,8 Q 75,22, 50,15 Q 25,8, 5,28',
    duration: 13,
    delay: 10,
    size: 0.21,
    color: 'rgba(34, 197, 94, 0.85)',
    direction: 'rtl',
  },
];


const AnimatedJets = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* SVG containing flight paths and animations */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Gradient for paths */}
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Define flight path references */}
          {flightPaths.map((flight) => (
            <path
              key={`def-${flight.id}`}
              id={`path-${flight.id}`}
              d={flight.path}
              fill="none"
            />
          ))}
        </defs>

        {/* Draw subtle curved flight path trails */}
        {flightPaths.map((flight) => (
          <path
            key={`trail-${flight.id}`}
            d={flight.path}
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="0.12"
            strokeDasharray="0.8 1.5"
            opacity="0.5"
          />
        ))}

        {/* Airport markers with pulsing animation */}
        {airports.map((airport, index) => (
          <g key={airport.id}>
            {/* Outer pulse ring */}
            <circle
              cx={airport.x}
              cy={airport.y}
              r="1"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.08"
            >
              <animate
                attributeName="r"
                values="0.6;1.8;0.6"
                dur={`${2.5 + index * 0.15}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur={`${2.5 + index * 0.15}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Core dot */}
            <circle
              cx={airport.x}
              cy={airport.y}
              r="0.5"
              fill="rgba(255,255,255,0.7)"
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="0.35;0.55;0.35"
                dur={`${2 + index * 0.1}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Animated Jets following curved paths */}
        {flightPaths.map((flight) => (
          <g key={flight.id}>
            {/* Contrail/trail effect following the plane */}
            <circle r="0.15" fill={flight.color} opacity="0.4">
              <animateMotion
                dur={`${flight.duration}s`}
                begin={`${flight.delay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;0.15;0.4;0.6;0.85;1"
                keyTimes="0;0.12;0.35;0.55;0.85;1"
                keySplines="0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1"
              >
                <mpath href={`#path-${flight.id}`} />
              </animateMotion>
            </circle>

            {/* The airplane - NOSE POINTING RIGHT for animateMotion auto-rotate */}
            <g filter="url(#glow)">
              <animateMotion
                dur={`${flight.duration}s`}
                begin={`${flight.delay}s`}
                repeatCount="indefinite"
                rotate="auto"
                calcMode="spline"
                keyPoints="0;0.15;0.4;0.6;0.85;1"
                keyTimes="0;0.12;0.35;0.55;0.85;1"
                keySplines="0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1"
              >
                <mpath href={`#path-${flight.id}`} />
              </animateMotion>
              
              {/* 
                Airplane icon - proper plane shape pointing RIGHT
                Using Material Design Flight icon path, rotated 90 degrees
              */}
              <g transform={`scale(${flight.size})`}>
                {/* Proper airplane icon */}
                <path
                  d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  fill={flight.color}
                  transform="translate(-12, -12) rotate(90, 12, 12)"
                />
              </g>
            </g>

            {/* Pulsing glow at stops */}
            <circle r="0" fill={flight.color}>
              <animateMotion
                dur={`${flight.duration}s`}
                begin={`${flight.delay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;0.15;0.4;0.6;0.85;1"
                keyTimes="0;0.12;0.35;0.55;0.85;1"
                keySplines="0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1;0.3 0 0.7 1;0.4 0 0.6 1"
              >
                <mpath href={`#path-${flight.id}`} />
              </animateMotion>
              <animate
                attributeName="r"
                values="0;0;1.5;0;0;1.5;0;0;1.5;0"
                dur={`${flight.duration}s`}
                begin={`${flight.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0;0.6;0;0;0.6;0;0;0.6;0"
                dur={`${flight.duration}s`}
                begin={`${flight.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Ambient twinkling particles */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={`particle-${i}`}
          sx={{
            position: 'absolute',
            left: `${8 + (i * 7) % 85}%`,
            top: `${12 + (i * 8) % 75}%`,
            width: 2.5,
            height: 2.5,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.2),
            animation: `twinkle ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
            '@keyframes twinkle': {
              '0%, 100%': { opacity: 0.1, transform: 'scale(0.7)' },
              '50%': { opacity: 0.45, transform: 'scale(1.2)' },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedJets;
