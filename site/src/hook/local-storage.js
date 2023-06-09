import { useMemo, useEffect } from 'react';

const noop = () => {};

export function useLocalStorage(key) {
  if (!key) {
    return [undefined, noop, noop];
  }
  if (typeof key !== 'string') {
    throw new Error(`key must be a string or falsy value: ${key}`);
  }

  const value = useMemo(() => {
    const str = localStorage.getItem(key);
    if (str !== null) {
      try {
        return JSON.parse(str);
      } catch (err) {}
    }
    return undefined;
  }, [key]);

  const setValue = (value) => {
    // TODO: clear old entry on key change?
    useEffect(() => {
      typeof value === 'function' && (value = value());
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      //console.log(`[useLocalStorage] ${key} = ${JSON.stringify(value)}`);
    }, [key, value]);
  };

  const clear = () => {
    localStorage.removeItem(key);
    //console.log(`[useLocalStorage] ${key} = undefined`);
  };

  return [value, setValue, clear];
}
