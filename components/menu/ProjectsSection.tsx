import TransitionLink from '@/components/transitions/TransitionLink';
import styles from './ProjectsSection.module.css';
import { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
  currentSlug: string | null;
}

export default function ProjectsSection({ projects, currentSlug }: ProjectsSectionProps) {
  return (
    <div className={styles.projectsSection}>
      <ul className={styles.projectList}>
        {projects.map((project, index) => (
          <li key={project.id} className={styles.projectItem}>
            <span className={styles.projectNumber}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.projectInfoContainer}>
              <TransitionLink 
                href={`/projects/${project.slug}`}
                className={`${styles.projectLink} ${currentSlug === project.slug ? styles.active : ''}`}
              >
                {project.title}
              </TransitionLink>
              <span className={styles.projectMeta}>
                {project.location}, {project.year}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

