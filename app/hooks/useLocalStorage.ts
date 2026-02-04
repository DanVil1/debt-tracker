'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const isFirstRender = useRef(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Start with initialValue on both server and client first render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After hydration, load from localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Save to localStorage whenever value changes (skip initial loads)
  useEffect(() => {
    if (!hasMounted) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, hasMounted]);

  // Memoized setter
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue, hasMounted] as const;
}
