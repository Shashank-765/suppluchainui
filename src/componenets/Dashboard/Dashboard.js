import React from 'react'
import './Dashboard.css'
import image1 from '../../Imges/process.png'
import image2 from '../../Imges/shop.png'
import image3 from '../../Imges/sprout.png'
import image4 from '../../Imges/right-arrow.png'
import image5 from '../../Imges/moving-truck.png'
import image6 from '../../Imges/customer.png'


function Dashboard() {
    return (
        <>
            {/* <div className='headersection'>
                <div></div>
                <div className='dashboardlinks'>
                    <ul>
                        <li>Dashboard</li>
                        <li>Track & Trace</li>
                        <li>Supply Chain Reports</li>
                        <li></li>
                    </ul>
                </div>
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div> */}
            <div className='maincontainer'>
            <div className='headings'>
                <h1>Supply Chain Management Dashboard</h1>
            </div>
               
                <div className='supplychainbox'>
                   <div className='supplychainconainterinner'>
                         <div className='dashsecondsection'>
                        <div className='boxheader'>
                            <h3>
                                Active Farms
                            </h3>
                            <div className='boximagesection'>
                            </div>
                        </div>
                        <div className='boxdetails'>
                            1,234
                        </div>
                    </div>
                    <div className='dashsecondsection'>
                        <div className='boxheader'>
                            <h3>
                                Products in Transit
                            </h3>
                            <div>

                            </div>
                        </div>
                        <div className='boxdetails'>
                            456
                        </div>

                    </div>
                    <div className='dashsecondsection'>
                        <div className='boxheader'>
                            <h3>
                                Active Orders
                            </h3>
                            <div>
                            </div>
                        </div>
                        <div className='boxdetails'>
                            789
                        </div>

                    </div>
                    <div className='dashsecondsection'>
                        <div className='boxheader'>
                            <h3>
                                Total Retailers
                            </h3>
                            <div>
                            </div>
                        </div>
                        <div className='boxdetails'>
                            321
                        </div>

                    </div>
                   </div>
                </div>

                <h1 className='supplycahinstages'>Supply Chain Stages</h1>

                <div className='section-2dashboard'>
                    <div className='dashboardsection-2'>
                        <div className='section-2cover'>
                            <div className='imagesection-2'>
                              <img src={image3}/>
                            </div>
                            <p>Growing</p>
                        </div>
                        <div className='section-2cover1'>
                            <div className='imagesection-21'>
                              <img src={image4}/>
                            </div>
                        </div>
                        <div className='section-2cover'>
                            <div className='imagesection-2'>
                              <img src={image1}/>
                            </div>
                            <p>Processong</p>
                        </div>
                        <div className='section-2cover1'>
                            <div className='imagesection-21'>
                             <img src={image4}/>
                            </div>
                        </div>
                        <div className='section-2cover'>
                            <div className='imagesection-2'>
                              <img src={image5}/>
                            </div>
                            <p>Distribution</p>
                        </div>
                        <div className='section-2cover1'>
                            <div className='imagesection-21'>
                             <img src={image4}/>
                            </div>
                        </div>
                        <div className='section-2cover'>
                            <div className='imagesection-2'>
                             <img src={image2}/>
                            </div>
                            <p>Retail</p>
                        </div>
                        <div className='section-2cover1'>
                            <div className='imagesection-21'>
                             <img src={image4}/>
                            </div>
                        </div>
                        <div className='section-2cover'>
                            <div className='imagesection-2'>
                              <img src={image6}/>
                            </div>
                            <p>Consumer</p>
                        </div>

                    </div>
                </div>

                <h1>Recent Blockchain Transactions</h1>


                <div className='transactiondata'>
                    <div className='tabledata'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>0x8f2e54...</td>
                                    <td>Buy</td>
                                    <td>Confirmed</td>
                                    <td>2025-01-15 14:30:00</td>
                                </tr>
                                <tr>
                                    <td>0x8f2e54...</td>
                                    <td>Buy</td>
                                    <td>Confirmed</td>
                                    <td>2025-01-15 14:30:00</td>
                                </tr>
                                <tr>
                                    <td>0x8f2e54...</td>
                                    <td>Sell</td>
                                    <td>Confirmed</td>
                                    <td>2025-01-15 14:30:00</td>
                                </tr>
                                <tr>
                                    <td>0x8f2e54...</td>
                                    <td>Buy</td>
                                    <td>Confirmed</td>
                                    <td>2025-01-15 14:30:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='dashboardsection-3'>
                    <div className='dashboardsection-3container'>
                        <div className='dashboardsec-3blocks'>
                            <h2>Track Products</h2>
                            <div className='textbuttoncontainer'>
                                <input className='text' placeholder='Enter Product Id' type='text' />
                                <button className='tracknow-button'>Track Now</button>
                            </div>
                        </div>
                        <div className='dashboardsec-3blocks'>
                            <h2>Add New Batch</h2>
                            <div className='textbuttoncontainer'>
                                <select className='text2'  type='text'>
                                 <option>Select Product Type</option>
                                </select>
                                <button className='tracknow-button'>Create Batch</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard