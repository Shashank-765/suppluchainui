import React from "react";
import styles from "./BatchProgressView.module.css";

const BatchProgressView = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Batch Progress: #Pine</h2>
      <p className={styles.subtitle}>
        Batch No: 0x0283907293987f90d3409f89d88f945ac56009878258
      </p>

     <div className={styles.timeline}>
        {/* Cultivation */}
        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>1</div>
          <div className={styles.box}>
            <h3>Cultivation</h3>
            <p><span className={styles.batchesheading}>Registration No:</span><span className={styles.batchesdatavalue}> ABC123456</span></p>
            <p><span className={styles.batchesheading}>Farmer Name:</span><span className={styles.batchesdatavalue}> Marnus Lab</span></p>
            <p><span className={styles.batchesheading}>Farm Address:</span><span className={styles.batchesdatavalue}> XYZ St, Northern Territory</span></p>
            <p><span className={styles.batchesheading}>Exporter Name:</span><span className={styles.batchesdatavalue}> ABC Export Pvt. Ltd.</span></p>
            <p><span className={styles.batchesheading}>Inspector Name:</span><span className={styles.batchesdatavalue}> FSC Organic Certified Agent</span></p>
          </div>
        </div>

        {/* Farm Inspector */}
        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>2</div>
          <div className={styles.box}>
            <h3>Farm Inspector</h3>
            <p><span className={styles.batchesheading}>Certificate No:</span><span className={styles.batchesdatavalue}> 1234567890</span></p>
            <p><span className={styles.batchesheading}>Certificate From:</span><span className={styles.batchesdatavalue}> FSC Certified</span></p>
            <p><span className={styles.batchesheading}>Type of Fertilizer:</span><span className={styles.batchesdatavalue}> Coffee Fertilizer</span></p>
            <p><span className={styles.batchesheading}>Fertilizer Used:</span><span className={styles.batchesdatavalue}> Organic Fertilizer</span></p>
          </div>
        </div>

        {/* Harvester */}
        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>3</div>
          <div className={styles.box}>
            <h3>Harvester</h3>
            <p><span className={styles.batchesheading}>Crop Sampling:</span><span className={styles.batchesdatavalue}> 1 Sample/1hr</span></p>
            <p><span className={styles.batchesheading}>Temperature Level:</span><span className={styles.batchesdatavalue}> 35°C</span></p>
            <p><span className={styles.batchesheading}>Humidity:</span><span className={styles.batchesdatavalue}> 65%</span></p>
          </div>
        </div>

        {/* Exporter */}
        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>4</div>
          <div className={styles.box}>
            <h3>Exporter</h3>
            <p><span className={styles.batchesheading}>Exporter ID:</span><span className={styles.batchesdatavalue}> 998877X</span></p>
            <p><span className={styles.batchesheading}>Coordination Address:</span><span className={styles.batchesdatavalue}> Address XYZ</span></p>
            <p><span className={styles.batchesheading}>Ship Name:</span><span className={styles.batchesdatavalue}> Exporta</span></p>
            <p><span className={styles.batchesheading}>Ship No:</span><span className={styles.batchesdatavalue}> 98765</span></p>
            <p><span className={styles.batchesheading}>Departure Date:</span><span className={styles.batchesdatavalue}> 12/03/2025</span></p>
            <p><span className={styles.batchesheading}>Estimated Date:</span><span className={styles.batchesdatavalue}> 22/03/2025</span></p>
            <p><span className={styles.batchesheading}>Exported To:</span><span className={styles.batchesdatavalue}> USA</span></p>
          </div>
        </div>

        {/* Importer */}
        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>5</div>
          <div className={styles.box}>
            <h3>Importer</h3>
            <p><span className={styles.batchesheading}>Importer ID:</span><span className={styles.batchesdatavalue}> IMP345678</span></p>
            <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> 600 KG</span></p>
            <p><span className={styles.batchesheading}>Ship Storage:</span><span className={styles.batchesdatavalue}> Temp-Controlled</span></p>
            <p><span className={styles.batchesheading}>Arrival Date:</span><span className={styles.batchesdatavalue}> 23/03/2025</span></p>
            <p><span className={styles.batchesheading}>Warehouse Location:</span><span className={styles.batchesdatavalue}> Central Depot</span></p>
            <p><span className={styles.batchesheading}>Warehouse Arrival Date:</span><span className={styles.batchesdatavalue}> 24/03/2025</span></p>
            <p><span className={styles.batchesheading}>Importer Address:</span><span className={styles.batchesdatavalue}> 56 St, Market Central</span></p>
          </div>
        </div>

        {/* Processor */}
        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>6</div>
          <div className={styles.box}>
            <h3>Processor</h3>
            <p><span className={styles.batchesheading}>Processor ID:</span><span className={styles.batchesdatavalue}> PROC12987</span></p>
            <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> 580 KG</span></p>
            <p><span className={styles.batchesheading}>Processing Method:</span><span className={styles.batchesdatavalue}> Roasting</span></p>
            <p><span className={styles.batchesheading}>Packaging:</span><span className={styles.batchesdatavalue}> Boxed</span></p>
            <p><span className={styles.batchesheading}>Packaged Date:</span><span className={styles.batchesdatavalue}> 25/03/2025</span></p>
            <p><span className={styles.batchesheading}>Warehouse:</span><span className={styles.batchesdatavalue}> Local Warehouse</span></p>
            <p><span className={styles.batchesheading}>Warehouse Address:</span><span className={styles.batchesdatavalue}> 123 Main St, NY 10001</span></p>
            <p><span className={styles.batchesheading}>Destination:</span><span className={styles.batchesdatavalue}> Supermarket Chains</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProgressView;
