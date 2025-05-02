import React from 'react';
import './Contact.css';
import coverImage from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp'

function Contact() {
  return (
    <div className="contact-wrapper">
    <div className='contactcoverimagecontianer'>
       <img  src={coverImage} alt='images'/>
        <h1>Contact Us</h1>
    </div>
     

      {/* Full-width Map */}
      <div className="map-fullwidth">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps?q=B-2,+Block+B,+Sector+4,+Noida,+Uttar+Pradesh+201301&output=embed"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="contact-grid below-map">
    
        <div className="contact-card form-card">
          <h2>Send Us a Message</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="contact-card right-info">
          <div className="social-links">
            <h2>Connect With Us</h2>
            <a href="mailto:info@bastionex.com" target="_blank" rel="noreferrer">📧 Email</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">🐦 Twitter</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">📘 Facebook</a>
          </div>

          <div className="address-section">
            <h2>Our Address</h2>
            <p><strong>Bastionex Infotech Pvt. Ltd.</strong></p>
            <p>B-2, Block B, Sector 4</p>
            <p>Noida, Uttar Pradesh 201301</p>
            <p>India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
