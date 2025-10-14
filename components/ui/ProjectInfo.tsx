import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  onOpenProjectInfo?: () => void;
}

export default function ProjectInfo({ project, onOpenProjectInfo }: ProjectInfoProps) {
  return (
    <div className={styles.projectInfo}>
      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.meta}>
        {project.location}, {project.year}
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

