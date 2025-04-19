import './App.css';
import React, { useState, useEffect } from 'react';
import Footer from './componenets/Footer/Footer';
import Navbar from './componenets/Navbar/Navbar';
import Product from './componenets/Product/Product';
import Home from './componenets/Home/Home';
import Contact from './componenets/contact/Contact';
import Faqs from './componenets/Faqs/Faqs';
import View from './componenets/View/View';
import Form from './componenets/Form/Form';
import Invoice from './componenets/Invoice/Invoice';
import SignupLogin from './componenets/signup/Signup';
import NotFound from './componenets/Not-Found';
import Profile from './componenets/Profile/Profile';
import Dashboard from './componenets/Admin/Dashboard';
import EditUser from './componenets/EditUser/EditUser';
import UserDashBoard from './componenets/User/UserDashbord';
import BatchProgressView from './componenets/ScanPage/BatchProgressView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className='appcontainerbakground'>
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/viewpage" element={<View />} />
          <Route
            path="/auth"
            element={<SignupLogin setIsAuthenticated={setIsAuthenticated} />}
          />

          {isAuthenticated && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edituser" element={<EditUser />} />
              <Route path="/product" element={<Product />} />
              <Route path="/form" element={<Form />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/userdashboard" element={<UserDashBoard />} />
               <Route path="/batchprogress" element={<BatchProgressView />} />
              <Route
                path="/profile"
                element={<Profile setIsAuthenticated={setIsAuthenticated} />}
              />
            </>
          )}

          <Route path="*" element={<NotFound />} />
         
        </Routes>

        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={1000}            
          hideProgressBar={false}      
          newestOnTop={true}
          closeOnClick
          pauseOnHover={false}
          draggable={false}
          theme="colored"            
        />
      </div>
    </Router>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default App;
