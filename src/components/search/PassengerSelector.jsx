// Passenger Selector Component - Dropdown for selecting passengers
// Implements: Norman's Principle (Affordances, Constraints)
import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PASSENGER_TYPES } from '../../utils/constants';

const PassengerSelector = ({ passengers, onUpdate, minimal = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIncrement = (type) => {
    const config = PASSENGER_TYPES[type];
    if (passengers[type] < config.max) {
      onUpdate(type, passengers[type] + 1);
    }
  };

  const handleDecrement = (type) => {
    const config = PASSENGER_TYPES[type];
    if (passengers[type] > config.min) {
      onUpdate(type, passengers[type] - 1);
    }
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  
  const getLabel = () => {
    const parts = [];
    if (passengers.adults > 0) {
      parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? 's' : ''}`);
    }
    if (passengers.children > 0) {
      parts.push(`${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}`);
    }
    if (passengers.infants > 0) {
      parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? 's' : ''}`);
    }
    return parts.join(', ') || '1 Adult';
  };

  // Minimal trigger for new design
  const minimalTrigger = (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        '&:hover': { opacity: 0.8 },
      }}
    >
      <Typography variant="body1" fontWeight={600}>
        {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
      </Typography>
      <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
    </Box>
  );

  // Standard trigger button
  const standardTrigger = (
    <Button
      onClick={handleClick}
      variant="outlined"
      sx={{
        height: 56,
        justifyContent: 'space-between',
        textTransform: 'none',
        color: 'text.primary',
        borderColor: 'divider',
        minWidth: 150,
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
      startIcon={<PersonIcon />}
      endIcon={<KeyboardArrowDownIcon />}
    >
      <Box sx={{ textAlign: 'left', flex: 1, ml: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Passengers
        </Typography>
        <Typography variant="body2" fontWeight={500} noWrap>
          {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
        </Typography>
      </Box>
    </Button>
  );

  return (
    <>
      {minimal ? minimalTrigger : standardTrigger}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 3,
            minWidth: 300,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Typography variant="subtitle1" gutterBottom fontWeight={700}>
          ✈️ Who's traveling?
        </Typography>
        
        {Object.entries(PASSENGER_TYPES).map(([type, config], index) => (
          <Box key={type}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {config.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {config.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleDecrement(type)}
                  disabled={passengers[type] <= config.min}
                  sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light',
                      color: 'white',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.4,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ minWidth: 32, textAlign: 'center' }}
                >
                  {passengers[type]}
                </Typography>
                
                <IconButton
                  size="small"
                  onClick={() => handleIncrement(type)}
                  disabled={passengers[type] >= config.max}
                  sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      borderColor: 'primary.main',
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.4,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}

        <Box 
          sx={{ 
            mt: 3, 
            pt: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {getLabel()}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleClose}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Done
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default PassengerSelector;
