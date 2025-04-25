import React, { useEffect, useState, useRef } from 'react';
import styles from './UserDashboard.module.css';
import axios from 'axios';
import view from '../../Imges/eye.png'
import { useNavigate, useLocation } from 'react-router-dom';
import profileImage from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';
import formbackground from '../../Imges/formbackground.jpg'
import CircularLoader from '../CircularLoader/CircularLoader'
import { showError, showSuccess } from '../ToastMessage/ToastMessage';
import Popup from '../Popups/Popup'

function UserDashBoard() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [showForm, setShowForm] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [usersPerPage] = useState(6);
  const [currnetBatchPage, setCurrentBatchPage] = useState(1);
  const [searchBatchTerm, setSearchBatchTerm] = useState('');
  const [totalBatchPage, setTotalBatchPage] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [hoveredBatchId, setHoveredBatchId] = useState(null);
  const [isCircularloader, setIsCircularLoader] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState('');
  const [pendingFunction, setPendingFunction] = useState(null);
  const [pendingArgs, setPendingArgs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();
  const [toggle, setToggle] = useState(false);

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowForm(false); // close popup
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const showPopup = (actionText, callbackFn, args = []) => {
    setPopupAction(actionText);
    setPendingFunction(() => callbackFn);
    setPendingArgs(args);
    setPopupOpen(true);
  };

  const handleConfirm = () => {
    if (typeof pendingFunction === 'function') {
      pendingFunction(...pendingArgs);
    }
    setPopupOpen(false);
  };
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
    inspectedImages: [],

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
  if (user?.role?.label) {

    if (user?.role?.label === 'Farm Inspection') {
      formData.farmInspectionId = user?._id;
      formData.farmInspectionName = user?.name;
    }

    if (user?.role?.label === 'Harvester') {
      formData.harvesterId = user?._id;
      formData.harvesterName = user?.name;
    }

    if (user?.role?.label === 'Importer') {
      formData.importerId = user?._id;
      formData.importerName = user?.name;
    }

    if (user?.role?.label === 'Exporter') {
      formData.exporterId = user?._id;
      formData.exporterName = user?.name;
    }

    if (user?.role?.label === 'Processor') {
      formData.processorId = user?._id;
      formData.processorName = user?.name;
    }

  }
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    fileInputRef.current.value = '';
  };
  const handleInspectedImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.inspectedImages, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      inspectedImages: [...prev.images, ...newFiles]
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);


    fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };
  const handleRemoveInspectedImage = (index) => {
    const updatedImages = formData.inspectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, inspectedImages: updatedImages }));
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
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/batch/getBatchByUserId?id=${userdata ? userdata?._id : user?._id}`, {
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';

    if (name === 'images' || name === 'inspectedImages') {
      return error;
    }
    const currentRoleFields = getCurrentRoleFields(user?.role?.label);

    if (!currentRoleFields.includes(name)) {
      return error;
    }

    if (!value && value !== 0) {
      error = 'This field is required';
      return error;
    }
    switch (name) {
      case 'certificateNo':
        if (value.length < 3) error = 'Certificate No must be at least 3 characters';
        break;
      case 'temperatureLevel':
      case 'humidity':
        if (isNaN(value)) error = 'Must be a number';
        else if (name === 'temperatureLevel' && (value < -50 || value > 100)) error = 'Temperature must be between -50 and 100';
        else if (name === 'humidity' && (value < 0 || value > 100)) error = 'Humidity must be between 0 and 100';
        break;
      case 'quantityImported':
      case 'quantityProcessed':
        if (isNaN(value)) error = 'Must be a number';
        else if (value <= 0) error = 'Must be greater than 0';
        break;
      case 'departureDate':
      case 'estimatedDate':
      case 'arrivalDate':
      case 'warehouseArrivalDate':
      case 'packagedDate':
        if (new Date(value) > new Date()) error = 'Date cannot be in the future';
        break;
      case 'estimatedDate':
        if (formData.departureDate && new Date(value) < new Date(formData.departureDate)) {
          error = 'Estimated date cannot be before departure date';
        }
        break;
      case 'warehouseArrivalDate':
        if (formData.arrivalDate && new Date(value) < new Date(formData.arrivalDate)) {
          error = 'Warehouse arrival cannot be before ship arrival';
        }
        break;
      case 'price':
      case 'miniQuantity':
      case 'maxiQuantity':
        if (isNaN(value)) error = 'Must be a number';
        else if (value <= 0) error = 'Must be greater than 0';
        break;
      case 'miniQuantity':
        if (formData.maxiQuantity && parseFloat(value) > parseFloat(formData.maxiQuantity)) {
          error = 'Minimum quantity cannot be greater than maximum';
        }
        break;
      case 'maxiQuantity':
        if (formData.miniQuantity && parseFloat(value) < parseFloat(formData.miniQuantity)) {
          error = 'Maximum quantity cannot be less than minimum';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const getCurrentRoleFields = (roleLabel) => {
    const roleFields = {
      'Farm Inspection': [
        'farmInspectionId',
        'farmInspectionName',
        'certificateNo',
        'certificateFrom',
        'productName',
        'typeOfFertilizer',
        'fertilizerUsed',
        'inspectedImages'
      ],
      'Harvester': [
        'harvesterId',
        'harvesterName',
        'cropSampling',
        'temperatureLevel',
        'humidity'
      ],
      'Exporter': [
        'exporterId',
        'exporterName',
        'coordinationAddress',
        'shipName',
        'shipNo',
        'departureDate',
        'estimatedDate',
        'exportedTo'
      ],
      'Importer': [
        'importerId',
        'importerName',
        'quantityImported',
        'shipStorage',
        'arrivalDate',
        'warehouseLocation',
        'warehouseArrivalDate',
        'importerAddress'
      ],
      'Processor': [
        'processorId',
        'processorName',
        'quantityProcessed',
        'processingMethod',
        'packaging',
        'packagedDate',
        'warehouse',
        'warehouseAddress',
        'destination',
        'price',
        'miniQuantity',
        'maxiQuantity',
        'images'
      ]
    };

    return roleFields[roleLabel] || [];
  };

  const validateForm = () => {
    const currentRoleFields = getCurrentRoleFields(user?.role?.label);
    const newErrors = {};

    currentRoleFields.forEach(key => {
      if (key !== 'images' && key !== 'inspectedImages') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'inspectedImages') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setIsCircularLoader(false);
      showError('Please fix the errors in the form');
      return;
    }
    showPopup(' submit this form ', handleSubmit, [e]);

  };
  const handleSubmit = async () => {
    setIsCircularLoader(true);

    try {

      const payload = new FormData();

      for (const key in formData) {
        if (key === 'images') {
          formData.images.forEach((image) => {
            payload.append('images', image);
          });
        } else if (key === 'inspectedImages') {
          formData.inspectedImages.forEach((image) => {
            payload.append('inspectedImages', image);
          });
        } else {
          payload.append(key, formData[key]);
        }
      }

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/batch/updateBatch`, payload);
      if (res) {
        setIsCircularLoader(false);
        toggleForm();
        setToggle(!toggle)
        setImagePreviews([]);
        setFormData({
          batchId: '',
          farmInspectionId: '',
          farmInspectionName: '',
          productName: '',
          certificateNo: '',
          certificateFrom: '',
          typeOfFertilizer: '',
          fertilizerUsed: '',
          inspectedImages: [],
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
        showSuccess('submitted successfully')
      }
    } catch (err) {
      setIsCircularLoader(false);
      console.error(err);
      showError('Failed to update batch.');
    }
  }
  useEffect(() => {
    fetchbatchbyid();
  }, [searchBatchTerm, currnetBatchPage, toggle]);

  const renderInput = (name, label, type = 'text', disabled = false, options = []) => (
    <div className={styles.formGroup}>
      <label>
        {label}:
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors[name] && touched[name] ? styles.errorInput : ''}
          >
            {options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            disabled={disabled}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors[name] && touched[name] ? styles.errorInput : ''}
          />
        )}
      </label>
      {errors[name] && touched[name] && (
        <div className={styles.errorMessage}>{errors[name]}</div>
      )}
    </div>
  );


  return (
    <div className={styles.batchViewContainer}>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm} ref={popupRef}>
            <div className={styles.popupFormContent}>
              <div className={styles.formheaders}>
                <h2>{user?.role?.label}</h2>
              </div>
              <form onSubmit={handlePopupSubmit}>
                {/* Farm Inspector */}
                {user?.role?.label === 'Farm Inspection' && (
                  <>
                    {renderInput('farmInspectionId', 'Farm Inspection Id', 'text', true)}
                    {renderInput('farmInspectionName', 'Farm Inspection Name', 'text', true)}
                    {renderInput('certificateNo', 'Certificate No')}
                    {renderInput('certificateFrom', 'Certificate From')}
                    {renderInput('productName', 'Product Name')}
                    {renderInput('typeOfFertilizer', 'Type of Fertilizer')}
                    {renderInput('fertilizerUsed', 'Fertilizer Used')}

                    {/* Select input for Farm Inspector */}
                    {renderInput('inspectionStatus', 'Inspection Status', 'select', false, ['Ready to Inspect', 'Pending', 'Completed'])}

                    {/* Image upload remains unchanged */}
                    <div className='custom-file-upload'>
                      <label htmlFor='fruit-images' className='upload-button'>
                        {formData.inspectedImages.length === 0
                          ? 'Choose images'
                          : `${formData.inspectedImages.length} image${formData.inspectedImages.length > 1 ? 's' : ''} selected`}
                      </label>
                      <input
                        id='fruit-images'
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleInspectedImageChange}
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
                            onClick={() => handleRemoveInspectedImage(idx)}
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Harvester */}
                {user?.role?.label === 'Harvester' && (
                  <>
                    {renderInput('harvesterId', 'Harvester Id', 'text', true)}
                    {renderInput('harvesterName', 'Harvester Name', 'text', true)}
                    {renderInput('cropSampling', 'Crop Sampling')}
                    {renderInput('temperatureLevel', 'Temperature Level')}
                    {renderInput('humidity', 'Humidity')}

                    {/* Select input for Harvester */}
                    {renderInput('harvestStatus', 'Harvest Status', 'select', false, ['Ready to Harvest', 'Pending', 'Completed'])}
                  </>
                )}

                {/* Exporter */}
                {user?.role?.label === 'Exporter' && (
                  <>
                    {renderInput('exporterId', 'Exporter ID', 'text', true)}
                    {renderInput('exporterName', 'Exporter Name', 'text', true)}
                    {renderInput('coordinationAddress', 'Coordination Address')}
                    {renderInput('shipName', 'Ship Name')}
                    {renderInput('shipNo', 'Ship No')}
                    {renderInput('departureDate', 'Departure Date', 'date')}
                    {renderInput('estimatedDate', 'Estimated Date', 'date')}
                    {renderInput('exportedTo', 'Exported To')}

                    {/* Select input for Exporter */}
                    {renderInput('exportStatus', 'Export Status', 'select', false, ['Ready for Export', 'Pending', 'Shipped'])}
                  </>
                )}

                {/* Importer */}
                {user?.role?.label === 'Importer' && (
                  <>
                    {renderInput('importerId', 'Importer ID', 'text', true)}
                    {renderInput('importerName', 'Importer Name', 'text', true)}
                    {renderInput('quantityImported', 'Quantity')}
                    {renderInput('shipStorage', 'Ship Storage')}
                    {renderInput('arrivalDate', 'Arrival Date', 'date')}
                    {renderInput('warehouseLocation', 'Warehouse Location')}
                    {renderInput('warehouseArrivalDate', 'Warehouse Arrival Date', 'date')}
                    {renderInput('importerAddress', 'Importer Address')}

                    {/* Select input for Importer */}
                    {renderInput('importStatus', 'Import Status', 'select', false, ['Ready for Import', 'Pending', 'Received'])}
                  </>
                )}

                {/* Processor */}
                {user?.role?.label === 'Processor' && (
                  <>
                    {renderInput('processorId', 'Processor ID', 'text', true)}
                    {renderInput('processorName', 'Processor Name', 'text', true)}
                    {renderInput('quantityProcessed', 'Quantity')}
                    {renderInput('processingMethod', 'Processing Method')}
                    {renderInput('packaging', 'Packaging')}
                    {renderInput('packagedDate', 'Packaged Date', 'date')}
                    {renderInput('warehouse', 'Warehouse')}
                    {renderInput('warehouseAddress', 'Warehouse Address')}
                    {renderInput('destination', 'Destination')}
                    {renderInput('price', 'Price')}
                    {renderInput('miniQuantity', 'Mini Quantity')}
                    {renderInput('maxiQuantity', 'Max Quantity')}

                    {/* Select input for Processor */}
                    {renderInput('processingStatus', 'Processing Status', 'select', false, ['Ready for Processing', 'Pending', 'Processed'])}

                    {/* Image upload remains unchanged */}
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
                  <button type="submit">{isCircularloader ? <CircularLoader size={18} /> : 'Submit'}</button>
                  <button type="button" onClick={toggleForm}>Cancel</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      <div className={styles.batchesOverview}>
        <div className={styles.batchoverviewimagecontainer}>
          <img src={profileImage} />
          <h1>Batches Overview</h1>
        </div>
        <input
          type="text"
          placeholder="Search By Batch ID"
          value={searchBatchTerm}
          onChange={handleSearchBatchChange}
          className={styles.searchInput}
        />
        <div className={styles.tableWrapper}>
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
                        {batch?.tracking?.isInspexted ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : !batch?.tracking?.isInspexted ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Farm Inspection'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata && user?.role?.label === 'Farm Inspection'
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            onMouseEnter={() => user?.role?.label === 'Farm Inspection' && setHoveredBatchId(batch?.batchId)}
                            onMouseLeave={() => setHoveredBatchId(null)}
                          >
                            Progress
                          </button>
                        ) : (
                          <button
                            className={styles.pendingBtn}
                            onClick={
                              !userdata && user?.role?.label === 'Farm Inspection'
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Farm Inspection'
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.tracking?.isHarvested ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.tracking?.isInspexted ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Harvester' && batch?.tracking?.isInspexted
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Harvester' &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            onMouseEnter={() => user?.role?.label === 'Harvester' && setHoveredBatchId(batch?.batchId)}
                            onMouseLeave={() => setHoveredBatchId(null)}
                          >
                            Progress
                          </button>
                        ) : (
                          <button
                            className={styles.pendingBtn}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Harvester' &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Harvester' &&
                                  batch?.tracking?.isInspexted
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.tracking?.isImported ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.tracking?.isHarvested ? (
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
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Importer' &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            onMouseEnter={() => user?.role?.label === 'Importer' && setHoveredBatchId(batch?.batchId)}
                            onMouseLeave={() => setHoveredBatchId(null)}
                          >
                            Progress
                          </button>
                        ) : (
                          <button
                            className={styles.pendingBtn}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Importer' &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Importer' &&
                                  batch?.tracking?.isHarvested &&
                                  batch?.tracking?.isInspexted
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.tracking?.isExported ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.tracking?.isImported ? (
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
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Exporter' &&
                                batch?.tracking?.isImported &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            onMouseEnter={() => user?.role?.label === 'Exporter' && setHoveredBatchId(batch?.batchId)}
                            onMouseLeave={() => setHoveredBatchId(null)}
                          >
                            Progress
                          </button>
                        ) : (
                          <button
                            className={styles.pendingBtn}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Exporter' &&
                                batch?.tracking?.isImported &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Exporter' &&
                                  batch?.tracking?.isImported &&
                                  batch?.tracking?.isHarvested &&
                                  batch?.tracking?.isInspexted
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.tracking?.isProcessed ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.tracking?.isExported ? (
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
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Processor' &&
                                batch?.tracking?.isImported &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isExported &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            onMouseEnter={() => user?.role?.label === 'Processor' && setHoveredBatchId(batch?.batchId)}
                            onMouseLeave={() => setHoveredBatchId(null)}
                          >
                            Progress
                          </button>
                        ) : (
                          <button
                            className={styles.pendingBtn}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Processor' &&
                                batch?.tracking?.isImported &&
                                batch?.tracking?.isHarvested &&
                                batch?.tracking?.isExported &&
                                batch?.tracking?.isInspexted
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
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
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => HandleBatchviewPage(batch)}
                          className={styles.editButton}
                        >
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
        </div>
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


      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirm}
        action={popupAction}
      />
    </div>
  );
}

export default UserDashBoard;
