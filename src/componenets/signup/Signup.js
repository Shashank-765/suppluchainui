import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import './Signup.css';

function SignupLogin({ setIsAuthenticated }) {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'buyer',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup) {
            console.log('formData', formData);

            try {
                const registeredUser = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/register', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('registeredUser.data', registeredUser.data);
                if (registeredUser && registeredUser.data) {
                    showSuccess('Signup successful!');
                    setIsSignup(false);
                }
            } catch (error) {
                console.error(error);
                showError(error.response?.data?.message || 'Signup failed. Please try again.');
            }
        } else {
            try {
                const loggedInUser = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/login', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('loggedInUser.data', loggedInUser.data);
                if (loggedInUser && loggedInUser.data) {

                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(loggedInUser.data.user));
                    navigate('/home');
                    showSuccess('Login successful!');
                }
            } catch (error) {
                console.error(error);
                showError(error.response?.data?.message || 'Login failed. Please try again.');
            }
        }
    };

    return (
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
                    {isSignup ? 'Signup' : 'Login'}
                </button>
            </form>

            {
                isSignup ? (<p className='toggle-text'>
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span
                        className='toggle-link'
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Login' : 'Signup'}
                    </span>
                </p>) : ''
            }
        </div>
    );
}

export default SignupLogin;
