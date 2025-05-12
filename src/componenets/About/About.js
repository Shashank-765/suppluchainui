import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.intro}>
        Welcome to our Supply Chain Management System — your trusted platform for transparent and secure transactions of fruits and vegetables using blockchain technology. We aim to revolutionize the traditional supply chain model by infusing it with innovation, efficiency, and digital trust.
      </p>

      <section className={styles.section}>
        <h2>Who We Are</h2>
        <p>
          We are a team of innovators, farmers, engineers, and blockchain experts passionate about building a more trustworthy and efficient food supply chain. Our mission is to empower both producers and consumers by providing a system where every product’s journey is verifiable and secure. We believe in creating systems that bridge the gap between technology and real-world agricultural needs.
        </p>
        <p>
          Our team operates at the intersection of agriculture and cutting-edge technology. We understand the real challenges faced by each stakeholder in the supply chain and continuously work to develop solutions that are simple to use yet powerful under the hood.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What We Do</h2>
        <p>
          Our platform leverages Hyperledger Fabric to record every transaction from farm to table. Whether you're a grower, inspector, importer, or buyer — we ensure transparency at every stage of the supply chain.
        </p>
        <p>
          With features such as real-time tracking, role-based access control, and immutable ledger entries, our system ensures that data entered at every stage is trusted and validated. We reduce fraud, streamline audits, and ensure that everyone involved can operate with complete visibility.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Why Blockchain?</h2>
        <p>
          Blockchain provides immutable records, increased trust, and decentralization. By using a permissioned blockchain, we allow only verified participants to interact, ensuring data privacy and authenticity across all stages of the transaction.
        </p>
        <p>
          This technology enhances food safety, reduces waste, and boosts confidence in the origin and journey of goods. In industries like agriculture where time-sensitive deliveries and authenticity are crucial, blockchain becomes a game-changer.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Our Vision</h2>
        <p>
          To become a global leader in blockchain-based food traceability — ensuring every tomato, grain, or fruit is accounted for, trusted, and safely delivered to the end user.
        </p>
        <p>
          We envision a future where anyone — from a local farmer to an international buyer — can instantly trace the origin, quality, and handling of food products. Through this transparency, we aim to foster greater trust between producers and consumers, enabling fair trade and sustainable practices.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Integrity:</strong> We prioritize honest and transparent processes in every interaction.</li>
          <li><strong>Innovation:</strong> We continually enhance our platform to meet the evolving needs of the supply chain ecosystem.</li>
          <li><strong>Empowerment:</strong> We support farmers, businesses, and consumers by giving them access to reliable and verifiable information.</li>
          <li><strong>Sustainability:</strong> We advocate for responsible sourcing, waste reduction, and environmental stewardship in supply chain logistics.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Contact Us</h2>
        <p>
          Have questions or want to partner with us? Reach out at
          <Link to='/contact'> support@supplychain.com</Link>. We are always open to collaborations with forward-thinking organizations, supply chain experts, and agricultural stakeholders.
        </p>
        <p>
          You can also follow us on our social media channels for updates, insights, and stories from our community:
          <ul>
            <li><a href='https://twitter.com'>Twitter</a></li>
            <li><a href='https://linkedin.com'>LinkedIn</a></li>
            <li><a href='https://facebook.com'>Facebook</a></li>
          </ul>
        </p>
      </section>
    </div>
  );
}

export default About;
