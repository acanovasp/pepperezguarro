'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectSlider.module.css';
import { Project } from '@/lib/types';

import 'swiper/css';

interface ProjectSliderProps {
  project: Project;
  onToggleGrid: () => void;
  initialSlide?: number;
}

interface ImagePosition {
  top: string;
  left: string;
}

// Calculate random position ensuring image stays within viewport with margin
function calculateRandomPosition(imageHeight: number, imageMargin: number = 20): ImagePosition {
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  
  // Approximate image width based on 3:2 aspect ratio
  const approximateImageWidth = (imageHeight * 3) / 2;
  
  const maxTop = viewportHeight - imageHeight - imageMargin;
  const maxLeft = viewportWidth - approximateImageWidth - imageMargin;
  
  const randomTop = Math.random() * (maxTop - imageMargin) + imageMargin;
  const randomLeft = Math.random() * (maxLeft - imageMargin) + imageMargin;
  
  return {
    top: `${randomTop}px`,
    left: `${randomLeft}px`
  };
}

export default function ProjectSlider({ project, onToggleGrid, initialSlide = 0 }: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [positions, setPositions] = useState<ImagePosition[]>([]);
  const [prevPosition, setPrevPosition] = useState<ImagePosition | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Generate random positions for all images
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const imageHeightPx = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--image-height')) || 400;
    
    const newPositions = project.images.map(() => 
      calculateRandomPosition(imageHeightPx, 20)
    );
    setPositions(newPositions);
  }, [project.images]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.realIndex;
    
    // Save previous position for ghost effect
    if (positions[activeIndex]) {
      setPrevPosition(positions[activeIndex]);
    }
    
    setActiveIndex(newIndex);
  };

  const handleGhostClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <div className={styles.projectSlider}>
      <Swiper
        modules={[Keyboard, Mousewheel]}
        speed={800}
        loop={true}
        initialSlide={initialSlide}
        keyboard={{
          enabled: true,
        }}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        className="project-swiper"
      >
        {project.images.map((image, index) => {
          const position = positions[index];
          
          return (
            <SwiperSlide key={image.id}>
              <div className={styles.slide}>
                {/* Ghost image (previous slide) */}
                {activeIndex === index && prevPosition && activeIndex > 0 && (
                  <div
                    className={styles.ghostImage}
                    style={prevPosition}
                    onClick={handleGhostClick}
                  >
                    <Image
                      src={project.images[activeIndex - 1]?.url || project.images[project.images.length - 1].url}
                      alt="Previous"
                      width={1200}
                      height={800}
                      className={styles.slideImage}
                    />
                  </div>
                )}

                {/* Current image */}
                {position && (
                  <div className={styles.imageContainer} style={position}>
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={1200}
                      height={800}
                      className={styles.slideImage}
                      priority={index < 2}
                      placeholder="blur"
                      blurDataURL={image.blurDataURL}
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className={styles.caption}>
        <button 
          className={styles.imageCounter}
          onClick={onToggleGrid}
          title="Toggle grid view"
        >
          {String(activeIndex + 1).padStart(2, '0')}/{String(project.images.length).padStart(2, '0')}
        </button>
        <Link href="/" className={styles.closeProject}>
          Close project
        </Link>
      </div>
    </div>
  );
}

