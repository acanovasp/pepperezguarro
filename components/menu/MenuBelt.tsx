'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './MenuBelt.module.css';
import ProjectsSection from './ProjectsSection';
import AboutSection from './AboutSection';
import ProjectInfoSection from './ProjectInfoSection';
import SiteHeader from '@/components/ui/SiteHeader';
import SiteFooter from '@/components/ui/SiteFooter';
import { Project } from '@/lib/types';

type MenuSection = 'projects' | 'about' | 'project-info';

interface MenuBeltProps {
  projects: Project[];
  currentProject?: Project | null;
}

export interface MenuBeltRef {
  openSection: (section: MenuSection) => void;
}

const MenuBelt = forwardRef<MenuBeltRef, MenuBeltProps>(function MenuBelt({ projects, currentProject }, ref) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection>('projects');
  const [detectedProject, setDetectedProject] = useState<Project | null>(currentProject || null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [forceClose, setForceClose] = useState(false);
  const params = useParams();

  // Detect current project from URL
  useEffect(() => {
    if (params?.slug) {
      const project = projects.find(p => p.slug === params.slug);
      setDetectedProject(project || null);
    } else {
      setDetectedProject(null);
    }
  }, [params?.slug, projects]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    openSection: (section: MenuSection) => {
      setActiveSection(section);
      setIsExpanded(true);
    }
  }));

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Listen for custom event to open menu sections
  useEffect(() => {
    const handleOpenSection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const section = customEvent.detail as MenuSection;
      setActiveSection(section);
      setIsExpanded(true);
    };

    window.addEventListener('openMenuSection', handleOpenSection);
    return () => window.removeEventListener('openMenuSection', handleOpenSection);
  }, []);

  // Listen for page transitions to keep menu open during navigation
  useEffect(() => {
    const handleTransitionStart = () => {
      setIsNavigating(true);
    };

    window.addEventListener('startPageTransition', handleTransitionStart);
    return () => window.removeEventListener('startPageTransition', handleTransitionStart);
  }, []);

  // Reset navigation state after route change
  useEffect(() => {
    setIsNavigating(false);
  }, [params?.slug]);

  // Reset to projects section when menu closes
  useEffect(() => {
    if (!isExpanded) {
      setTimeout(() => setActiveSection('projects'), 300);
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    // Don't reopen if force close is active
    if (!forceClose) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // Don't close menu if we're navigating to a new page
    if (!isNavigating) {
      setIsExpanded(false);
    }
    // Reset force close flag when mouse leaves
    setForceClose(false);
  };

  const toggleSection = (section: MenuSection) => {
    setActiveSection(section);
  };

  const handleProjectHover = (project: Project | null) => {
    setHoveredProject(project);
  };

  const handleToggleThumbnails = () => {
    window.dispatchEvent(new CustomEvent('toggleGridView'));
    setIsExpanded(false);
    setForceClose(true); // Prevent menu from reopening while hovering
  };

  return (
    <nav
      className={`${styles.menuBelt} ${isExpanded ? styles.expanded : styles.collapsed}`}
      data-section={activeSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Main navigation"
      role="navigation"
    >
      {isExpanded && (
        <div className={styles.menuContent}>
          {/* Mobile-only header with navigation */}
          <div className={styles.mobileHeader}>
            <SiteHeader />
            <div className={styles.mobileNav}>
              {/* Single toggle button that changes based on active section */}
              {activeSection === 'projects' ? (
                <button 
                  className={styles.toggleButton}
                  onClick={() => toggleSection('about')}
                >
                  About
                </button>
              ) : (
                <button 
                  className={styles.toggleButton}
                  onClick={() => toggleSection('projects')}
                >
                  Projects
                </button>
              )}
              
              {/* Thumbnails button - only show in project-info section */}
              {activeSection === 'project-info' && (
                <button 
                  className={styles.toggleButton}
                  onClick={handleToggleThumbnails}
                >
                  Thumbnails
                </button>
              )}
            </div>
          </div>

          <div className={styles.leftSection}>
            <div key={activeSection} className={styles.sectionContent}>
              {activeSection === 'projects' && (
                <ProjectsSection 
                  projects={projects} 
                  currentSlug={detectedProject?.slug || null}
                  onOpenProjectInfo={() => toggleSection('project-info')}
                  onProjectHover={handleProjectHover}
                />
              )}
              
              {activeSection === 'about' && (
                <AboutSection />
              )}
              
              {activeSection === 'project-info' && detectedProject && (
                <ProjectInfoSection 
                  project={detectedProject} 
                  projectNumber={projects.findIndex(p => p.id === detectedProject.id) + 1}
                />
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            {/* Single toggle button that changes based on active section */}
            {activeSection === 'projects' ? (
              <button 
                className={styles.toggleButton}
                onClick={() => toggleSection('about')}
              >
                About
              </button>
            ) : (
              <button 
                className={styles.toggleButton}
                onClick={() => toggleSection('projects')}
              >
                Projects
              </button>
            )}
            
            {/* Thumbnails button - only show in project-info section */}
            {activeSection === 'project-info' && (
              <button 
                className={styles.toggleButton}
                onClick={handleToggleThumbnails}
              >
                Thumbnails
              </button>
            )}
          </div>

          {/* Mobile-only footer */}
          <div className={styles.mobileFooter} data-section={activeSection}>
            <SiteFooter />
          </div>
        </div>
      )}

      {/* Stats container for hovered project in projects section */}
      {isExpanded && activeSection === 'projects' && hoveredProject && (
        <div className={styles.statsContainer}>
          <p className={styles.imageCounter}>
            {String(hoveredProject.images.length).padStart(2, '0')} Images 
          </p>
          {hoveredProject.collaboration && (
            <p className={styles.collaboration}>
              {hoveredProject.collaboration}
            </p>
          )}
        </div>
      )}
    </nav>
  );
});

export default MenuBelt;

