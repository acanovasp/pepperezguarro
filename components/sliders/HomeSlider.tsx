'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeSlider.module.css';
import ProjectInfo from '@/components/ui/ProjectInfo';
import { Project, ProjectImage } from '@/lib/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HomeSliderProps {
  projects: Project[];
}

// Get random image from project
function getRandomImage(project: Project): { image: ProjectImage; index: number } {
  const randomIndex = Math.floor(Math.random() * project.images.length);
  return {
    image: project.images[randomIndex],
    index: randomIndex
  };
}

export default function HomeSlider({ projects }: HomeSliderProps) {
  const [randomImages, setRandomImages] = useState<Map<string, { image: ProjectImage; index: number }>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorStyle, setCursorStyle] = useState<'w-resize' | 'e-resize'>('w-resize');
  const swiperRef = useRef<SwiperType | null>(null);
  const isUserInteractionRef = useRef(true); // Track if slide change is from user interaction

  // Generate random images ONCE when component mounts
  useEffect(() => {
    const newRandomImages = new Map<string, { image: ProjectImage; index: number }>();
    projects.forEach(project => {
      newRandomImages.set(project.id, getRandomImage(project));
    });
    setRandomImages(newRandomImages);
  }, [projects]);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    
    // Only generate new random image if it's from user interaction (not resize)
    if (!isUserInteractionRef.current) return;
    
    const activeProject = projects[swiper.realIndex];
    if (activeProject) {
      const newRandom = getRandomImage(activeProject);
      setRandomImages(prev => new Map(prev).set(activeProject.id, newRandom));
    }
  };

  // Prevent random image changes during resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      // Disable random image changes immediately
      isUserInteractionRef.current = false;
      
      // Clear previous timeout
      clearTimeout(resizeTimeout);
      
      // Re-enable only after resize stops (300ms of no resize events)
      resizeTimeout = setTimeout(() => {
        isUserInteractionRef.current = true;
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (mouseX < screenWidth / 2) {
      setCursorStyle('w-resize');
    } else {
      setCursorStyle('e-resize');
    }
  };

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

  const activeProject = projects[activeIndex];

  return (
    <div 
      className={styles.homeSlider} 
      role="region" 
      aria-label="Project gallery"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{ cursor: cursorStyle }}
    >
      {activeProject && <ProjectInfo project={activeProject} />}
      <Swiper
        modules={[Keyboard, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={800}
        loop={true}
        keyboard={{
          enabled: true,
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
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
                  <div className={styles.imageContainer}>
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={1200}
                      height={800}
                      className={styles.slideImage}
                      priority={projects.indexOf(project) === 0}
                      fetchPriority={projects.indexOf(project) === 0 ? 'high' : 'auto'}
                      placeholder={projects.indexOf(project) < 2 ? 'blur' : 'empty'}
                      blurDataURL={projects.indexOf(project) < 2 ? image.blurDataURL : undefined}
                    />
                  </div>
                  
                  <div className={styles.caption}>
                    <span className={styles.imageCounter}>
                      {String(index + 1).padStart(2, '0')}/{String(project.images.length).padStart(2, '0')}
                    </span>
                    <Link href={`/projects/${project.slug}`} className={styles.openProject} onClick={(e) => e.stopPropagation()}>
                      Open project
                    </Link>
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

