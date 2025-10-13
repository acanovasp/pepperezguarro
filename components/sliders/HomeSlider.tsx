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

  // Generate random images when component mounts and when slide changes
  useEffect(() => {
    const newRandomImages = new Map<string, { image: ProjectImage; index: number }>();
    projects.forEach(project => {
      newRandomImages.set(project.id, getRandomImage(project));
    });
    setRandomImages(newRandomImages);
  }, [projects]);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    
    // Generate new random image for the active project
    const activeProject = projects[swiper.realIndex];
    if (activeProject) {
      const newRandom = getRandomImage(activeProject);
      setRandomImages(prev => new Map(prev).set(activeProject.id, newRandom));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (mouseX < screenWidth / 2) {
      setCursorStyle('w-resize');
    } else {
      setCursorStyle('e-resize');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
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
                <div className={styles.imageContainer}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={1200}
                    height={800}
                    className={styles.slideImage}
                    priority={projects.indexOf(project) < 2}
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                  />
                </div>
                
                <div className={styles.caption}>
                  <span className={styles.imageCounter}>
                    {String(index + 1).padStart(2, '0')}/{String(project.images.length).padStart(2, '0')}
                  </span>
                  <Link href={`/projects/${project.slug}`} className={styles.openProject}>
                    Open project
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className={styles.navigationHint}>
        Use arrows or scroll to navigate
      </div>
    </div>
  );
}

