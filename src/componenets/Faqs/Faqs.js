import React, { useState } from 'react';
import styles from './FaqPage.module.css';

const faqs = [
  {
    question: 'How can blockchain revolutionize the safety of food supply chains?',
    answer: `Blockchain can revolutionize the food supply chain by providing an immutable, decentralized ledger that documents every step a food item takes—from cultivation to the final consumer. By leveraging smart contracts and consensus mechanisms, this technology eliminates the need for third-party verification, reducing the chances of human error and fraud. Each transaction in the chain—such as a harvest, inspection, or shipping event—is permanently recorded and timestamped, making the data transparent and traceable. For consumers, this means being able to see when and where their food was grown, how it was processed, and how long it took to reach them. For businesses, it means easier compliance with food safety regulations, better recall management, and deeper consumer trust. Furthermore, blockchain's distributed nature means that the system remains robust even if one node fails, enhancing the overall resilience of the food supply chain. This shift not only empowers consumers with greater insight into the foods they eat but also motivates producers and distributors to maintain high standards, knowing their actions are recorded and visible.`
  },
  {
    question: 'What makes real-time traceability essential in modern agriculture logistics?',
    answer: `Real-time traceability is essential in modern agriculture because it enables stakeholders to monitor the movement, condition, and location of goods as they move through the supply chain. Perishable food products such as fruits and vegetables have a limited shelf life and can quickly spoil under poor handling or environmental conditions. Real-time traceability helps track these factors in transit—temperature, humidity, time in transit, and more—allowing quick interventions if something goes wrong. It also helps in planning and decision-making. For instance, if a shipment is delayed due to traffic or customs, alternate arrangements can be made immediately. In the case of a contamination outbreak, it allows rapid pinpointing of the affected batches, preventing widespread recalls. Moreover, real-time data supports consumer transparency, compliance with food safety laws, and logistics optimization. With IoT sensors, GPS tracking, and integrated data dashboards, supply chain managers can get a live feed of their operations and ensure every product meets quality expectations.`
  },
  {
    question: 'Why should consumers care about the transparency of their food’s origin?',
    answer: `Transparency in food origin is not just a trend; it’s a growing demand driven by health, ethics, and environmental concerns. Consumers want to know where their food comes from, who grew it, under what conditions, and whether fair trade or sustainable practices were followed. Transparency ensures that people can make informed choices aligned with their values—whether it’s supporting local farmers, avoiding genetically modified organisms (GMOs), or ensuring no child labor was involved. From a health perspective, knowing the source helps consumers avoid foods exposed to harmful pesticides or unethical processing. With transparent records, buyers can verify certifications (organic, non-GMO, fair trade) and better trust what’s labeled on the package. It also allows people to trace allergies or dietary issues back to the source. Finally, this level of visibility holds producers accountable, encourages best practices, and promotes trust throughout the entire ecosystem, leading to a more sustainable and equitable food system.`
  },
  {
    question: 'How do smart contracts improve operational efficiency in supply chain management?',
    answer: `Smart contracts are self-executing agreements with the terms directly written into code. In supply chain management, they automate tasks such as payments, shipment updates, and inventory control, significantly improving efficiency and reducing human error. For example, once a shipment of wheat reaches the required temperature and humidity for a designated duration during transit, a smart contract can automatically approve its delivery and release payment. This reduces paperwork, accelerates transactions, and removes the need for intermediaries. Smart contracts can also enforce regulatory compliance by triggering alerts or actions when specific conditions are met or violated. Since all transactions are recorded on a blockchain, the contracts are secure and tamper-proof, fostering greater trust between trading partners. Overall, smart contracts streamline complex logistics operations, save costs, reduce delays, and ensure all parties follow through on their commitments without needing manual oversight.`
  },
  {
    question: 'In what ways does digital documentation reduce fraud and waste in food logistics?',
    answer: `Digital documentation ensures that every action—whether it’s a shipment received, a product graded, or an item processed—is recorded electronically with time and location stamps. Unlike paper trails, which can be altered, lost, or forged, digital records offer permanent, auditable logs that greatly reduce the opportunity for fraud. In food logistics, this means less chance of false reporting on food quality, quantity, or origin. For instance, if a batch of rice is claimed to be organic, digital records must show its entire journey from an organic-certified farm to the consumer, verifying the claim. It also reduces product waste by improving inventory management. With accurate, real-time digital logs, stakeholders can plan for better storage, avoid overproduction, and act quickly in case of disruptions. Moreover, during recalls or quality audits, digital documentation makes tracing specific products easy, saving time and resources. Altogether, it builds a cleaner, more reliable, and more efficient supply chain.`
  }
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Frequently Asked Questions</h1>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => toggle(index)}
            >
              <div className={styles.question}>{faq.question}</div>
              {activeIndex === index && <div className={styles.answer}>{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;
