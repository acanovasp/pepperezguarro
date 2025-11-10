'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';
import FadeTransition from '@/components/transitions/FadeTransition';
import { Project } from '@/lib/types';
import styles from './ProjectPageClient.module.css';

interface ProjectPageClientProps {
  project: Project;
  nextProjectSlug: string;
}

export default function ProjectPageClient({ project, nextProjectSlug }: ProjectPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isIntroMode = searchParams.get('intro') === 'true';
  
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);
  const [navigationArrow, setNavigationArrow] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(!isIntroMode);
  const [isAdvancingToNext, setIsAdvancingToNext] = useState(false);
  const [projectInfoVariant, setProjectInfoVariant] = useState<'default' | 'centered-intro'>(
    isIntroMode ? 'centered-intro' : 'default'
  );
  
  // Show project info only in slideshow mode
  const showProjectInfo = viewMode === 'slideshow';

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

  // Handle intro mode transition sequence
  useEffect(() => {
    if (isIntroMode) {
      // Step 1: Show centered ProjectInfo immediately
      setProjectInfoVariant('centered-intro');
      setIsVisible(false);
      
      // Step 2: After 3 seconds, slide ProjectInfo up and fade in slider
      const timer = setTimeout(() => {
        setProjectInfoVariant('default');
        setIsVisible(true);
        
        // Remove intro param from URL without navigation
        window.history.replaceState({}, '', `/projects/${project.slug}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isIntroMode, project.slug]);

  // Handle advance to next project
  const handleAdvanceToNextProject = () => {
    if (isAdvancingToNext) return; // Prevent multiple triggers
    
    setIsAdvancingToNext(true);
    setIsVisible(false); // Start fade out
    
    // After fade out completes (800ms), navigate to next project
    setTimeout(() => {
      router.push(`/projects/${nextProjectSlug}?intro=true`);
    }, 800);
  };

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

  // Listen for toggle grid view event from menu belt
  useEffect(() => {
    const handleToggleGrid = () => {
      handleToggleView();
    };

    window.addEventListener('toggleGridView', handleToggleGrid);
    return () => window.removeEventListener('toggleGridView', handleToggleGrid);
  }, []);

  return (
    <>
      {/* ProjectInfo outside FadeTransition to work with View Transition API */}
      {showProjectInfo && viewMode === 'slideshow' && (
        <ProjectInfo 
          project={project}
          onOpenProjectInfo={handleOpenProjectInfo}
          variant={projectInfoVariant}
        />
      )}

      <FadeTransition>
        <div 
          className={`${styles.viewContainer} ${isVisible ? styles.visible : styles.hidden}`}
          style={{ pointerEvents: isAdvancingToNext || isIntroMode ? 'none' : 'auto' }}
        >
          {/* Main content */}
          {viewMode === 'slideshow' ? (
            <ProjectSlider 
              project={project} 
              onToggleGrid={handleToggleView}
              initialSlide={initialSlide}
              onNavigationArrowChange={handleNavigationArrowChange}
              navigationArrow={navigationArrow}
              onAdvanceToNextProject={handleAdvanceToNextProject}
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
