import React, { useEffect, useState } from "react";

import certificqte from '../../Imges/certificqte.jpg'
import check from '../../Imges/check.png'
import No from '../../Imges/no.png'
import styles from "./BatchProgressView.module.css";
import leftarrow from '../../Imges/left-chevron.png'
import rightarrow from '../../Imges/right-chevron.png'
import axios from "axios";
import { useLocation } from "react-router-dom";
const BatchProgressView = () => {
  const location = useLocation();
  const { batch } = location.state || {};

  const [allBatch, setAllBatch] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState(null);

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


  const fetchbatchbyid = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/batch/getBatchById?id=${batch?.batchId}`);

      if (response.data) {
        setAllBatch(response?.data?.batch);
      }
    } catch (error) {
      console.error('Error fetching batch:', error);
    }
  }
  useEffect(() => {
    fetchbatchbyid();
  }, [])
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Batch Progress</h2>
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
            {allBatch?.tracking?.isInspexted ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div className={styles.boxinnerside}>
              <h3>Farm Inspector</h3>
              <p><span className={styles.batchesheading}>Farm Inspector Id:</span><span className={styles.batchesdatavalue}>{allBatch?.farmInspectionId}</span></p>
              <p><span className={styles.batchesheading}>Certificate No:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.certificateNo}</span></p>
              <p><span className={styles.batchesheading}>Certificate From:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.certificateFrom}</span></p>
              <p><span className={styles.batchesheading}>Type of Fertilizer:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.typeOfFertilizer}</span></p>
              <p><span className={styles.batchesheading}>Fertilizer Used:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.fertilizerUsed}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.tracking?.images?.length > 0 && (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevImage}><img src={leftarrow} /></button>
                    <button className={styles.navButton} onClick={nextImage}><img src={rightarrow} /></button>
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
            {allBatch?.tracking?.isHarvested ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Harvester</h3>
            <p><span className={styles.batchesheading}>Harvester Id:</span><span className={styles.batchesdatavalue}>{allBatch?.harvesterId}</span></p>
            <p><span className={styles.batchesheading}>Crop Sampling:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.cropSampling}</span></p>
            <p><span className={styles.batchesheading}>Temperature Level:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.temperatureLevel}</span></p>
            <p><span className={styles.batchesheading}>Humidity:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.humidity}</span></p>
          </div>
        </div>



        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {allBatch?.tracking?.isImported ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Importer</h3>
            <p><span className={styles.batchesheading}>Importer ID:</span><span className={styles.batchesdatavalue}> {allBatch?.importerId}</span></p>
            <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.quantityImported}</span></p>
            <p><span className={styles.batchesheading}>Ship Storage:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.shipStorage}</span></p>
            <p><span className={styles.batchesheading}>Arrival Date:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.arrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Location:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.warehouseLocation}</span></p>
            <p><span className={styles.batchesheading}>Warehouse Arrival Date:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.warehouseArrivalDate}</span></p>
            <p><span className={styles.batchesheading}>Importer Address:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.importerAddress}</span></p>
          </div>
        </div>

        <div className={`${styles.timelineItem} ${styles.left}`}>
          <div className={styles.circle}>
            {allBatch?.tracking?.isExported ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box}>
            <h3>Exporter</h3>
            <p><span className={styles.batchesheading}>Exporter ID:</span><span className={styles.batchesdatavalue}>{allBatch?.exporterId}</span></p>
            <p><span className={styles.batchesheading}>Coordination Address:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.coordinationAddress}</span></p>
            <p><span className={styles.batchesheading}>Ship Name:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.shipName}</span></p>
            <p><span className={styles.batchesheading}>Ship No:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.shipNo}</span></p>
            <p><span className={styles.batchesheading}>Departure Date:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.departureDate}</span></p>
            <p><span className={styles.batchesheading}>Estimated Date:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.estimatedDate}</span></p>
            <p><span className={styles.batchesheading}>Exported To:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.exportedTo}</span></p>
          </div>
        </div>


        <div className={`${styles.timelineItem} ${styles.right}`}>
          <div className={styles.circle2}>
            {allBatch?.tracking?.isProcessed ?
              <img src={check} alt="Checked" className={styles.checkIcon} />
              :
              <img src={No} alt="Not Checked" className={styles.checkIcon} />
            }
          </div>
          <div className={styles.box1}>
            <div>
              <h3>Processor</h3>
              <p><span className={styles.batchesheading}>Processor ID:</span><span className={styles.batchesdatavalue}> {allBatch?.processorId}</span></p>
              <p><span className={styles.batchesheading}>Quantity:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.quantityProcessed}</span></p>
              <p><span className={styles.batchesheading}>Processing Method:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.processingMethod}</span></p>
              <p><span className={styles.batchesheading}>Packaging:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.packaging}</span></p>
              <p><span className={styles.batchesheading}>Packaged Date:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.packagedDate}</span></p>
              <p><span className={styles.batchesheading}>Warehouse:</span><span className={styles.batchesdatavalue}>{allBatch?.tracking?.warehouse}</span></p>
              <p><span className={styles.batchesheading}>Warehouse Address:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.warehouseAddress}</span></p>
              <p><span className={styles.batchesheading}>Destination:</span><span className={styles.batchesdatavalue}> {allBatch?.tracking?.destination}</span></p>
            </div>
            <div className={styles.imgecontainer}>
              {allBatch?.tracking?.inspectedImages?.length > 0 && (
                <div className={styles.carouselWrapper}>
                  <div className={styles.arrowContainer}>
                    <button className={styles.navButton} onClick={prevInspected}><img src={leftarrow} /></button>
                    <button className={styles.navButton} onClick={nextInspected}><img src={rightarrow} /></button>
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
