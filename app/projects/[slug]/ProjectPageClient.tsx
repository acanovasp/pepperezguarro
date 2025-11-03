'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';
import styles from './ProjectPageClient.module.css';

interface ProjectPageClientProps {
  project: Project;
  allProjects: Project[];
}

export default function ProjectPageClient({ project, allProjects }: ProjectPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Check presentation param immediately (before first render)
  const shouldPresent = searchParams.get('presentation') === 'true';
  
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);
  const [navigationArrow, setNavigationArrow] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPresentation, setShowPresentation] = useState(shouldPresent);
  const presentationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Show project info only in slideshow mode
  const showProjectInfo = viewMode === 'slideshow';

  // Handle presentation auto-dismiss and URL cleanup
  useEffect(() => {
    if (shouldPresent) {
      // Auto-dismiss after 5 seconds
      presentationTimeoutRef.current = setTimeout(() => {
        setShowPresentation(false);
      }, 5000);
      
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('presentation');
      window.history.replaceState({}, '', url.toString());
    }
    
    return () => {
      if (presentationTimeoutRef.current) {
        clearTimeout(presentationTimeoutRef.current);
      }
    };
  }, []); // Only run once on mount

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

  // Handle presentation click to dismiss early
  const handlePresentationClick = () => {
    if (showPresentation) {
      if (presentationTimeoutRef.current) {
        clearTimeout(presentationTimeoutRef.current);
      }
      setShowPresentation(false);
    }
  };

  // Handle navigation to next project
  const handleNextProject = () => {
    const currentIndex = allProjects.findIndex(p => p.id === project.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < allProjects.length) {
      const nextProject = allProjects[nextIndex];
      router.push(`/projects/${nextProject.slug}?presentation=true`);
    }
  };

  // Listen for toggle grid view event from menu belt
  useEffect(() => {
    const handleToggleGrid = () => {
      handleToggleView();
    };

    window.addEventListener('toggleGridView', handleToggleGrid);
    return () => window.removeEventListener('toggleGridView', handleToggleGrid);
  }, [handleToggleView]);

  return (
    <>
      {/* ProjectInfo outside FadeTransition for View Transition API (when not presenting) */}
      {showProjectInfo && viewMode === 'slideshow' && !shouldPresent && (
        <ProjectInfo 
          project={project}
          onOpenProjectInfo={handleOpenProjectInfo}
          isPresenting={showPresentation}
          useViewTransition={true}
        />
      )}
      
      <FadeTransition>
        {/* ProjectInfo inside FadeTransition when presenting (fades with content) */}
        {showProjectInfo && viewMode === 'slideshow' && shouldPresent && (
          <ProjectInfo 
            project={project}
            onOpenProjectInfo={handleOpenProjectInfo}
            isPresenting={showPresentation}
            useViewTransition={false}
          />
        )}
        
        <div 
          className={`${styles.viewContainer} ${isVisible ? styles.visible : styles.hidden}`}
          onClick={handlePresentationClick}
        >
          {/* Main content */}
        {viewMode === 'slideshow' ? (
          <ProjectSlider 
            project={project} 
            onToggleGrid={handleToggleView}
            initialSlide={initialSlide}
            onNavigationArrowChange={handleNavigationArrowChange}
            navigationArrow={navigationArrow}
            hideImages={showPresentation}
            onNextProject={handleNextProject}
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
