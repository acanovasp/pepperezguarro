'use client';

import { useEffect, useState } from 'react';
import styles from './AboutSection.module.css';
import { AboutInfo } from '@/lib/types';
import { getAboutInfo } from '@/lib/data';

export default function AboutSection() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  useEffect(() => {
    getAboutInfo().then(setAboutInfo);
  }, []);

  if (!aboutInfo) return null;

  return (
    <div className={styles.aboutSection}>
      <h1 className={styles.name}>{aboutInfo.name}</h1>
      <div className={styles.bioContainer}>
        <h1 className={styles.bio}>{aboutInfo.bio}</h1>
        <div className={styles.collaborators}>
          <p className={styles.contactLabel}>Projects and Collaborators</p>
          <h1 className={styles.collaboratorsList}>
            {aboutInfo.collaborators.join(', ')}
          </h1>
        </div>
      </div>
      <div className={styles.contact}>
        <div className={styles.contactItem}>
          <p className={styles.contactLabel}>Email</p>
          <h1>
            <a href={aboutInfo.contact.email.link} className={styles.contactAnchor}>
              {aboutInfo.contact.email.display}
            </a>
          </h1>  
        </div>
        <div className={styles.contactItem}>
          <p className={styles.contactLabel}>Phone</p>
          <a href={aboutInfo.contact.phone.link} className={styles.contactAnchor}>
            {aboutInfo.contact.phone.display}
          </a>
        </div>
        <div className={styles.contactItem}>
          <p className={styles.contactLabel}>Insta</p>
          <a 
            href={aboutInfo.contact.instagram.link} 
            className={styles.contactAnchor}
            target="_blank"
            rel="noopener noreferrer"
          >
            {aboutInfo.contact.instagram.display}
          </a>
        </div>
      </div>
    </div>
  );
}

