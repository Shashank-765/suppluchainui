import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../Imges/companylogo.png';
import menu from '../../Imges/menus.png';
import cross from '../../Imges/cross.png';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [navstae, setNavState] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return (
    <div className='navbarsection'>
      <div className='navbarleftlog'>
        <div className='logocontainercompany'>
          <img src={logo} alt='images' />
        </div>
      </div>

      <div className={`${navstae ? 'navbarrightside' : 'navafterbutton'}`}>
        <ul>
          <li onClick={() => setNavState('navbarrightside')}>
            <Link to='/'>Home</Link>
          </li>

          {/* Protected: Dashboard */}
          {isAuthenticated && (
            <li onClick={() => setNavState('navbarrightside')}>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
          )}

          {/* Protected: Product Dropdown */}
          {isAuthenticated && (
            <li className='dropdown'>
              <span
                className='dropdown-toggle'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Product▾
              </span>

              {isDropdownOpen && (
                <ul className='dropdown-menu'>
                  <li>
                    <Link
                      to='/product'
                      onClick={() => {
                        setNavState('navbarrightside');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/form'
                      onClick={() => {
                        setNavState('navbarrightside');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Add Product
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          <li onClick={() => setNavState('navbarrightside')}>
            <Link to='/contact'>Contact</Link>
          </li>
          <li onClick={() => setNavState('navbarrightside')}>
            <Link to='/userdashboard'>Dashboard</Link>
          </li>
          <li onClick={() => setNavState('navbarrightside')} className='faqbutton'>
            <Link to='/faqs'>FAQs</Link>
          </li>

          {/* Show Login/Signup or Logout */}
          {!isAuthenticated ? (
            <li onClick={() => setNavState('navbarrightside')}>
              <Link to='/auth'>Login</Link>
            </li>
          ) : (
            <li onClick={() => setNavState('navbarrightside')}>
              <Link to="/profile">Profile</Link>
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
