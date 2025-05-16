import React, { useEffect, useState } from 'react';
import './Product.css';
import api from '../../axios';
import image1 from '../../Imges/Image6.png';
import coverImage from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';
import CircularLoader from '../CircularLoader/CircularLoader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product() {
    const navigate = useNavigate();
    const [isCircularloader, setIsCircularLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);


    const handleClick = (ele) => {
        navigate('/viewpage', { state: { product: ele } });
    };

    const fetchAllProducts = async (pageToFetch) => {
        try {
            setIsCircularLoader(true);
            // const response = await api.get(`/products/getproducttomarkiting?page=${pageToFetch}&limit=3`);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND2_URL}/batches/filter`);

            if (response.data) {
                const newData = response.data.data;
                // Prevent duplicates
                setData(prev => {
                    const ids = new Set(prev.map(p => p.batchId));
                    const uniqueNew = newData?.filter(item => !ids.has(item.batchId));
                    return [...prev, ...uniqueNew];
                });

                setTotalPages(response.data.totalPages);
            } else {
                console.error('Error fetching products:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsCircularLoader(false);
        }
    };
    useEffect(() => {
            fetchAllProducts(1);    
    }, []);

    const handleSeeMore = () => {
        const nextPage = page + 1;
        fetchAllProducts(nextPage);
        setPage(nextPage);
    };

    return (
        <div className='productsection'>
            <div className='contactcoverimagecontianer'>
                <img src={coverImage} alt='cover' />
                <h1>Products</h1>
            </div>

            <div className='productmaincontainer'>
                {data.length > 0  ? (
                    <>
                        {data?.map((ele, i) => (
                            ele?.processorId?.processorStatus === 'Processed' &&
                            <div className='productcontainer' onClick={() => handleClick(ele)} key={i}>
                                <div className='productimagecontianer'>
                                    { ele?.processorId?.image?.length > 0 ? (
                                        <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${ele?.processorId?.image[0]}`} alt='product' />
                                    ) : (
                                        <img src={image1} alt='default' />
                                    )}
                                </div>
                                <div className='productdetailscontainer'>
                                    <div className='productdetailscontainerdetails'>
                                        <p>{ele?.coffeeType}</p>
                                        <p>Total QTY: <span className='pricevalueproduct'>{Number(ele?.processorId?.quantity).toFixed(2)} qtl</span></p>
                                    </div>
                                    <p className='prices'>Price: <span className='pricevalueproduct'>{ele?.processorId?.price}</span></p>
                                </div>
                            </div>
                        ))}

                        {isCircularloader && <CircularLoader size={20} />}

                        {!isCircularloader && page < totalPages && (
                            <div className='productcontainer see-more-card' onClick={handleSeeMore}>
                                <div className='productimagecontianer'>
                                
                                </div>
                                <div className='productdetailscontainer'>
                                    <div className='productdetailscontainerdetails'>
                                        <p className='see-more-text'>See More</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='no-product-container'>
                        <p>{isCircularloader ? <CircularLoader size={20} /> : 'No Product Available'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Product;
