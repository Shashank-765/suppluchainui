import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import image1 from '../../Imges/Image6.png'
import profileImage from '../../Imges/portrait-322470_1280.jpg';
import profilecover from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';
import CircularLoader from '../CircularLoader/CircularLoader'
import api from '../../axios'

import './Profile.css';


function Profile({ setIsAuthenticated, setUser }) {
    const popupRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', userType: '', address: '', contact: '' });
    const [isCircularloader, setIsCircularLoader] = useState(false);


    useEffect(() => {
        if (isEditing)

            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isEditing]);

    const user = JSON.parse(localStorage.getItem('user')) || null;
    const navigate = useNavigate();

    const handleClick = (product) => {
    const viewOnly = 'viewOnly'
        navigate('/viewpage', { state: { product,viewOnly } });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleEditToggle();
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
            const parsedUser = JSON.parse(localUser);
            setUserData(parsedUser);
            setFormData(parsedUser);
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {   
          setIsCircularLoader(true);
            const response = await api.get(`/products/getmyproducts?id=${user._id}`);
            if (response.data) {
            setIsCircularLoader(false);
                const updatedProducts = response.data.products.map((product) => {
                    let totalQuantityQuintal = 0;

                    (product?.purchaseHistory || [])?.forEach((history) => {
                        const quantityStr = String(history?.quantityBought || '');

                        const matches = quantityStr.match(/([\d.]+)\s*\/?\s*(kg|quintal)?/i);

                        if (matches) {
                            const quantity = parseFloat(matches[1]);
                            const unit = matches[2]?.toLowerCase() || 'quintal';

                            if (unit.includes('kg')) {
                                totalQuantityQuintal += quantity / 100;
                            } else {
                                totalQuantityQuintal += quantity;
                            }
                        }
                    });


                    return {
                        ...product,
                        totalQuantityQuintal: totalQuantityQuintal.toFixed(2),
                    };
                });

                setProducts(updatedProducts);
            }
            else {
            setIsCircularLoader(false);
                showError('Failed to fetch products');
            }
        } catch (error) {
        setIsCircularLoader(false);
            console.log(error)
            showError('Error fetching products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/auth');
        showSuccess('Logout successful!');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsCircularLoader(true);
            const response = await api.post(`/users/updateprofile`, formData)
            if (response?.data) {
                setIsEditing(false);
                setIsCircularLoader(false);
                showSuccess('Profile updated!');
            }
        } catch (error) {
            setIsEditing(true);
            setIsCircularLoader(false);
            showError('Failed to update profile')
        }

    };

    return (
        <div className="profile-container">
            {userData ? (
                <>
                    {isEditing ? (
                        <div className="profile-edit-form">
                            <div className="editformcontianer" ref={popupRef}>
                                <label>
                                    Name:
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </label>
                                <label>
                                    Email:
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                                </label>
                                <label>
                                    Contact:
                                    <input type="number" className='contacteditnumber' name="contact" value={formData.contact} onChange={handleChange} />
                                </label>
                                <label>
                                    Address:
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                                </label>
                                {(user?.userType !== 'user' && user?.userType !== 'admin') ? (
                                    <label>
                                        User Type:
                                        <select
                                            name="userType"
                                            className="authtext"
                                            value={formData.userType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="retailer">Retailer</option>
                                        </select>
                                    </label>
                                ) : null}

                                <div className='buttoncancesave'>
                                    <button onClick={handleSave} className="profile-save-btn">{isCircularloader ? <CircularLoader size={13} /> : 'save'}</button>
                                    <button onClick={handleEditToggle} className="profile-cancel-btn">Cancel</button>
                                </div>

                            </div>
                        </div>
                    ) : null}
                    <>
                        <div className="profile-card">
                            <div className="profile-banner">
                                <img src={profilecover} alt='images' />
                                <h1>Welcome, {userData.name}</h1>
                            </div>
                            <div className="profile-content">
                                <img className="profile-image" src={profileImage} alt="Profile" />
                                <div className="profile-details">
                                    <div className="contact-info">
                                        <p>Contact No</p>
                                        <span className="contact-information">{user?.contact}</span>
                                    </div>

                                    {

                                        user?.userType === 'user' ? <div className="role-info">
                                            <p>Role</p>
                                            <span className={user?.role?.className}>
                                                {user?.role?.slug}
                                            </span>
                                        </div> : ''

                                    }

                                    <div className="settings">
                                        <p>{user?.role?.label} Email</p>
                                        <span className="edit-btn">{user?.email}</span>
                                    </div>
                                    <div className="settings">
                                        <p>Wallet Address</p>
                                        <span className="edit-btn">
                                            {user?.walletAddress
                                                ? `${user.walletAddress.slice(0, 4)}......${user.walletAddress.slice(-4)}`
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleEditToggle} className="profile-edit-btn">Edit Profile</button>
                                <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
                            </div>
                        </div>


                        {

                            // user?.userType === 'user' || user?.userType === 'admin' ? '' :
                                <div className="my-product-continer">
                                    <h2 className="my-products-only">My Products</h2>
                                    <div className="productmaincontainer">
                                        {products.length > 0 ? (
                                            products.map((product, i) => (
                                                <div className="productcontainer" onClick={() => handleClick(product)} key={i}>
                                                    <div className="productimagecontianer">
                                                        {product?.images?.length > 0 ?(
                                                            <img
                                                                src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${product.images[0]}`}
                                                                alt={`product-${i}`}
                                                                className="product-image"
                                                            />
                                                        ):
                                                          <img src={image1} alt='images' />
                                                        }
                                                    </div>
                                                    <div className="productdetailscontainer">
                                                        <div className="productdetailscontainerdetails">
                                                            <p>{product?.productName}</p>
                                                            <p>Stock: <span className="pricevalueproduct">{product?.totalQuantityQuintal} qtl</span></p>
                                                        </div>
                                                        <p className="prices">
                                                            Price: <span className="pricevalueproduct">{product?.price}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-product-container-profile">
                                                <p>{isCircularloader ? <CircularLoader size={20}/> :'No Product Available'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                        }
                    </>

                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default Profile;
