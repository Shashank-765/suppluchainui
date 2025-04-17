import React from 'react'
import './EditUser.css' 
import { useLocation } from 'react-router-dom';
function EditUser() {
   const location = useLocation();
  const { user } = location.state || {};
  console.log(user, 'user')
  return (
    <div className='edituser'>EditUser</div>
  )
}

export default EditUser