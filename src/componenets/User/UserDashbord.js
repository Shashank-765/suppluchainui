import React, { useEffect, useState, useRef } from 'react';
import styles from './UserDashboard.module.css';
import axios from 'axios';
import view from '../../Imges/eye.png'
import { useNavigate, useLocation } from 'react-router-dom';
import profileImage from '../../Imges/portrait-322470_1280.jpg';

function UserDashBoard() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [showForm, setShowForm] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [usersPerPage] = useState(6);
  const [currnetBatchPage, setCurrentBatchPage] = useState(1);
  const [searchBatchTerm, setSearchBatchTerm] = useState('');
  const [totalBatchPage, setTotalBatchPage] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();

  const { userdata } = location.state || {};
  const [formData, setFormData] = useState({
    batchId: '',
    // Common fields
    farmInspectionId: '',
    farmInspectionName: '',
    productName: '',
    certificateNo: '',
    certificateFrom: '',
    typeOfFertilizer: '',
    fertilizerUsed: '',

    harvesterId: '',
    harvesterName: '',
    cropSampling: '',
    temperatureLevel: '',
    humidity: '',

    exporterId: '',
    exporterName: '',
    coordinationAddress: '',
    shipName: '',
    shipNo: '',
    departureDate: '',
    estimatedDate: '',
    exportedTo: '',

    importerId: '',
    importerName: '',
    quantityImported: '',
    shipStorage: '',
    arrivalDate: '',
    warehouseLocation: '',
    warehouseArrivalDate: '',
    importerAddress: '',

    processorId: '',
    processorName: '',
    quantityProcessed: '',
    processingMethod: '',
    packaging: '',
    packagedDate: '',
    warehouse: '',
    warehouseAddress: '',
    destination: '',
    price: '',
    miniQuantity: '',
    maxiQuantity: '',
    images: [],
  });
  if(user?.role?.label){
  
    if(user?.role?.label==='Farm Inspection'){
      formData.farmInspectionId=user?._id;
      formData.farmInspectionName = user?.name;
    }
      
    if(user?.role?.label==='Harvester'){
      formData.harvesterId=user?._id;
      formData.harvesterName = user?.name;
    }
      
    if(user?.role?.label==='Importer'){
      formData.importerId=user?._id;
      formData.importerName = user?.name;
    }
      
    if(user?.role?.label==='Exporter'){
      formData.exporterId=user?._id;
      formData.exporterName = user?.name;
    }
     
    if(user?.role?.label==='Processor'){
      formData.processorId=user?._id;
      formData.processorName = user?.name;
    }
  
  }
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles] // File objects must go here
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Reset to allow re-selection of same files
    fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const handleSearchBatchChange = (e) => {
    setSearchBatchTerm(e.target.value);
    setCurrentBatchPage(1);
  };
  const handlePreviousBatchPage = () => {
    setCurrentBatchPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextBatchPage = () => {
    setCurrentBatchPage((prev) => Math.min(prev + 1, totalBatchPage));
  };
  const toggleForm = (id) => {
    formData.batchId = id;
    setShowForm(!showForm)
  };
  console.log(formData.images); 
  const HandleBatchviewPage = (batch) => {
    navigate('/batchprogress', { state: { batch } });
  }

  useEffect(() => {
    if (showForm)

      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [showForm]);

  const fetchbatchbyid = async () => {
    try {
      const response = await axios.get(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getBatchByUserId?id=${userdata ? userdata?._id : user?._id}`, {
        params: {
          page: currnetBatchPage,
          limit: usersPerPage,
          search: searchBatchTerm,
        },
      });

      if (response.data) {
        setBatchData(response?.data?.batches);
        setTotalBatchPage(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching batch:', error);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = new FormData();

      for (const key in formData) {
        if (key === 'images') {
          formData.images.forEach((image) => {
            payload.append('images', image);
          });
        } else {
          payload.append(key, formData[key]);
        }
      }
      console.log(payload, 'payload');
      const res = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/updateBatch', payload);
      console.log(res.data, 'res.data');
      toggleForm();
    } catch (err) {
      console.error(err);
      alert('Failed to update batch.');
    }
  };

  useEffect(() => {
    fetchbatchbyid();
  }, [searchBatchTerm, currnetBatchPage, showForm]);

  return (
    <div className={styles.batchViewContainer}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileBanner}></div>
        <div className={styles.profileContent}>
          <img className={styles.profileImage} src={profileImage} alt="Profile" />
          <div className={styles.profileDetails}>
            <div className={styles.contactInfo}>
              <p> Contact No</p>
              <span className={styles.contactInformation}>{userdata ? userdata?.contact : user?.contact}</span>
            </div>
            <div className={styles.roleInfo}>
              <p> Role</p>
              <span
                className={

                  userdata ?
                    userdata?.role?.className.split(' ')
                      .map(cn => styles[cn])
                      .join(' ') :

                    user.role.className
                      .split(' ')
                      .map(cn => styles[cn])
                      .join(' ')
                }
              >
                {userdata ? userdata?.role?.slug : user?.role?.slug}
              </span>
            </div>
            <div className={styles.settings}>
              <span>{userdata ? userdata?.role?.label : user?.role?.label} Id</span>
              <span className={styles.editBtn} >
                {userdata ? userdata?._id : user?._id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>Edit Info - {user?.role?.label}</h2>
            <form onSubmit={handleSubmit}>
              {user?.role?.label === 'Farm Inspection' && (
                <>
                    <label>Farm Inspection Id: <input type="text" name="farmInspectionId" value={formData.farmInspectionId} disabled='true' onChange={handleChange} /></label>
                       <label>Farm Inspection Name: <input type="text" name="farmInspectionName" value={formData.farmInspectionName} disabled='true' onChange={handleChange} /></label>
                  <label>Certificate No: <input type="text" name="certificateNo" value={formData.certificateNo} onChange={handleChange} /></label>
                  <label>Certificate From: <input type="text" name="certificateFrom" value={formData.certificateFrom} onChange={handleChange} /></label>
                   <label>Product Name: <input type="text" name="productName" value={formData.productName} onChange={handleChange} /></label>
                  <label>Type of Fertilizer: <input type="text" name="typeOfFertilizer" value={formData.typeOfFertilizer} onChange={handleChange} /></label>
                  <label>Fertilizer Used: <input type="text" name="fertilizerUsed" value={formData.fertilizerUsed} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Harvester' && (
                <>
                 <label>Harvester Id: <input type="text" name="harvesterId" value={formData.harvesterId} disabled='true' onChange={handleChange} /></label>
                    <label>Harvester Name: <input type="text" name="harvesterName" value={formData.harvesterName} disabled='true' onChange={handleChange} /></label>
                  <label>Crop Sampling: <input type="text" name="cropSampling" value={formData.cropSampling} onChange={handleChange} /></label>
                  <label>Temperature Level: <input type="text" name="temperatureLevel" value={formData.temperatureLevel} onChange={handleChange} /></label>
                  <label>Humidity: <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Exporter' && (
                <>
                  <label>Exporter ID: <input type="text" name="exporterId" value={formData.exporterId} disabled='true' onChange={handleChange} /></label>
                  <label>Exporter Name: <input type="text" name="exporterName" value={formData.exporterName} disabled='true' onChange={handleChange} /></label>
                  <label>Coordination Address: <input type="text" name="coordinationAddress" value={formData.coordinationAddress} onChange={handleChange} /></label>
                  <label>Ship Name: <input type="text" name="shipName" value={formData.shipName} onChange={handleChange} /></label>
                  <label>Ship No: <input type="text" name="shipNo" value={formData.shipNo} onChange={handleChange} /></label>
                  <label>Departure Date: <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} /></label>
                  <label>Estimated Date: <input type="date" name="estimatedDate" value={formData.estimatedDate} onChange={handleChange} /></label>
                  <label>Exported To: <input type="text" name="exportedTo" value={formData.exportedTo} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Importer' && (
                <>
                  <label>Importer ID: <input type="text" name="importerId" value={formData.importerId} disabled='true' onChange={handleChange} /></label>
                  <label>Importer Name: <input type="text" name="importerName" value={formData.importerName} disabled='true' onChange={handleChange} /></label>
                  <label>Quantity: <input type="text" name="quantityImported" value={formData.quantityImported} onChange={handleChange} /></label>
                  <label>Ship Storage: <input type="text" name="shipStorage" value={formData.shipStorage} onChange={handleChange} /></label>
                  <label>Arrival Date: <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} /></label>
                  <label>Warehouse Location: <input type="text" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} /></label>
                  <label>Warehouse Arrival Date: <input type="date" name="warehouseArrivalDate" value={formData.warehouseArrivalDate} onChange={handleChange} /></label>
                  <label>Importer Address: <input type="text" name="importerAddress" value={formData.importerAddress} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Processor' && (
                <>
                  <label>Processor ID: <input type="text" name="processorId" value={formData.processorId} disabled='true' onChange={handleChange} /></label>
                  <label>Processor Name: <input type="text" name="processorName" value={formData.processorName} disabled='true' onChange={handleChange} /></label>
                  <label>Quantity: <input type="text" name="quantityProcessed" value={formData.quantityProcessed} onChange={handleChange} /></label>
                  <label>Processing Method: <input type="text" name="processingMethod" value={formData.processingMethod} onChange={handleChange} /></label>
                  <label>Packaging: <input type="text" name="packaging" value={formData.packaging} onChange={handleChange} /></label>
                  <label>Packaged Date: <input type="date" name="packagedDate" value={formData.packagedDate} onChange={handleChange} /></label>
                  <label>Warehouse: <input type="text" name="warehouse" value={formData.warehouse} onChange={handleChange} /></label>
                  <label>Warehouse Address: <input type="text" name="warehouseAddress" value={formData.warehouseAddress} onChange={handleChange} /></label>
                  <label>Destination: <input type="text" name="destination" value={formData.destination} onChange={handleChange} /></label>
                  <label>Price: <input type="text" name="price" value={formData.price} onChange={handleChange} /></label>
                  <label>miniQuantity: <input type="text" name="miniQuantity" value={formData.miniQuantity} onChange={handleChange} /></label>
                  <label>maxQuantity: <input type="text" name="maxiQuantity" value={formData.maxiQuantity} onChange={handleChange} /></label>
                  <div className='custom-file-upload'>
                    <label htmlFor='fruit-images' className='upload-button'>
                      {formData.images.length === 0
                        ? 'Choose images'
                        : `${formData.images.length} image${formData.images.length > 1 ? 's' : ''} selected`}
                    </label>
                    <input
                      id='fruit-images'
                      type='file'
                      multiple
                      accept='image/*'
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className={styles.custom_file_input}
                    />
                  </div>

                  <div className='preview-container'>
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className='preview-item'>
                        <img src={src} alt={`fruit-${idx}`} className='preview-image' />
                        <span
                          className='remove-icon'
                          onClick={() => handleRemoveImage(idx)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button type="submit">Submit</button>
                <button type="button" onClick={toggleForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.batchesOverview}>
        <h3>Batches Overview</h3>
        <input
          type="text"
          placeholder="Search By Batch ID"
          value={searchBatchTerm}
          onChange={handleSearchBatchChange}
          className={styles.searchInput}
        />
        <table className={styles.batchTable}>
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Farm Inspector</th>
              <th>Harvester</th>
              <th>Importer</th>
              <th>Exporter</th>
              <th>Processor</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {
              batchData?.length > 0 ?
                batchData?.map((batch, index) => (
                  <tr key={index}>
                    <td>{batch?.batchId}</td>
                    <td>
                      {/* {batch?.farmInspectionName} */}

                      {

                        (batch?.tracking?.isInspexted) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                          (!batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Farm Inspection'
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Farm Inspection'
                                    ? ''
                                    : 'rgb(245 208 142)',
                              }}

                              onClick={!userdata && user?.role?.label === 'Farm Inspection' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                            :
                            <button
                              className={styles.pendingBtn}
                              onClick={!userdata && user?.role?.label === 'Farm Inspection' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Farm Inspection'
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Farm Inspection'
                                    ? ''
                                    : 'rgb(237 200 193)',
                              }}

                            >
                              Pending
                            </button>

                      }

                      {/* <button className={styles.verifyBtn}>✅</button> */}
                    </td>
                    <td>
                      {/* {batch?.harvesterName} */}
                      {

                        (batch?.tracking?.isHarvested) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :


                          ( batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Harvester' && batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Harvester'
                                    ? ''
                                    : 'rgb(245 208 142)',
                              }}

                              onClick={(!userdata && user?.role?.label === 'Harvester' && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                            :
                            <button
                              className={styles.pendingBtn}
                              onClick={(!userdata && user?.role?.label === 'Harvester' && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Harvester' && batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Harvester'
                                    ? ''
                                    : 'rgb(237 200 193)',
                              }}


                            >
                              Pending
                            </button>


                      }
                    </td>
                    <td>
                      {/* {batch?.importerName} */}
                      {

                        (batch?.tracking?.isImported) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                          (batch?.tracking?.isHarvested ) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Importer' &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Importer'
                                    ? ''
                                    : 'rgb(245 208 142)',
                              }}

                              onClick={(!userdata && user?.role?.label === 'Importer' && batch?.tracking?.isHarvested && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                            :
                            <button
                              className={styles.pendingBtn}
                              onClick={(!userdata && user?.role?.label === 'Importer' && batch?.tracking?.isHarvested && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Importer' &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Importer'
                                    ? ''
                                    : 'rgb(237 200 193)',
                              }}


                            >
                              Pending
                            </button>

                      }
                    </td>
                    <td>
                      {/* {batch?.exporterName} */}
                      {

                        (batch?.tracking?.isExported) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                          ( batch?.tracking?.isImported ) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Exporter' &&
                                    batch?.tracking?.isImported &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Exporter'
                                    ? ''
                                    : 'rgb(245 208 142)',
                              }}


                              onClick={(!userdata && user?.role?.label === 'Exporter' && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                            :
                            <button
                              className={styles.pendingBtn}
                              onClick={(!userdata && user?.role?.label === 'Exporter' && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Exporter' &&
                                    batch?.tracking?.isImported &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Exporter'
                                    ? ''
                                    : 'rgb(237 200 193)',
                              }}


                            >
                              Pending
                            </button>

                      }
                    </td>
                    <td>
                      {/* {batch?.processorName} */}
                      {

                        (batch?.tracking?.isProcessed) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                          ( batch?.tracking?.isExported ) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Processor' &&
                                    batch?.tracking?.isImported &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isExported &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Processor'
                                    ? ''
                                    : 'rgb(245 208 142)',
                              }}

                              onClick={(!userdata && user?.role?.label === 'Processor' && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                            :
                            <button
                              className={styles.pendingBtn}
                              onClick={(!userdata && user?.role?.label === 'Processor' && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: userdata
                                  ? 'not-allowed'
                                  : user?.role?.label === 'Processor' &&
                                    batch?.tracking?.isImported &&
                                    batch?.tracking?.isHarvested &&
                                    batch?.tracking?.isExported &&
                                    batch?.tracking?.isInspexted
                                    ? 'pointer'
                                    : 'not-allowed',
                                backgroundColor: userdata
                                  ? 'rgb(245 208 142)'
                                  : user?.role?.label === 'Processor'
                                    ? ''
                                    : 'rgb(237 200 193)',
                              }}


                            >
                              Pending
                            </button>
                      }
                    </td>
                    <td>
                      <button onClick={() => HandleBatchviewPage(batch)} className={styles.editButton}>
                        <img src={view} />
                      </button>
                    </td>
                  </tr>
                ))
                :
                <td colSpan="7" className={styles.noData}>No Data Available</td>
            }
          </tbody>

        </table>
        <div className={styles.pagination}>
          <button onClick={handlePreviousBatchPage} disabled={currnetBatchPage === 1}>
            ◀
          </button>
          <span>
            Page {currnetBatchPage} of {totalBatchPage}
          </span>
          <button onClick={handleNextBatchPage} disabled={currnetBatchPage === totalBatchPage}>
            ▶
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        © 2025 Coffee SupplyChain by <a href="https://bastionex.net/" target="_blank" rel="noopener noreferrer">Bastionex Infotech Pvt Ltd</a>
      </footer>
    </div>
  );
}

export default UserDashBoard;
