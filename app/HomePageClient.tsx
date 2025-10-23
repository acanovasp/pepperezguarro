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
  
  // Get the active project number (index + 1)
  const activeProjectNumber = projects.findIndex(p => p.id === activeProject.id) + 1;

  // Set data attribute on body to hide gradients on homepage
  useEffect(() => {
    document.body.setAttribute('data-page', 'home');

    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <main>
      <ProjectInfo project={activeProject} projectNumber={activeProjectNumber} />
      <FadeTransition>
        <HomeSlider 
          projects={projects} 
          onActiveProjectChange={setActiveProject}
        />
      </FadeTransition>
    </main>
  );
}

