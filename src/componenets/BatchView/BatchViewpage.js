import React from 'react';
import styles from './BatchView.module.css';
import profileImage from '../../Imges/portrait-322470_1280.jpg'
import { useLocation } from 'react-router-dom';
function BatchViewpage() {
    const location = useLocation();
    const { batch } = location.state || {};
  return (
    <div className={styles.batchViewContainer}>
      <div className={styles.header}>
        <div className={styles.brand}>
          {/* <span className={styles.logo}>☕</span> IMPERIAL */}
        </div>
        <h2 className={styles.pageTitle}>Dashboard</h2>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileBanner}></div>
        <div className={styles.profileContent}>
          <img
            className={styles.profileImage}
            src={profileImage}
            alt="Profile"
          />
          <div className={styles.profileDetails}>
             <div className={styles.contactInfo}>
            <p>📱 Contact No</p>
            <span>7599269978</span>
          </div>
          <div className={styles.roleInfo}>
            <p>👤 Role</p>
            <span>Exporter</span>
          </div>
          <div className={styles.settings}>
            <span>⚙ Settings</span>
            <button className={styles.editBtn}>Edit</button>
          </div>
          </div>
        </div>
      </div>

      <div className={styles.batchesOverview}>
        <h3>Batches Overview</h3>
        <table className={styles.batchTable}>
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Farm Inspector</th>
              <th>Harvester</th>
              <th>Exporter</th>
              <th>Importer</th>
              <th>Processor</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className={styles.noData}>
                No Data Available
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        © 2025 Coffee SupplyChain by <a href="https://bastionex.net/" target="_blank" rel="noopener noreferrer">Bastionex Infotech Pvt Ltd.com</a>
      </footer>
    </div>
  );
}

export default BatchViewpage;
