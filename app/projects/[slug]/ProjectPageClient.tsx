'use client';

import { useState } from 'react';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';

interface ProjectPageClientProps {
  project: Project;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);
  const [showProjectInfo, setShowProjectInfo] = useState(true); // Always show by default

  const handleToggleView = () => {
    setViewMode(prev => prev === 'slideshow' ? 'grid' : 'slideshow');
  };

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setViewMode('slideshow');
  };

  const handleOpenProjectInfo = () => {
    window.dispatchEvent(new CustomEvent('openMenuSection', { detail: 'project-info' }));
  };

  return (
    <>
      {showProjectInfo && (
        <ProjectInfo 
          project={project} 
          onOpenProjectInfo={handleOpenProjectInfo}
        />
      )}
      
      <FadeTransition>
        {viewMode === 'slideshow' ? (
          <ProjectSlider 
            project={project} 
            onToggleGrid={handleToggleView}
            initialSlide={initialSlide}
          />
        ) : (
          <ImageGrid 
            project={project} 
            onImageClick={handleImageClick}
            onToggleView={handleToggleView}
          />
        )}
      </FadeTransition>
    </>
  );
}
