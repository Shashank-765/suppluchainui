import React from 'react';
import styles from './Screening.module.css';

function ScreeningPage() {
  const trackingSteps = [
    { title: 'Batch Received', status: 'Completed', date: '2025-04-10' },
    { title: 'Initial Screening', status: 'Completed', date: '2025-04-12' },
    { title: 'Lab Analysis', status: 'In Progress', date: '2025-04-15' },
    { title: 'Quality Approval', status: 'Pending', date: null },
    { title: 'Ready for Export', status: 'Pending', date: null },
  ];

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Batch Screening Tracker</h1>
      <div className={styles.timeline}>
        {trackingSteps.map((step, index) => (
          <div key={index} className={styles.stepCard}>
            <div className={`${styles.statusDot} ${styles[step.status.toLowerCase().replace(' ', '')]}`} />
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepStatus}>{step.status}</p>
              {step.date && <p className={styles.stepDate}>{step.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScreeningPage;
