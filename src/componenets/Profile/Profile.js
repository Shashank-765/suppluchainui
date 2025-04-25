import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import profileImage from '../../Imges/portrait-322470_1280.jpg';
import profilecover from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';

import './Profile.css';
import axios from 'axios';

function Profile({ setIsAuthenticated, setUser }) {
    const popupRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', userType: '', address: '', contact: '' });

    const user = JSON.parse(localStorage.getItem('user')) || null;
    const navigate = useNavigate();

    const handleClick = (product) => {
        navigate('/viewpage', { state: { product } });
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/getProducts?id=${user._id}`);
            if (response.data) {
                setProducts(response.data.products);
            } else {
                showError('Failed to fetch products');
            }
        } catch (error) {
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

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/updateprofile`, formData)
            if (response?.data) {
                setIsEditing(false);
                showSuccess('Profile updated!');
            }
        } catch (error) {
            setIsEditing(true);

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
                                    <input type="number" name="contact" value={formData.contact} onChange={handleChange} />
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
                                            <option value="seller">Seller</option>
                                            <option value="retailer">Retailer</option>
                                        </select>
                                    </label>
                                ) : null}

                                <button onClick={handleSave} className="profile-save-btn">Save</button>
                                <button onClick={handleEditToggle} className="profile-cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ) : null}
                    <>
                        <div className="profile-card">
                            <div className="profile-banner">
                                <img src={profilecover} />
                                <h1>Welcome, {userData.name}</h1>
                            </div>
                            <div className="profile-content">
                                <img className="profile-image" src={profileImage} alt="Profile" />
                                <div className="profile-details">
                                    <div className="contact-info">
                                        <p>Contact No</p>
                                        <span className="contact-information">{user?.contact}</span>
                                    </div>
                                    <div className="role-info">
                                        <p>Role</p>
                                        <span className={user?.role?.className}>
                                            {user?.role?.slug}
                                        </span>
                                    </div>
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

                        <div className="my-product-continer">
                            <h2 className="my-products-only">My Products</h2>
                            <div className="productmaincontainer">
                                {products.length > 0 ? (
                                    products.map((product, i) => (
                                        <div className="productcontainer" onClick={() => handleClick(product)} key={i}>
                                            <div className="productimagecontianer">
                                                {product?.images?.length > 0 && (
                                                    <img
                                                        src={`https://lfgkx3p7-5000.inc1.devtunnels.ms${product.images[0]}`}
                                                        alt={`product-${i}`}
                                                        className="product-image"
                                                    />
                                                )}
                                            </div>
                                            <div className="productdetailscontainer">
                                                <div className="productdetailscontainerdetails">
                                                    <p>{product?.fruitName}</p>
                                                    <p>QTY: <span className="pricevalueproduct">{product?.quantity}</span></p>
                                                </div>
                                                <p className="prices">
                                                    Price: <span className="pricevalueproduct">{product?.price}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-product-container-profile">
                                        <p>No Product Available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>

                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default Profile;
