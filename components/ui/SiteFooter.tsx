import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <div className={styles.siteFooter}>
      <div className={styles.contactInfo}>
        <div>info@pepperezguarro.com / ES 0034 681 378 920</div>
        <div>@pepperezguarro</div>
      </div>
      
      <div className={styles.copyright}>
        <div>All rights reserved. ©Pep Perez Guarro, 2025</div>
        <div>Design & Code by Alvaro Canovas</div>
      </div>
    </div>
  );
}

