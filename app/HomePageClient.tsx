'use client';

import { useState } from 'react';
import HomeSlider from '@/components/sliders/HomeSlider';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';

interface HomePageClientProps {
  projects: Project[];
}

export default function HomePageClient({ projects }: HomePageClientProps) {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  return (
    <main>
      <ProjectInfo project={activeProject} />
      <FadeTransition>
        <HomeSlider 
          projects={projects} 
          onActiveProjectChange={setActiveProject}
        />
      </FadeTransition>
    </main>
  );
}

