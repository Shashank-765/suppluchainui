import React from 'react'
import './Invoice.css'
import qrcode from '../../Imges/qrcode.jpg'
import { useLocation } from 'react-router-dom'
function Invoice() {
const location = useLocation();
const { quantity,price,realprice,productname,unit } = location.state || {};
// console.log(unit,'price and quantity')
  return (
    <div>
      <div className="invoice-container">
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
                Ramesh Kumar
              </h4>
            </div>
            <p>Farm ID: FARM-102</p>
            <p>Location: Nashik, Naharashtra</p>
            <p>Phone: +91-XXXXX-XXXX</p>
          </div>
          <div className="party to">
            <div className="party-header">
              <div className="party-icon"><i className="fas fa-building"></i></div>
              <h4>
                To<br />
                AgriFresh Ltd.
              </h4>
            </div>
            <p>Company ID: COMP-507</p>
            <p>Bengaluru, Karnataka, Indaia</p>
            <p>Phone: +91-YYYYY-YYYYY</p>
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
              {/* <tr>
                <td>2</td>
                <td>Baby Potatoes</td>
                <td>300 kg</td>
                <td>₹18/kg</td>
                <td>₹5,400</td>
              </tr> */}
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
                  <p>Invoice Date: April 9, 2025</p>
                  <p>Payment Due: April 16, 2025</p>
                  <p>Payment Status: Pending</p>
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
      <button className='print-button'>Print</button>
      </div>
    </div>
  )
}

export default Invoice
