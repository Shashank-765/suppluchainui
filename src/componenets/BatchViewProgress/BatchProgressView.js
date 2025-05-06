import React, { useEffect, useState } from "react";
import api from '../../axios'
import certificqte from '../../Imges/certificqte.jpg'
import check from '../../Imges/check.png'
import No from '../../Imges/no.png'
import styles from "./BatchProgressView.module.css";
import leftarrow from '../../Imges/left-chevron.png'
import rightarrow from '../../Imges/right-chevron.png'
import { useLocation } from "react-router-dom";
import axios from "axios";
const BatchProgressView = () => {
  const location = useLocation();
  const { batch } = location.state || {};
  // console.log(batch, 'this is batch data')
  const [allBatch, setAllBatch] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState(null);
  const [harvesterData, setHarvesterData] = useState(null);
  const [exporterData, setExporterData] = useState(null);
  const [importerData, setImporterData] = useState(null);
  const [processorData, setProcessorData] = useState(null);
  const [inspectorData, setInspectorData] = useState(null);

  const openQrModal = (qr) => {
    setSelectedQr(qr);
    setQrModalOpen(true);
  };
  const closeQrModal = () => {
    setQrModalOpen(false);
    setSelectedQr(null);
  };

  const [imageIndex, setImageIndex] = useState(0);
  const [inspectedIndex, setInspectedIndex] = useState(0);
  const images = allBatch?.tracking?.images || [];
  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  const inspectedImages = allBatch?.tracking?.inspectedImages || [];
  const nextInspected = () => {
    setInspectedIndex((prev) => (prev + 1) % inspectedImages.length);
  };
  const prevInspected = () => {
    setInspectedIndex((prev) => (prev - 1 + inspectedImages.length) % inspectedImages.length);
  };


  const fetchBatchById = async () => {
    try {
      const response = await api.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/batch/${batch?.batchId}`);
      const data = response?.data;

      if (data) {
        setAllBatch(data);
        const batchId = data.batchId;

        const responses = await Promise.allSettled([
          axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/harvester/${batchId}_${data.harvesterId}`),
          axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/exporter/${batchId}_${data.exporterId}`),
          axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/importer/${batchId}_${data.importerId}`),
          axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/processor/${batchId}_${data.processorId}`),
          axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/farmInspector/${batchId}_${data.farmInspectionId}`)
        ]);

        const [harvesterRes, exporterRes, importerRes, processorRes, inspectorRes] = responses;

        if (harvesterRes.status === 'fulfilled') setHarvesterData(harvesterRes.value.data);

        if (exporterRes.status === 'fulfilled') setExporterData(exporterRes.value.data);

        if (importerRes.status === 'fulfilled') setImporterData(importerRes.value.data);

        if (processorRes.status === 'fulfilled') setProcessorData(processorRes.value.data);

        if (inspectorRes.status === 'fulfilled') setInspectorData(inspectorRes.value.data);

      }
    } catch (error) {
      console.error('Error fetching batch or related data:', error);
    }
  };

  useEffect(() => {
    fetchBatchById();
  }, [])
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Batch Progress for {allBatch?.coffeeType}</h2>
      <p className={styles.subtitle}>
        Batch No: {allBatch?.batchId} <br />
      </p>

      <div className={styles.timeline}>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {allBatch?.farmerRegNo ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Cultivation</h3>
            {allBatch.qrCode && (
              <img
                src={allBatch.qrCode}
                alt="QR Code"
                className={styles.qrCode}
                onClick={() => openQrModal(batch.qrCode)}
              />
            )}
            <p><span className={styles.batchesheading}>Registration No:</span><span className={styles.batchesdatavalue}> {allBatch?.farmerRegNo}</span></p>
            <p><span className={styles.batchesheading}>Farmer Name:</span><span className={styles.batchesdatavalue}> {allBatch?.farmerName}</span></p>
            <p><span className={styles.batchesheading}>Farm Address:</span><span className={styles.batchesdatavalue}> {allBatch?.farmerAddress}</span></p>
            <p><span className={styles.batchesheading}>Inspector Name:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionName}</span></p>
            <p><span className={styles.batchesheading}>Harvester Name:</span><span className={styles.batchesdatavalue}> {allBatch?.harvesterName}</span></p>
            <p><span className={styles.batchesheading}>Importer Name:</span><span className={styles.batchesdatavalue}> {allBatch?.importerName}</span></p>
            <p><span className={styles.batchesheading}>Exporter Name:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterName}</span></p>
            <p><span className={styles.batchesheading}>Processor Name:</span><span className={styles.batchesdatavalue}> {allBatch?.processorName}</span></p>

            <img
              src={certificqte}
              alt="Decorative"
              className={styles.bottomImage}
            />

          </div>
        </div>

        {qrModalOpen && (
          <div className={styles.qrModalOverlay} onClick={closeQrModal}>
            <div className={styles.qrModal} onClick={(e) => e.stopPropagation()}>
              <img src={selectedQr} alt="Full QR Code" className={styles.qrModalImg} />
              <button onClick={closeQrModal} className={styles.closeBtn}>×</button>
            </div>
          </div>
        )}


        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {inspectorData?.certificateFrom ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div className={styles.boxinnerside}>
              <h3>Farm Inspector</h3>
              <p><span className={styles.batchesheading}>Farm Inspector Id:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionId}</span></p>
              <p><span className={styles.batchesheading}>Certificate No:</span><span className={styles.batchesdatavalue}>{inspectorData?.certificateNo}</span></p>
              <p><span className={styles.batchesheading}>Certificate From:</span><span className={styles.batchesdatavalue}>{inspectorData?.certificateFrom}</span></p>
              <p><span className={styles.batchesheading}>Type of Fertilizer:</span><span className={styles.batchesdatavalue}> {inspectorData?.typeOfFertilizer}</span></p>
              <p><span className={styles.batchesheading}>Fertilizer Used:</span><span className={styles.batchesdatavalue}> {inspectorData?.fertilizerUsed}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.tracking?.images?.length > 0 && (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevImage}><img src={leftarrow} alt='images' /></button>
                    <button className={styles.navButton} onClick={nextImage}><img src={rightarrow} alt='images' /></button>
                  </div>
                  <div className={styles.sliderContainer}>
                    {allBatch.tracking.images.map((img, idx) => {
                      let positionClass = styles.hidden;
                      if (idx === imageIndex) positionClass = styles.current;
                      else if (idx === imageIndex + 1) positionClass = styles.next;
                      else if (idx === imageIndex - 1) positionClass = styles.prev;

                      return (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${img}`}
                          alt={`image-${idx}`}
                          className={`${styles.carouselImage} ${positionClass}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {harvesterData?.harvestStatus ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Harvester</h3>
            <p><span className={styles.batchesheading}>Harvester Id:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId}</span></p>
            <p><span className={styles.batchesheading}>Crop Sampling:</span><span className={styles.batchesdatavalue}>{harvesterData?.cropSampling}</span></p>
            <p><span className={styles.batchesheading}>Temperature Level:</span><span className={styles.batchesdatavalue}>{harvesterData?.temperatureLevel}</span></p>
            <p><span className={styles.batchesheading}>Humidity:</span><span className={styles.batchesdatavalue}>{harvesterData?.humidityLevel}</span></p>
          </div>
        </div>



        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {importerData?.importerStatus ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Importer</h3>
            <p><span className={styles.batchesheading}>Importer ID:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId}</span></p>
            <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {importerData?.quantity}</span></p>
            <p><span className={styles.batchesheading}>Ship Storage:</span><span className={styles.batchesdatavalue}> {importerData?.shipStorage}</span></p>
            <p><span className={styles.batchesheading}>Arrival Date:</span><span className={styles.batchesdatavalue}> {importerData?.arrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Location:</span><span className={styles.batchesdatavalue}>{importerData?.warehouseLocation}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Arrival Date:</span><span className={styles.batchesdatavalue}> {importerData?.warehouseArrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Importer Address:</span><span className={styles.batchesdatavalue}>{importerData?.importerAddress}</span></p>
          </div>
        </div>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {exporterData?.exporterStatus ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Exporter</h3>
            <p><span className={styles.batchesheading}>Exporter ID:</span><span className={styles.batchesdatavalue}>{allBatch?.exporterId}</span></p>
            <p><span className={styles.batchesheading}>Coordination Address:</span><span className={styles.batchesdatavalue}> {exporterData?.coordinationAddress}</span></p>
            <p><span className={styles.batchesheading}>Ship Name:</span><span className={styles.batchesdatavalue}>{exporterData?.shipName}</span></p>
            <p><span className={styles.batchesheading}>Ship No:</span><span className={styles.batchesdatavalue}> {exporterData?.shipNo}</span></p>
            <p><span className={styles.batchesheading}>Departure Date:</span><span className={styles.batchesdatavalue}> {exporterData?.departureDate}</span></p>
            <p><span className={styles.batchesheading}>Estimated Date:</span><span className={styles.batchesdatavalue}> {exporterData?.estimatedDate}</span></p>
            <p><span className={styles.batchesheading}>Exported To:</span><span className={styles.batchesdatavalue}> {exporterData?.exportedTo}</span></p>
          </div>
        </div>


        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {processorData?.processorStatus ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div>
              <h3>Processor</h3>
              <p><span className={styles.batchesheading}>Processor ID:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId}</span></p>
              <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {processorData?.quantity}</span></p>
              <p><span className={styles.batchesheading}>Processing Method:</span><span className={styles.batchesdatavalue}> {processorData?.processingMethod}</span></p>
              <p><span className={styles.batchesheading}>Packaging:</span><span className={styles.batchesdatavalue}> {processorData?.packaging}</span></p>
              <p><span className={styles.batchesheading}>Packaged Date:</span><span className={styles.batchesdatavalue}>{processorData?.packagedDate}</span></p>
              <p><span className={styles.batchesheading}>Warehouse:</span><span className={styles.batchesdatavalue}>{processorData?.warehouse}</span></p>
              <p><span className={styles.batchesheading}>Warehouse Address:</span><span className={styles.batchesdatavalue}> {processorData?.warehouseLocation}</span></p>
              <p><span className={styles.batchesheading}>Destination:</span><span className={styles.batchesdatavalue}> {processorData?.destination}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.tracking?.inspectedImages?.length > 0 && (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevInspected}><img src={leftarrow} alt='images' /></button>
                    <button className={styles.navButton} onClick={nextInspected}><img src={rightarrow} alt='images' /></button>
                  </div>
                  <div className={styles.sliderContainer}>
                    {allBatch.tracking.inspectedImages.map((img, idx) => {
                      let positionClass = styles.hidden;
                      if (idx === inspectedIndex) positionClass = styles.current;
                      else if (idx === inspectedIndex + 1) positionClass = styles.next;
                      else if (idx === inspectedIndex - 1) positionClass = styles.prev;

                      return (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${img}`}
                          alt={`inspected-${idx}`}
                          className={`${styles.carouselImage} ${positionClass}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProgressView;
