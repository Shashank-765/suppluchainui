import React from 'react';
import styles from './Popup.module.css';

const Popup = ({ isOpen, onClose, onConfirm, action = 'perform this action' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Are you sure you want to {action}?</h2>
        <div className={styles.buttons}>
          <button className={styles.yes} onClick={onConfirm}>Yes</button>
          <button className={styles.no} onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
