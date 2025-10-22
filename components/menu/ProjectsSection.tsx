import TransitionLink from '@/components/transitions/TransitionLink';
import styles from './ProjectsSection.module.css';
import { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
  currentSlug: string | null;
  onOpenProjectInfo?: () => void;
  onProjectHover?: (project: Project | null) => void;
}

export default function ProjectsSection({ projects, currentSlug, onOpenProjectInfo, onProjectHover }: ProjectsSectionProps) {
  const isActive = (slug: string) => currentSlug === slug;

  return (
    <div className={styles.projectsSection}>
      <ul className={styles.projectList}>
        {projects.map((project, index) => {
          const active = isActive(project.slug);
          
          return (
            <li 
              key={project.id} 
              className={`${styles.projectItem} ${active ? styles.activeItem : ''}`}
              onMouseEnter={() => onProjectHover?.(project)}
              onMouseLeave={() => onProjectHover?.(null)}
            >
              <p className={styles.projectNumber}>
                {active && <span className={styles.arrow}>● </span>}
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className={styles.projectItemContent}>
                <TransitionLink 
                  href={`/projects/${project.slug}`}
                  className={`${styles.projectInfoContainer} ${styles.projectLink}`}
                >
                  {project.title}
                  <span className={styles.projectMeta}>
                    {project.location}, {project.year}
                  </span>
                </TransitionLink>
                
                {/* Show extraInfo for active project */}
                {active && (
                  <div className={styles.extraInfo}>
                    <p className={styles.imageCount}>
                      {String(project.images.length).padStart(2, '0')} Images
                    </p>
                    <button 
                      className={styles.projectInfoLink}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProjectInfo?.();
                      }}
                    >
                      Project info
                    </button>
                  </div>
                )}
                
                {/* Show openProject link on hover for non-active projects */}
                {!active && (
                  <TransitionLink 
                    href={`/projects/${project.slug}`}
                    className={styles.openProjectLink}
                  >
                    Open project
                  </TransitionLink>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

