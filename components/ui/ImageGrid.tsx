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
  // Calculate how many images to prioritize (first visible row = 6-8 images)
  const priorityCount = 8;
  
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {project.images.map((image, index) => {
          const isPriority = index < priorityCount;
          
          return (
            <div
              key={image.id}
              className={styles.gridItem}
              onClick={() => onImageClick(index)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={110}
                  height={73}
                  className={styles.gridImage}
                  sizes="110px"
                  loading={isPriority ? 'eager' : 'lazy'}
                  priority={isPriority}
                  placeholder={image.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={image.blurDataURL}
                  quality={75}
                />
              </div>
              <p className={styles.imageNumber}>
                {String(index + 1).padStart(3, '0')}
              </p>
            </div>
          );
        })}
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

