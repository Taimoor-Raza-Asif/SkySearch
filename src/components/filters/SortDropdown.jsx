// Sort Dropdown Component
import { MenuItem, TextField } from '@mui/material';
import { useSearchContext } from '../../contexts/SearchContext';
import { SORT_OPTIONS } from '../../utils/constants';

const SortDropdown = ({ sx = {} }) => {
  const { filters, updateFilters } = useSearchContext();

  return (
    <TextField
      select
      value={filters.sortBy}
      onChange={(e) => updateFilters({ sortBy: e.target.value })}
      label="Sort by"
      size="small"
      sx={{ minWidth: 180, ...sx }}
    >
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SortDropdown;
