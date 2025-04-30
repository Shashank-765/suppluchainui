import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoader from '../CircularLoader/CircularLoader'
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import './Signup.css';

function SignupLogin({ setIsAuthenticated, setUserData }) {
    const [isSignup, setIsSignup] = useState(false);
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
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Name is required';
                else if (value.length < 3) error = 'Name must be at least 3 characters';
                break;
            case 'contact':
                if (!/^\d{10}$/.test(value)) error = 'Enter a valid 10-digit contact number';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email';
                break;
            case 'password':
                if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                } else if (!/[A-Za-z]/.test(value)) {
                    error = 'Password must include at least one letter';
                } else if (!/\d/.test(value)) {
                    error = 'Password must include at least one number';
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    error = 'Password must include at least one special character';
                }
                break;

            case 'address':
                if (!value.trim()) error = 'Address is required';
                break;
            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const errors = {};
        const fieldsToValidate = isSignup
            ? ['name', 'contact', 'email', 'password', 'address']
            : ['email', 'password'];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) errors[field] = error;
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // true if no errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            const error = validateField(name, value);
            setFormErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCircularLoader(true);

        const isValid = validateForm();
        if (!isValid) {
            setIsCircularLoader(false);
            return;
        }

        if (isSignup) {
            try {
                const registeredUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (registeredUser && registeredUser.data) {
                    setIsCircularLoader(false);
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        userType: '',
                        contact: '',
                        address: ''
                    });
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
                                type="text"
                                name="name"
                                className="authtext"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {touched.name && formErrors.name && (
                                <span className="error-text">{formErrors.name}</span>
                            )}

                            <input
                                type="text"
                                name="contact"
                                className="authtext"
                                placeholder="Contact No."
                                value={formData.contact}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {touched.contact && formErrors.contact && (
                                <span className="error-text">{formErrors.contact}</span>
                            )}

                            <select
                                name="userType"
                                className="authtext"
                                value={formData.userType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            >
                                <option value="">Select User Type</option>
                                <option value="buyer">Buyer</option>
                                <option value="retailer">Retailer</option>
                            </select>
                            {touched.userType && !formData.userType && (
                                <span className="error-text">User type is required</span>
                            )}

                            <input
                                type="text"
                                name="address"
                                className="authtext"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {touched.address && formErrors.address && (
                                <span className="error-text">{formErrors.address}</span>
                            )}
                        </>

                    )}

                    <input
                        type="email"
                        name="email"
                        className="authtext"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {touched.email && formErrors.email && (
                        <span className="error-text">{formErrors.email}</span>
                    )}

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="authtext"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {touched.password && formErrors.password && (
                        <span className="error-text">{formErrors.password}</span>
                    )}


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
