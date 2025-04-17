import React from 'react'
import './Footer.css'
import Image1 from '../../Imges/companylogo.png'
function Footer() {
    return (
        <div className='footer-section'>
            <div className='footerleftIcon'>
            <div className='footerleftIconcontainer'>
               <img src={Image1}/>
            </div>
            <p>© 2025 Bastionex Infotech, Inc.
              All rights reserved.</p>
            </div>
            <div className='footerrightcontent'>
                <div className='footerrightsections'>
                    <p className='footerlinksheading'>Quick Links</p>
                    <p className='footerlink'>Home</p>
                    <p className='footerlink'>ABout</p>
                    <p className='footerlink'>Product</p>
                    <p className='footerlink'>Contact</p>
                </div>
                <div className='footerrightsections'>
                    <p className='footerlinksheading'>Exolore More</p>
                    <p className='footerlink'>FAQ</p>
                    <p className='footerlink'>Privacy Policy</p>
                    <p className='footerlink'>Term of service</p>
                    <p className='footerlink'>Carrer Apportunities</p>

                </div>
                <div className='footerrightsections'>
                    <p className='footerlinksheading'>Connect with us</p>
                    <p className='footerlink'>Facebook</p>
                    <p className='footerlink'>twitter</p>
                    <p className='footerlink'>LinkedIn</p>
                    <p className='footerlink'>Instagram</p>

                </div>
            </div>
        </div>
    )
}

export default Footer