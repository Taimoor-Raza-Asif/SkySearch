// Main Layout Component - Page structure with header
import { Box } from '@mui/material';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
