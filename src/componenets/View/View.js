import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import './View.css';
import image1 from '../../Imges/Image6.png'
import uparrow from '../../Imges/down-arrow.png';
import downarrow from '../../Imges/arrow.png';
import CircularLoader from '../CircularLoader/CircularLoader'
import informat from '../../Imges/information.png';
import locationImage from '../../Imges/location.png';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHED_KEY);

function View() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [productData, setProductsData] = useState([]);
  const [isCircularloader, setIsCircularLoader] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [unit, setUnit] = useState('kg');
  const [editableField, setEditableField] = useState('quantity');
  const [quantityError, setQuantityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const popupRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 5,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // const handleLimitChange = (newLimit) => {
  //   const limitValue = Number(newLimit);
  //   setPagination(prev => ({
  //     ...prev,
  //     limit: limitValue
  //   }));
  //   // No need to setCurrentPage(1) here as the useEffect will trigger
  // };

  // const getPageNumbers = () => {
  //   const pages = [];
  //   const maxVisiblePages = 5;

  //   if (pagination.totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= pagination.totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  //     let endPage = startPage + maxVisiblePages - 1;

  //     if (endPage > pagination.totalPages) {
  //       endPage = pagination.totalPages;
  //       startPage = endPage - maxVisiblePages + 1;
  //     }

  //     for (let i = startPage; i <= endPage; i++) {
  //       pages.push(i);
  //     }
  //   }

  //   return pages;
  // };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setQuantity('');
        setPrice('');
        setPriceError('')
        setQuantityError('')
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
  const fetchHistory = async () => {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/gettransactionhistory`, {
        params: {
          productId: product?._id,
          page: currentPage,
          limit: pagination.limit
        }
      });

      if (resp?.data) {
        setHistory(resp?.data?.Data);
        setPagination({
          ...resp?.data?.pagination,
          limit: pagination.limit // Keep our local limit setting
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, [currentPage, pagination.limit, product?._id]);


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
      setQuantity(calculatedQty.trim());
    }
  };


  const toggleEditable = () =>
    setEditableField(editableField === 'quantity' ? 'price' : 'quantity');

  const [lastChanged, setLastChanged] = useState(null);

  const scrollToIndex = (index) => {
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
  };

  const handlebuynow = async (quantity, price, realprice) => {
    setQuantityError('');
    setPriceError('');

    if (quantity <= 0 && editableField === 'quantity') {
      setQuantityError('Please enter a valid quantity');
      return;
    }

    if (price <= 0 && editableField === 'price') {
      setPriceError('Please enter a valid price');
      return;
    }
    setIsCircularLoader(true);
    try {
      const stripe = await stripePromise;
      const sessionRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/create-checkout-session`, {
        batchId: productData?.batchId,
        quantity,
        price,
        buyerId: user?._id,
        sellerId: productData?.processorId,
        productId: product?._id,
        unit,
      });

      const session = sessionRes.data;
      sessionStorage.setItem('invoiceData', JSON.stringify({
        quantity,
        price,
        realprice,
        productname: productData?.productName,
        unit,
      }));
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      setIsCircularLoader(false);
      if (result.error) {
        console.log(result.error.message);
        setIsCircularLoader(false);
        showError('Stripe redirect error');
      }
    } catch (error) {
      console.log('Error:====>', error);
      setIsCircularLoader(false);
      showError(error?.response?.data?.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/getProductById?id=${product?._id}`);
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
  }, [])

  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  const handleQuantityChange = (e) => {
    setQuantityError('');
    let rawValue = e.target.value;

    const value = rawValue.replace(/^0+(?!\.)/, '');

    if (!/^\d*\.?\d*$/.test(value)) return;
    if (parseFloat(value) < 0) return;

    const basePricePerQuintal = parseFloat(productData?.price || 0);
    const totalAvailableQuintal = parseFloat(productData?.quantityProcessed || 0);
    const unitPrice = unit === 'kg' ? basePricePerQuintal / 100 : basePricePerQuintal;

    const enteredQuantity = parseFloat(value) || 0;
    const quantityInQuintal = unit === 'kg' ? enteredQuantity / 100 : enteredQuantity;

    if (quantityInQuintal > totalAvailableQuintal) {
      setQuantityError(`Only ${totalAvailableQuintal} quintals available.`);
      return;
    }

    if (lastChanged === 'price') {
      setQuantity('');
      setPrice('');
      setLastChanged(null);
    } else {
      setQuantity(value);

      const calculatedPrice = value
        ? (enteredQuantity * unitPrice).toFixed(2)
        : '';

      setPrice(calculatedPrice);
      setLastChanged('quantity');
    }
  };

  const handlePriceChange = (e) => {
    setQuantityError('');
    setPriceError('')
    let rawValue = e.target.value;
    const value = rawValue.replace(/^0+(?!\.)/, '');
    if (!/^\d*\.?\d*$/.test(value)) return;
    if (parseFloat(value) < 0) return;

    const basePricePerQuintal = parseFloat(productData?.price || 0);
    const totalAvailableQuintal = parseFloat(productData?.quantityProcessed || 0);
    const unitPrice = unit === 'kg' ? basePricePerQuintal / 100 : basePricePerQuintal;

    const enteredPrice = parseFloat(value) || 0;
    const calculatedQty = enteredPrice / unitPrice;
    const quantityInQuintal = unit === 'kg' ? calculatedQty / 100 : calculatedQty;

    if (quantityInQuintal > totalAvailableQuintal) {
      setQuantityError(`Only ${totalAvailableQuintal} quintals available.`);
      return;
    }

    if (lastChanged === 'quantity') {
      setQuantity('');
      setPrice('');
      setLastChanged(null);
    } else {
      setPrice(value);

      const calculatedQuantity = value
        ? calculatedQty.toFixed(2)
        : '';

      setQuantity(calculatedQuantity);
      setLastChanged('price');
    }
  };

  const BuyNowHandler = () => {
    if (user) {
      setShowPopup(true)
    }
    else {
      navigate('/auth', { state: { login: 'viewpage' } })
    }
  }
  const handleClosepopup = () => {
    setQuantity('');
    setPrice('');
    setPriceError('')
    setQuantityError('')
    setShowPopup(false)
  }

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
              {
                productData?.images?.length > 0 ? productData?.images?.map((img, index) => (
                  <div className="imagecontainerview" key={index}>
                    <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${img}`} alt={`product-${index}`} />
                  </div>
                )) :
                  <div className="imagecontainerview">
                    <img src={image1} />
                  </div>
              }
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
              <h2>Qty : <span className='priceproduct'>{productData?.quantityProcessed}  Qtl</span></h2>
              <div className='buynowbuttoncover'>

                <div className='buynowbuttoncover'>
                  <button onClick={BuyNowHandler} className='buynowbutton'>Buy Now</button>
                </div>
              </div>
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
                    <th>To</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', fontSize: '15px', padding: '1rem' }}>
                        Loading...
                      </td>
                    </tr>
                  ) : history?.length > 0 ? (
                    history.map((ele, i) => (
                      <tr key={i}>
                        <td>{ele?.transactionId}</td>
                        <td>{ele?.seller}</td>
                        <td>{ele?.buyer}</td>
                        <td>₹ {ele?.price}</td>
                        <td>{ele?.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', fontSize: '15px', padding: '1rem' }}>
                        No history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


            </div>
            {history?.length > 0 && (
              <div className="pagination-container" style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>Items per page:</span>
                    <select
                      value={pagination.limit}
                      onChange={(e) => handleLimitChange(e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px' }}
                      disabled={loading}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div> */}

                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || loading}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      background: currentPage === 1 ? '#f5f5f5' : '#fff',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    ◀◀
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    style={{
                      padding: '5px 8px',
                      border: '1px solid #ddd',
                      background: currentPage === 1 ? '#f5f5f5' : '#fff',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    ◀
                  </button>

                  {/* {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        style={{
                          padding: '5px 10px',
                          border: '1px solid #ddd',
                          background: currentPage === page ? '#007bff' : '#fff',
                          color: currentPage === page ? '#fff' : '#000',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          minWidth: '36px'
                        }}
                      >
                        {page}
                      </button>
                    ))} */}
                  <div style={{ color: '#666', fontSize: '0.9em',display:'flex',alignItems:'center' }}>
                    Page {currentPage} of {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    style={{
                      padding: '5px 8px',
                      border: '1px solid #ddd',
                      background: currentPage === pagination.totalPages ? '#f5f5f5' : '#fff',
                      cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    ▶
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={currentPage === pagination.totalPages || loading}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      background: currentPage === pagination.totalPages ? '#f5f5f5' : '#fff',
                      cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    ▶▶
                  </button>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>



      {showPopup && (
        <div className="popupOverlay">
          <div ref={popupRef} className="popup animatedPopup">
            <h2 className="popupTitle">Buy Product</h2>

            <div className={`inputBlock ${editableField !== 'quantity' ? 'disabledBlock' : ''}`}>
              <p className='totalquantityblock'><span>Total Quantity</span><span>{productData?.quantityProcessed}</span></p>
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
                  onChange={(e) => handleUnitChange(e)}
                  disabled={editableField !== 'quantity'}
                  className="select"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                </select>

              </div>
              {quantityError && <p className='errorclass'>{quantityError}</p>}
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
              {priceError && <p className='errorclass'>{priceError}</p>}
            </div>

            <div className="actions">
             <button onClick={handleClosepopup} className="cancelButton">
                Cancel
              </button>
              <button
                onClick={() => handlebuynow(quantity, price, productData?.price)}
                className="confirmButton"
              >
                {isCircularloader ? <CircularLoader size={15} /> : 'confirm'}
              </button>
             
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default View