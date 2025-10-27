'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import styles from './HomeSlider.module.css';
import TransitionLink from '@/components/transitions/TransitionLink';
import { Project, ProjectImage } from '@/lib/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HomeSliderProps {
  projects: Project[];
  onActiveProjectChange?: (project: Project) => void;
}

// Get random image from project
function getRandomImage(project: Project): { image: ProjectImage; index: number } {
  const randomIndex = Math.floor(Math.random() * project.images.length);
  return {
    image: project.images[randomIndex],
    index: randomIndex
  };
}

export default function HomeSlider({ projects, onActiveProjectChange }: HomeSliderProps) {
  const [randomImages, setRandomImages] = useState<Map<string, { image: ProjectImage; index: number }>>(new Map());
  const [navigationArrow, setNavigationArrow] = useState<'left' | 'right' | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevIndexRef = useRef<number>(0); // Track previous index to detect actual changes
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Generate random images ONCE when component mounts
  useEffect(() => {
    const newRandomImages = new Map<string, { image: ProjectImage; index: number }>();
    projects.forEach(project => {
      newRandomImages.set(project.id, getRandomImage(project));
    });
    setRandomImages(newRandomImages);
  }, [projects]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.realIndex;
    
    // Only update if index actually changed (prevents flickering during drag/resize)
    if (prevIndexRef.current !== newIndex) {
      prevIndexRef.current = newIndex;
      
      // Notify parent of active project change
      const activeProject = projects[newIndex];
      if (activeProject && onActiveProjectChange) {
        onActiveProjectChange(activeProject);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (mouseX < screenWidth / 2) {
      setNavigationArrow('left');
    } else {
      setNavigationArrow('right');
    }

    // Clear existing timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Set new timeout to hide arrow after 1000ms of inactivity
    inactivityTimeoutRef.current = setTimeout(() => {
      setNavigationArrow(null);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    setNavigationArrow(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger on actual clicks, not during drags or resizes
    if (e.button !== 0) return; // Only left click
    if (!swiperRef.current) return;
    
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (clickX < screenWidth / 2) {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div 
      className={styles.homeSlider} 
      role="region" 
      aria-label="Project gallery"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Keyboard, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: false,
        }}
        speed={300}
        loop={true}
        keyboard={{
          enabled: true,
        }}
        watchSlidesProgress={true}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          const initialIndex = swiper.realIndex;
          prevIndexRef.current = initialIndex;
          // Notify parent of initial active project
          const initialProject = projects[initialIndex];
          if (initialProject && onActiveProjectChange) {
            onActiveProjectChange(initialProject);
          }
        }}
        aria-label="Project slideshow"
      >
        {projects.map((project) => {
          const randomData = randomImages.get(project.id);
          if (!randomData) return null;

          const { image, index } = randomData;

          return (
            <SwiperSlide key={project.id}>
              <div className={styles.slide}>
                <div className={styles.imageWithCaption}>
                  <div className={styles.imageContainerWrapper}>
                    {/* Navigation arrows positioned next to image */}
                    <span className={`${styles.arrow} ${styles.arrowLeft} ${navigationArrow === 'left' ? styles.arrowVisible : ''}`}>●</span>
                    <span className={`${styles.arrow} ${styles.arrowRight} ${navigationArrow === 'right' ? styles.arrowVisible : ''}`}>●</span>
                    
                    {/* Conditionally wrap image in link on desktop only */}
                    {isDesktop ? (
                      <TransitionLink 
                        href={`/projects/${project.slug}`} 
                        className={styles.imageContainer}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          className={styles.slideImage}
                          sizes="(max-width: 768px) 70vw, 55vw"
                          priority={projects.indexOf(project) === 0}
                          fetchPriority={projects.indexOf(project) === 0 ? 'high' : 'auto'}
                          loading={projects.indexOf(project) === 0 ? 'eager' : 'lazy'}
                          placeholder={projects.indexOf(project) === 0 ? 'blur' : 'empty'}
                          blurDataURL={projects.indexOf(project) === 0 ? image.blurDataURL : undefined}
                        />
                      </TransitionLink>
                    ) : (
                      <div className={styles.imageContainer}>
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          className={styles.slideImage}
                          sizes="(max-width: 768px) 70vw, 55vw"
                          priority={projects.indexOf(project) === 0}
                          fetchPriority={projects.indexOf(project) === 0 ? 'high' : 'auto'}
                          loading={projects.indexOf(project) === 0 ? 'eager' : 'lazy'}
                          placeholder={projects.indexOf(project) === 0 ? 'blur' : 'empty'}
                          blurDataURL={projects.indexOf(project) === 0 ? image.blurDataURL : undefined}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.caption}>
                    <p className={styles.imageCounter}>
                      {String(index + 1).padStart(2, '0')}/{String(project.images.length).padStart(2, '0')}
                    </p>
                    <TransitionLink href={`/projects/${project.slug}`} className={styles.openProject} onClick={(e) => e.stopPropagation()}>
                      Open project
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

