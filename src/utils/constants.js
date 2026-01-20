// App Constants
export const TRAVEL_CLASSES = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
];

export const STOP_OPTIONS = [
  { value: 'any', label: 'Any number of stops' },
  { value: 0, label: 'Nonstop only' },
  { value: 1, label: '1 stop or fewer' },
  { value: 2, label: '2 stops or fewer' },
];

export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'duration_asc', label: 'Duration: Shortest' },
  { value: 'departure_asc', label: 'Departure: Earliest' },
  { value: 'departure_desc', label: 'Departure: Latest' },
];

export const PASSENGER_TYPES = {
  adults: { label: 'Adults', description: 'Age 12+', min: 1, max: 9 },
  children: { label: 'Children', description: 'Age 2-11', min: 0, max: 8 },
  infants: { label: 'Infants', description: 'Under 2', min: 0, max: 4 },
};

// Airlines with logos (common carriers)
export const AIRLINE_LOGOS = {
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  WN: 'Southwest Airlines',
  B6: 'JetBlue Airways',
  AS: 'Alaska Airlines',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
  BA: 'British Airways',
  LH: 'Lufthansa',
  AF: 'Air France',
  KL: 'KLM',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  SQ: 'Singapore Airlines',
  CX: 'Cathay Pacific',
  JL: 'Japan Airlines',
  NH: 'All Nippon Airways',
};

// Price range defaults
export const DEFAULT_PRICE_RANGE = {
  min: 0,
  max: 10000,
};

// Animation durations
export const TRANSITION_DURATION = 300;

// Debounce delays
export const DEBOUNCE_DELAY = 300;
export const SEARCH_DEBOUNCE = 500;
