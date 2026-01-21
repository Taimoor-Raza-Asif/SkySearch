// Airport Autocomplete Component - Smart airport search with debouncing
// Implements: Shneiderman's #8 (Reduce Memory Load), Nielsen's #6 (Recognition over Recall)
import { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { useDebounce } from '../../hooks/useDebounce';
import { searchAirports, popularAirports } from '../../api/services/airportService';

const AirportAutocomplete = ({
  value,
  onChange,
  label,
  placeholder,
  type = 'origin', // 'origin' or 'destination'
  error,
  disabled = false,
  minimal = false, 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(popularAirports);
  const [loading, setLoading] = useState(false);
  
  const debouncedInput = useDebounce(inputValue, 300);

  // Search airports when input changes
  useEffect(() => {
    const fetchAirports = async () => {
      if (!debouncedInput || debouncedInput.length < 2) {
        setOptions(popularAirports);
        return;
      }

      setLoading(true);
      const result = await searchAirports(debouncedInput);
      
      if (result.success && result.data.length > 0) {
        setOptions(result.data);
      } else {
        // Filter popular airports if API fails
        const filtered = popularAirports.filter(
          (a) =>
            a.code.toLowerCase().includes(debouncedInput.toLowerCase()) ||
            a.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
            a.cityName.toLowerCase().includes(debouncedInput.toLowerCase())
        );
        setOptions(filtered.length > 0 ? filtered : popularAirports);
      }
      setLoading(false);
    };

    fetchAirports();
  }, [debouncedInput]);

  const handleChange = useCallback((event, newValue) => {
    onChange(newValue);
  }, [onChange]);

  const getIcon = () => {
    if (type === 'origin') {
      return <FlightTakeoffIcon sx={{ color: 'primary.main', mr: 1 }} />;
    }
    return <FlightLandIcon sx={{ color: 'secondary.main', mr: 1 }} />;
  };

  if (minimal) {
    return (
      <Autocomplete
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        options={options}
        loading={loading}
        disabled={disabled}
        getOptionLabel={(option) => 
          option ? `${option.code} - ${option.cityName || option.name}` : ''
        }
        isOptionEqualToValue={(option, val) => option?.code === val?.code}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="standard"
            fullWidth
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: { 
                fontWeight: 600, 
                fontSize: '1.1rem',
              },
              endAdornment: (
                <>
                  {loading && <CircularProgress color="primary" size={16} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <Box
              key={option.code}
              component="li"
              {...restProps}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: option.type === 'CITY' ? 'secondary.light' : 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.type === 'CITY' ? (
                  <LocationCityIcon sx={{ color: 'white', fontSize: 18 }} />
                ) : (
                  <FlightTakeoffIcon sx={{ color: 'white', fontSize: 18 }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {option.cityName || option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.name}
                </Typography>
              </Box>
              <Chip 
                label={option.code} 
                size="small" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }} 
              />
            </Box>
          );
        }}
        noOptionsText="No airports found"
        loadingText="Searching..."
        sx={{
          '& .MuiAutocomplete-popupIndicator': {
            display: 'none',
          },
          '& .MuiAutocomplete-clearIndicator': {
            display: 'none',
          },
        }}
      />
    );
  }

  // Standard mode
  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => 
        option ? `${option.code} - ${option.cityName || option.name}` : ''
      }
      isOptionEqualToValue={(option, val) => option?.code === val?.code}
      filterOptions={(x) => x} // Disable built-in filtering, we use API
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {getIcon()}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress color="primary" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box
            key={option.code}
            component="li"
            {...restProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: option.type === 'CITY' ? 'secondary.light' : 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {option.type === 'CITY' ? (
                <LocationCityIcon sx={{ color: 'white', fontSize: 20 }} />
              ) : (
                <FlightTakeoffIcon sx={{ color: 'white', fontSize: 20 }} />
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight={500}>
                {option.cityName || option.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.name} {option.countryCode && `• ${option.countryCode}`}
              </Typography>
            </Box>
            <Chip 
              label={option.code} 
              size="small" 
              sx={{ 
                fontWeight: 600,
                bgcolor: 'background.default',
              }} 
            />
          </Box>
        );
      }}
      noOptionsText="No airports found"
      loadingText="Searching airports..."
      sx={{
        '& .MuiAutocomplete-popupIndicator': {
          display: 'none',
        },
      }}
    />
  );
};

export default AirportAutocomplete;
