// Utility Functions - Formatters
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Format price with currency symbol
 * @param {number} amount 
 * @param {string} currency 
 * @returns {string}
 */
export const formatPrice = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format duration from ISO 8601 duration (e.g., "PT2H30M")
 * @param {string} isoDuration 
 * @returns {string} e.g., "2h 30m"
 */
export const formatDuration = (isoDuration) => {
  if (!isoDuration) return '';
  
  // Parse ISO 8601 duration
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

/**
 * Format date for display
 * @param {string} dateString 
 * @param {string} format 
 * @returns {string}
 */
export const formatDate = (dateString, format = 'ddd, MMM D') => {
  return dayjs(dateString).format(format);
};

/**
 * Format time from datetime string
 * @param {string} dateTimeString 
 * @returns {string} e.g., "10:30 AM"
 */
export const formatTime = (dateTimeString) => {
  return dayjs(dateTimeString).format('h:mm A');
};

/**
 * Format datetime for display
 * @param {string} dateTimeString 
 * @returns {string}
 */
export const formatDateTime = (dateTimeString) => {
  return dayjs(dateTimeString).format('MMM D, h:mm A');
};

/**
 * Calculate total duration from segments
 * @param {Array} segments 
 * @returns {string}
 */
export const calculateTotalDuration = (segments) => {
  if (!segments || segments.length === 0) return '';
  
  let totalMinutes = 0;
  
  segments.forEach(segment => {
    const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      totalMinutes += (parseInt(match[1]) || 0) * 60 + (parseInt(match[2]) || 0);
    }
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

/**
 * Get stop count text
 * @param {number} stops 
 * @returns {string}
 */
export const getStopsText = (stops) => {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

/**
 * Format layover airports
 * @param {Array} segments 
 * @returns {string}
 */
export const getLayoverAirports = (segments) => {
  if (!segments || segments.length <= 1) return '';
  
  const layovers = segments.slice(0, -1).map(s => s.arrival.iataCode);
  return layovers.join(', ');
};

/**
 * Calculate layover duration between two times
 * @param {string} arrivalTime - Arrival time at layover airport
 * @param {string} departureTime - Departure time from layover airport
 * @returns {string} e.g., "2h 30m"
 */
export const calculateLayoverDuration = (arrivalTime, departureTime) => {
  const arrival = dayjs(arrivalTime);
  const departure = dayjs(departureTime);
  const diffMinutes = departure.diff(arrival, 'minute');
  
  if (diffMinutes < 0) return '0m';
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

