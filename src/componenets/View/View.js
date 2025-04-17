import React, { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import './View.css'
import uparrow from '../../Imges/down-arrow.png'
import downarrow from '../../Imges/arrow.png'
import informat from '../../Imges/information.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function View() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user')) || null;
  console.log(product?._id, 'product')
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProductSold, setIsProductSold] = useState(false);
  const [productData, setProductsData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleScroll = () => {
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;

    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
  };
  const handlebuynow = async () => {
     
     try {
        
          const response = await axios.post('http://localhost:5000/api/users/buyproduct', {
              id: product?._id,
              quantity: quantity,
              ownerId: product?.ownerId,
              buyerId: user?._id
          });
          console.log(response.data, 'response')
          if (response.data) {
              alert('Product Bought Successfully');
          } else {
              alert('Something went wrong');
          }
     } catch (error) {
       console.error('Error fetching products:', error);
      
     }

    // navigate('/invoice');
  }
  const handleSell = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/soldproduct', {
        id: product?._id,
        price: price,
      });
      console.log(response.data, 'response')
      if (response?.data?.product?.isAvailable === true) {
        setIsProductSold(true)
      }
      if (response.data) {
        alert('Product Sold Successfully');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error('Error selling product:', error);
      alert('Server error, please try again later');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/getProductById?id=${product?._id}`);
      if (response.data) {
        setProductsData(response.data.product);
      } else {
        console.error('Error fetching products:', response.data.message);

      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, [isProductSold])

  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };


  const dummyData = [
    {
      id: '1',
      heading: "Description",
      Description: productData?.description
    },
    {
      id: '2',
      heading: "About",
      Taste_Texture: productData?.taste,
      Health_Benefits: productData?.healthBenefits
    },
    {
      id: '3',
      heading: "Address",
      address: productData?.address,
      Pin: productData?.pin
    }

  ];
  return (
    <>
      <div className='viewpagecontaianer'>
        <div className='viewmaincontainer'>
          <div className="carousel-wrapper">
            <div className="leftviewdiv" ref={scrollRef} onScroll={handleScroll}>
              {productData?.images?.map((img, index) => (
                <div className="imagecontainerview" key={index}>
                  <img src={`http://localhost:5000${img}`} alt={`product-${index}`} />
                </div>
              ))}
            </div>

            <div className="dot-indicators">
              {productData?.images?.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>

          </div>
          <div className='rightviewdiv'>
            <div className='rightviewfirstdiv'>
              <h2>{productData?.desc}</h2>
              <h2>Price : <span className='priceproduct'>{productData?.price}</span></h2>
              <div className='buynowbuttoncover'>


                {
                  productData?.ownerId === user?._id ? (
                    <div className='buynowbuttoncover'>

                      {
                        productData?.isAvailable ? (
                          <button className='buynowbutton'> Product Sold</button>
                        ) : (
                          <>
                            <input className='quantitytext' onChange={(e) => setPrice(e.target.value)} placeholder='Enter Price' type='number' />
                            <button onClick={handleSell} className='buynowbutton'>Sell Now</button>
                          </>
                        )

                      }

                    </div>
                  ) : (
                    <div className='buynowbuttoncover'>
                      <input className='quantitytext' onChange={(e)=>setQuantity(e.target.value)} placeholder='Enter Quantity In Quentel' type='number' />
                      <button onClick={handlebuynow} className='buynowbutton'>Buy Now</button>
                    </div>
                  )
                }


              </div>

              {/* <div className='buynowbuttoncover'>
                <input className='quantitytext' placeholder='Enter Price' type='number' />
                <button onClick={handlebuynow} className='buynowbutton'>Sell Now</button>
              </div> */}

            </div>

          </div>
        </div>
        <div className='parentdesciptionofboth'>
          <div className='descriptiop-containeriew'>
            <h2>Details</h2>
            {dummyData.map((item, index) => (
              <div className='imagedescription' key={index}>
                <div className='description-container'>
                  <div onClick={() => handleAccordion(index)} className='about-vegitable'>
                    <div className='iconvegtble'>
                      <img src={informat} />
                      <p className='descriptionimage'>{item?.heading}</p>
                    </div>
                    <div className='righticon'>
                      {activeAccordion === index ? (
                        <img src={downarrow} />
                      ) : (
                        <img src={uparrow} />
                      )}
                    </div>
                  </div>

                  <div
                    className='about-vegitabledescription'
                    style={{ display: activeAccordion === index ? 'flex' : 'none' }}
                  >
                    <div className='descriptionmanagaersection'>
                      <p className='tesxtjustify'>
                        <div className='tesxtjustify'>
                          {item?.Description && <p>{item.Description}</p>}
                          {item?.Taste_Texture && <p><span>Taste & Texture </span> <span>{item.Taste_Texture}</span></p>}
                          {item?.Health_Benefits && <p><span>Health & Benefits </span><span> {item.Health_Benefits}</span></p>}
                          {item?.address && <p><span>Address </span><span> {item.address}</span></p>}
                          {item?.Pin && <p><span>PIN </span> <span>{item.Pin}</span></p>}
                        </div>

                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='rightsidedescriptionimage'>
            <h2>History</h2>
            <div className='rightsidehistorydetials'>
              <table>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>From</th>
                    <th>TO</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Arun</td>
                    <td>Karan</td>
                    <td>2025</td>
                  </tr>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Abhay</td>
                    <td>shahil</td>
                    <td>20</td>
                  </tr>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Tushar</td>
                    <td>Aashish</td>
                    <td>30:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default View