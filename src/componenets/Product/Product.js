import React, { useEffect ,useState} from 'react'
import './Product.css'
import api from '../../axios'
import image1 from '../../Imges/Image6.png'
import coverImage from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp'
import CircularLoader from '../CircularLoader/CircularLoader'
import { useNavigate } from 'react-router-dom';


function Product() {
    const navigate = useNavigate();
    const [isCircularloader, setIsCircularLoader] = useState(false);
    const handleClick = (ele) => {
        navigate('/viewpage', { state: { product: ele } });
    }
    const [data, setData] = React.useState([]);
    const fetchallproducts = async () => {
        try {
            setIsCircularLoader(true);
            const response = await api.get(`/products/getproducttomarkiting`);

            if (response.data) {
                setData(response.data.trackingDetails);
                setIsCircularLoader(false);
            }
            else {
                console.error('Error fetching products:', response.data.message);
                setIsCircularLoader(false);
            }
        }
        catch (error) {
            setIsCircularLoader(false);
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchallproducts();
    }, [])

    return (
        <>
            <div className='productsection'>
                <div className='contactcoverimagecontianer'>
                    <img src={coverImage} alt='images' />
                    <h1>Products</h1>
                </div>
                <div className='productmaincontainer'>
                    {

                        data.length > 0 ? isCircularloader ? <CircularLoader size={20}/> : data?.map((ele, i) => {
                            return (
                                <div className='productcontainer' onClick={() => handleClick(ele)} key={i}>
                                    <div className='productimagecontianer'>

                                        {
                                            ele?.images[0] ?
                                                <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${ele?.images[0]}`} alt='images' />
                                                :
                                                <img src={image1} alt='images' />
                                        }
                                    </div>
                                    <div className='productdetailscontainer'>
                                        <div className='productdetailscontainerdetails'>
                                            <p>{ele?.productName}</p>
                                            <p>Total QTY : <span className='pricevalueproduct'>{ele?.quantityProcessed} qtl</span></p>
                                        </div>
                                        <p className='prices'>Price : <span className='pricevalueproduct'>{ele?.price}</span></p>
                                    </div>
                                </div>
                            )
                        })
                            :
                            <div className='no-product-container'>
                                <p>{ isCircularloader ? <CircularLoader size={20}/> :'No Product Available'} </p>
                            </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Product