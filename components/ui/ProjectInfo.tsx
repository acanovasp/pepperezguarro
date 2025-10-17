import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  projectNumber?: number;
  onOpenProjectInfo?: () => void;
  navigationArrow?: 'left' | 'right' | null;
}

export default function ProjectInfo({ project, projectNumber, onOpenProjectInfo, navigationArrow }: ProjectInfoProps) {
  return (
    <div className={styles.projectInfo}>
      {navigationArrow === 'left' && (
        <span className={`${styles.arrow} ${styles.arrowLeft}`}>►</span>
      )}
      {navigationArrow === 'right' && (
        <span className={`${styles.arrow} ${styles.arrowRight}`}>►</span>
      )}
      
      <div className={styles.content}>
        {projectNumber && (
          <h1 className={styles.number}>
            {String(projectNumber).padStart(2, '0')}
          </h1>
        )}
        <h1 className={styles.details}>
          {project.title}. {project.location}, {project.year}
        </h1>
        
        {onOpenProjectInfo && (
          <button 
            className={styles.link}
            onClick={onOpenProjectInfo}
          >
            Project info
          </button>
        )}
      </div>
    </div>
  );
}

