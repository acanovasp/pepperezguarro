'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './MenuBelt.module.css';
import ProjectsSection from './ProjectsSection';
import AboutSection from './AboutSection';
import ProjectInfoSection from './ProjectInfoSection';
import SiteHeader from '@/components/ui/SiteHeader';
import SiteFooter from '@/components/ui/SiteFooter';
import { Project, AboutInfo } from '@/lib/types';

type MenuSection = 'projects' | 'about' | 'project-info';

interface MenuBeltProps {
  projects: Project[];
  aboutInfo: AboutInfo;
  currentProject?: Project | null;
}

export interface MenuBeltRef {
  openSection: (section: MenuSection) => void;
}

const MenuBelt = forwardRef<MenuBeltRef, MenuBeltProps>(function MenuBelt({ projects, aboutInfo, currentProject }, ref) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection>('projects');
  const [detectedProject, setDetectedProject] = useState<Project | null>(currentProject || null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [forceClose, setForceClose] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const params = useParams();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

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

  // Listen for page transitions and close menu on all devices
  useEffect(() => {
    const handleTransitionStart = () => {
      setIsExpanded(false);
      setForceClose(true);
    };

    window.addEventListener('startPageTransition', handleTransitionStart);
    return () => window.removeEventListener('startPageTransition', handleTransitionStart);
  }, []);

  // Listen for grid view toggle and close menu (desktop and mobile)
  useEffect(() => {
    const handleToggleGrid = () => {
      setIsExpanded(false);
      setForceClose(true);
    };

    window.addEventListener('toggleGridView', handleToggleGrid);
    return () => window.removeEventListener('toggleGridView', handleToggleGrid);
  }, []);

  // Cleanup close timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Reset to projects section when menu closes
  useEffect(() => {
    if (!isExpanded) {
      setTimeout(() => setActiveSection('projects'), 300);
    }
  }, [isExpanded]);

  // Click-outside detection for mobile
  useEffect(() => {
    if (!isMobile || !isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't close if clicking a button that changes sections
      if (target.closest('button')) {
        return;
      }
      
      const menuElement = document.querySelector('[data-section]') as HTMLElement;
      
      if (menuElement && !menuElement.contains(target)) {
        setIsExpanded(false);
      }
    };

    // Delay adding listener to avoid immediate close
    const timeout = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isExpanded]);

  // Swipe gesture detection for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const screenHeight = window.innerHeight;
      
      // Check if grid is visible (on project page with grid view)
      const gridVisible = document.querySelector('[class*="ImageGrid_gridContainer"]') !== null;
      
      // If grid is visible, only detect swipes from bottom 150px
      if (gridVisible && !isExpanded) {
        const distanceFromBottom = screenHeight - touchY;
        if (distanceFromBottom > 150) {
          // Touch started too far from bottom, ignore it
          return;
        }
      }
      
      setTouchStart({
        y: touchY,
        time: Date.now()
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = e.changedTouches[0].clientY;
      const deltaY = touchStart.y - touchEnd;
      const deltaTime = Date.now() - touchStart.time;
      const velocity = Math.abs(deltaY) / deltaTime;

      // Minimum swipe distance: 50px
      // Or fast swipe with velocity > 0.5px/ms
      const isSignificantSwipe = Math.abs(deltaY) >= 50 || velocity > 0.5;

      if (isSignificantSwipe) {
        if (deltaY > 0 && !isExpanded) {
          // Swipe up - open menu
          setIsExpanded(true);
        } else if (deltaY < 0 && isExpanded) {
          // Swipe down - close menu (only if swipe started outside menu content)
          const target = e.target as HTMLElement;
          const menuContent = target.closest('[class*="MenuBelt_leftSection"]');
          
          // Only close if swipe was outside the scrollable content
          if (!menuContent) {
            setIsExpanded(false);
          }
        }
      }

      setTouchStart(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;
      
      const deltaY = Math.abs(touchStart.y - e.touches[0].clientY);
      if (deltaY <= 10) return; // Not a significant move yet
      
      // Check if touch is inside the menu content
      const target = e.target as HTMLElement;
      const menuContent = target.closest('[class*="MenuBelt_leftSection"]');
      
      // If menu is expanded and touch is inside scrollable content, allow scrolling
      if (isExpanded && menuContent) {
        return; // Don't preventDefault, allow native scroll
      }
      
      // Otherwise, prevent default to handle menu open/close gesture
      e.preventDefault();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, isExpanded, touchStart]);

  const handleMouseEnter = () => {
    // Clear any pending close timeout when mouse re-enters
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    // Don't reopen if force close is active
    if (!forceClose) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // Delay closing by 250ms to prevent accidental closures
    closeTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      // Reset force close flag when menu closes
      setForceClose(false);
    }, 250);
  };

  const toggleSection = (section: MenuSection) => {
    setActiveSection(section);
  };

  const handleProjectHover = (project: Project | null) => {
    setHoveredProject(project);
  };

  const handleToggleThumbnails = () => {
    window.dispatchEvent(new CustomEvent('toggleGridView'));
    // Menu closing is handled by toggleGridView event listener
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    
    // If menu is collapsed, expand it
    if (!isExpanded) {
      setIsExpanded(true);
      e.stopPropagation();
    }
    // If expanded, clicks inside don't close (handled by click-outside)
  };

  return (
    <nav
      className={`${styles.menuBelt} ${isExpanded ? styles.expanded : styles.collapsed}`}
      data-section={activeSection}
      {...(!isMobile && {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      })}
      {...(isMobile && {
        onClick: handleMenuClick
      })}
      aria-label="Main navigation"
      role="navigation"
    >
      {isExpanded && (
        <div 
          className={styles.menuContent}
          onClick={(e) => e.stopPropagation()}
        >
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
                <AboutSection aboutInfo={aboutInfo} />
              )}
              
              {activeSection === 'project-info' && detectedProject && (
                <ProjectInfoSection 
                  project={detectedProject}
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
            <SiteFooter aboutInfo={aboutInfo} />
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

