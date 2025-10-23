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

// Calculate random position within center 50% of viewport
function calculateRandomPosition(imageHeight: number, imageMargin: number = 20): ImagePosition {
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

export default function ProjectSlider({ project, onToggleGrid, initialSlide = 0 }: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [positions, setPositions] = useState<ImagePosition[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  // Generate random positions for all images
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculatePositions = () => {
      // Calculate actual pixel value of 40dvh
      const imageHeightPx = window.innerHeight * 0.4; // 40dvh = 40% of viewport height
      
      const newPositions = project.images.map(() => 
        calculateRandomPosition(imageHeightPx, 20)
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

                {/* Image with caption - caption fades with image */}
                {position && (
                  <div className={styles.imageWithCaption} style={position}>
                    <div className={styles.imageContainer}>
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
                    {/* Caption always rendered, fades with parent slide */}
                    <div className={styles.imageCaption}>
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
                      <Link href="/" className={styles.closeProject} onClick={(e) => e.stopPropagation()}>
                        Close project
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

