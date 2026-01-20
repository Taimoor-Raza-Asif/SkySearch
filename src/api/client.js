// API Client - Axios instance with interceptors
import axios from 'axios';

// Amadeus API base URL (test environment)
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: AMADEUS_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage
let accessToken = null;
let tokenExpiry = null;

// Get access token from Amadeus
const getAccessToken = async () => {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: import.meta.env.VITE_AMADEUS_API_KEY || '',
        client_secret: import.meta.env.VITE_AMADEUS_API_SECRET || '',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Failed to get Amadeus access token:', error);
    throw new Error('Authentication failed');
  }
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token for auth endpoint
    if (config.url?.includes('/security/oauth2/token')) {
      return config;
    }

    const token = await getAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, refresh token and retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      accessToken = null;
      tokenExpiry = null;

      try {
        const token = await getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (authError) {
        return Promise.reject(authError);
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      console.warn('Rate limit reached. Please wait before making more requests.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
