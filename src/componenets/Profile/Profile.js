import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import './Profile.css';
import axios from 'axios';

function Profile({ setIsAuthenticated, setUser }) {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const user = JSON.parse(localStorage.getItem('user')) || null;
    console.log(user, 'user')
    const navigate = useNavigate();
    const handleClick = (ele) => {
        navigate('/viewpage', { state: { product: ele } });
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserData(parsedUser);
            setFormData(parsedUser);
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getProducts?id=${user._id}`);
            if (response.data) {
                setProducts(response.data.products);
            } else {
                console.error('Error fetching products:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUserData(formData);
        localStorage.setItem('user', JSON.stringify(formData));
        setIsEditing(false);
    };

    return (
        <>
            <div className="profile-container">
                {userData ? (
                    <>
                        <h1>Welcome, {userData.name}</h1>

                        {isEditing ? (
                            <div className="profile-edit-form">
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled='true'
                                    />
                                </label>
                                <label>
                                    <select
                                        name='userType'
                                        className='authtext'
                                        value={formData.userType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value='buyer'>Buyer</option>
                                        <option value='seller'>Seller</option>
                                        <option value='retailer'>Retailer</option>
                                    </select>
                                </label>


                                <button onClick={handleSave} className="profile-save-btn">Save</button>
                                <button onClick={handleEditToggle} className="profile-cancel-btn">Cancel</button>


                            </div>
                        ) : (
                            <>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <div className='profile-edit-buttons'>
                                    <button onClick={handleEditToggle} className="profile-edit-btn">Edit Profile</button>
                                    <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
                                </div>

                            </>
                        )}
                    </>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>

            <div className='my-product-continer'>
                <h2 className='my-products-only'>My Products</h2>
                <div className='productmaincontainer'>
                    {

                        products.length > 0 ? products?.map((ele, i) => {
                            return (
                                <div className='productcontainer' onClick={() => handleClick(ele)} key={i}>
                                    <div className='productimagecontianer'>

                                        {ele?.images?.length > 0 && (
                                            <img
                                                src={`https://lfgkx3p7-5000.inc1.devtunnels.ms${ele.images[0]}`}
                                                alt={`product-${i}-img`}
                                                className="product-image"
                                            />
                                        )}
                                    </div>

                                    <div className='productdetailscontainer'>
                                        <div className='productdetailscontainerdetails'>
                                            <p>{ele?.fruitName}</p>
                                            <p>QTY : <span className='pricevalueproduct'>{ele?.quantity}</span></p>
                                        </div>
                                        <p className='prices'>Price : <span className='pricevalueproduct'>{ele?.price}</span></p>
                                    </div>
                                </div>
                            )
                        })
                            :
                            <div className='no-product-container-profile'>
                                <p>No Product Available </p>
                            </div>

                    }
                </div>

            </div>
        </>


    );
}

export default Profile;
