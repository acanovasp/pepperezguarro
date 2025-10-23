import styles from './ProjectInfoSection.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoSectionProps {
  project: Project;
  projectNumber: number;
}

export default function ProjectInfoSection({ project, projectNumber }: ProjectInfoSectionProps) {
  return (
    <>
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

        <h1 className={styles.description}>
          {project.description}
        </h1>
      </div>
      
      <div className={styles.statsContainer}>
        <p className={styles.imageCounter}>
          {String(project.images.length).padStart(2, '0')} Images 
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

