import Image from 'next/image';
import styles from './ImageGrid.module.css';
import TransitionLink from '@/components/transitions/TransitionLink';
import { Project } from '@/lib/types';

interface ImageGridProps {
  project: Project;
  onImageClick: (index: number) => void;
  onToggleView: () => void;
}

export default function ImageGrid({ project, onImageClick, onToggleView }: ImageGridProps) {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {project.images.map((image, index) => (
          <div
            key={image.id}
            className={styles.gridItem}
            onClick={() => onImageClick(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className={styles.gridImage}
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
            <span className={styles.imageNumber}>
              {String(index + 1).padStart(3, '0')}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.caption}>
        <button 
          className={styles.toggleView}
          onClick={onToggleView}
        >
          Slideshow view
        </button>
        <TransitionLink href="/" className={styles.closeProject}>
          Close project
        </TransitionLink>
      </div>
    </div>
  );
}

