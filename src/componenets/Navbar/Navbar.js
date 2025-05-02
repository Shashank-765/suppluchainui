import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import logo from '../../Imges/companylogo.png';
import menu from '../../Imges/menus.png';
import notificationimage from '../../Imges/notification.png'
import cross from '../../Imges/cross.png';

function Navbar({ isAuthenticated }) {
  const data = (JSON.parse(localStorage.getItem('user')));
  const [navstae, setNavState] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const seemoreHandler = ()=>{
   setShowDropdown(false);
    navigate('/notifications')
  }

  const markAsRead = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notify/notified?notificationId=${id}`, {}, {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };
  const handleNotification = (batch) => {
    markAsRead(batch?._id);
    navigate('/batchprogress', { state: { batch } })
    setShowDropdown(false);
  }

  const navigate = useNavigate();
  const navigatetohome = () => {
    navigate('/')

  }
  useEffect(() => {
    if (data) {
      fetchNotifications();
    }
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/notify/notifications?id=${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${data?.token}`,
          },
        }
      );

      const unread = res.data.filter(n => !n.readStatus[data._id]);
      setNotifications(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };


  return (
    <div className='navbarsection'>
      <div className='navbarleftlog'>
        <div className='logocontainercompany'>
          <img onClick={navigatetohome} src={logo} alt='images' />
        </div>
      </div>

      <div className={`${navstae ? 'navbarrightside' : 'navafterbutton'}`}>
        <ul>
          <li onClick={() => setNavState('navbarrightside')}>
            <Link to='/'>Home</Link>
          </li>

          {isAuthenticated && (
            <>
              {data?.userType === 'admin' ? <li onClick={() => setNavState('navbarrightside')}>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
                :
                data?.userType === 'user' ?
                  <li onClick={() => setNavState('navbarrightside')}>
                    <Link to='/userdashboard'>Dashboard</Link>
                  </li> : ''}
            </>
          )}


          <li>
            <Link
              to='/product'
              onClick={() => {
                setNavState('navbarrightside');
              }}
            >
              Explore
            </Link>
          </li>



          <li onClick={() => setNavState('navbarrightside')}>
            <Link to='/contact'>Contact</Link>
          </li>

          {/* Show Login/Signup or Logout */}
          {!isAuthenticated ? (
            <li onClick={() => setNavState('navbarrightside')}>
              <Link to='/auth'>Signup</Link>
            </li>
          ) : (
            <li onClick={() => setNavState('navbarrightside')}>
              <Link to="/profile">Profile</Link>
            </li>

          )}

          {isAuthenticated && lastSegment !== 'batchprogress' && lastSegment !== 'notifications' && (
            <li className="dropdown notification-bell" ref={dropdownRef}>
              <span className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
                <img src={notificationimage} alt='images' />
                {notifications.length > 0 && <span className="badge">{notifications?.length}</span>}
              </span>

              {showDropdown && (
                <ul className="dropdown-menu">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((note, index) => (
                        <li key={index} className="notificationli">
                          <div className="notification-header" onClick={() => handleNotification(note)}>
                            {note.batchId && note.message
                              ? `Batch Id ${note.batchId} ${note.message}`
                              : 'New Notification'}
                          </div>
                          <div className="notification-date">
                            {new Date(note.createdAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                      {notifications.length > 2 && (
                        <li className="notification-see-more">
                          <button className='seemorebutton' onClick={()=>seemoreHandler()}>
                            See more
                          </button>
                        </li>
                      )}
                    </>
                  ) : (
                    <li className="notificationlino">No notifications</li>
                  )}
                </ul>
              )}


            </li>
          )}
        </ul>
      </div>

      {navstae ? (
        <img className='menubutton' onClick={() => setNavState(!navstae)} src={menu} alt='menu' />
      ) : (
        <img className='menubutton' onClick={() => setNavState(!navstae)} src={cross} alt='close' />
      )}
    </div>
  );
}

export default Navbar;
