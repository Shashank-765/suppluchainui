import React, { useEffect, useState, useRef } from "react";
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
  const [allBatch, setAllBatch] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState(null);
  const qrImageRef = useRef(null);
  const openQrModal = (qr) => {
    setSelectedQr(qr);
    setQrModalOpen(true);
  };
  const closeQrModal = () => {
    setQrModalOpen(false);
    setSelectedQr(null);
  };
  const downloadQrImage = () => {
    const imageElement = qrImageRef.current;
    if (!imageElement) return;
    const imageURL = imageElement.src;

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const [imageIndex, setImageIndex] = useState(0);
  const [inspectedIndex, setInspectedIndex] = useState(0);
  const images = allBatch?.processorId?.image || [];
  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  const inspectedImages = allBatch?.farmInspectionId?.image || [];
  const nextInspected = () => {
    setInspectedIndex((prev) => (prev + 1) % inspectedImages.length);
  };
  const prevInspected = () => {
    setInspectedIndex((prev) => (prev - 1 + inspectedImages.length) % inspectedImages.length);
  };


  const fetchBatchById = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND2_URL}/batch/${batch?.batchId}`);
      const data = response?.data;

      if (data) {
        setAllBatch(data);
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
              <img src={selectedQr} ref={qrImageRef} alt="Full QR Code" className={styles.qrModalImg} />
              <button onClick={closeQrModal} className={styles.closeBtn}>×</button>
              <button onClick={downloadQrImage} className={styles.qrDownloadButton}>
                Download
              </button>
            </div>
          </div>
        )}


        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {allBatch?.farmInspectionId?.farmInspectionStatus === 'Completed' ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div className={styles.boxinnerside}>
              <h3>Farm Inspector</h3>
              <p><span className={styles.batchesheading}>Id:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionId?.farmInspectionId?.split('_')[1] || allBatch?.farmInspectionId?.id?.split('_')[1]}</span></p>
              <p><span className={styles.batchesheading}>Certificate No:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionId?.certificateNo}</span></p>
              <p><span className={styles.batchesheading}>Certificate From:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionId?.certificateFrom}</span></p>
              <p><span className={styles.batchesheading}>Type of Fertilizer:</span><span className={styles.batchesdatavalue}> {allBatch?.farmInspectionId?.typeOfFertilizer}</span></p>
              <p><span className={styles.batchesheading}>Fertilizer Used:</span><span className={styles.batchesdatavalue}> {allBatch?.farmInspectionId?.fertilizerUsed}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.farmInspectionId?.image?.length > 0 && allBatch?.farmInspectionId?.image[0] !== 'nil' ? (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevInspected}><img src={leftarrow} alt='images' /></button>
                    <button className={styles.navButton} onClick={nextInspected}><img src={rightarrow} alt='images' /></button>
                  </div>
                  <div className={styles.sliderContainer}>
                    {allBatch.farmInspectionId.image.map((img, idx) => {
                      let positionClass = styles.hidden;
                      if (idx === inspectedIndex) positionClass = styles.current;
                      else if (idx === inspectedIndex + 1) positionClass = styles.next;
                      else if (idx === inspectedIndex - 1) positionClass = styles.prev;

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
              ) : ''}
            </div>

          </div>
        </div>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {allBatch?.harvesterId?.harvestStatus === 'Completed' ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Harvester</h3>
            <p><span className={styles.batchesheading}>Id:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId?.harvestId?.split('_')[1] || allBatch?.harvesterId?.id?.split('_')[1]}</span></p>
            <p><span className={styles.batchesheading}>Crop Sampling:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId?.cropSampling}</span></p>
            <p><span className={styles.batchesheading}>Temperature Level:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId?.temperatureLevel}</span></p>
            <p><span className={styles.batchesheading}>Humidity:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId?.humidityLevel}</span></p>
          </div>
        </div>



        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {allBatch?.importerId?.importerStatus === 'Received' ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Importer</h3>
            <p><span className={styles.batchesheading}>Id:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId?.importerId?.split('_')[1] || allBatch?.importerId?.id?.split('_')[1]}</span></p>
            <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId?.quantity}</span></p>
            <p><span className={styles.batchesheading}>Ship Storage:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId?.shipStorage}</span></p>
            <p><span className={styles.batchesheading}>Arrival Date:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId?.arrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Location:</span><span className={styles.batchesdatavalue}>{allBatch?.importerId?.warehouseLocation}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Arrival Date:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId?.warehouseArrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Importer Address:</span><span className={styles.batchesdatavalue}>{allBatch?.importerId?.importerAddress}</span></p>
          </div>
        </div>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {allBatch?.exporterId?.exporterStatus === 'Shipped' ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Exporter</h3>
            <p><span className={styles.batchesheading}>Id:</span><span className={styles.batchesdatavalue}>{allBatch?.exporterId?.exporterId?.split('_')[1] || allBatch?.exporterId?.id?.split('_')[1]}</span></p>
            <p><span className={styles.batchesheading}>Coordination Address:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterId?.coordinationAddress}</span></p>
            <p><span className={styles.batchesheading}>Ship Name:</span><span className={styles.batchesdatavalue}>{allBatch?.exporterId?.shipName}</span></p>
            <p><span className={styles.batchesheading}>Ship No:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterId?.shipNo}</span></p>
            <p><span className={styles.batchesheading}>Departure Date:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterId?.departureDate}</span></p>
            <p><span className={styles.batchesheading}>Estimated Date:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterId?.estimatedDate}</span></p>
            <p><span className={styles.batchesheading}>Exported To:</span><span className={styles.batchesdatavalue}> {allBatch?.exporterId?.exportedTo}</span></p>
          </div>
        </div>


        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {allBatch?.processorId?.processorStatus === 'Processed' ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div>
              <h3>Processor</h3>
              <p><span className={styles.batchesheading}>Id:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.processorId?.split('_')[1] || allBatch?.processorId?.id?.split('_')[1]}</span></p>
              <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.quantity}</span></p>
              <p><span className={styles.batchesheading}>Processing Method:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.processingMethod}</span></p>
              <p><span className={styles.batchesheading}>Packaging:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.packaging}</span></p>
              <p><span className={styles.batchesheading}>Packaged Date:</span><span className={styles.batchesdatavalue}>{allBatch?.processorId?.packagedDate}</span></p>
              <p><span className={styles.batchesheading}>Warehouse:</span><span className={styles.batchesdatavalue}>{allBatch?.processorId?.warehouse}</span></p>
              <p><span className={styles.batchesheading}>Warehouse Address:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.warehouseLocation}</span></p>
              <p><span className={styles.batchesheading}>Destination:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId?.destination}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.processorId?.image?.length > 0 && allBatch?.processorId?.image[0] !== 'nil' ? (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevImage}><img src={leftarrow} alt='images' /></button>
                    <button className={styles.navButton} onClick={nextImage}><img src={rightarrow} alt='images' /></button>
                  </div>
                  <div className={styles.sliderContainer}>
                    {allBatch?.processorId?.image.map((img, idx) => {
                      let positionClass = styles.hidden;
                      if (idx === imageIndex) positionClass = styles.current;
                      else if (idx === imageIndex + 1) positionClass = styles.next;
                      else if (idx === imageIndex - 1) positionClass = styles.prev;

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
              ) : ''}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProgressView;
