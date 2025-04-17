import React, { useState } from 'react';
import styles from './UserDashboard.module.css';
import profileImage from '../../Imges/portrait-322470_1280.jpg';

function UserDashBoard() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <div className={styles.batchViewContainer}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileBanner}></div>
        <div className={styles.profileContent}>
          <img className={styles.profileImage} src={profileImage} alt="Profile" />
          <div className={styles.profileDetails}>
            <div className={styles.contactInfo}>
              <p>📱 Contact No</p>
              <span>{user?.contact}</span>
            </div>
            <div className={styles.roleInfo}>
              <p>👤 Role</p>
              <span
                className={
                  user.role.className
                    .split(' ')
                    .map(cn => styles[cn])
                    .join(' ')
                }
              >
                {user?.role?.slug}
              </span>
            </div>
            <div className={styles.settings}>
              <span>⚙ Settings</span>
              <button className={styles.editBtn} onClick={toggleForm}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>Edit Info - {user?.role?.label}</h2>
            <form>
              {user?.role?.label === 'farm_inspector content' && (
                <>
                  <label>Certificate No: <input type="text" /></label>
                  <label>Certificate From: <input type="text" /></label>
                  <label>Type of Fertilizer: <input type="text" /></label>
                  <label>Fertilizer Used: <input type="text" /></label>
                </>
              )}

              {user?.role?.label === 'harvester content' && (
                <>
                  <label>Crop Sampling: <input type="text" /></label>
                  <label>Temperature Level: <input type="text" /></label>
                  <label>Humidity: <input type="text" /></label>
                </>
              )}

              {user?.role?.label === 'exporter content' && (
                <>
                  <label>Exporter ID: <input type="text" /></label>
                  <label>Coordination Address: <input type="text" /></label>
                  <label>Ship Name: <input type="text" /></label>
                  <label>Ship No: <input type="text" /></label>
                  <label>Departure Date: <input type="date" /></label>
                  <label>Estimated Date: <input type="date" /></label>
                  <label>Exported To: <input type="text" /></label>
                </>
              )}

              {user?.role?.label === 'Importer' && (
                <>
                  <label>Importer ID: <input type="text" /></label>
                  <label>Quantity: <input type="text" /></label>
                  <label>Ship Storage: <input type="text" /></label>
                  <label>Arrival Date: <input type="date" /></label>
                  <label>Warehouse Location: <input type="text" /></label>
                  <label>Warehouse Arrival Date: <input type="date" /></label>
                  <label>Importer Address: <input type="text" /></label>
                </>
              )}

              {user?.role?.label === 'processor content' && (
                <>
                  <label>Processor ID: <input type="text" /></label>
                  <label>Quantity: <input type="text" /></label>
                  <label>Processing Method: <input type="text" /></label>
                  <label>Packaging: <input type="text" /></label>
                  <label>Packaged Date: <input type="date" /></label>
                  <label>Warehouse: <input type="text" /></label>
                  <label>Warehouse Address: <input type="text" /></label>
                  <label>Destination: <input type="text" /></label>
                </>
              )}

              <div className={styles.formActions}>
                <button type="submit">Submit</button>
                <button type="button" onClick={toggleForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <td colSpan="7" className={styles.noData}>No Data Available</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        © 2025 Coffee SupplyChain by <a href="https://bastionex.net/" target="_blank" rel="noopener noreferrer">Bastionex Infotech Pvt Ltd</a>
      </footer>
    </div>
  );
}

export default UserDashBoard;
