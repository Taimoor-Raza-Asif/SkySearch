import { useMemo } from 'react';
import { Box, Typography, IconButton, Paper, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import dayjs from 'dayjs';

const PriceTrendGraph = ({
  currentMonth,
  prices,
  tripDuration,
  onTripDurationChange,
  departureDate,
  onSelectDate,
  maxPrice,
  minPrice
}) => {
  const theme = useTheme();

  // Prepare data for Recharts
  const chartData = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const data = [];

    // Add a few days from previous month for context? No, just keep it simple for now.
    
    for (let i = 0; i < daysInMonth; i++) {
        const date = startOfMonth.add(i, 'day');
        const dateStr = date.format('YYYY-MM-DD');
        const price = prices[dateStr];
        
        data.push({
            date: date,
            dateStr: dateStr,
            day: date.format('DD'),
            dayName: date.format('ddd'),
            price: price || 0,
            hasPrice: !!price,
            isPast: date.isBefore(dayjs(), 'day'),
        });
    }
    return data;
  }, [currentMonth, prices]);

  // Custom Tick for X Axis
  const CustomXAxisTick = ({ x, y, payload }) => {
      // payload.value is the index or formatted value
      // We want to show Flight Icon for selected date, or date otherwise?
      // Google flights shows flight icons on the axis for selected dates.
      // For now, let's just show dates sparingly.
      return (
          <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
                  {payload.value}
              </text>
          </g>
      );
  };

  const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
          const data = payload[0].payload;
          const returnDate = data.date.add(tripDuration, 'day');
          
          if (!data.hasPrice) return null;

          return (
              <Paper sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.8)', color: 'white' }}>
                  <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                      {tripDuration}-day trip
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {data.date.format('ddd, MMM D')} - {returnDate.format('ddd, MMM D')}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.light">
                      From ${data.price}
                  </Typography>
              </Paper>
          );
      }
      return null;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Trip Duration Control */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Paper 
            elevation={0}
            variant="outlined"
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 0.5, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5)
            }}
        >
            <Box sx={{ px: 2, borderRight: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600}>
                    {tripDuration}-day trip
                </Typography>
            </Box>
            <IconButton 
                size="small" 
                onClick={() => onTripDurationChange(Math.max(1, tripDuration - 1))}
            >
                <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton 
                size="small" 
                onClick={() => onTripDurationChange(tripDuration + 1)}
            >
                <AddIcon fontSize="small" />
            </IconButton>
        </Paper>
      </Box>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barGap={2}
            >
                {/* Background Grid Lines similar to Google Flights */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.text.disabled, 0.2)} />
                
                {/* Y Axis - Price Levels */}
                <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                    tickFormatter={(value) => `$${value}`}
                    domain={[0, 'auto']}
                    allowDataOverflow={true} // Allow scaling
                />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: alpha(theme.palette.primary.main, 0.1) }} />

                {/* Bars */}
                <Bar 
                    dataKey="price" 
                    minPointSize={5} 
                    radius={[2, 2, 0, 0]}
                    onClick={(data) => {
                        if (data.hasPrice) {
                            onSelectDate(data.date);
                        }
                    }}
                >
                    {chartData.map((entry, index) => {
                        const isSelected = departureDate && entry.dateStr === departureDate.format('YYYY-MM-DD');
                        const isCheap = entry.price <= minPrice + (maxPrice - minPrice) * 0.2;
                        
                        let fillColor = theme.palette.primary.main;
                        if (isSelected) fillColor = theme.palette.primary.dark;
                        else if (isCheap) fillColor = theme.palette.success.light;
                        
                        // Google flight style: Blue bars, grey for null?
                        // Actually Google Flights uses blue bars. 
                        // Selected bar is highlighted.
                        
                        return (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={isSelected ? theme.palette.primary.dark : theme.palette.primary.main} 
                                opacity={entry.hasPrice ? (isSelected ? 1 : 0.7) : 0}
                                style={{ 
                                    cursor: entry.hasPrice ? 'pointer' : 'default',
                                    transition: 'all 0.3s'
                                }}
                            />
                        );
                    })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Axis Labels / Flight Icons could go here manually if Recharts XAxis feels too limited */}
    </Box>
  );
};

export default PriceTrendGraph;
