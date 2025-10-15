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
      {projectNumber && (
        <div className={styles.number}>
          {String(projectNumber).padStart(2, '0')}
        </div>
      )}
      <p className={styles.details}>
        {project.title}. {project.location}, {project.year}
      </p>
      {onOpenProjectInfo && (
        <button 
          className={styles.link}
          onClick={onOpenProjectInfo}
        >
          Project info
        </button>
      )}
    </div>
  );
}

