// Loading Skeleton Component - Provides visual feedback during loading
// Implements: Shneiderman's Rule #3 (Informative Feedback), Nielsen's #1 (Visibility of System Status)
import { Box, Skeleton } from '@mui/material';

/**
 * Flight card loading skeleton
 */
export const FlightCardSkeleton = () => (
  <Box
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: 1,
      mb: 2,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={60} height={16} />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Skeleton variant="text" width={80} height={32} />
        <Skeleton variant="text" width={60} height={16} />
      </Box>
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
      <Skeleton variant="text" width={60} height={28} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="rectangular" height={4} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="text" width={60} height={28} />
    </Box>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="text" width={80} height={20} />
    </Box>
  </Box>
);

/**
 * Search form loading skeleton
 */
export const SearchFormSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
    </Box>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
      <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
      <Skeleton variant="rounded" height={56} width={150} />
    </Box>
  </Box>
);

/**
 * Price graph loading skeleton
 */
export const PriceGraphSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
  </Box>
);

/**
 * Generic skeleton with custom dimensions
 */
export const GenericSkeleton = ({ width, height, variant = 'rectangular', ...props }) => (
  <Skeleton variant={variant} width={width} height={height} {...props} />
);

export default {
  FlightCardSkeleton,
  SearchFormSkeleton,
  PriceGraphSkeleton,
  GenericSkeleton,
};
