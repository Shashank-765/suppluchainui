import React from 'react';
import styles from './PrivacyPolicy.module.css';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className={styles.privacyContainer}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.intro}>
        Welcome to our Supply Chain Management System. We are committed to protecting your privacy and ensuring the security of your data throughout our blockchain-powered platform. This Privacy Policy outlines the type of information we collect, how we use it, and the rights you have concerning your data.
      </p>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>We collect a range of personal and transactional data, including but not limited to:</p>
        <ul>
          <li>User identification details (e.g., name, email address, organization, role)</li>
          <li>Usage and interaction logs on the platform</li>
          <li>Blockchain transaction history (including timestamps and role-specific activity)</li>
          <li>Device information and IP addresses for analytics and security</li>
        </ul>
        <p>This information is collected through registration forms, transaction logs, and automated tracking tools used on our site.</p>
      </section>

      <section className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected data for the following purposes:</p>
        <ul>
          <li>To facilitate transparent and immutable product traceability via blockchain</li>
          <li>To secure access through user role validation and permissions</li>
          <li>To provide analytical insights and platform improvements</li>
          <li>To detect and prevent fraudulent or unauthorized activities</li>
          <li>To communicate updates, changes, and service-related notifications</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Blockchain and Data Immutability</h2>
        <p>
          All critical transactions are stored on a permissioned Hyperledger Fabric blockchain. Data once recorded is immutable, meaning it cannot be modified or deleted. This ensures high integrity, transparency, and auditability.
        </p>
        <p>
          While we can restrict visibility through access control mechanisms, the transactional data itself remains permanent. We design smart contracts to manage these permissions at a granular level.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Data Security</h2>
        <p>
          We implement advanced technical and organizational measures to protect your information:
        </p>
        <ul>
          <li>End-to-end encryption for sensitive user data</li>
          <li>Role-based access control across all systems</li>
          <li>Two-factor authentication for administrative access</li>
          <li>Regular penetration testing and vulnerability assessments</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. Third-Party Access</h2>
        <p>
          We do not share or sell your personal data with third-party advertisers or marketers. In cases where third-party service providers assist in platform maintenance or analytics, they are contractually bound to maintain confidentiality and comply with our security policies.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Data Retention</h2>
        <p>
          Personal data that is not recorded on-chain is retained only as long as it is needed to fulfill platform requirements or legal obligations. Blockchain entries, by nature, are permanent and stored across the distributed ledger.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Your Rights</h2>
        <p>As a user, you have the right to:</p>
        <ul>
          <li>Access the data we store about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Withdraw consent to optional data collection features</li>
          <li>Request account deactivation or deletion of off-chain data</li>
        </ul>
        <p>
          Please note that blockchain data cannot be deleted or altered due to its immutable nature.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Children's Privacy</h2>
        <p>
          Our platform is intended for use by professionals and individuals aged 18 and above. We do not knowingly collect data from children under 13 years of age.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. All changes will be posted on this page and, where appropriate, notified via email. We encourage you to review the policy regularly.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or your data rights, feel free to contact us at
          <Link to='/contact'> support@supplychain.com</Link>. We are happy to provide assistance and clarity.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
