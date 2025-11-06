'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProjectVideo } from '@/lib/types';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  video: ProjectVideo;
  priority?: boolean;
  isActive?: boolean; // Whether this video slide is currently active
  onLoad?: () => void;
}

/**
 * Optimized video player component supporting Vimeo, YouTube, and other providers
 * Features:
 * - Lazy loading with intersection observer
 * - Responsive embed
 * - Privacy-enhanced mode
 * - Minimal performance impact
 */
export default function VideoPlayer({ video, priority = false, isActive = false, onLoad }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip observer if priority loading

    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [priority]);

  // Build embed URL based on provider
  const getEmbedUrl = (): string => {
    const { provider, videoId } = video;

    switch (provider) {
      case 'vimeo':
        // Vimeo embed parameters:
        // - dnt=1: Do not track (privacy)
        // - title=0, byline=0, portrait=0: Minimal UI
        // - autopause=0: Don't pause when another video plays
        // - background=0: Allow controls
        return `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0&autopause=0&background=0`;

      case 'youtube':
        // YouTube embed parameters:
        // - rel=0: Show related videos from same channel only
        // - modestbranding=1: Minimal YouTube branding
        // - enablejsapi=1: Enable API for video control
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;

      default:
        // For other providers, return the original URL
        return video.url;
    }
  };

  // Pause video when slide becomes inactive
  useEffect(() => {
    if (!iframeRef.current || !isLoaded) return;

    const iframe = iframeRef.current;

    if (!isActive) {
      // Pause video when not active
      try {
        if (video.provider === 'vimeo') {
          // Vimeo postMessage API
          iframe.contentWindow?.postMessage('{"method":"pause"}', '*');
        } else if (video.provider === 'youtube') {
          // YouTube postMessage API
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
        }
      } catch (error) {
        // Silently fail if postMessage is blocked
        console.debug('Could not pause video:', error);
      }
    }
  }, [isActive, isLoaded, video.provider]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Calculate width based on 40dvh height and aspect ratio
  // This ensures the video respects its aspect ratio while matching image height
  const containerStyle = {
    aspectRatio: `${video.aspectRatio}`,
  };

  return (
    <div
      ref={containerRef}
      className={styles.videoContainer}
      style={containerStyle}
    >
      {isInView && (
        <>
          {/* Loading placeholder */}
          {!isLoaded && video.thumbnailUrl && (
            <div className={styles.thumbnail}>
              <Image
                src={video.thumbnailUrl}
                alt={video.title || 'Video thumbnail'}
                className={styles.thumbnailImage}
                fill
                sizes="(max-width: 768px) 70vw, 45vw"
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.playButton}>▶</div>
            </div>
          )}

          {/* Iframe embed */}
          <iframe
            ref={iframeRef}
            src={getEmbedUrl()}
            className={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            title={video.title || 'Video'}
          />
        </>
      )}

      {/* Placeholder before in view */}
      {!isInView && video.thumbnailUrl && (
        <div className={styles.thumbnail}>
          <Image
            src={video.thumbnailUrl}
            alt={video.title || 'Video thumbnail'}
            className={styles.thumbnailImage}
            fill
            sizes="(max-width: 768px) 70vw, 45vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
}

