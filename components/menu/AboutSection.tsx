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
      <h2 className={styles.name}>{aboutInfo.name}</h2>
      <div className={styles.bioContainer}>
        <p className={styles.bio}>{aboutInfo.bio}</p>
        <div className={styles.collaborators}>
          <div className={styles.contactLabel}>Projects and Collaborators</div>
          <div className={styles.collaboratorsList}>
            {aboutInfo.collaborators.join(', ')}
          </div>
        </div>
      </div>
      <div className={styles.contact}>
        <div className={styles.contactLabel}>Email</div>
        <div className={styles.contactItem}>{aboutInfo.contact.email}</div>
        
        <div className={styles.contactLabel} style={{ marginTop: '12px' }}>Phone</div>
        <div className={styles.contactItem}>{aboutInfo.contact.phone}</div>
        
        <div className={styles.contactLabel} style={{ marginTop: '12px' }}>Insta</div>
        <div className={styles.contactItem}>{aboutInfo.contact.instagram}</div>
      </div>
    </div>
  );
}

