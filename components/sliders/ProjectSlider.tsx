'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import styles from './ProjectSlider.module.css';
import TransitionLink from '@/components/transitions/TransitionLink';
import { Project } from '@/lib/types';

import 'swiper/css';
import 'swiper/css/effect-fade';

interface ProjectSliderProps {
  project: Project;
  onToggleGrid: () => void;
  initialSlide?: number;
  onNavigationArrowChange?: (direction: 'left' | 'right' | null) => void;
  navigationArrow?: 'left' | 'right' | null;
  hideImages?: boolean;
  onNextProject?: () => void;
}

interface ImagePosition {
  top: string;
  left: string;
}

// Calculate random position within center 50% of viewport
function calculateRandomPosition(imageHeight: number): ImagePosition {
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  
  // Approximate image width based on 3:2 aspect ratio
  const approximateImageWidth = (imageHeight * 3) / 2;
  
  // Center 50% zone: 25% to 75% of viewport
  const centerZoneStartY = viewportHeight * 0.15;
  const centerZoneEndY = viewportHeight * 0.85;
  const centerZoneStartX = viewportWidth * 0.15;
  const centerZoneEndX = viewportWidth * 0.85;
  
  // Calculate available space for image within center zone
  const availableHeight = centerZoneEndY - centerZoneStartY - imageHeight;
  const availableWidth = centerZoneEndX - centerZoneStartX - approximateImageWidth;
  
  // Random position within center 50% zone
  const randomTop = centerZoneStartY + (Math.random() * Math.max(0, availableHeight));
  const randomLeft = centerZoneStartX + (Math.random() * Math.max(0, availableWidth));
  
  return {
    top: `${randomTop}px`,
    left: `${randomLeft}px`
  };
}

