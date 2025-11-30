'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './FadeTransition.module.css';

interface FadeTransitionProps {
  children: React.ReactNode;
}

export default function FadeTransition({ children }: FadeTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Fade in on mount or route change
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure CSS transition triggers

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Listen for page transition event to fade out
    const handleTransition = () => {
      setIsVisible(false);
    };

    // Use 'any' type to handle both Event and CustomEvent
    window.addEventListener('startPageTransition', handleTransition as EventListener);
    return () => window.removeEventListener('startPageTransition', handleTransition as EventListener);
  }, []);

  return (
    <div className={`${styles.fadeWrapper} ${isVisible ? styles.visible : ''}`}>
      {children}
    </div>
  );
}

