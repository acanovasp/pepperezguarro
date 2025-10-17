import TransitionLink from '@/components/transitions/TransitionLink';
import styles from './ProjectsSection.module.css';
import { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
  currentSlug: string | null;
  onOpenProjectInfo?: () => void;
}

export default function ProjectsSection({ projects, currentSlug, onOpenProjectInfo }: ProjectsSectionProps) {
  const isActive = (slug: string) => currentSlug === slug;

  return (
    <div className={styles.projectsSection}>
      <ul className={styles.projectList}>
        {projects.map((project, index) => {
          const active = isActive(project.slug);
          
          return (
            <li key={project.id} className={`${styles.projectItem} ${active ? styles.activeItem : ''}`}>
              <p className={styles.projectNumber}>
                {active && <span className={styles.arrow}>► </span>}
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
                
                {active && (
                  <div className={styles.extraInfo}>
                    <p className={styles.imageCount}>
                      {String(project.images.length).padStart(2, '0')} Images
                    </p>
                    <button 
                      className={styles.projectInfoLink}
                      onClick={onOpenProjectInfo}
                    >
                      Project info
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