export default function ProjectSlider({ project, onToggleGrid, initialSlide = 0, onNavigationArrowChange, navigationArrow, hideImages = false, onNextProject }: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [positions, setPositions] = useState<ImagePosition[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevIndexRef = useRef<number>(initialSlide);

  // Generate random positions for all images (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculatePositions = () => {
      // Skip calculation on mobile (≤768px) - positions overridden by CSS
      if (window.innerWidth <= 768) {
        setPositions([]);
        return;
      }

      // Calculate actual pixel value of 40dvh
      const imageHeightPx = window.innerHeight * 0.4; // 40dvh = 40% of viewport height
      
      const newPositions = project.images.map(() => 
        calculateRandomPosition(imageHeightPx)
      );
      setPositions(newPositions);
    };

    calculatePositions();

    // Recalculate on resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculatePositions, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [project.images]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.realIndex;
    const prevIndex = prevIndexRef.current;
    
    setActiveIndex(newIndex);
    setHasInteracted(true);
    
    // Detect swipe direction and show corresponding arrow
    if (onNavigationArrowChange) {
      let direction: 'left' | 'right' | null = null;
      
      // Calculate direction considering loop behavior
      if (newIndex > prevIndex || (prevIndex === project.images.length - 1 && newIndex === 0)) {
        // Swiped forward (show right arrow)
        direction = 'right';
      } else if (newIndex < prevIndex || (prevIndex === 0 && newIndex === project.images.length - 1)) {
        // Swiped backward (show left arrow)
        direction = 'left';
      }
      
      if (direction) {
        onNavigationArrowChange(direction);
        
        // Hide arrow after 1 second
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        inactivityTimeoutRef.current = setTimeout(() => {
          onNavigationArrowChange(null);
        }, 1000);
      }
    }
    
    prevIndexRef.current = newIndex;
  };

  // Handle mouse movement for navigation arrow display
  const handleMouseMove = () => {
    // Clear existing timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Set new timeout to hide arrow after 2000ms of inactivity
    inactivityTimeoutRef.current = setTimeout(() => {
      onNavigationArrowChange?.(null);
    }, 1000);
  };

  const handleGhostMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent slide handler from firing
    onNavigationArrowChange?.('left');
    handleMouseMove();
  };

  const handleGhostMouseLeave = () => {
    // When leaving ghost, show right arrow (since we're still on slide)
    onNavigationArrowChange?.('right');
    handleMouseMove();
  };

  const handleSlideMouseEnter = () => {
    onNavigationArrowChange?.('right');
    handleMouseMove();
  };

  const handleMouseLeave = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    onNavigationArrowChange?.(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const handleGhostClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering slide click
    if (swiperRef.current && activeIndex > 0) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideClick = () => {
    if (swiperRef.current) {
      // Check if on last slide
      if (activeIndex === project.images.length - 1) {
        // Navigate to next project
        if (onNextProject) {
          onNextProject();
        }
      } else {
        swiperRef.current.slideNext();
      }
    }
    setHasInteracted(true);
  };

  return (
    <div 
      className={styles.projectSlider}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Keyboard, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={800}
        loop={false}
        initialSlide={initialSlide}
        keyboard={{
          enabled: true,
        }}
        watchSlidesProgress={true}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        className="project-swiper"
      >
        {project.images.map((image, index) => {
          const position = positions[index];
          
          // Calculate ghost image index (previous slide)
          const ghostIndex = activeIndex > 0 ? activeIndex - 1 : project.images.length - 1;
          const ghostPosition = positions[ghostIndex];
          const isActiveSlide = activeIndex === index;
          
          return (
            <SwiperSlide key={image.id}>
              <div 
                className={styles.slide} 
                onClick={handleSlideClick}
                onMouseEnter={handleSlideMouseEnter}
                onMouseMove={handleMouseMove}
              >
                {/* Ghost image (previous slide) - only show on active slide after interaction and not during presentation */}
                {isActiveSlide && ghostPosition && hasInteracted && activeIndex > 0 && !hideImages && (
                  <div
                    className={styles.ghostImage}
                    style={ghostPosition}
                    onClick={handleGhostClick}
                    onMouseEnter={handleGhostMouseEnter}
                    onMouseLeave={handleGhostMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <Image
                      src={project.images[ghostIndex].url}
                      alt="Previous"
                      width={project.images[ghostIndex].width}
                      height={project.images[ghostIndex].height}
                      className={styles.slideImage}
                      sizes="(max-width: 768px) 70vw, 45vw"
                      priority={initialSlide === 0 && ghostIndex === project.images.length - 1}
                      fetchPriority={initialSlide === 0 && ghostIndex === project.images.length - 1 ? 'high' : 'auto'}
                      loading={initialSlide === 0 && ghostIndex === project.images.length - 1 ? 'eager' : 'lazy'}
                      placeholder={initialSlide === 0 && ghostIndex === project.images.length - 1 ? 'blur' : 'empty'}
                      blurDataURL={initialSlide === 0 && ghostIndex === project.images.length - 1 ? project.images[ghostIndex].blurDataURL : undefined}
                    />
                  </div>
                )}

                {/* Image with caption - caption fades with image */}
                <div 
                  className={styles.imageWithCaption} 
                  style={{
                    ...position, 
                    opacity: hideImages ? 0 : 1, 
                    transition: hideImages ? 'none' : 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                    <div className={styles.imageContainer}>
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className={styles.slideImage}
                        sizes="(max-width: 768px) 70vw, 45vw"
                        priority={index === initialSlide || (initialSlide === 0 && index === project.images.length - 1)}
                        fetchPriority={index === initialSlide || (initialSlide === 0 && index === project.images.length - 1) ? 'high' : 'auto'}
                        loading={index === initialSlide || (initialSlide === 0 && index === project.images.length - 1) ? 'eager' : 'lazy'}
                        placeholder={index === initialSlide || (initialSlide === 0 && index === project.images.length - 1) ? 'blur' : 'empty'}
                        blurDataURL={index === initialSlide || (initialSlide === 0 && index === project.images.length - 1) ? image.blurDataURL : undefined}
                      />
                    </div>
                    {/* Caption always rendered, fades with parent slide */}
                    <div className={styles.imageCaption}>
                      <div className={styles.imageCounterWrapper}>
                        <span className={`${styles.arrow} ${styles.arrowLeft} ${navigationArrow === 'left' ? styles.arrowVisible : ''}`}>●</span>
                        <button 
                          className={styles.imageCounter}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleGrid();
                          }}
                          title="Toggle grid view"
                        >
                          {String(index + 1).padStart(2, '0')}/{String(project.images.length).padStart(2, '0')}
                        </button>
                        <span className={`${styles.arrow} ${styles.arrowRight} ${navigationArrow === 'right' ? styles.arrowVisible : ''}`}>●</span>
                      </div>
                      <TransitionLink href="/" className={styles.closeProject} onClick={(e) => e.stopPropagation()}>
                        Close project
                      </TransitionLink>
                    </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

