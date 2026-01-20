// Empty State Component - Displays when no results or data
// Implements: Nielsen's #9 (Error Recovery), Shneiderman's #4 (Dialogue Closure)
import { Box, Typography, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const EmptyState = ({ 
  type = 'no-results', 
  title, 
  message, 
  actionLabel, 
  onAction,
  icon: CustomIcon 
}) => {
  const getContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: SearchOffIcon,
          title: title || 'No flights found',
          message: message || 'Try adjusting your search criteria or selecting different dates.',
        };
      case 'start':
        return {
          icon: FlightTakeoffIcon,
          title: title || 'Ready to explore?',
          message: message || 'Search for flights to your dream destination.',
        };
      case 'error':
        return {
          icon: ErrorOutlineIcon,
          title: title || 'Something went wrong',
          message: message || 'We couldn\'t complete your request. Please try again.',
        };
      default:
        return {
          icon: SearchOffIcon,
          title: title || 'No data',
          message: message || '',
        };
    }
  };

  const content = getContent();
  const Icon = CustomIcon || content.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 40, color: 'text.secondary' }} />
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {content.title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ maxWidth: 400, mb: actionLabel ? 3 : 0 }}
      >
        {content.message}
      </Typography>
      
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
