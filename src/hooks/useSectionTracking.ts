import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

interface SectionInfo {
  element: Element;
  sectionIndex: number;
  title?: string;
}

export const useSectionTracking = (routeId: string) => {
  const { sectionStarted, sectionCompleted } = useAnalytics();
  const sectionsRef = useRef<Map<Element, SectionInfo>>(new Map());
  const sectionTimersRef = useRef<Map<Element, number>>(new Map());
  const activeSectionsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const sections = document.querySelectorAll('section.section-y');
    const map = new Map<Element, SectionInfo>();

    sections.forEach((section, index) => {
      const title = section.querySelector('h2')?.textContent;
      map.set(section, { element: section, sectionIndex: index, title });
    });

    sectionsRef.current = map;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionInfo = sectionsRef.current.get(entry.target);
          if (!sectionInfo) return;

          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Sección iniciada
            if (!activeSectionsRef.current.has(entry.target)) {
              activeSectionsRef.current.add(entry.target);
              sectionTimersRef.current.set(entry.target, Date.now());
              sectionStarted(routeId, sectionInfo.sectionIndex, sectionInfo.title);
            }
          } else if (!entry.isIntersecting && activeSectionsRef.current.has(entry.target)) {
            // Sección completada
            activeSectionsRef.current.delete(entry.target);
            const startTime = sectionTimersRef.current.get(entry.target);
            if (startTime) {
              const timeSpent = (Date.now() - startTime) / 1000;
              sectionCompleted(routeId, sectionInfo.sectionIndex, timeSpent, sectionInfo.title);
              sectionTimersRef.current.delete(entry.target);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-80px 0px -80px 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      activeSectionsRef.current.clear();
      sectionTimersRef.current.clear();
    };
  }, [routeId, sectionStarted, sectionCompleted]);
};
