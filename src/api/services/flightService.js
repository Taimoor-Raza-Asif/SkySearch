// Flight Service - API calls for flight search
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

/**
 * Search for flight offers
 * @param {Object} params - Search parameters
 * @param {string} params.originLocationCode - IATA code (e.g., 'JFK')
 * @param {string} params.destinationLocationCode - IATA code (e.g., 'LAX')
 * @param {string} params.departureDate - Date in YYYY-MM-DD format
 * @param {string} [params.returnDate] - Date in YYYY-MM-DD format (optional for one-way)
 * @param {number} params.adults - Number of adult passengers
 * @param {number} [params.children] - Number of child passengers
 * @param {string} [params.travelClass] - ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
 * @param {boolean} [params.nonStop] - Filter for non-stop flights only
 * @param {string} [params.currencyCode] - Currency for prices (default USD)
 * @param {number} [params.max] - Maximum number of results
 * @returns {Promise<Object>} Flight offers response
 */
export const searchFlights = async (params) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    travelClass = 'ECONOMY',
    nonStop = false,
    currencyCode = 'USD',
    max = 50,
  } = params;

  const queryParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    currencyCode,
    max,
  };

  if (returnDate) {
    queryParams.returnDate = returnDate;
  }

  if (children > 0) {
    queryParams.children = children;
  }

  if (travelClass !== 'ECONOMY') {
    queryParams.travelClass = travelClass;
  }

  if (nonStop) {
    queryParams.nonStop = true;
  }

  try {
    const response = await apiClient.get(ENDPOINTS.FLIGHT_OFFERS, {
      params: queryParams,
    });

    return {
      success: true,
      data: response.data.data || [],
      dictionaries: response.data.dictionaries || {},
      meta: response.data.meta || {},
    };
  } catch (error) {
    console.error('Flight search error:', error);
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.detail || 'Failed to search flights',
      data: [],
    };
  }
};

/**
 * Get flight price analysis for a route
 * @param {string} originIataCode 
 * @param {string} destinationIataCode 
 * @param {string} departureDate 
 * @returns {Promise<Object>}
 */
export const getFlightPriceAnalysis = async (originIataCode, destinationIataCode, departureDate) => {
  try {
    const response = await apiClient.get(ENDPOINTS.FLIGHT_PRICE_ANALYSIS, {
      params: {
        originIataCode,
        destinationIataCode,
        departureDate,
        currencyCode: 'USD',
      },
    });

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error('Price analysis error:', error);
    return {
      success: false,
      error: 'Failed to get price analysis',
      data: [],
    };
  }
};

/**
 * Get cheapest flight dates for a route
 * @param {string} origin 
 * @param {string} destination 
 * @returns {Promise<Object>}
 */
export const getFlightDates = async (origin, destination) => {
  try {
    const response = await apiClient.get(ENDPOINTS.FLIGHT_DATES, {
      params: {
        origin,
        destination,
      },
    });

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error('Flight dates error:', error);
    return {
      success: false,
      error: 'Failed to get flight dates',
      data: [],
    };
  }
};

export default {
  searchFlights,
  getFlightPriceAnalysis,
  getFlightDates,
};
