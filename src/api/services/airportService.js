// Airport Service - Airport autocomplete and lookup
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

/**
 * Search for airports and cities by keyword
 * @param {string} keyword - Search term (min 1 character)
 * @returns {Promise<Object>} List of matching airports/cities
 */
export const searchAirports = async (keyword) => {
  if (!keyword || keyword.length < 1) {
    return { success: true, data: [] };
  }

  try {
    const response = await apiClient.get(ENDPOINTS.AIRPORT_SEARCH, {
      params: {
        subType: 'AIRPORT,CITY',
        keyword: keyword.toUpperCase(),
        'page[limit]': 10,
        sort: 'analytics.travelers.score',
        view: 'LIGHT',
      },
    });

    const locations = response.data.data || [];
    
    // Format for autocomplete
    const formattedLocations = locations.map((location) => ({
      code: location.iataCode,
      name: location.name,
      cityName: location.address?.cityName || location.name,
      countryCode: location.address?.countryCode || '',
      type: location.subType,
      label: `${location.iataCode} - ${location.name}${location.address?.cityName ? `, ${location.address.cityName}` : ''}`,
    }));

    return {
      success: true,
      data: formattedLocations,
    };
  } catch (error) {
    console.error('Airport search error:', error);
    return {
      success: false,
      error: 'Failed to search airports',
      data: [],
    };
  }
};

/**
 * Get airline information by code
 * @param {string} airlineCode - IATA airline code
 * @returns {Promise<Object>}
 */
export const getAirlineInfo = async (airlineCode) => {
  try {
    const response = await apiClient.get(ENDPOINTS.AIRLINES, {
      params: {
        airlineCodes: airlineCode,
      },
    });

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error('Airline lookup error:', error);
    return {
      success: false,
      error: 'Failed to get airline info',
      data: [],
    };
  }
};

// Common airports for quick access
export const popularAirports = [
  { code: 'JFK', name: 'John F. Kennedy International', cityName: 'New York', countryCode: 'US' },
  { code: 'LAX', name: 'Los Angeles International', cityName: 'Los Angeles', countryCode: 'US' },
  { code: 'LHR', name: 'Heathrow Airport', cityName: 'London', countryCode: 'GB' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryCode: 'FR' },
  { code: 'DXB', name: 'Dubai International', cityName: 'Dubai', countryCode: 'AE' },
  { code: 'SIN', name: 'Singapore Changi', cityName: 'Singapore', countryCode: 'SG' },
  { code: 'HND', name: 'Haneda Airport', cityName: 'Tokyo', countryCode: 'JP' },
  { code: 'SFO', name: 'San Francisco International', cityName: 'San Francisco', countryCode: 'US' },
  { code: 'ORD', name: "O'Hare International", cityName: 'Chicago', countryCode: 'US' },
  { code: 'MIA', name: 'Miami International', cityName: 'Miami', countryCode: 'US' },
];

export default {
  searchAirports,
  getAirlineInfo,
  popularAirports,
};
