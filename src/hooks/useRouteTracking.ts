import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useRouteTracking = (routeId: string) => {
  const { routeStarted, routeCompleted } = useAnalytics();
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startedRef.current = false;
    completedRef.current = false;
    startTimeRef.current = 0;

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = window.scrollY / scrollable;

      if (!startedRef.current && pct >= 0.25) {
        startedRef.current = true;
        startTimeRef.current = Date.now();
        routeStarted(routeId);
      }

      if (startedRef.current && !completedRef.current && pct >= 0.95) {
        completedRef.current = true;
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        routeCompleted(routeId, timeSpent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [routeId, routeStarted, routeCompleted]);
};
