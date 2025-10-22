import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  projectNumber?: number;
  onOpenProjectInfo?: () => void;
}

export default function ProjectInfo({ project, projectNumber, onOpenProjectInfo }: ProjectInfoProps) {
  return (
    <div className={styles.projectInfo}>
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

