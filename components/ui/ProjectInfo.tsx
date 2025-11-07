import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  onOpenProjectInfo?: () => void;
}

export default function ProjectInfo({ project, onOpenProjectInfo }: ProjectInfoProps) {
  const locationYear = [project.location, project.year].filter(Boolean).join(', ');
  
  return (
    <div className={styles.projectInfo}>
      <div className={styles.content}>
        {project.formattedNumber && (
          <h1 className={styles.number}>
            {project.formattedNumber}
          </h1>
        )}
        <h1 className={styles.details}>
          {project.title}{locationYear && `. ${locationYear}`}
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

