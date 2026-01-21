// Price Graph Component - Real-time price visualization
import { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useSearchContext } from '../../contexts/SearchContext';
import { formatPrice } from '../../utils/formatters';
import { PriceGraphSkeleton } from '../common/LoadingSkeleton';

const PriceGraph = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { filteredFlights, isLoading, hasSearched, priceStats, filteredPriceStats, filters, updateFilters } = useSearchContext();
  const [activeIndex, setActiveIndex] = useState(null);

  // Process flight data for the chart - group by price ranges
  const chartData = useMemo(() => {
    if (!filteredFlights || filteredFlights.length === 0) return [];

    // Use GLOBAL stats for the X-axis range/buckets to keep "Budget/Mid/Premium" consistent
    // regardless of filters. This prevents the graph from "zooming in" on a tiny $1 range.
    const minPrice = priceStats.min;
    const maxPrice = priceStats.max;
    const range = maxPrice - minPrice;
    
    // Avoid division by zero if single price
    const bucketSize = range === 0 ? 100 : range / 8;
    const priceRanges = []; // Fixed: Re-added missing array declaration

    for (let i = 0; i < 8; i++) {
      // Use floor/ceil to ensure we cover the full range without gaps
      // but keep nice rounded numbers for display where possible
      const rawStart = minPrice + i * bucketSize;
      const rawEnd = minPrice + (i + 1) * bucketSize;
      
      const start = Math.floor(rawStart);
      const end = Math.ceil(rawEnd);

      const flightsInRange = filteredFlights.filter((f) => {
        const price = parseFloat(f.price.total);
        if (i === 7) return price >= start && price <= end; // Include upper bound for last bucket
        return price >= start && price < end;
      });

      // Calculate tier for coloring
      const tier = i < 3 ? 'cheap' : i >= 6 ? 'expensive' : 'mid';

      priceRanges.push({
        range: `$${start}`,
        fullRange: `${formatPrice(start)} - ${formatPrice(end)}`,
        count: flightsInRange.length,
        minPrice: start,
        maxPrice: end,
        tier,
        avgPrice: flightsInRange.length > 0
          ? flightsInRange.reduce((sum, f) => sum + parseFloat(f.price.total), 0) / flightsInRange.length
          : 0,
      });
    }

    return priceRanges; // Return all ranges to maintain x-axis structure, even if empty
  }, [filteredFlights, priceStats]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {data.fullRange}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.count} flight{data.count !== 1 ? 's' : ''} available
          </Typography>
          {data.avgPrice > 0 && (
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              Avg: {formatPrice(data.avgPrice)}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Get bar color based on tier and active state
  const getBarColor = useCallback((entry, index) => {
    const isActive = activeIndex === index;
    
    const colors = {
      cheap: {
        normal: theme.palette.success.main,
        active: theme.palette.success.light,
      },
      mid: {
        normal: theme.palette.primary.main,
        active: theme.palette.primary.light,
      },
      expensive: {
        normal: theme.palette.error.light,
        active: theme.palette.error.main,
      },
    };

    const tier = entry.tier || 'mid';
    return isActive ? colors[tier].active : colors[tier].normal;
  }, [activeIndex, theme]);

  // Handle mouse events for bar animation
  const handleMouseMove = useCallback((state) => {
    if (state && state.activeTooltipIndex !== undefined) {
      setActiveIndex(state.activeTooltipIndex);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  if (isLoading) {
    return <PriceGraphSkeleton />;
  }

  if (!hasSearched || filteredFlights.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Price Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredFlights.length} flights • Updates live with filters
          </Typography>
        </Box>
        
        {/* Color Legend */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">Budget</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">Mid-range</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'error.light' }} />
            <Typography variant="caption" color="text.secondary">Premium</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: isMobile ? 200 : 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={false}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry, index)}
                  style={{
                    filter: activeIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
                    transition: 'filter 0.2s ease-out',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Price insights - Clickable Filters */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { 
            id: 'cheapest', 
            label: 'CHEAPEST', 
            value: filteredPriceStats?.min || priceStats.min,
            color: theme.palette.success.main,
            icon: <LocalOfferIcon />
          },
          { 
            id: 'average', 
            label: 'AVERAGE', 
            value: filteredPriceStats?.avg || priceStats.avg,
            color: theme.palette.primary.main,
            icon: <ShowChartIcon />
          },
          { 
            id: 'highest', 
            label: 'HIGHEST', 
            value: filteredPriceStats?.max || priceStats.max,
            color: theme.palette.error.main,
            icon: <AttachMoneyIcon />
          }
        ].map((stat) => {
          const isActive = filters.priceFilterType === stat.id;
          return (
            <Paper
              key={stat.id}
              elevation={isActive ? 4 : 0}
              onClick={() => updateFilters({ 
                priceFilterType: isActive ? null : stat.id 
              })}
              sx={{
                flex: 1,
                minWidth: 140,
                maxWidth: 200,
                p: 2,
                borderRadius: 4,
                bgcolor: isActive ? stat.color : alpha(theme.palette.background.paper, 0.5),
                border: '1px solid',
                borderColor: isActive ? 'transparent' : alpha(stat.color, 0.3),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  bgcolor: isActive ? stat.color : alpha(stat.color, 0.1),
                },
              }}
            >
              <Box 
                sx={{ 
                  fontSize: '1.5rem',
                  color: isActive ? 'white' : stat.color,
                  filter: window.location.search.includes('mock') ? 'grayscale(0%)' : 'none' // Hack to force render
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography 
                  variant="caption" 
                  fontWeight={700} 
                  sx={{ 
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                    letterSpacing: 0.5,
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight={800}
                  sx={{ 
                    color: isActive ? 'white' : 'text.primary',
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(stat.value)}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

export default PriceGraph;
