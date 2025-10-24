'use client';

import { useState, useEffect } from 'react';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';
import styles from './ProjectPageClient.module.css';

interface ProjectPageClientProps {
  project: Project;
  projectNumber: number;
}

export default function ProjectPageClient({ project, projectNumber }: ProjectPageClientProps) {
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [navigationArrow, setNavigationArrow] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
  }, [isTransitioning]);

  const handleToggleView = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsVisible(false); // Start fade out immediately
    
    // After fade out completes (800ms), switch views
    setTimeout(() => {
      setViewMode(prev => prev === 'slideshow' ? 'grid' : 'slideshow');
      setIsVisible(true); // Trigger fade in
      setIsTransitioning(false);
    }, 800);
  };

  const handleImageClick = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsVisible(false); // Start fade out immediately
    
    // After fade out completes (800ms), switch views
    setTimeout(() => {
      setInitialSlide(index);
      setViewMode('slideshow');
      setIsVisible(true); // Trigger fade in
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
      {/* ProjectInfo outside FadeTransition to work with View Transition API */}
      {showProjectInfo && viewMode === 'slideshow' && (
        <ProjectInfo 
          project={project}
          projectNumber={projectNumber}
          onOpenProjectInfo={handleOpenProjectInfo}
        />
      )}

      <FadeTransition>
        <div className={`${styles.viewContainer} ${isVisible ? styles.visible : styles.hidden}`}>
          {/* Main content */}
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
        </div>
      </FadeTransition>
    </>
  );
}
