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
  // Calculate how many media items to prioritize (first visible row = 6-8 items)
  const priorityCount = 8;
  
  return (
    <>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {project.media.map((mediaItem, index) => {
            const isPriority = index < priorityCount;
            const isVideo = mediaItem.type === 'video';
            
            // For videos, use thumbnail if available, otherwise show a placeholder
            const thumbnailUrl = isVideo && mediaItem.data.thumbnailUrl 
              ? mediaItem.data.thumbnailUrl 
              : isVideo 
                ? null 
                : mediaItem.data.url;
            
            // Calculate dimensions based on aspect ratio for videos
            let width: number;
            let height: number;
            
            if (mediaItem.type === 'image') {
              width = mediaItem.data.width;
              height = mediaItem.data.height;
            } else {
              // For videos: use aspect ratio to calculate dimensions
              // Base height of 1000px, calculate width from aspect ratio
              height = 1000;
              width = Math.round(height * mediaItem.data.aspectRatio);
            }
            
            return (
              <div
                key={mediaItem.type === 'image' ? mediaItem.data.id : mediaItem.data.id}
                className={styles.gridItem}
                onClick={() => onImageClick(index)}
              >
                <div 
                  className={styles.imageWrapper}
                  style={isVideo ? { aspectRatio: `${mediaItem.data.aspectRatio}` } : undefined}
                >
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={mediaItem.type === 'image' ? mediaItem.data.alt : (mediaItem.data.title || 'Video')}
                      width={width}
                      height={height}
                      className={styles.gridImage}
                      sizes="110px"
                      loading={isPriority ? 'eager' : 'lazy'}
                      priority={isPriority}
                      placeholder={mediaItem.type === 'image' && mediaItem.data.blurDataURL ? 'blur' : 'empty'}
                      blurDataURL={mediaItem.type === 'image' ? mediaItem.data.blurDataURL : undefined}
                      quality={75}
                      style={isVideo ? { objectFit: 'contain' } : undefined}
                    />
                  ) : (
                    <div className={styles.videoPlaceholder}>
                      <span className={styles.videoIcon}>▶</span>
                    </div>
                  )}
                  {isVideo && <div className={styles.videoIndicator}>▶</div>}
                </div>
                <p className={styles.imageNumber}>
                  <span className={styles.arrow}>●</span>
                  {String(index + 1).padStart(3, '0')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile gradient overlay - separate element for proper fixed positioning */}
      <div className={styles.mobileGradient} />
    </>
  );
}

