import React from 'react'
import "./Home.css"
import section2 from '../../Imges/BG.png'
import Image10 from '../../Imges/Image 10.png'
import icon1 from '../../Imges/Icon.png'
import icon2 from '../../Imges/Icon2.png'
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
import { Link } from 'react-router-dom'
function Home() {
  return (
    <>
      <div className='main-container'>
        <div className='upper-container'>
          <h1>Revolutionizing Supply Chain Management for...</h1>
          <p>Welcome to our innovative platform designed to streamline the supply chain for agricultural crops</p>
          <div className='greenleasvehorizontl'><img src={image14} /></div>
          <button className='button-explore'>Explore Now</button>
          <div className='greenleasveverticle'><img src={image13} /></div>
          <div className='reddotimage'><img src={image12} /></div>
        </div>

        <div className='image-container'>
          <img src={section2} alt='photo' />
          <div className='imagesection-image'>
            <img src={image11} />
          </div>
          <div className='imagesectionblock'>
            <p>Empowering Farmers, Enhancing Efficiency</p>
            <h1>Transforming Agricult...</h1>
            <p>At the heart of our platform lies a decentralized infrastructure built on Hyperledger Fabric. This cutting-edge technology enables seamless collaboration, transparency, and traceability across the entire supply chain</p>
            <div className='getstartedbuttoncontainer'>
              <Link className='getstartedbutton' to="/product">Get Started</Link>
            </div>

          </div>
        </div>

        <div className='section-2'>
          <p>Streamlining the Supply Chain</p>
          <h1>Elevating Productivity and Profitability</h1>
        </div>

        <div className='boxes_container'>
          <div className='boxes'>
            <div className='image-container2'>
              <div className='image-container2img'>
                <img src={icon1} />
              </div>
            </div>
            <h1>Optimize Inventory Management</h1>
            <p>Enhance Traceability</p>
          </div>
          <div className='boxes1'>
            <div className='image-container2'>
              <div className='image-container2img'>
                <img src={icon2} />
              </div>
            </div>
            <h1>Reduce Operational Costs</h1>
            <p>Enhance Traceability</p>
          </div>
          <div className='boxes2'>
            <div className='image-container2'>
              <div className='image-container2img'>
                <img src={icon1} />
              </div>
            </div>
            <h1>Optimize Inventory Management</h1>
            <p>Enhance Traceability</p>
          </div>
        </div>

        <div className='section-3'>
          <h1>Cultivating a Thriving Agricultural Ecosystem</h1>
          <p>
            Our platform harnesses the power of blockchain technology to create a decentralized, transparent, and secure supply chain management system for agricultural crops</p>
        </div>
        <div className='boxes_container'>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>
              <img src={image1} />
            </div>
            <p> Achieve Increased Crop Yields</p>
          </div>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>
              <img src={image2} />
            </div>
            <p> Ensure Quality and Freshness</p>
          </div>
          <div className='boxessecond'>
            <div className='boxessecondimgcontainer'>
              <img src={image3} />
            </div>
            <p>Minimize Waste and Spoilage</p>
          </div>
        </div>
        <div className='blankimagecontainer'>
          <img src={image4} />
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
              <button className='joinnowbutton'>Join Now</button>
            </div>
            <div className='sector5-boxes2'>
              <img src={Image10} alt='photo'></img>
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
              <img src={image5} />
            </div>
            <div className='section-6imgcontainer'>
              <img src={image6} />
            </div>
            <div className='section-6imgcontainer'>
              <img src={image7} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home