import React, { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import './View.css'
import uparrow from '../../Imges/down-arrow.png'
import downarrow from '../../Imges/arrow.png'
import informat from '../../Imges/information.png'
import locationImage from '../../Imges/location.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function View() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user')) || null;
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

  // const [quantity, setQuantity] = useState('');
  // const [price, setPrice] = useState('');
  const [lastChanged, setLastChanged] = useState(null);

  const scrollToIndex = (index) => {
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
  };

  const handlebuynow = async (quantity, price, realprice) => {

    // try {

    //   const response = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/buyproduct', {
    //     id: product?._id,
    //     quantity: quantity,
    //     ownerId: product?.ownerId,
    //     buyerId: user?._id
    //   });
    //   console.log(response.data, 'response')
    //   if (response.data) {
    //     alert('Product Bought Successfully');
    //   } else {
    //     alert('Something went wrong');
    //   }
    // } catch (error) {
    //   console.error('Error fetching products:', error);

    // }

    if (price <= 0 && quantity <= 0) return;
    let productname = productData?.productName;

    navigate('/invoice', { state: { quantity, price, realprice, productname } });
  }
  const handleSell = async () => {
    try {
      const response = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/soldproduct', {
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
      const response = await axios.get(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getProductById?id=${product?._id}`);
      if (response.data) {
        setProductsData(response.data.product);
        console.log(response.data.product, 'response')
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

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) return;

    if (lastChanged === 'price') {
      setQuantity('');
      setPrice('');
      setLastChanged(null);
    } else {
      setQuantity(value);
      const calculatedPrice =
        value && productData?.price
          ? (parseFloat(value) * parseFloat(productData.price)).toFixed(2)
          : '';
      setPrice(calculatedPrice);
      setLastChanged('quantity');
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) return;

    if (lastChanged === 'quantity') {
      setQuantity('');
      setPrice('');
      setLastChanged(null);
    } else {
      setPrice(value);
      const calculatedQty =
        value && productData?.price
          ? (parseFloat(value) / parseFloat(productData.price)).toFixed(2)
          : '';
      setQuantity(calculatedQty);
      setLastChanged('price');
    }
  };


  const dummyData = [
    {
      id: '1',
      heading: "Processor",
      processorId: productData?.processorId,
      processorName: productData?.processorName,
      processedDate: productData?.processedDate,
      processorAddress: productData?.warehouseAddress
    },
    {
      id: '2',
      heading: "Exporter",
      exporterId: productData?.exporterId,
      exporterName: productData?.exporterName
    },
    {
      id: '3',
      heading: "Importer",
      importerId: productData?.importerId,
      importerName: productData?.importerName
    },
    {
      id: '4',
      heading: "Harvester",
      harvesterId: productData?.harvesterId,
      harvesterName: productData?.harvesterName
    },
    {
      id: '5',
      heading: "Inspection",
      farmInspectionId: productData?.farmInspectionId,
      farmInspectionName: productData?.farmInspectionName
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
                  <img src={`https://lfgkx3p7-5000.inc1.devtunnels.ms${img}`} alt={`product-${index}`} />
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
              <h2><img src={locationImage} />{productData?.warehouseAddress}</h2>
              <h2>{productData?.productName}</h2>
              <h2>Price : <span className='priceproduct'>{productData?.price}</span></h2>
              <h2>Mini Qty : <span className='priceproduct'>{productData?.miniQuantity}</span></h2>
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
                      {/* <div className='quantitypricecover'> 
                         <input className='quantitytext' onChange={(e)=>setQuantity(e.target.value)} placeholder='Enter Quantity' type='number' />
                      <input className='quantitytext' onChange={(e)=>setQuantity(e.target.value)} placeholder='Enter Price' type='number' />
                     </div> */}

                      <div className='quantitypricecover'>
                        Qunaity
                        <input
                          className='quantitytext'
                          placeholder='Enter Quantity'
                          type='number'
                          value={quantity}
                          min='0'
                          onChange={handleQuantityChange}
                        />
                        price
                        <input
                          className='quantitytext'
                          placeholder='Enter Price'
                          type='number'
                          value={price}
                          min='0'
                          onChange={handlePriceChange}
                        />
                      </div>
                      <button onClick={() => handlebuynow(quantity, price, productData?.price)} className='buynowbutton'>Buy Now</button>
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
                          {item?.processorId && <p> <span>Id </span><span> {item?.processorId}</span></p>}
                          {item?.processorName && <p><span>Name </span> <span>{item?.processorName}</span></p>}
                          {item?.processedDate && <p><span>Date </span><span> {item?.processedDate}</span></p>}
                          {item?.processorAddress && <p><span>Address </span><span> {item.processorAddress}</span></p>}
                          {item?.exporterId && <p><span>Id </span><span> {item.exporterId}</span></p>}
                          {item?.exporterName && <p><span>Name </span><span> {item.exporterName}</span></p>}
                          {item?.exporterAddress && <p><span>Address </span><span> {item.exporterAddress}</span></p>}
                          {item?.importerId && <p><span>Id </span><span> {item.importerId}</span></p>}
                          {item?.importerName && <p><span>Name </span><span> {item.importerName}</span></p>}
                          {item?.harvesterId && <p><span>Id </span><span> {item.harvesterId}</span></p>}
                          {item?.harvesterName && <p><span>Name </span><span> {item.harvesterName}</span></p>}
                          {item?.farmInspectionId && <p><span>Id </span><span> {item.farmInspectionId}</span></p>}
                          {item?.farmInspectionName && <p><span>Name </span><span> {item.farmInspectionName}</span></p>}
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
              <table className='viewtablehistory'>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>From</th>
                    <th>TO</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Arun</td>
                    <td>Karan</td>
                    <td>2025</td>
                    <td>2025</td>
                  </tr>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Abhay</td>
                    <td>shahil</td>
                    <td>20</td>
                    <td>2025</td>
                  </tr>
                  <tr>
                    <td>0x8f2e54...</td>
                    <td>Tushar</td>
                    <td>Aashish</td>
                    <td>30:00</td>
                    <td>2025</td>
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