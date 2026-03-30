
import { useState, useEffect, useCallback } from 'react';

/**
 * Lightweight hash-based router — zero dependencies.
 *
 * Uses window.location.hash for routing:
 *   #/          → Home
 *   #/pricing   → Pricing
 *   #/dashboard → Dashboard
 *   #/docs      → Docs
 */
export function useRouter() {
  const getRoute = (): string => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  const isActive = useCallback((path: string): boolean => {
    if (path === '/') return route === '/' || route === '';
    return route.startsWith(path);
  }, [route]);

  return { route, navigate, isActive };
}
