'use client';

import { useState, useEffect } from 'react';
import HomeSlider from '@/components/sliders/HomeSlider';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';

interface HomePageClientProps {
  projects: Project[];
}

export default function HomePageClient({ projects }: HomePageClientProps) {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [projectInfoVisible, setProjectInfoVisible] = useState(true);

  // Set data attribute on body to hide gradients on homepage
  useEffect(() => {
    document.body.setAttribute('data-page', 'home');

    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  // Listen for page transition event from menu to fade out ProjectInfo
  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<{ fadeOutProjectInfo?: boolean }>;
      if (customEvent.detail?.fadeOutProjectInfo) {
        setProjectInfoVisible(false);
      }
    };

    window.addEventListener('startPageTransition', handleTransition as EventListener);
    return () => window.removeEventListener('startPageTransition', handleTransition as EventListener);
  }, []);

  return (
    <main>
      <ProjectInfo project={activeProject} isVisible={projectInfoVisible} />
      <FadeTransition>
        <HomeSlider 
          projects={projects} 
          onActiveProjectChange={setActiveProject}
        />
      </FadeTransition>
    </main>
  );
}

