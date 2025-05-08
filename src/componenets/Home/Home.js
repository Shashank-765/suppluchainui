import React, { useEffect, useState } from 'react'
import api from '../../axios'
import "./Home.css"
import section2 from '../../Imges/BG.png'
import Image10 from '../../Imges/Multicropping.webp'
import image1 from '../../Imges/Image6.png'
import image2 from '../../Imges/Image7.png'
import image3 from '../../Imges/Image8.png'
import image4 from '../../Imges/Image9.png'
import image5 from '../../Imges/Image11.png'
import image6 from '../../Imges/Image13.png'
import image7 from '../../Imges/Container30.png'
import image11 from '../../Imges/Image 4.png'
import image12 from '../../Imges/Image 3.png'
import image13 from '../../Imges/Image 2.png'
import image14 from '../../Imges/Image 1.png'
import { useNavigate } from 'react-router-dom';

function Home() {
  const Navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [inspectedImages, setInspectedImages] = useState([]);
  const [images, setImages] = useState([]);

  const userhandler = () => {
    Navigate('/auth')
  }
 const hangelesinghup =()=>{
   if(user){
     Navigate('/product')
   }
   else{
   Navigate('/auth')
   }
 }
  const getimages = async () => {
    try {
      const response = await api.get(`/users/getimages`)
      if (response?.data) {
        setInspectedImages(response?.data?.randomInspectedImages)
        setImages(response?.data?.randomImages)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    getimages()

  }, [])

  return (
    <>
      <div className='main-container'>
        <div className='upper-container'>
          <h1>🌾 Welcome to AgriChain – Blockchain-Powered Crop Supply Chain</h1>
          <h3>Built on Hyperledger Fabric for Secure, Transparent, and Trusted Agriculture</h3>
          <p>AgriChain is an enterprise-grade crop supply chain management platform that leverages the power of Hyperledger Fabric to ensure transparency, traceability, and trust across all agricultural processes — from sowing to sale.</p>
          <div className='greenleasvehorizontl'><img src={image14} alt='images' /></div>
          <button className='button-explore'onClick={hangelesinghup}>Get Started</button>
          <div className='greenleasveverticle'><img src={image13} alt='images' /></div>
          <div className='reddotimage'><img src={image12} alt='images' /></div>
        </div>

        <div className='image-container'>
          <img src={section2} alt='images' />
          <div className='imagesection-image'>
            <img src={image11} alt='images' />
          </div>
          <div className='imagesectionblock'>
            <h1>🔐 Why Hyperledger Fabric?</h1>
            {/* <p>At the heart of our platform lies a decentralized infrastructure built on Hyperledger Fabric. This cutting-edge technology enables seamless collaboration, transparency, and traceability across the entire supply chain</p> */}
            <ul>
              <li>Permissioned Blockchain Network</li>
              <p>Only authorized participants can join and interact, ensuring security and trust among all stakeholders.</p>
              <li>Private Channels for Confidential Deals</li>
              <p>Enable confidential transactions between specific parties (e.g., farmers and buyers) without exposing data network-wide.</p>
              <li>Smart Contracts (Chaincode) for Automation</li>
              <p>Automate processes like crop registration, quality verification, logistics tracking, and payments with customizable chaincode.</p>
              <li>Immutable Ledger for End-to-End Traceability</li>
              <p>Every action is recorded on a tamper-proof ledger, enabling full traceability of crops at every stage.</p>
            </ul>
            {/* <div className='getstartedbuttoncontainer'>
              <Link classNa
              me='getstartedbutton' to="/product">Get Started</Link>
            </div> */}

          </div>
        </div>

        <div className='section-2'>
          <p>Streamlining the Supply Chain</p>
          <h1>🚜 Platform Highlights</h1>
        </div>

        <div className='boxes_container'>
          <div className='boxes'>
            <h1>Farmer Onboarding & Crop Lifecycle Management</h1>
            <p>Register crops, track growth stages, and manage resources all from a single interface.</p>
          </div>
          <div className='boxes1'>
            <h1>Transparent Procurement & Distribution</h1>
            <p>From warehouses to retailers, every handoff is digitally recorded and traceable.</p>
          </div>
          <div className='boxes2'>
            <h1>Quality Assurance via Integrated Labs</h1>
            <p>Third-party lab reports and certifications are securely logged on the blockchain.</p>
          </div>
          <div className='boxes1'>
            <h1>Buyer & Seller Trust</h1>
            <p>Smart contracts enforce transparent deals and help eliminate disputes.</p>
          </div>
        </div>

        <div className='section-3'>
          <h1>Rooted in Trust, Grown with Blockchain</h1>
          <p>
            We’re cultivating a smarter agricultural ecosystem by combining blockchain technology with real-world farming — delivering a secure, transparent, and decentralized supply chain for crops.</p>
        </div>
        <div className='boxes_container'>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>
            {
              inspectedImages?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${inspectedImages[0]}`} alt='images' />
              : <img src={image1} alt='images' />
            }
              
            </div>
            <p> Achieve Increased Crop Yields</p>
          </div>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>{
              inspectedImages?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${inspectedImages[1]}`} alt='images' />
              : <img src={image2} alt='images' />
            } 
            </div>
            <p> Ensure Quality and Freshness</p>
          </div>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>
              {
              inspectedImages?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${inspectedImages[2]}`} alt='images' />
              : <img src={image3} alt='images' />
            }
            </div>
            
            <p>Minimize Waste and Spoilage</p>
          </div>
         
        </div>
        <div className='blankimagecontainer'>
          <img src={image4} alt='images' />
          <h2>🚜 Why Choose Our Platform?</h2>
          <div >

            <div className='blankomagecontainercontent' >
              <p className='paragragraohblank'>🔗 End-to-End Traceability</p>
              <p>Track every stage of your agricultural products' journey — from cultivation to distribution — with complete accuracy.</p>
            </div>
            <div className='blankomagecontainercontent' >
              <p className='paragragraohblank'>🧑‍🌾 Empowering Farmers</p>
              <p>Provide farmers with secure access to digital tools, fair markets, and transparent transaction records.</p>
            </div>
            <div className='blankomagecontainercontent' >
              <p className='paragragraohblank'>👁 Supply Chain Visibility</p>
              <p>Monitor and verify all crop movements and quality checks across the network in real-time.</p>
            </div>

          </div>
        </div>

        <div className='section45container'>
          <div className='section-4'>
            <p>Transforming Agriculture</p>
            <h1>Unlocking the Full Potential of Your Crops</h1>
          </div>
          <div className='section-5'>
            <div className='sector5-boxes'>
              <h2>Empowering Farmers</h2>
              <h1>Enhancing Supply Chain Visibility</h1>
              <p>Our decentralized platform built on Hyperledger Fabric offers end-to-end traceability, enabling you to track the journey of your agricultural products from farm to table</p>
              <br></br>
              <p>Leveraging the power of blockchain technology, our platform provides a secure and immutable record of all transactions, eliminating the risk of fraud and enhancing trust throughout the supply chain</p>

              {
                user ? '' : <button onClick={userhandler} className='joinnowbutton'>Join Now</button>
              }

            </div>
            <div className='sector5-boxes2'>
              <img src={Image10} alt='images'></img>
            </div>
          </div>
        </div>


        <div className='section-6'>
          <div className='section-6-uppercontainer'>
            <p>Cultivating a Sustainable Future</p>
            <h1>Empowering Farmers</h1>
          </div>
          <div className='section-6-lowercontainer'>
            <div className='section-6imgcontainer'>

            {
                images?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${images[0]}`} alt='images' />
                : <img  src={image5} alt='images'/>
            }
              
            </div>
            <div className='section-6imgcontainer'>
              {
                images?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${images[1]}`} alt='images' />
                : <img  src={image6} alt='images'/>
            }
            </div>
            <div className='section-6imgcontainer'>
             {
                images?.length > 0 ? <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${images[2]}`} alt='images' />
                : <img  src={image7} alt='images'/>
            }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home