'use client';

import { useState, useEffect } from 'react';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';

interface ProjectPageClientProps {
  project: Project;
  projectNumber: number;
}

export default function ProjectPageClient({ project, projectNumber }: ProjectPageClientProps) {
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);
  const [showProjectInfo, setShowProjectInfo] = useState(true); // Always show by default
  const [navigationArrow, setNavigationArrow] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set data attribute on body to control gradient visibility
  useEffect(() => {
    if (viewMode === 'slideshow') {
      document.body.setAttribute('data-view-mode', 'slideshow');
    } else {
      document.body.removeAttribute('data-view-mode');
    }

    return () => {
      document.body.removeAttribute('data-view-mode');
    };
  }, [viewMode]);

  // Listen for toggle grid view event from menu belt
  useEffect(() => {
    const handleToggleGrid = () => {
      handleToggleView();
    };

    window.addEventListener('toggleGridView', handleToggleGrid);
    return () => window.removeEventListener('toggleGridView', handleToggleGrid);
  }, [viewMode]); // Include viewMode as dependency

  const handleToggleView = () => {
    if (isTransitioning) return; // Prevent double-clicks
    
    setIsTransitioning(true);
    
    // Trigger fade out
    window.dispatchEvent(new Event('startPageTransition'));
    
    // Wait for fade out (800ms) then change view
    setTimeout(() => {
      setViewMode(prev => prev === 'slideshow' ? 'grid' : 'slideshow');
      setIsTransitioning(false);
    }, 800);
  };

  const handleImageClick = (index: number) => {
    if (isTransitioning) return; // Prevent clicks during transition
    
    setIsTransitioning(true);
    
    // Trigger fade out
    window.dispatchEvent(new Event('startPageTransition'));
    
    // Wait for fade out (800ms) then change view
    setTimeout(() => {
      setInitialSlide(index);
      setViewMode('slideshow');
      setIsTransitioning(false);
    }, 800);
  };

  const handleOpenProjectInfo = () => {
    window.dispatchEvent(new CustomEvent('openMenuSection', { detail: 'project-info' }));
  };

  const handleNavigationArrowChange = (direction: 'left' | 'right' | null) => {
    setNavigationArrow(direction);
  };

  return (
    <>
      {showProjectInfo && viewMode === 'slideshow' && (
        <ProjectInfo 
          project={project}
          projectNumber={projectNumber}
          onOpenProjectInfo={handleOpenProjectInfo}
        />
      )}
      
      <FadeTransition key={viewMode}>
        {viewMode === 'slideshow' ? (
          <ProjectSlider 
            project={project} 
            onToggleGrid={handleToggleView}
            initialSlide={initialSlide}
            onNavigationArrowChange={handleNavigationArrowChange}
            navigationArrow={navigationArrow}
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
