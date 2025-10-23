'use client';

import { useEffect, useState } from 'react';
import { getAboutInfo } from '@/lib/data';
import { AboutInfo } from '@/lib/types';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  useEffect(() => {
    getAboutInfo().then(setAboutInfo);
  }, []);

  if (!aboutInfo) return null;

  return (
    <div className={styles.siteFooter}>
      <div className={styles.contactInfo}>
        <p>
          <a href={aboutInfo.contact.email.link}>{aboutInfo.contact.email.display}</a>
          {' / '}
          <a href={aboutInfo.contact.phone.link}>{aboutInfo.contact.phone.display}</a>
        </p>
        <p>
          <a 
            href={aboutInfo.contact.instagram.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {aboutInfo.contact.instagram.display}
          </a>
        </p>
      </div>
      
      <div className={styles.copyright}>
        <p>All rights reserved. ©Pep Perez Guarro, {new Date().getFullYear()}</p>
        <p>Design & Code by <a href="https://www.acanovas.info" target="_blank" rel="noopener noreferrer">Alvaro Canovas</a></p>
      </div>
    </div>
  );
}

