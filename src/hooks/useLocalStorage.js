// useLocalStorage Hook - Persist data to localStorage
import { useState, useEffect, useCallback } from 'react';

/**
 * Sync state with localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeValue];
};

export default useLocalStorage;
