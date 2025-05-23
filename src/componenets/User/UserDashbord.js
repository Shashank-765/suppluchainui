import React, { useEffect, useState, useRef } from 'react';
import styles from './UserDashboard.module.css';
import api from '../../axios'
import view from '../../Imges/eye.png'
import { useNavigate, useLocation } from 'react-router-dom';
import profileImage from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';
import CircularLoader from '../CircularLoader/CircularLoader'
import { showError, showSuccess } from '../ToastMessage/ToastMessage';
import Popup from '../Popups/Popup'
import axios from 'axios';

function UserDashBoard() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  // console.log(user?.role?.label,'user role')
  const [showForm, setShowForm] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [usersPerPage] = useState(6);
  const [currnetBatchPage, setCurrentBatchPage] = useState(1);
  const [searchBatchTerm, setSearchBatchTerm] = useState('');
  const [totalBatchPage, setTotalBatchPage] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [inspectedImagePreviews, setInspectedImagePreviews] = useState([]);
  const [hoveredBatchId, setHoveredBatchId] = useState(null);
  const [isCircularloader, setIsCircularLoader] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState('');
  const [pendingFunction, setPendingFunction] = useState(null);
  const [pendingArgs, setPendingArgs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const processorFileInputRef = useRef(null);
  const inspectorFileInputRef = useRef(null);
  const [toUpdate, setToUpdate] = useState(null);
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowForm(false);
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
  const initialFormData = {
    batchId: '',
    farmInspectionId: '',
    farmInspectionName: '',
    productName: '',
    certificateNo: '',
    certificateFrom: '',
    typeOfFertilizer: '',
    fertilizerUsed: '',
    inspectedImages: [],
    inspectionStatus: '',

    harvesterId: '',
    harvesterName: '',
    cropSampling: '',
    temperatureLevel: '',
    humidity: '',
    harvestStatus: '',

    exporterId: '',
    exporterName: '',
    coordinationAddress: '',
    shipName: '',
    shipNo: '',
    departureDate: '',
    estimatedDate: '',
    exportedTo: '',
    exportStatus: '',

    importerId: '',
    importerName: '',
    quantityImported: '',
    shipStorage: '',
    arrivalDate: '',
    warehouseLocation: '',
    warehouseArrivalDate: '',
    importerAddress: '',
    importStatus: '',

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
    images: [],
    processingStatus: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    processorFileInputRef.current.value = '';
  };

  const handleInspectedImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.inspectedImages, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      inspectedImages: updatedImages
    }));
    setInspectedImagePreviews(prev => [...prev, ...newPreviews]);

    inspectorFileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };
  const handleRemoveInspectedImage = (index) => {
    const updatedImages = formData.inspectedImages.filter((_, i) => i !== index);
    const updatedPreviews = inspectedImagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, inspectedImages: updatedImages }));
    setInspectedImagePreviews(updatedPreviews);
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

    const selectedBatch = batchData.find(batch => String(batch.batchId) === String(id));
    if (selectedBatch) {
      const inspectedImages = selectedBatch?.tracking?.inspectedImages || [];
      const processingImages = selectedBatch?.tracking?.images || [];

        if(user?.role?.label === 'Farm Inspection'){
           if(selectedBatch?.farmInspectionId?.certificateNo){
             setToUpdate(true)         
           }else{
            setToUpdate(false) 
           }      
        }
        if(user?.role?.label === 'Harvester'){
           if(selectedBatch?.harvesterId?.cropSampling){
           console.log('selectedBatch?.harvesterId?.coordinationAddress', selectedBatch?.harvesterId?.cropSampling)
             setToUpdate(true)         
           }else{
            setToUpdate(false) 
           }      
        }
        if(user?.role?.label === 'Importer'){
           if(selectedBatch?.importerId?.quantity){
             setToUpdate(true)         
           }else{
            setToUpdate(false) 
           }      
        }
        if(user?.role?.label === 'Exporter'){
           if(selectedBatch?.exporterId?.coordinationAddress){
             setToUpdate(true)         
           }else{
            setToUpdate(false) 
           }      
        }
        if(user?.role?.label === 'Processor'){
           if(selectedBatch?.processorId?.processingMethod){
             setToUpdate(true)         
           }else{
            setToUpdate(false) 
           }      
        }
           console.log('selectedBatch?.harvesterId?.coordinationAddress', selectedBatch?.harvesterId?.coordinationAddress)

      setFormData(prevData => ({
        ...prevData,
        batchId: selectedBatch?.batchId ,
        farmInspectionId: selectedBatch?.farmInspectionId?.farmInspectionId || selectedBatch?.farmInspectionId?.id ,
        farmInspectionName: selectedBatch?.farmInspectionId?.farmInspectionName || 'Janiifer ojedja',
        productName: selectedBatch?.farmInspectionId?.productName || '',
        certificateNo: selectedBatch?.farmInspectionId?.certificateNo || '',
        certificateFrom: selectedBatch?.farmInspectionId?.certificateFrom || '',
        typeOfFertilizer: selectedBatch?.farmInspectionId?.typeOfFertilizer || '',
        fertilizerUsed: selectedBatch?.farmInspectionId?.fertilizerUsed || '',
        inspectedImages: selectedBatch?.farmInspectionId?.image || [""],
        inspectionStatus: selectedBatch?.farmInspectionId?.farmInspectionStatus || '',

        harvesterId: selectedBatch?.harvesterId?.harvestId || selectedBatch?.harvesterId?.id,
        harvesterName: selectedBatch?.harvesterId?.harvesterName || 'Janiifer ojedja',
        cropSampling: selectedBatch?.harvesterId?.cropSampling || '',
        temperatureLevel: selectedBatch?.harvesterId?.temperatureLevel || '',
        humidity: selectedBatch?.harvesterId?.humidityLevel || '',
        harvestStatus: selectedBatch?.harvesterId?.harvestStatus || '',

        exporterId: selectedBatch?.exporterId?.exporterId || selectedBatch?.exporterId?.id,
        exporterName: selectedBatch?.exporterId?.exporterName || 'Janiifer ojedja',
        coordinationAddress: selectedBatch?.exporterId?.coordinationAddress || '',
        shipName: selectedBatch?.exporterId?.shipName || '',
        shipNo: selectedBatch?.exporterId?.shipNo || '',
        departureDate: selectedBatch?.exporterId?.departureDate || '',
        estimatedDate: selectedBatch?.exporterId?.estimatedDate || '',
        exportedTo: selectedBatch?.exporterId?.exportedTo || '',
        exportStatus: selectedBatch?.exporterId?.exporterStatus || '',

        importerId: selectedBatch?.importerId?.importerId || selectedBatch?.importerId?.id,
        importerName: selectedBatch?.importerId?.importerName || 'Janiifer ojedja',
        quantityImported: selectedBatch?.importerId?.quantity || '',
        shipStorage: selectedBatch?.importerId?.shipStorage || '',
        arrivalDate: selectedBatch?.importerId?.arrivalDate || '',
        warehouseLocation: selectedBatch?.importerId?.warehouseLocation || '',
        warehouseArrivalDate: selectedBatch?.importerId?.warehouseArrivalDate || '',
        importerAddress: selectedBatch?.importerId?.importerAddress || '',
        importStatus: selectedBatch?.importerId?.importerStatus || '',

        processorId: selectedBatch?.processorId?.processorId || selectedBatch?.processorId?.id,
        processorName: selectedBatch?.processorId?.processorName || 'Janiifer ojedja',
        quantityProcessed: selectedBatch?.processorId?.quantity || '',
        processingMethod: selectedBatch?.processorId?.processingMethod || '',
        packaging: selectedBatch?.processorId?.packaging || '',
        packagedDate: selectedBatch?.processorId?.packagedDate || '',
        warehouse: selectedBatch?.processorId?.warehouse || '',
        warehouseAddress: selectedBatch?.processorId?.warehouseLocation || '',
        destination: selectedBatch?.processorId?.destination || '',
        price: selectedBatch?.processorId?.price || '',
        images: selectedBatch?.processorId?.images || [""],
        processingStatus: selectedBatch?.processorId?.processorStatus || ''
      }));
      setImagePreviews(
        processingImages.map(img =>
          typeof img === 'string'
            ? `${process.env.REACT_APP_BACKEND_IMAGE_URL}${img.startsWith('/') ? '' : '/'}${img}`
            : URL.createObjectURL(img)
        )
      );
      setInspectedImagePreviews(
        inspectedImages.map(img =>
          typeof img === 'string'
            ? `${process.env.REACT_APP_BACKEND_IMAGE_URv}${img.startsWith('/') ? '' : '/'}${img}`
            : URL.createObjectURL(img)
        )
      );
      setShowForm(true);
    } else {
      console.error('Batch not found');
    }
  };

  const toggleFormClose = () => {
    setShowForm(false);
  }

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

  const roleToFieldMap = {
    'Farm Inspection': 'farmInspectorId',
    'Harvester': 'harvesterId',
    'Importer': 'importerId',
    'Exporter': 'exporterId',
    'Processor': 'processorId',
  };


  const fetchbatchbyid = async () => {
    setIsCircularLoader(true);
    const userrole = roleToFieldMap[user?.role?.label];
    try {
      const response = await axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/batches/filter?${userrole}=${user?._id}`,
        {
          params: {
            id: userdata?._id || user?._id,
            page: currnetBatchPage,
            limit: usersPerPage,
            search: searchBatchTerm,
          },
        }
        // const response = await api.get(
        // `/batch/getBatchByUserId`,
        // {
        //   params: {
        //     id: userdata?._id || user?._id,
        //     page: currnetBatchPage,
        //     limit: usersPerPage,
        //     search: searchBatchTerm,
        //   },
        //   headers: {
        //     Authorization: `Bearer ${user?.token}`,
        //   },
        // }
      );

      if (response.data) {
        const batchList = response?.data?.data;
        setIsCircularLoader(false)
        setBatchData(batchList);
        setTotalBatchPage(response.data.totalPages);
      }

    } catch (error) {
      setIsCircularLoader(false)
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
      case 'inspectionStatus':
      case 'harvestStatus':
      case 'exportStatus':
      case 'importStatus':
      case 'processingStatus':
        if (value === '' || value === 'Select Status') {
          error = 'Please select a valid status';
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
        'inspectedImages',
        'inspectionStatus'
      ],
      'Harvester': [
        'harvesterId',
        'harvesterName',
        'cropSampling',
        'temperatureLevel',
        'humidity',
        'harvestStatus'
      ],
      'Exporter': [
        'exporterId',
        'exporterName',
        'coordinationAddress',
        'shipName',
        'shipNo',
        'departureDate',
        'estimatedDate',
        'exportedTo',
        'exportStatus'
      ],
      'Importer': [
        'importerId',
        'importerName',
        'quantityImported',
        'shipStorage',
        'arrivalDate',
        'warehouseLocation',
        'warehouseArrivalDate',
        'importerAddress',
        'importStatus'
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
        'images',
        'processingStatus'
      ]
    };

    return roleFields[roleLabel] || [];
  };

  const validateForm = () => {
    const currentRoleFields = getCurrentRoleFields(user?.role?.label);
    const newErrors = {};

    currentRoleFields.forEach(key => {
      // if (key !== 'images' && key !== 'inspectedImages') {
      const error = validateField(key, formData[key]);
      console.log(error, 'this is the error')
      if (error) newErrors[key] = error;
      // }
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

    if (!validateForm()) {
      setIsCircularLoader(false);
      return;
    }
    showPopup(' submit this form ', handleSubmit, [e]);

  };
  const handleSubmit = async () => {
    setIsCircularLoader(true);
    try {
      const payload = new FormData();
      const existingImages = formData.images.filter(img => typeof img === 'string');
      const newImages = formData.images.filter(img => typeof img !== 'string');
      const existingInspectedImages = formData.inspectedImages.filter(img => typeof img === 'string');
      const newInspectedImages = formData.inspectedImages.filter(img => typeof img !== 'string');
      newImages.forEach(image => payload.append('images', image));
      newInspectedImages.forEach(image => payload.append('inspectedImages', image));
      payload.append('existingImages', JSON.stringify(existingImages));
      payload.append('existingInspectedImages', JSON.stringify(existingInspectedImages));
      for (const key in formData) {
        if (key !== 'images' && key !== 'inspectedImages') {
          payload.append(key, formData[key]);
        }
      }

      const res = await api.post(`/batch/updateBatch`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res) {
        const batch = res?.data?.batch;
        const batchId = batch?.batchId;
        const userId = user?._id;
        const combinedId = `${batchId}_${userId}`;
        let farmdata;

        try {
          const now = new Date().toISOString();
          if (user?.role?.label === 'Farm Inspection') {
            const url = toUpdate
              ? `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/updateInspector/${combinedId}`
              : `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addInspector`;
            const method = toUpdate ? axios.put : axios.post;

            farmdata = await method(url, {
              batchId,
              farmInspectionId: combinedId,
              farmInspectionName: batch?.farmInspectionName,
              certificateNo: batch?.certificateNo,
              certificateFrom: batch?.certificateFrom,
              productName: batch?.productName,
              typeOfFertilizer: batch?.typeOfFertilizer,
              fertilizerUsed: batch?.fertilizerUsed,
              image: batch?.inspectedImages || ['nil'],
              farmInspectionStatus: batch?.inspectionStatus,
              farmInspectionCreatedAt: toUpdate ? batch?.createdAt : now,
              farmInspectionUpdatedAt: now,
              farmInspectionDeletedAt: toUpdate ? '00/00/0000' : now
            });
          }

          else if (user?.role?.label === 'Exporter') {
            const url = toUpdate
              ? `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/updateExporter/${combinedId}`
              : `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addExporter`;
            const method = toUpdate ? axios.put : axios.post;

            farmdata = await method(url, {
              batchId,
              exporterId: combinedId,
              exporterName: batch?.exporterName,
              coordinationAddress: batch?.coordinationAddress,
              shipName: batch?.shipName,
              shipNo: batch?.shipNo,
              departureDate: batch?.departureDate,
              estimatedDate: batch?.estimatedDate,
              exportedTo: batch?.exportedTo,
              exporterStatus: batch?.exportStatus,
              exporterCreated: toUpdate ? batch?.createdAt : now,
              exporterUpdated: now,
              exporterDeleted: toUpdate ? '00/00/0000' : now
            });
          }

          else if (user?.role?.label === 'Harvester') {
            const url = toUpdate
              ? `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/updateHarvester/${combinedId}`
              : `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addHarvester`;
            const method = toUpdate ? axios.put : axios.post;

            farmdata = await method(url, {
              batchId,
              harvestId: combinedId,
              harvesterName: batch?.harvesterName,
              cropSampling: batch?.cropSampling,
              temperatureLevel: batch?.temperatureLevel,
              humidityLevel: batch?.humidity,
              harvestStatus: batch?.harvestStatus,
              harvestCreatedAt: toUpdate ? batch?.createdAt : now,
              harvestUpdatedAt: now,
              harvestDeletedAt: toUpdate ? '00/00/0000' : now
            });
          }

          else if (user?.role?.label === 'Importer') {
            const url = toUpdate
              ? `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/updateImporter/${combinedId}`
              : `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addImporter`;
            const method = toUpdate ? axios.put : axios.post;

            farmdata = await method(url, {
              batchId,
              importerId: combinedId,
              importerName: batch?.importerName,
              quantity: batch?.quantityImported,
              shipStorage: batch?.shipStorage,
              arrivalDate: batch?.arrivalDate,
              warehouseLocation: batch?.warehouseLocation,
              warehouseArrivalDate: batch?.warehouseArrivalDate,
              importerAddress: batch?.importerAddress,
              importerStatus: batch?.importStatus,
              importerCreated: toUpdate ? batch?.createdAt : now,
              importerUpdated: now,
              importerDeleted: toUpdate ? '00/00/0000' : now
            });
          }

          else if (user?.role?.label === 'Processor') {
            const url = toUpdate
              ? `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/updateProcessor/${combinedId}`
              : `https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addProcessor`;
            const method = toUpdate ? axios.put : axios.post;

            farmdata = await method(url, {
              batchId,
              processorId: combinedId,
              processorName: batch?.processorName,
              price: batch?.price,
              quantity: batch?.quantityProcessed,
              processingMethod: batch?.processingMethod,
              packaging: batch?.packaging,
              packagedDate: batch?.packagedDate,
              warehouse: batch?.warehouse,
              warehouseLocation: batch?.warehouseAddress,
              destination: batch?.destination,
              processorStatus: batch?.processingStatus,
              processorCreated: toUpdate ? batch?.createdAt : now,
              processorUpdated: now,
              processorDeleted: toUpdate ? '00/00/0000' : now,
              image: batch?.images || ['nil']
            });
          }

          showSuccess('Submitted successfully');
          setIsCircularLoader(false);
          toggleForm();
          setToggle(!toggle);
          setImagePreviews([]);
          setInspectedImagePreviews([]);

        } catch (err) {
          setIsCircularLoader(false);
          console.error(err);
          showError('Failed to update batch.');
        }
      }

    } catch (error) {
      console.error("Outer try error:", error);
      setIsCircularLoader(false);
      showError('Something went wrong while submitting the form.');
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
            <option value="" disabled>Select Status</option>
            {options.slice(1).map((option, idx) => (
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
                {user?.role?.label === 'Farm Inspection' && (
                  <>
                    {renderInput('farmInspectionId', 'Farm Inspection Id', 'text', true)}
                    {renderInput('farmInspectionName', 'Farm Inspection Name', 'text', true)}
                    {renderInput('certificateNo', 'Certificate No')}
                    {renderInput('certificateFrom', 'Certificate From')}
                    {renderInput('productName', 'Product Name')}
                    {renderInput('typeOfFertilizer', 'Type of Fertilizer')}
                    {renderInput('fertilizerUsed', 'Fertilizer Used')}
                    {renderInput('inspectionStatus', 'Inspection Status', 'select', false, ['Select Status', 'Pending', 'Completed'])}


                    <div className='custom-file-upload'>
                      <label htmlFor='fruit-images' className='upload-button'>
                        {formData.inspectedImages.length === 0
                          ? 'Choose images'
                          : `${formData.inspectedImages.length} image ${formData.inspectedImages.length > 1 ? 's' : ''} selected`}
                      </label>
                      <input
                        id='fruit-images'
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleInspectedImageChange}
                        ref={inspectorFileInputRef}
                        className={styles.custom_file_input}
                      />
                    </div>

                    <div className='preview-container'>
                      {inspectedImagePreviews.map((src, idx) => (
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

                {user?.role?.label === 'Harvester' && (
                  <>
                    {renderInput('harvesterId', 'Harvester Id', 'text', true)}
                    {renderInput('harvesterName', 'Harvester Name', 'text', true)}
                    {renderInput('cropSampling', 'Crop Sampling')}
                    {renderInput('temperatureLevel', 'Temperature Level')}
                    {renderInput('humidity', 'Humidity')}
                    {renderInput('harvestStatus', 'Harvest Status', 'select', false, ['Select Status', 'Pending', 'Completed'])}
                  </>
                )}

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
                    {renderInput('exportStatus', 'Export Status', 'select', false, ['Select Status', 'Pending', 'Shipped'])}
                  </>
                )}

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
                    {renderInput('importStatus', 'Import Status', 'select', false, ['Select Status', 'Pending', 'Received'])}
                  </>
                )}

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
                    {renderInput('processingStatus', 'Processing Status', 'select', false, ['Select Status', 'Pending', 'Processed'])}

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
                        ref={processorFileInputRef}
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
                  <button type="button" onClick={toggleFormClose}>Cancel</button>
                  <button type="submit">{isCircularloader ? <CircularLoader size={18} /> : 'Submit'}</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      <div className={styles.batchesOverview}>
        <div className={styles.batchoverviewimagecontainer}>
          <img src={profileImage} alt='images' />
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
                        {batch?.farmInspectionId?.farmInspectionStatus === 'Completed' ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.farmInspectionId?.farmInspectionStatus !== 'Completed' ? (
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
                        {batch?.harvesterId?.harvestStatus === 'Completed' ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.farmInspectionId?.farmInspectionStatus === 'Completed' ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Harvester' && batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Harvester'
                                &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
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
                                user?.role?.label === 'Harvester'
                                &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Harvester' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.importerId?.importerStatus === 'Received' ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.harvesterId?.harvestStatus === 'Completed' ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Importer' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Importer'
                                &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
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
                                user?.role?.label === 'Importer'
                                &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Importer' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.exporterId?.exporterStatus === "Shipped" ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.importerId?.importerStatus === 'Received' ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Exporter' &&
                                  batch?.importerId?.importerStatus === 'Received' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Exporter'
                                &&
                                batch?.importerId?.importerStatus === 'Received' &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
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
                                user?.role?.label === 'Exporter'
                                &&
                                batch?.importerId?.importerStatus === 'Received' &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                ?
                                () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Exporter' &&
                                  batch?.importerId?.importerStatus === 'Received' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed'
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            Pending
                          </button>
                        )}
                      </td>
                      <td>
                        {batch?.processorId?.processorStatus === 'Processed' ? (
                          <button className={styles.completeBtn}>Complete</button>
                        ) : batch?.exporterId?.exporterStatus === 'Shipped' ? (
                          <button
                            className={styles.progressBtn}
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Processor' &&
                                  batch?.importerId?.importerStatus === 'Received' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed' &&
                                  batch?.exporterId?.exporterStatus === 'Shipped'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: hoveredBatchId === batch?.batchId ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                            onClick={
                              !userdata &&
                                user?.role?.label === 'Processor'
                                &&
                                batch?.importerId?.importerStatus === 'Received' &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed' &&
                                batch?.exporterId?.exporterStatus === 'Shipped'
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
                                user?.role?.label === 'Processor'
                                &&
                                batch?.importerId?.importerStatus === 'Received' &&
                                batch?.harvesterId?.harvestStatus === 'Completed' &&
                                batch?.farmInspectionId?.farmInspectionStatus === 'Completed' &&
                                batch?.exporterId?.exporterStatus === 'Shipped'
                                ? () => toggleForm(batch?.batchId)
                                : undefined
                            }
                            style={{
                              cursor: userdata
                                ? 'not-allowed'
                                : user?.role?.label === 'Processor' &&
                                  batch?.importerId?.importerStatus === 'Received' &&
                                  batch?.harvesterId?.harvestStatus === 'Completed' &&
                                  batch?.farmInspectionId?.farmInspectionStatus === 'Completed' &&
                                  batch?.exporterId?.exporterStatus === 'Shipped'
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
                          <img src={view} alt='images' />
                        </button>
                      </td>
                    </tr>
                  ))
                  :
                  <td colSpan="7" className={styles.noData}>{isCircularloader ? <CircularLoader size={20} /> : 'No Data Available'}</td>
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
        © 2025 Food SupplyChain by <a href="https://bastionex.net/" target="_blank" rel="noopener noreferrer">Bastionex Infotech Pvt Ltd</a>
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
