import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../Imges/companylogo.png';
import menu from '../../Imges/menus.png';
import cross from '../../Imges/cross.png';

function Navbar({ isAuthenticated }) {
  const data = (JSON.parse(localStorage.getItem('user')));
  const [navstae, setNavState] = useState(true);

  const navigate = useNavigate();
  const navigatetohome = () => {
    navigate('/')
  }
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

          {/* Protected: Dashboard */}
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
          {/* <li onClick={() => setNavState('navbarrightside')} className='faqbutton'>
            <Link to='/faqs'>FAQs</Link>
          </li> */}

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
