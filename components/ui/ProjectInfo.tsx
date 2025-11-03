import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  onOpenProjectInfo?: () => void;
  isPresenting?: boolean;
  useViewTransition?: boolean;
}

export default function ProjectInfo({ project, onOpenProjectInfo, isPresenting = false, useViewTransition = true }: ProjectInfoProps) {
  return (
    <div className={`${styles.projectInfo} ${isPresenting ? styles.presenting : ''} ${useViewTransition ? styles.withTransition : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.number}>
          {project.formattedNumber}
        </h1>
        <h1 className={styles.details}>
          {project.title}. {project.location}, {project.year}
        </h1>
        
        {onOpenProjectInfo && !isPresenting && (
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

