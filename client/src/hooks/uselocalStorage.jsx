import { useState } from 'react';

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      console.error(`Error in useLocalStorage for key "${keyName}":`, err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.error(
        `Error setting value in useLocalStorage for key "${keyName}":`,
        err,
      );
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
