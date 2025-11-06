import styles from './ProjectInfoSection.module.css';
import { Project } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { PortableText } from '@portabletext/react';

interface ProjectInfoSectionProps {
  project: Project;
}

export default function ProjectInfoSection({ project }: ProjectInfoSectionProps) {
  const descriptionRef = useRef<HTMLHeadingElement>(null);
  const [expandWidth, setExpandWidth] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!descriptionRef.current) return;

      const element = descriptionRef.current;
      const container = element.parentElement;
      
      if (!container) return;

      // Only check on desktop (min-width: 769px)
      if (window.innerWidth <= 768) {
        setExpandWidth(false);
        return;
      }

      // Get the available height of the container
      const containerHeight = container.clientHeight;
      
      // Check if content is overflowing vertically
      const isOverflowing = element.scrollHeight > containerHeight;
      
      setExpandWidth(isOverflowing);
    };

    // Check on mount and when description changes
    checkOverflow();

    // Recheck on window resize
    window.addEventListener('resize', checkOverflow);
    
    // Small delay to ensure layout is complete
    const timeoutId = setTimeout(checkOverflow, 100);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
    };
  }, [project.description]);

  return (
    <>
      <div className={styles.projectInfoSection}>
        <div className={styles.projectInfoHeader}>
          <p className={styles.projectNumber}>
            {project.formattedNumber}
          </p>
          <div className={styles.projectInfoContainer}>
            <h1 className={styles.title}>{project.title}</h1>
            <h1 className={styles.meta}>
              {project.location}, {project.year}
            </h1>
          </div>
        </div>

        <div 
          ref={descriptionRef}
          className={`${styles.description} ${expandWidth ? styles.descriptionExpanded : ''}`}
        >
          <PortableText 
            value={project.description}
            components={{
              block: {
                normal: ({ children }) => <h1>{children}</h1>,
              },
            }}
          />
        </div>
      </div>
      
      <div className={styles.statsContainer}>
        <p className={styles.imageCounter}>
          {String(project.media.length).padStart(2, '0')} {project.media.length === 1 ? 'Item' : 'Items'}
        </p>
        {project.collaboration && (
          <p className={styles.collaboration}>
            {project.collaboration}
          </p>
        )}
        <div className={styles.clientDateContainer}>
          {project.client && (
            <p className={styles.client}>
              {project.client}
            </p>
          )}
          {project.date && (
            <p className={styles.date}>
              {project.date}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

