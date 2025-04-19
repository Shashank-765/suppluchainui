import React, { useEffect, useState } from 'react';
import styles from './UserDashboard.module.css';
import axios from 'axios';
import profileImage from '../../Imges/portrait-322470_1280.jpg';

function UserDashBoard() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [showForm, setShowForm] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [usersPerPage] = useState(6);
  const [currnetBatchPage, setCurrentBatchPage] = useState(1);
  const [searchBatchTerm, setSearchBatchTerm] = useState('');
  const [totalBatchPage, setTotalBatchPage] = useState(0);

  const [formData, setFormData] = useState({
    batchId: '',
    // Common fields
    farmInspectionId: '',
    farmInspectionName: '',
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
  });


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
      const response = await axios.get(`http://localhost:5000/api/users/getBatchByUserId?id=${user?._id}`, {
        params: {
          page: currnetBatchPage,
          limit: usersPerPage,
          search: searchBatchTerm,
        },
      });

      if (response.data) {
        console.log(response.data);

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
      console.log(formData, 'formData');
      const res = await axios.post('http://localhost:5000/api/users/updateBatch', formData);
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
              <p>📱 Contact No</p>
              <span>{user?.contact}</span>
            </div>
            <div className={styles.roleInfo}>
              <p>👤 Role</p>
              <span
                className={
                  user.role.className
                    .split(' ')
                    .map(cn => styles[cn])
                    .join(' ')
                }
              >
                {user?.role?.slug}
              </span>
            </div>
            <div className={styles.settings}>
              <span>⚙ Settings</span>
              <button className={styles.editBtn} >
                Edit
              </button>
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
                  <label>Certificate No: <input type="text" name="certificateNo" value={formData.certificateNo} onChange={handleChange} /></label>
                  <label>Certificate From: <input type="text" name="certificateFrom" value={formData.certificateFrom} onChange={handleChange} /></label>
                  <label>Type of Fertilizer: <input type="text" name="typeOfFertilizer" value={formData.typeOfFertilizer} onChange={handleChange} /></label>
                  <label>Fertilizer Used: <input type="text" name="fertilizerUsed" value={formData.fertilizerUsed} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Harvester' && (
                <>
                  <label>Crop Sampling: <input type="text" name="cropSampling" value={formData.cropSampling} onChange={handleChange} /></label>
                  <label>Temperature Level: <input type="text" name="temperatureLevel" value={formData.temperatureLevel} onChange={handleChange} /></label>
                  <label>Humidity: <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} /></label>
                </>
              )}

              {user?.role?.label === 'Exporter' && (
                <>
                  <label>Exporter ID: <input type="text" name="exporterId" value={formData.exporterId} onChange={handleChange} /></label>
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
                  <label>Importer ID: <input type="text" name="importerId" value={formData.importerId} onChange={handleChange} /></label>
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
                  <label>Processor ID: <input type="text" name="processorId" value={formData.processorId} onChange={handleChange} /></label>
                  <label>Quantity: <input type="text" name="quantityProcessed" value={formData.quantityProcessed} onChange={handleChange} /></label>
                  <label>Processing Method: <input type="text" name="processingMethod" value={formData.processingMethod} onChange={handleChange} /></label>
                  <label>Packaging: <input type="text" name="packaging" value={formData.packaging} onChange={handleChange} /></label>
                  <label>Packaged Date: <input type="date" name="packagedDate" value={formData.packagedDate} onChange={handleChange} /></label>
                  <label>Warehouse: <input type="text" name="warehouse" value={formData.warehouse} onChange={handleChange} /></label>
                  <label>Warehouse Address: <input type="text" name="warehouseAddress" value={formData.warehouseAddress} onChange={handleChange} /></label>
                  <label>Destination: <input type="text" name="destination" value={formData.destination} onChange={handleChange} /></label>
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

                        (batch?.tracking?.isProcessed && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                           (batch?.tracking?.isProcessed || batch?.tracking?.isImported || batch?.tracking?.isHarvested || batch?.tracking?.isExported || batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: user?.role?.label === 'Farm Inspection' ? 'pointer' : 'not-allowed'
                              }}
                              onClick={user?.role?.label === 'Farm Inspection' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                           :
                            <button
                              className={styles.pendingBtn}
                              onClick={user?.role?.label === 'Farm Inspection' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: user?.role?.label === 'Farm Inspection' ? 'pointer' : 'not-allowed',
                                backgroundColor: user?.role?.label === 'Farm Inspection' ? '' : '#bc9993',
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

                        (batch?.tracking?.isProcessed && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted)? <button
                          className={styles.completeBtn}
                        >Complete</button> :


                          (batch?.tracking?.isProcessed || batch?.tracking?.isImported || batch?.tracking?.isHarvested || batch?.tracking?.isExported || batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: user?.role?.label === 'Harvester' ? 'pointer' : 'not-allowed'
                              }}
                              onClick={user?.role?.label === 'Harvester' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                           :
                            <button
                              className={styles.pendingBtn}
                              onClick={user?.role?.label === 'Harvester' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: user?.role?.label === 'Harvester' ? 'pointer' : 'not-allowed',
                                backgroundColor: user?.role?.label === 'Harvester' ? '' : '#bc9993',
                              }}

                            >
                              Pending
                            </button>
                          

                      }
                    </td>
                    <td>
                      {/* {batch?.importerName} */}
                      {

                       (batch?.tracking?.isProcessed && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                           (batch?.tracking?.isProcessed || batch?.tracking?.isImported || batch?.tracking?.isHarvested || batch?.tracking?.isExported || batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: user?.role?.label === 'Importer' ? 'pointer' : 'not-allowed'
                              }}
                              onClick={user?.role?.label === 'Importer' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                           :
                            <button
                              className={styles.pendingBtn}
                              onClick={user?.role?.label === 'Importer' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: user?.role?.label === 'Importer' ? 'pointer' : 'not-allowed',
                                backgroundColor: user?.role?.label === 'Importer' ? '' : '#bc9993',
                              }}

                            >
                              Pending
                            </button>

                      }
                    </td>
                    <td>
                      {/* {batch?.exporterName} */}
                      {

                       (batch?.tracking?.isProcessed && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                         (batch?.tracking?.isProcessed || batch?.tracking?.isImported || batch?.tracking?.isHarvested || batch?.tracking?.isExported || batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: user?.role?.label === 'Exporter' ? 'pointer' : 'not-allowed'
                              }}
                              onClick={user?.role?.label === 'Exporter' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                           :
                            <button
                              className={styles.pendingBtn}
                              onClick={user?.role?.label === 'Exporter' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: user?.role?.label === 'Exporter' ? 'pointer' : 'not-allowed',
                                backgroundColor: user?.role?.label === 'Exporter' ? '' : '#bc9993',
                              }}

                            >
                              Pending
                            </button>

                      }
                    </td>
                    <td>
                      {/* {batch?.processorName} */}
                      {

                       (batch?.tracking?.isProcessed && batch?.tracking?.isImported && batch?.tracking?.isHarvested && batch?.tracking?.isExported && batch?.tracking?.isInspexted) ? <button
                          className={styles.completeBtn}
                        >Complete</button> :
                           (batch?.tracking?.isProcessed || batch?.tracking?.isImported || batch?.tracking?.isHarvested || batch?.tracking?.isExported || batch?.tracking?.isInspexted) ?
                            <button
                              className={styles.progressBtn}
                              style={{
                                cursor: user?.role?.label === 'Processor' ? 'pointer' : 'not-allowed'
                              }}
                              onClick={user?.role?.label === 'Processor' ? () => toggleForm(batch?.batchId) : undefined}
                            >Progress</button>
                           :
                            <button
                              className={styles.pendingBtn}
                              onClick={user?.role?.label === 'Processor' ? () => toggleForm(batch?.batchId) : undefined}
                              style={{
                                cursor: user?.role?.label === 'Processor' ? 'pointer' : 'not-allowed',
                                backgroundColor: user?.role?.label === 'Processor' ? '' : '#bc9993',
                              }}

                            >
                              Pending
                            </button>
                      }
                    </td>
                    <td><button className={styles.viewBtn}>View</button></td>
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
