// Search Context - Global search state management
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

const SearchContext = createContext(null);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
};

// Default search parameters
const getDefaultSearchParams = () => ({
  origin: null,
  destination: null,
  departureDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  returnDate: dayjs().add(14, 'day').format('YYYY-MM-DD'),
  tripType: 'roundTrip', // 'oneWay' or 'roundTrip'
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  travelClass: 'ECONOMY',
});

// Default filter state
const getDefaultFilters = () => ({
  stops: 'any', // 'any', 0, 1, 2
  priceRange: { min: 0, max: 10000 },
  airlines: [], // Selected airline codes
  departureTime: { min: 0, max: 24 }, // Hours
  arrivalTime: { min: 0, max: 24 },
  departureTimeSlots: [], // 'morning', 'afternoon', 'evening', 'night'
  maxDuration: null, // Max duration in hours
  priceFilterType: null, // 'cheapest', 'average', 'highest'
  sortBy: 'price_asc',
});

export const SearchProvider = ({ children }) => {
  // Search parameters
  const [searchParams, setSearchParams] = useState(getDefaultSearchParams);
  
  // Search results
  const [flights, setFlights] = useState([]);
  const [dictionaries, setDictionaries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState(getDefaultFilters);

  // Update search params
  const updateSearchParams = useCallback((updates) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update passengers
  const updatePassengers = useCallback((type, value) => {
    setSearchParams((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, value),
      },
    }));
  }, []);

  // Swap origin and destination
  const swapLocations = useCallback(() => {
    setSearchParams((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, []);

  // Update filters
  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);

  // Set search results
  const setSearchResults = useCallback((data, dicts) => {
    setFlights(data);
    setDictionaries(dicts);
    setHasSearched(true);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setFlights([]);
    setDictionaries({});
    setError(null);
    setHasSearched(false);
    resetFilters();
  }, [resetFilters]);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Filter by stops
    if (filters.stops !== 'any') {
      result = result.filter((flight) => {
        const segments = flight.itineraries[0]?.segments || [];
        const stops = segments.length - 1;
        return stops <= filters.stops;
      });
    }

    // Filter by price range
    result = result.filter((flight) => {
      const price = parseFloat(flight.price.total);
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Filter by airlines
    if (filters.airlines.length > 0) {
      result = result.filter((flight) => {
        const carriers = flight.itineraries[0]?.segments?.map((s) => s.carrierCode) || [];
        return carriers.some((code) => filters.airlines.includes(code));
      });
    }

    // Filter by departure time slots
    if (filters.departureTimeSlots && filters.departureTimeSlots.length > 0) {
      result = result.filter((flight) => {
        const departureTime = flight.itineraries[0]?.segments[0]?.departure?.at;
        if (!departureTime) return true;
        const hour = new Date(departureTime).getHours();
        return filters.departureTimeSlots.some((slot) => {
          switch (slot) {
            case 'morning': return hour >= 6 && hour < 12;
            case 'afternoon': return hour >= 12 && hour < 18;
            case 'evening': return hour >= 18 && hour < 24;
            case 'night': return hour >= 0 && hour < 6;
            default: return true;
          }
        });
      });
    }

    // Filter by max duration
    if (filters.maxDuration && filters.maxDuration < 48) {
      result = result.filter((flight) => {
        const duration = flight.itineraries[0]?.duration;
        if (!duration) return true;
        // Parse ISO 8601 duration (e.g., "PT12H30M")
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        if (!match) return true;
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const totalHours = hours + minutes / 60;
        return totalHours <= filters.maxDuration;
      });
    }

    // Filter by price type (Cheapest, Average, Highest)
    if (filters.priceFilterType) {
      if (result.length > 0) {
        const prices = result.map(f => parseFloat(f.price.total));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        // Define ranges dynamically based on current result set
        switch (filters.priceFilterType) {
          case 'cheapest': {
             // Bottom 20% range or strict lowest? Let's do lowest 25% percentile
             const sortedPrices = [...prices].sort((a,b) => a - b);
             const percentile25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
             // If dataset is small, just take the absolute min or close to it
             const cutoff = Math.max(min, percentile25); 
             result = result.filter(f => parseFloat(f.price.total) <= cutoff);
             break;
          }
          case 'average': {
             // Within +/- 20% of average
             const lower = avg * 0.8;
             const upper = avg * 1.2;
             result = result.filter(f => {
               const p = parseFloat(f.price.total);
               return p >= lower && p <= upper;
             });
             break;
          }
          case 'highest': {
             // Top 25% percentile
             const sortedPrices = [...prices].sort((a,b) => a - b);
             const percentile75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];
             const cutoff = Math.min(max, percentile75);
             result = result.filter(f => parseFloat(f.price.total) >= cutoff);
             break;
          }
        }
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return parseFloat(a.price.total) - parseFloat(b.price.total);
        case 'price_desc':
          return parseFloat(b.price.total) - parseFloat(a.price.total);
        case 'duration_asc': {
          const durationA = a.itineraries[0]?.duration || '';
          const durationB = b.itineraries[0]?.duration || '';
          return durationA.localeCompare(durationB);
        }
        case 'departure_asc': {
          const depA = a.itineraries[0]?.segments[0]?.departure?.at || '';
          const depB = b.itineraries[0]?.segments[0]?.departure?.at || '';
          return depA.localeCompare(depB);
        }
        case 'departure_desc': {
          const depA = a.itineraries[0]?.segments[0]?.departure?.at || '';
          const depB = b.itineraries[0]?.segments[0]?.departure?.at || '';
          return depB.localeCompare(depA);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [flights, filters]);

  // Get unique airlines from results
  const availableAirlines = useMemo(() => {
    const airlineSet = new Set();
    flights.forEach((flight) => {
      flight.itineraries?.forEach((itinerary) => {
        itinerary.segments?.forEach((segment) => {
          airlineSet.add(segment.carrierCode);
        });
      });
    });
    return Array.from(airlineSet).map((code) => ({
      code,
      name: dictionaries?.carriers?.[code] || code,
    }));
  }, [flights, dictionaries]);

  // Get price range from ALL results (for filter slider)
  const priceStats = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 10000, avg: 0 };
    
    const prices = flights.map((f) => parseFloat(f.price.total));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    };
  }, [flights]);

  // Get price range from FILTERED results (updates with filters)
  const filteredPriceStats = useMemo(() => {
    if (filteredFlights.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const prices = filteredFlights.map((f) => parseFloat(f.price.total));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    };
  }, [filteredFlights]);

  const contextValue = useMemo(
    () => ({
      // Search params
      searchParams,
      updateSearchParams,
      updatePassengers,
      swapLocations,
      
      // Results
      flights,
      filteredFlights,
      dictionaries,
      setSearchResults,
      clearSearch,
      
      // Loading state
      isLoading,
      setIsLoading,
      error,
      setError,
      hasSearched,
      
      // Filters
      filters,
      updateFilters,
      resetFilters,
      availableAirlines,
      priceStats,
      filteredPriceStats,
    }),
    [
      searchParams,
      updateSearchParams,
      updatePassengers,
      swapLocations,
      flights,
      filteredFlights,
      dictionaries,
      setSearchResults,
      clearSearch,
      isLoading,
      error,
      hasSearched,
      filters,
      updateFilters,
      resetFilters,
      availableAirlines,
      priceStats,
      filteredPriceStats,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
