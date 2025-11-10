import styles from './ProjectInfo.module.css';
import { Project } from '@/lib/types';

interface ProjectInfoProps {
  project: Project;
  onOpenProjectInfo?: () => void;
  variant?: 'default' | 'centered-intro';
  isVisible?: boolean;
}

export default function ProjectInfo({ project, onOpenProjectInfo, variant = 'default', isVisible = true }: ProjectInfoProps) {
  const locationYear = [project.location, project.year].filter(Boolean).join(', ');
  const isCenteredIntro = variant === 'centered-intro';
  
  return (
    <div className={`${styles.projectInfo} ${isCenteredIntro ? styles.centeredIntro : ''} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.content}>
        {project.formattedNumber && (
          <h1 className={styles.number}>
            {project.formattedNumber}
          </h1>
        )}
        <h1 className={styles.details}>
          {project.title}{locationYear && `. ${locationYear}`}
        </h1>
        
        {onOpenProjectInfo && !isCenteredIntro && (
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

