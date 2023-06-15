import { useEffect, useRef } from 'react';

export function useScrollTo(deps = []) {
  const ref = useRef(null);

  const scroll = () => {
    ref.current && ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scroll();
  }, deps);

  return [ref];
}
