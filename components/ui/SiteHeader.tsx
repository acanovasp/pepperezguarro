'use client';

import { usePathname } from 'next/navigation';
import TransitionLink from '../transitions/TransitionLink';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <TransitionLink 
      href="/" 
      className={`${styles.siteHeader} ${isHomepage ? styles.disabled : ''}`}
    >
      Pep Perez Guarro
    </TransitionLink>
  );
}

