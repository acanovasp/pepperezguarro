import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  onOpenProjectInfo?: () => void;
}

export default function ProjectInfo({ project, onOpenProjectInfo }: ProjectInfoProps) {
  return (
    <div className={styles.projectInfo}>
      <div className={styles.content}>
        <h1 className={styles.number}>
          {project.formattedNumber}
        </h1>
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

