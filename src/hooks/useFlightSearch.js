// useFlightSearch Hook - Main search logic
import { useCallback } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { searchFlights } from '../api/services/flightService';

/**
 * Custom hook for flight search functionality
 * @returns {Object} Search methods and state
 */
export const useFlightSearch = () => {
  const {
    searchParams,
    setSearchResults,
    setIsLoading,
    setError,
    isLoading,
    error,
    hasSearched,
    filteredFlights,
    priceStats,
  } = useSearchContext();

  const performSearch = useCallback(async () => {
    // Validate required fields
    if (!searchParams.origin || !searchParams.destination) {
      setError('Please select origin and destination airports');
      return { success: false };
    }

    if (!searchParams.departureDate) {
      setError('Please select a departure date');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchFlights({
        originLocationCode: searchParams.origin.code,
        destinationLocationCode: searchParams.destination.code,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.tripType === 'roundTrip' ? searchParams.returnDate : undefined,
        adults: searchParams.passengers.adults,
        children: searchParams.passengers.children,
        travelClass: searchParams.travelClass,
      });

      if (result.success) {
        setSearchResults(result.data, result.dictionaries);
        return { success: true, count: result.data.length };
      } else {
        setError(result.error);
        return { success: false };
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, setSearchResults, setIsLoading, setError]);

  return {
    search: performSearch,
    isLoading,
    error,
    hasSearched,
    results: filteredFlights,
    resultsCount: filteredFlights.length,
    priceStats,
  };
};

export default useFlightSearch;
