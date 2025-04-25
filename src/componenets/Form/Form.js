import React, { useRef, useState } from 'react';
import './Form.css';
import axios from 'axios';

function Form() {
  const fileInputRef = useRef();
  const user =  JSON.parse(localStorage.getItem('user')) || null;
  const [formData, setFormData] = useState({
    email: user ? user?.email : '',
    fruitName: '',
    description: '',
    taste: '',
    healthBenefits: '',
    sellerName: '',
    address: '',
    pin: '',
    ownerId:'',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...newFiles];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Reset to allow re-selection of same files
    fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Create a new FormData instance
  const formDataToSend = new FormData();
  
  // Append the other form data
  formDataToSend.append('ownerId', user?._id);
  formDataToSend.append('fruitName', formData.fruitName);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('taste', formData.taste);
  formDataToSend.append('healthBenefits', formData.healthBenefits);
  formDataToSend.append('sellerName', formData.sellerName);
  formDataToSend.append('address', formData.address);
  formDataToSend.append('pin', formData.pin);

  // Append images as files
  formData.images.forEach((image) => {
    formDataToSend.append('images', image);  // 'images' is the field name expected by multer
  });

  try {
    const productdata = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/products/addProduct`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Important: set this for file uploads
      },
    });
     
    if (productdata && productdata.data) {
      alert('Product added successfully!');
    }
    // setFormData({
    //   fruitName: '',
    //   description: '',
    //   taste: '',
    //   healthBenefits: '',
    //   sellerName: '',
    //   address: '',
    //   pin: '',
    //   ownerId:'',
    //   images: [],
    // });
    // setImagePreviews([]);

  } catch (error) {
    console.error('Error submitting form:', error);
    alert(error.response?.data?.message || 'Failed to add product. Please try again.');
    return;
  }
};


  return (
    <div className='formsection'>
      <h2>Sell Your Fruit Online</h2>
      <form onSubmit={handleSubmit}>
        <label>Fruit Name:</label>
        <input type='text' name='fruitName' value={formData.fruitName} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name='description' value={formData.description} onChange={handleChange} required />

        <label>Taste & Texture:</label>
        <input type='text' name='taste' value={formData.taste} onChange={handleChange} />

        <label>Health Benefits:</label>
        <textarea name='healthBenefits' value={formData.healthBenefits} onChange={handleChange} />

        <label>Seller Name:</label>
        <input type='text' name='sellerName' value={formData.sellerName} onChange={handleChange} required />

        <label>Seller Address:</label>
        <textarea name='address' value={formData.address} onChange={handleChange} required />

        <label>PIN Code:</label>
        <input type='text' name='pin' value={formData.pin} onChange={handleChange} required maxLength={6} />
      
        <label htmlFor='fruit-images'>
          Upload Fruit Images :
        </label>

        <div className='custom-file-upload'>
          <label htmlFor='fruit-images' className='upload-button'>
            {formData.images.length === 0
              ? 'Choose images'
              : `${formData.images.length} image${formData.images.length > 1 ? 's' : ''} selected`}
          </label>
          <input
            id='fruit-images'
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
            ref={fileInputRef}
            className="custom-file-input"
          />
        </div>

        <div className='preview-container'>
          {imagePreviews.map((src, idx) => (
            <div key={idx} className='preview-item'>
              <img src={src} alt={`fruit-${idx}`} className='preview-image' />
              <span
                className='remove-icon'
                onClick={() => handleRemoveImage(idx)}
              >
                &times;
              </span>
            </div>
          ))}
        </div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Form;
