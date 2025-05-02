import React, { useState } from 'react';
import styles from './FaqPage.module.css';

const faqs = [
  {
    question: 'What is a supply chain tracking system?',
    answer: 'It’s a digital system that monitors the movement and status of goods—like wheat, rice, and other food items—from origin to consumer.'
  },
  {
    question: 'How does the system ensure food quality?',
    answer: 'Each step like cultivation, harvesting, and transportation is logged with timestamps and quality checks, ensuring traceability and safety.'
  },
  {
    question: 'Can I see the entire journey of my product?',
    answer: 'Yes, you can view the full history including origin farm, inspections, transport hubs, and processing facilities.'
  },
  {
    question: 'How often is the data updated?',
    answer: 'Data is updated in real-time as events are logged into the system by producers, inspectors, and transporters.'
  },
  {
    question: 'Is this system secure?',
    answer: 'Absolutely. The platform uses authentication, authorization, and encrypted data flows to ensure secure and tamper-proof records.'
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
            <div className={styles.answer}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Faqs;
