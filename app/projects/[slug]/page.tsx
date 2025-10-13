'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProjectBySlug } from '@/lib/data';
import { Project } from '@/lib/types';
import ProjectSlider from '@/components/sliders/ProjectSlider';
import ImageGrid from '@/components/ui/ImageGrid';
import ProjectInfo from '@/components/ui/ProjectInfo';

// Note: Dynamic metadata generation would be done in a separate metadata file
// or in a Server Component wrapper for production

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    if (params?.slug) {
      getProjectBySlug(params.slug as string).then(setProject);
    }
  }, [params?.slug]);

  const handleToggleView = () => {
    setViewMode(prev => prev === 'slideshow' ? 'grid' : 'slideshow');
  };

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setViewMode('slideshow');
  };

  const handleOpenProjectInfo = () => {
    // This will be handled by the menu belt via a global event or context
    // For now, we can use a custom event
    window.dispatchEvent(new CustomEvent('openMenuSection', { detail: 'project-info' }));
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {viewMode === 'slideshow' && (
        <ProjectInfo 
          project={project} 
          onOpenProjectInfo={handleOpenProjectInfo}
        />
      )}
      
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
    </main>
  );
}

