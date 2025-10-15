'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './MenuBelt.module.css';
import ProjectsSection from './ProjectsSection';
import AboutSection from './AboutSection';
import ProjectInfoSection from './ProjectInfoSection';
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
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Don't close menu if we're navigating to a new page
    if (!isNavigating) {
      setIsExpanded(false);
    }
  };

  const toggleSection = (section: MenuSection) => {
    setActiveSection(section);
  };

  return (
    <nav
      className={`${styles.menuBelt} ${isExpanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Main navigation"
      role="navigation"
    >
      {isExpanded && (
        <div className={styles.menuContent}>
          <div className={styles.leftSection}>
            {activeSection === 'projects' && (
              <ProjectsSection 
                projects={projects} 
                currentSlug={detectedProject?.slug || null}
              />
            )}
            
            {activeSection === 'about' && (
              <AboutSection />
            )}
            
            {activeSection === 'project-info' && detectedProject && (
              <ProjectInfoSection project={detectedProject} />
            )}
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
          </div>
        </div>
      )}
    </nav>
  );
});

export default MenuBelt;

