import React, { useEffect } from 'react'
import './Product.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Product() {
    const navigate = useNavigate();
    const handleClick = (ele) => {
        navigate('/viewpage', { state: { product: ele } });
    }

    const [data, setData] = React.useState([]);
    const fetchallproducts = async () => {
        try {
            const response = await axios.get('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getproducttomarkiting');
            console.log(response.data.trackingDetails, 'response')

            if (response.data) {
                setData(response.data.trackingDetails);
            }
            else {
                console.error('Error fetching products:', response.data.message);
            }
        }
        catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchallproducts();
    }, [])

    return (
        <>
            <div className='productsection'>
                <div className='productlistheading'>
                    <h1>Product List</h1>
                </div>
                <div className='productmaincontainer'>
                    {

                     data.length > 0 ?   data?.map((ele, i) => {
                            return (
                                <div className='productcontainer' onClick={() => handleClick(ele)} key={i}>
                                    <div className='productimagecontianer'>
                                        <img src={`https://lfgkx3p7-5000.inc1.devtunnels.ms${ele?.images[0]}`} />
                                    </div>
                                    <div className='productdetailscontainer'>
                                        <div className='productdetailscontainerdetails'>
                                            <p>{ele?.productName}</p>
                                            <p>Min QTY : <span className='pricevalueproduct'>{ele?.miniQuantity}</span></p>
                                        </div>
                                        <p className='prices'>Price : <span className='pricevalueproduct'>{ele?.price}</span></p>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className='no-product-container'>
                          <p>No Product Available </p>
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Product