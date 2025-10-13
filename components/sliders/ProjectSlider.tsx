'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectSlider.module.css';
import { Project } from '@/lib/types';

import 'swiper/css';
import 'swiper/css/effect-fade';

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
    setActiveIndex(swiper.realIndex);
  };

  const handleGhostClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering slide click
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className={styles.projectSlider}>
      <Swiper
        modules={[Keyboard, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={800}
        loop={true}
        initialSlide={initialSlide}
        keyboard={{
          enabled: true,
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
          
          // Calculate ghost image index (previous slide)
          const ghostIndex = activeIndex === 0 ? project.images.length - 1 : activeIndex - 1;
          const ghostPosition = positions[ghostIndex];
          const isActiveSlide = activeIndex === index;
          
          return (
            <SwiperSlide key={image.id}>
              <div className={styles.slide} onClick={handleSlideClick}>
                {/* Ghost image (previous slide) - only show on active slide */}
                {isActiveSlide && ghostPosition && (
                  <div
                    className={styles.ghostImage}
                    style={ghostPosition}
                    onClick={handleGhostClick}
                  >
                    <Image
                      src={project.images[ghostIndex].url}
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

