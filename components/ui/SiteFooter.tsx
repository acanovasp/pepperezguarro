'use client';

import { AboutInfo } from '@/lib/types';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  aboutInfo: AboutInfo;
}

export default function SiteFooter({ aboutInfo }: SiteFooterProps) {

  return (
    <div className={styles.siteFooter}>
      <div className={styles.contactInfo}>
        <p>
          <a href={aboutInfo.contact.email.link}>{aboutInfo.contact.email.display}</a>
          {' / '}
          <a 
            href={aboutInfo.contact.instagram.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {aboutInfo.contact.instagram.display}
          </a>
        </p>
        <p>
          {aboutInfo.contact.phone.map((phone, index) => (
            <span key={phone.link}>
              <a href={phone.link}>{phone.display}</a>
              {index < aboutInfo.contact.phone.length - 1 && ' / '}
            </span>
          ))}
        </p>
      </div>
      
      <div className={styles.copyright}>
        <p>All rights reserved. ©Pep Perez Guarro, {new Date().getFullYear()}</p>
        <p>Design & Code by <a href="https://www.acanovas.info" target="_blank" rel="noopener noreferrer">Alvaro Canovas</a></p>
      </div>
    </div>
  );
}

