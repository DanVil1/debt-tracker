'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [hasMounted, setHasMounted] = useState(false);
  const hasLoadedFromStorage = useRef(false);

  // Start with initialValue on both server and client first render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After hydration, load from localStorage
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    // Mark as loaded AFTER we've set the value from storage
    hasLoadedFromStorage.current = true;
    setHasMounted(true);
  }, [key]);

  // Save to localStorage whenever value changes (skip initial load)
  useEffect(() => {
    // Don't save until we've loaded from storage first
    if (!hasLoadedFromStorage.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Memoized setter
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue, hasMounted] as const;
}
