'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  fadeOutProjectInfo?: boolean; // Optional flag to fade out ProjectInfo on homepage
}

export default function TransitionLink({ href, children, className, onClick, fadeOutProjectInfo = false }: TransitionLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Check if browser supports View Transition API
    if ('startViewTransition' in document) {
      // Trigger fade out event for slider (with optional ProjectInfo fade flag)
      window.dispatchEvent(new CustomEvent('startPageTransition', { 
        detail: { fadeOutProjectInfo } 
      }));

      // Wait for slider fade out (800ms) then use View Transition API
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).startViewTransition(() => {
          startTransition(() => {
            router.push(href);
          });
        });
      }, 800);
    } else {
      // Fallback for browsers without View Transition API
      // Trigger fade out by dispatching custom event (with optional ProjectInfo fade flag)
      window.dispatchEvent(new CustomEvent('startPageTransition', { 
        detail: { fadeOutProjectInfo } 
      }));

      // Wait for fade out animation (800ms) then navigate
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, 800);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

