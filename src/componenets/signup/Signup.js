import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoader from '../CircularLoader/CircularLoader'
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import './Signup.css';

function SignupLogin({ setIsAuthenticated, setUserData }) {
    const [isSignup, setIsSignup] = useState(true);
    const [isCircularloader, setIsCircularLoader] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: '',
        contact: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCircularLoader(true);
        if (isSignup) {
            try {
                const registeredUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (registeredUser && registeredUser.data) {
                    setIsCircularLoader(false);
                    showSuccess('Signup successful!');
                    setIsSignup(false);
                }
            } catch (error) {
                console.error(error);
                setIsCircularLoader(false);
                showError(error.response?.data?.message || 'Signup failed. Please try again.');
            }
        } else {
            try {
                const loggedInUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (loggedInUser && loggedInUser.data) {
                    setIsCircularLoader(false);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(loggedInUser.data.user));
                    setUserData(loggedInUser.data.user);
                    navigate('/');
                    showSuccess('Login successful!');
                }
            } catch (error) {
                setIsCircularLoader(false);
                console.error(error);
                showError(error.response?.data?.message || 'Login failed. Please try again.');
            }
        }
    };

    return (
        <div className='signuploginconainter'>
            <div className='form-container'>
                <h2>{isSignup ? 'Signup' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            <input
                                type='text'
                                name='name'
                                className='authtext'
                                placeholder='Full Name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type='text'
                                name='contact'
                                className='authtext'
                                placeholder='Contact No.'
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
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
                            <input
                                type='text'
                                name='address'
                                className='authtext'
                                placeholder='Address '
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <input
                        type='email'
                        name='email'
                        className='authtext'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className='password-wrapper'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            className='authtext'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type='button'
                            className='toggle-password'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <button type='submit' className='auth-button'>
                        {isCircularloader ? (
                            <CircularLoader size={18} />
                        ) : (
                            isSignup ? 'Signup' : 'Login'
                        )}
                    </button>
                </form>

                <p className='toggle-text'>
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span
                        className='toggle-link'
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Login' : 'Signup'}
                    </span>
                </p>

            </div>
        </div>
    );
}

export default SignupLogin;
