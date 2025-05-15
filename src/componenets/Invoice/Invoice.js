import React from 'react'
import './Invoice.css'
import axios from 'axios';
import { useEffect, useState } from 'react'
import CircularLoader from '../CircularLoader/CircularLoader'
import qrcode from '../../Imges/qrcode.jpg'
import { useNavigate } from 'react-router-dom'
import { usePDF } from 'react-to-pdf';
function Invoice() {

  const [invoiceData, setInvoiceData] = useState(null);
  const [processordata, setProcessordata] = useState(null);
  const [isCircularloader, setIsCircularLoader] = useState(false);
  useEffect(() => {
    const storedData = sessionStorage.getItem('invoiceData');
    if (storedData) {
      setInvoiceData(JSON.parse(storedData));
    } else {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!invoiceData) return;

    const fetchprocessordetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND2_URL}/processor/${invoiceData.batchId + '_' + invoiceData.sellerId}`);
        console.log(response.data, 'this is data of processor');
        setProcessordata(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchprocessordetails();
  }, [invoiceData]);

  useEffect(() => {
    if (!invoiceData || !processordata) return;

    const fetchSession = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (!sessionId) return;

      try {
        const session = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/stripe/getsession/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
          },
        }).then(res => res.data);

        // 1. Log buy transaction
        try {
          const data = await axios.post(`${process.env.REACT_APP_BACKEND2_URL}/buy`, {
            transactionId: session.payment_intent,
            buyerId: invoiceData.buyerId,
            batchId: invoiceData.batchId,
            sellerId: invoiceData.sellerId,
            quantity: invoiceData.quantity,
            price: invoiceData.price,
            buyStatus: 'completed',
            buyCreated: new Date().toISOString(),
            buyUpdated: new Date().toISOString()
          });
          console.log(data, 'buy data');
        } catch (error) {
          console.log('Buy API error:', error);
        }

        // 2. Update processor
        let purchaseQuantity = parseFloat(invoiceData.quantity);
        if (invoiceData.unit === 'kg') {
          purchaseQuantity = purchaseQuantity / 100;
        }
        const storeQuantity = processordata.quantity - purchaseQuantity;

        try {
          const processorquantity = await axios.put(`${process.env.REACT_APP_BACKEND2_URL}/updateProcessor/${invoiceData.batchId}_${invoiceData.sellerId}`, {
            batchId: invoiceData.batchId,
            processorId: invoiceData.sellerId,
            processorName: processordata.processorName,
            price: invoiceData.realprice,
            quantity: storeQuantity.toString(),
            processingMethod: processordata.processingMethod,
            packaging: processordata.packaging,
            packagedDate: processordata.packagedDate,
            warehouse: processordata.warehouse,
            warehouseLocation: processordata.warehouseLocation,
            destination: processordata.destination,
            processorStatus: processordata.processorStatus,
            processorCreated: processordata.processorCreated,
            processorUpdated: processordata.processorUpdated,
            processorDeleted: processordata.processorDeleted,
            image: processordata.image || []
          });
          console.log(processorquantity, 'processor updated');
        } catch (error) {
          console.log('Update Processor API error:', error);
        }

      } catch (err) {
        console.error('Failed to fetch session:', err);
      }
    };

    fetchSession();
  }, [invoiceData, processordata]);




  const { toPDF, targetRef } = usePDF({ filename: 'invoice.pdf' });
  const navigate = useNavigate();


  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  const handlePrint = () => {
    setIsCircularLoader(true);
    toPDF().then(() => {
      setIsCircularLoader(false);
      navigate('/product')
    })
    setIsCircularLoader(false);
  };

  const { quantity, price, realprice, productname, unit } = invoiceData;

  return (
    <div>
      <div className="invoice-container" ref={targetRef}>
        <header className="invoice-header">
          <div className="brand">
            <h1>INVOICE</h1>
            <p>
              Agriculture Supply Chain <br /> Management Invoice
            </p>
          </div>
          <div className="blockchain-details">
            <div className="chain-icon"><i className="fas fa-link"></i></div>
            <div className="details">
              <h3>Blockchain Details</h3>
              <p>0xe......fd54</p>
              <p><em>Block Number #1024</em></p>
              <p>Timestamp: 2025-04-00 14:30:0</p>
              <p>Smart Contract: AgrimoicsContract</p>
              <p>Verified On: Hyperledger Fabric</p>
            </div>
          </div>
        </header>

        <div className="parties-container">
          <div className="party from">
            <div className="party-header">
              <div className="party-icon"><i className="fas fa-user-tie"></i></div>
              <h4>
                From<br />
                {invoiceData?.processorName}
              </h4>
            </div>
            <p>Farm ID: {invoiceData?.farmId}</p>
            <p>Location: {invoiceData?.farmddress}</p>
            <p>Phone: +91-{invoiceData?.farmContact}</p>
          </div>
          <div className="party to">
            <div className="party-header">
              <div className="party-icon"><i className="fas fa-building"></i></div>
              <h4>
                To<br />
                {invoiceData?.recieverName}
              </h4>
            </div>
            <p>Company ID: {invoiceData?.receiverId}</p>
            <p>{invoiceData?.receiverAddress}</p>
            <p>Phone: +91-{invoiceData?.receiverContact}</p>
          </div>
        </div>

        <div className="invoice-content">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{productname}</td>
                <td>{quantity} {unit}</td>
                <td>₹{realprice}/{unit}</td>
                <td>₹{price}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Total</td>
                <td>₹{price}</td>
              </tr>
            </tfoot>
          </table>

          <div className="invoice-summary">
            <div className="calculations">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{price}</span>
              </div>
              <div className="calc-row">
                <span>Logistics Charges</span>
                <span>₹00</span>
              </div>
              <div className="calc-row">
                <span>GST (0%)</span>
                <span>₹00</span>
              </div>
              <div className="calc-row">
                <span>Blockchain Validation Fee</span>
                <span>₹0</span>
              </div>
              <div className="calc-row total">
                <span>Grand Total</span>
                <span>₹{price}</span>
              </div>
            </div>

            <div className="invoice-details">
              <div className="details-header">
                <div className="document-icon"><i className="fas fa-file-invoice"></i></div>
                <div className="details-content">
                  <p>Invoice No.<br /> INV-AGRI-20250409-001</p><br />
                  <p>Invoice Date: {invoiceData?.paymentDate}</p>
                  <p>Payment Due: {invoiceData?.paymentDate}</p>
                  <p>Payment Status: {invoiceData?.status || 'Success'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="invoice-footer">
          <div className="blockchain-proof">
            <h3>Blockchain Proof</h3>
            <div className="proof-content">
              <div className="qr-code">
                <img src={qrcode} alt="QR Code" />
              </div>
              <p>On-chain visaro <br />on-chain</p>
            </div>
          </div>

          <div className="signatures">
            <h3>Authorized Signatory</h3>
            <p>Digitally signed via blockchain</p>
            <div className="signature-line"></div>
            <p>Authorized Signatory</p>
            <p>Digitally signed via blockchain</p>
          </div>
        </footer>
      </div>

      <div className='printbutton-container'>
        <button className='print-button' onClick={handlePrint}>{isCircularloader ? <CircularLoader size={20} /> : 'Print'}</button>
      </div>
    </div>
  )
}

export default Invoice
