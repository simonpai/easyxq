import { useMemo } from 'react';

export function usePseudorandom(options) {
  return mulberry32(useRandomSeed(options));
}

export function useRandomSeed({ salt, deps = [] } = {}) {
  return useMemo(() => randomInt() ^ hash(salt), deps);
}

function randomInt() {
  return Math.random() * 2 ** 32 | 0;
}

function mulberry32(a = 0) {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hash(str) {
  if (!str) {
    return 0;
  }
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // convert to 32bit integer
  }
  return hash;
}
