import styles from './ProjectInfoSection.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoSectionProps {
  project: Project;
  projectNumber: number;
}

export default function ProjectInfoSection({ project, projectNumber }: ProjectInfoSectionProps) {
  return (
    <div className={styles.projectInfoSection}>
      <div className={styles.projectInfoHeader}>
        <p className={styles.projectNumber}>
          {String(projectNumber).padStart(2, '0')}
        </p>
        <div className={styles.projectInfoContainer}>
          <h1 className={styles.title}>{project.title}</h1>
          <h1 className={styles.meta}>
            {project.location}, {project.year}
          </h1>
        </div>
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

