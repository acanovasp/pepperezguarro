'use client';

import { useEffect } from 'react';
import HomeSlider from '@/components/sliders/HomeSlider';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';

interface HomePageClientProps {
  projects: Project[];
}

export default function HomePageClient({ projects }: HomePageClientProps) {
  // Set data attribute on body to hide gradients on homepage
  useEffect(() => {
    document.body.setAttribute('data-page', 'home');

    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <main>
      <FadeTransition>
        <HomeSlider projects={projects} />
      </FadeTransition>
    </main>
  );
}

