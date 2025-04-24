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
  const [showPopup, setShowPopup] = useState(false);
  const [unit, setUnit] = useState('kg');
  const [editableField, setEditableField] = useState('quantity');
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);
  const handleScroll = () => {
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;

    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

 const handleUnitChange = (e) => {
  const newUnit = e.target.value;
  setUnit(newUnit);

  const basePricePerQuintal = parseFloat(productData?.price || 0);
  const unitPrice = newUnit === 'kg' ? basePricePerQuintal / 100 : basePricePerQuintal;

  if (lastChanged === 'quantity') {
    const calculatedPrice =
      quantity
        ? (parseFloat(quantity) * unitPrice).toFixed(2)
        : '';
    setPrice(calculatedPrice);
  } else if (lastChanged === 'price') {
    const calculatedQty =
      price
        ? (parseFloat(price) / unitPrice).toFixed(2)
        : '';
    setQuantity(calculatedQty);
  }
};


  const toggleEditable = () =>
    setEditableField(editableField === 'quantity' ? 'price' : 'quantity');


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

    navigate('/invoice', { state: { quantity, price, realprice, productname, unit } });
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

    const basePricePerQuintal = parseFloat(productData?.price || 0);
    const unitPrice = unit === 'kg' ? basePricePerQuintal / 100 : basePricePerQuintal;

    const calculatedPrice =
      value
        ? (parseFloat(value) * unitPrice).toFixed(2)
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

    const basePricePerQuintal = parseFloat(productData?.price || 0);
    const unitPrice = unit === 'kg' ? basePricePerQuintal / 100 : basePricePerQuintal;

    const calculatedQty =
      value
        ? (parseFloat(value) / unitPrice).toFixed(2)
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
      processorAddress: productData?.warehouseAddress,
      quantityProcessed: productData?.quantityProcessed,
      processingMethod: productData?.processingMethod,
      packaging: productData?.packaging,
      packagedDate: productData?.packagedDate,
      warehouse: productData?.warehouse,
      destination: productData?.destination,
      processedDate: productData?.processedDate,
    },
    {
      id: '2',
      heading: "Exporter",
      exporterId: productData?.exporterId,
      exporterName: productData?.exporterName,
      coordinationAddress: productData?.coordinationAddress,
      shipName: productData?.shipName,
      shipNo: productData?.shipNo,
      departureDate: productData?.departureDate,
      estimatedDate: productData?.estimatedDate,
      exportedTo: productData?.exportedTo,
      exportDate: productData?.exportDate,
    },
    {
      id: '3',
      heading: "Importer",
      importerId: productData?.importerId,
      importerName: productData?.importerName,
      quantityImported: productData?.quantityImported,
      shipStorage: productData?.shipStorage,
      arrivalDate: productData?.arrivalDate,
      warehouseLocation: productData?.warehouseLocation,
      warehouseArrivalDate: productData?.warehouseArrivalDate,
      importerAddress: productData?.importerAddress,
      importDate: productData?.importDate,

    },
    {
      id: '4',
      heading: "Harvester",
      harvesterId: productData?.harvesterId,
      harvesterName: productData?.harvesterName,
      cropSampling: productData?.cropSampling,
      temperatureLevel: productData?.temperatureLevel,
      humidity: productData?.humidity,
      harvestDate: productData?.harvestDate
    },
    {
      id: '5',
      heading: "Inspection",
      farmInspectionId: productData?.farmInspectionId,
      farmInspectionName: productData?.farmInspectionName,
      productName: productData?.productName,
      certificateNo: productData?.certificateNo,
      certificateFrom: productData?.certificateFrom,
      typeOfFertilizer: productData?.typeOfFertilizer,
      fertilizerUsed: productData?.fertilizerUsed,
      inspectionDate: productData?.inspectionDate,
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
              <h2>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(productData?.warehouseAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                >
                  <img src={locationImage} alt="Location" style={{ marginRight: '8px' }} />
                  {productData?.warehouseAddress}
                </a>
              </h2>
              <h2 className='nameofproductowner'>{productData?.productName}</h2>
              <h2>Price : <span className='priceproduct'>₹ {productData?.price}</span></h2>
              <h2>Mini Qty : <span className='priceproduct'>{productData?.miniQuantity} Qtl</span></h2>
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
                        <div>
                          <h3>Total Qunaity</h3>
                          <input
                            className='quantitytext'
                            placeholder='Enter Quantity'
                            type='number'
                            value={quantity}
                            min='0'
                            onChange={handleQuantityChange}
                          />
                        </div>
                        <div>
                          <h3>Total Price</h3>
                          <input
                            className='quantitytext'
                            placeholder='Enter Price'
                            type='number'
                            value={price}
                            min='0'
                            onChange={handlePriceChange}
                          />
                        </div>
                      </div> */}
                      <button onClick={() => setShowPopup(true)} className='buynowbutton'>Buy Now</button>
                    </div>
                  )
                }

                {showPopup && (
                  <div className="popupOverlay">
                    <div ref={popupRef} className="popup animatedPopup">
                      <h2 className="popupTitle">Buy Product</h2>

                      <div className={`inputBlock ${editableField !== 'quantity' ? 'disabledBlock' : ''}`}>
                        <label>Total Quantity</label>
                        <div className='quantity_box'>
                          <input
                            type="number"
                            placeholder="Enter Quantity"
                            className="inputQunatity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            disabled={editableField !== 'quantity'}
                          />
                          <select
                            value={unit}
                            onChange={(e)=>handleUnitChange(e)}
                            disabled={editableField !== 'quantity'}
                            className="select"
                          >
                            <option value="kg">kg</option>
                            <option value="quintal">quintal</option>
                          </select>
                        </div>

                      </div>

                      <button className="arrowButton" onClick={toggleEditable}>
                        {editableField === 'quantity' ? '↑' : '↓'}
                      </button>

                      <div className={`inputBlock2 ${editableField !== 'price' ? 'disabledBlock' : ''}`}>
                        <label>Total Price</label>
                        <input
                          type="number"
                          placeholder="Enter Price"
                          className="inputQunatity2"
                          value={price}
                          onChange={handlePriceChange}
                          disabled={editableField !== 'price'}
                        />
                      </div>

                      <div className="actions">
                        <button
                          onClick={() => handlebuynow(quantity, price, productData?.price)}
                          className="confirmButton"
                        >
                          Confirm
                        </button>
                        <button onClick={() => setShowPopup(false)} className="cancelButton">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}





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
                          {/* {item?.processorId && <p><span>Id </span><span>{item.processorId}</span></p>} */}
                          {item?.processorName && <p><span>Name </span><span>{item.processorName}</span></p>}
                          {item?.processedDate && <p><span>Processed Date </span><span>{item.processedDate}</span></p>}
                          {item?.processorAddress && <p><span>Address </span><span>{item.processorAddress}</span></p>}
                          {item?.quantityProcessed && <p><span>Quantity Processed </span><span>{item.quantityProcessed}</span></p>}
                          {item?.processingMethod && <p><span>Processing Method </span><span>{item.processingMethod}</span></p>}
                          {item?.packaging && <p><span>Packaging </span><span>{item.packaging}</span></p>}
                          {item?.packagedDate && <p><span>Packaged Date </span><span>{item.packagedDate}</span></p>}
                          {item?.warehouse && <p><span>Warehouse </span><span>{item.warehouse}</span></p>}
                          {item?.destination && <p><span>Destination </span><span>{item.destination}</span></p>}

                          {/* {item?.exporterId && <p><span>Id </span><span>{item.exporterId}</span></p>} */}
                          {item?.exporterName && <p><span>Name </span><span>{item.exporterName}</span></p>}
                          {item?.coordinationAddress && <p><span>Coordination Address </span><span>{item.coordinationAddress}</span></p>}
                          {item?.shipName && <p><span>Ship Name </span><span>{item.shipName}</span></p>}
                          {item?.shipNo && <p><span>Ship No </span><span>{item.shipNo}</span></p>}
                          {item?.departureDate && <p><span>Departure Date </span><span>{item.departureDate}</span></p>}
                          {item?.estimatedDate && <p><span>Estimated Arrival </span><span>{item.estimatedDate}</span></p>}
                          {item?.exportedTo && <p><span>Exported To </span><span>{item.exportedTo}</span></p>}
                          {item?.exportDate && <p><span>Export Date </span><span>{item.exportDate}</span></p>}

                          {/* {item?.importerId && <p><span>Id </span><span>{item.importerId}</span></p>} */}
                          {item?.importerName && <p><span>Name </span><span>{item.importerName}</span></p>}
                          {item?.quantityImported && <p><span>Quantity Imported </span><span>{item.quantityImported}</span></p>}
                          {item?.shipStorage && <p><span>Ship Storage </span><span>{item.shipStorage}</span></p>}
                          {item?.arrivalDate && <p><span>Arrival Date </span><span>{item.arrivalDate}</span></p>}
                          {item?.warehouseLocation && <p><span>Warehouse Location </span><span>{item.warehouseLocation}</span></p>}
                          {item?.warehouseArrivalDate && <p><span>Warehouse Arrival Date </span><span>{item.warehouseArrivalDate}</span></p>}
                          {item?.importerAddress && <p><span>Importer Address </span><span>{item.importerAddress}</span></p>}
                          {item?.importDate && <p><span>Import Date </span><span>{item.importDate}</span></p>}

                          {/* {item?.harvesterId && <p><span>Id </span><span>{item.harvesterId}</span></p>} */}
                          {item?.harvesterName && <p><span>Name </span><span>{item.harvesterName}</span></p>}
                          {item?.cropSampling && <p><span>Crop Sampling </span><span>{item.cropSampling}</span></p>}
                          {item?.temperatureLevel && <p><span>Temperature Level </span><span>{item.temperatureLevel}</span></p>}
                          {item?.humidity && <p><span>Humidity </span><span>{item.humidity}</span></p>}
                          {item?.harvestDate && <p><span>Harvest Date </span><span>{item.harvestDate}</span></p>}

                          {/* {item?.farmInspectionId && <p><span>Id </span><span>{item.farmInspectionId}</span></p>} */}
                          {item?.farmInspectionName && <p><span>Name </span><span>{item.farmInspectionName}</span></p>}
                          {item?.productName && <p><span>Product Name </span><span>{item.productName}</span></p>}
                          {item?.certificateNo && <p><span>Certificate No </span><span>{item.certificateNo}</span></p>}
                          {item?.certificateFrom && <p><span>Certificate From </span><span>{item.certificateFrom}</span></p>}
                          {item?.typeOfFertilizer && <p><span>Type of Fertilizer </span><span>{item.typeOfFertilizer}</span></p>}
                          {item?.fertilizerUsed && <p><span>Fertilizer Used </span><span>{item.fertilizerUsed}</span></p>}
                          {item?.inspectionDate && <p><span>Inspection Date </span><span>{item.inspectionDate}</span></p>}

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