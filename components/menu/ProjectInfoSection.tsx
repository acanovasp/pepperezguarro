import styles from './ProjectInfoSection.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoSectionProps {
  project: Project;
}

export default function ProjectInfoSection({ project }: ProjectInfoSectionProps) {
  return (
    <div className={styles.projectInfoSection}>
      <div>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.meta}>
          {project.location}, {project.year}
        </p>
      </div>

      <p className={styles.description}>
        {project.description}
      </p>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Images</span>
          <span className={styles.statValue}>{project.images.length}</span>
        </div>
      </div>

      {project.collaboration && (
        <p className={styles.collaboration}>
          {project.collaboration}
        </p>
      )}
    </div>
  );
}

