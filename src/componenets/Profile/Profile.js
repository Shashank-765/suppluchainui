import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import image1 from '../../Imges/Image6.png'
import profileImage from '../../Imges/portrait-322470_1280.jpg';
import profilecover from '../../Imges/green-tea-plantation-sunrise-timenature-260nw-2322999967.webp';
import CircularLoader from '../CircularLoader/CircularLoader'
import api from '../../axios'

import './Profile.css';


function Profile({ setIsAuthenticated, setUser }) {
    const popupRef = useRef(null);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [products, setProducts] = useState([]);
    const [buyProducts, setBuyProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        userType: '',
        address: '',
        contact: '',
        id: '',
        password: '',
        role: '',
        status: '',
        walletAddress: '',
        isDeleted: '',
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
        deletedAt: '',
        deletedBy: '',
        buyProducts: []
    });
    const [isCircularloader, setIsCircularLoader] = useState(false);
    const { userdata } = location.state || {};
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
        navigate('/viewpage', { state: { product, viewOnly } });
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
            // const response = await api.get(`/products/getmyproducts?id=${userdata ? userdata?._id : user._id}`);
            const response = await api.get(`${process.env.REACT_APP_BACKEND2_URL}/user/${userdata ? userdata?.userId : user._id}`);
            if (response.data) {
                
                // const updatedProducts = response.data.products.map((product) => {
                //     let totalQuantityQuintal = 0;

                //     (product?.purchaseHistory || [])?.forEach((history) => {
                //         const quantityStr = String(history?.quantityBought || '');

                //         const matches = quantityStr.match(/([\d.]+)\s*\/?\s*(kg|quintal)?/i);

                //         if (matches) {
                //             const quantity = parseFloat(matches[1]);
                //             const unit = matches[2]?.toLowerCase() || 'quintal';

                //             if (unit.includes('kg')) {
                //                 totalQuantityQuintal += quantity / 100;
                //             } else {
                //                 totalQuantityQuintal += quantity;
                //             }
                //         }
                //     });


                //     return {
                //         ...product,
                //         totalQuantityQuintal: totalQuantityQuintal.toFixed(2),
                //     };
                // });

                const products = response.data.userBuyProducts || [];
                setBuyProducts(products);
                const batchMap = {};
                await Promise.all(
                    products.map(async (product) => {
                        const batchId = product.batchId;
                        const { data: batchData } = await api.get(`${process.env.REACT_APP_BACKEND2_URL}/batch/${batchId}`);

                        const productQuantity = Number(product.quantity) || 0;

                        if (batchMap[batchId]) {
                            batchMap[batchId].quantity += productQuantity;
                        } else {
                            batchMap[batchId] = {
                                ...product,
                                ...batchData,
                                quantity: productQuantity
                            };
                        }

                    })
                    
                );
                setIsCircularLoader(false);
                const mergedProducts = Object.values(batchMap);
                setProducts(mergedProducts);
            }
            else {
                setIsCircularLoader(false);
                showError('Failed to fetch products');
            }
        } catch (error) {
            setIsCircularLoader(false);
            console.log(error)
        }
    };

    useEffect(() => { 
        fetchProducts();
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem('user');
    //     document.cookie.split(";").forEach(cookie => {
    //         const name = cookie.trim().split("=")[0];
    //         document.cookie = `${name}=; Max-Age=0; path=/;`;
    //         document.cookie = `${name}=; Max-Age=0; path=/; SameSite=None; Secure`;
    //     });
    //     setIsAuthenticated(false);
    //     navigate('/auth');
    //     showSuccess('Logout successful!');
    // };

    const handleLogout = () => {
        localStorage.removeItem('user');
        
        // Get current domain
        const domain = window.location.hostname;
        
        // Delete cookies with all possible attributes
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
        
        // Additional variants if needed
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
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
            console.log(response?.data)
            if (response?.data) {
                try {
                    const updatedb = await api.put(`${process.env.REACT_APP_BACKEND2_URL}/updateUser/${response.data?.user?._id}`,
                        {
                            userId: response.data?.user?._id,
                            userType: response.data.user?.userType,
                            userRole: response.data.user?.userType,
                            userName: response.data.user?.name,
                            userEmail: response.data.user?.email,
                            userPhone: response.data.user?.contact,
                            userBuyProducts: response.data.user?.buyProducts || buyProducts,
                            userIsDeleted: response.data.user?.isDeleted || "False",
                            userWalletAddress: response.data.user?.walletAddress,
                            userPassword: response.data.user?.password,
                            userAddress: response.data.user?.address || 'noida sector 12',
                            userStatus: response.data.user?.isBlocked || "True",
                            userCreatedAt: response.data.user?.createdAt || new Date().toISOString(),
                            userUpdatedAt: response.data.user?.updatedAt || new Date().toISOString(),
                            userDeletedAt: response.data.user?.deletedAt || '00/00/0000',
                            userCreatedBy: response.data.user?.createdBy || user?._id,
                            userUpdatedBy: response.data.user?.updatedBy || user?._id,
                            userDeletedBy: response.data.user?.deletedBy || 'null'
                        })
                }
                catch (error) {
                    console.log(error)
                }

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
                                <h1>{userdata ? '' : 'Welcome,'} {userdata ? `${userdata?.userName}'s Profile` : userData.name}</h1>
                            </div>
                            <div className="profile-content">
                                <img className="profile-image" src={profileImage} alt="Profile" />
                                <div className="profile-details">
                                    <div className="contact-info">
                                        <p>Contact No</p>
                                        <span className="contact-information">{userdata ? userdata?.userPhone : user?.contact}</span>
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
                                        <span className="edit-btn">{userdata ? userdata?.userEmail : user?.email}</span>
                                    </div>
                                    <div className="settings">
                                        <p>Wallet Address</p>
                                        <span className="edit-btn">
                                            {userdata?.userWalletAddress
                                                ? `${userdata?.userWalletAddress.slice(0, 4)}......${userdata?.userWalletAddress.slice(-4)}`
                                                : user?.walletAddress
                                                    ? `${user?.walletAddress.slice(0, 4)}......${user?.walletAddress.slice(-4)}`
                                                    : ''}
                                        </span>

                                    </div>
                                </div>

                                {

                                    userdata ? '' :
                                        <>
                                            <button onClick={handleEditToggle} className="profile-edit-btn">Edit Profile</button>
                                            <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
                                        </>
                                }

                            </div>
                        </div>
                        {
                            <div className="my-product-continer">
                                <h2 className="my-products-only">{userdata ? 'Products' : 'My Products'}</h2>
                                <div className="productmaincontainer">
                                    {products.length > 0 ? (
                                        products?.map((product, i) => (
                                            <div className="productcontainer" onClick={() => handleClick(product)} key={i}>
                                                <div className="productimagecontianer">
                                                    {product?.processorId?.image?.length > 0 ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${product.processorId.image[0]}`}
                                                            alt={`product-${i}`}
                                                            className="product-image"
                                                        />
                                                    ) :
                                                        <img src={image1} alt='images' />
                                                    }
                                                </div>
                                                <div className="productdetailscontainer">
                                                    <div className="productdetailscontainerdetails">
                                                        <p>{product?.coffeeType}</p>
                                                        <p>Stock: <span className="pricevalueproduct">{Number(product?.quantity).toFixed(2)} qtl</span></p>
                                                    </div>
                                                    <p className="prices">
                                                        Price: <span className="pricevalueproduct">{product?.processorId?.price}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-product-container-profile">
                                            <p>{isCircularloader ? <CircularLoader size={20} /> : 'No Product Available'}</p>
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
