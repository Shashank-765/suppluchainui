import './App.css';
import React, { useState, useEffect } from 'react';
import Footer from './componenets/Footer/Footer';
import Navbar from './componenets/Navbar/Navbar';
import Product from './componenets/Product/Product';
import Home from './componenets/Home/Home';
import Contact from './componenets/contact/Contact';
import Faqs from './componenets/Faqs/Faqs';
import View from './componenets/View/View';
import Invoice from './componenets/Invoice/Invoice';
import SignupLogin from './componenets/signup/Signup';
import NotFound from './componenets/Not-Found';
import Profile from './componenets/Profile/Profile';
import Dashboard from './componenets/Admin/Dashboard';
import UserDashBoard from './componenets/User/UserDashbord';
import BatchProgressView from './componenets/BatchViewProgress/BatchProgressView';
import NotificationPage from './componenets/Notifications/NotificationPage';
import ScreeningPage from './componenets/QrscanerPage/ScreeningPage';
import { ToastContainer } from 'react-toastify';
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import PrivacyPolicy from './componenets/privacyPolicy/PrivacyPolicy';
import About from './componenets/About/About';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData(parsed);
      setIsAuthenticated(true);
    }
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const userData = JSON.parse(localStorage.getItem("user"));
  //       if (!userData?.token) return;

  //       const res = await axios.post(
  //         `${process.env.REACT_APP_BACKEND_URL}/users/renewtoken?userId=${userData?._id}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${userData.token}`,
  //           },
  //         }
  //       );

  //       const updatedUser = { ...userData, token: res.data.token };
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     } catch (err) {
  //       console.error("Token renewal failed", err);
  //     }
  //   }, 270000); 

  //   return () => clearInterval(interval);
  // }, []);

  const userType = userData?.userType;

  return (
    <Router>
      <ScrollToTop />
      <div className="appcontainerbakground">
        <Navbar isAuthenticated={isAuthenticated} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/product" element={<Product />} />
          <Route path="/viewpage" element={<View />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />


          {!isAuthenticated && (
            <Route
              path="/auth"
              element={<SignupLogin setIsAuthenticated={setIsAuthenticated} setUserData={setUserData} />}
            />
          )}

          {isAuthenticated && userType === 'admin' && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/userdashboard" element={<UserDashBoard />} />
              <Route path="/batchprogress" element={<BatchProgressView />} />
              <Route path="/screening" element={<ScreeningPage />} />
              <Route
                path="/profile"
                element={<Profile setIsAuthenticated={setIsAuthenticated} />}
              />
            </>
          )}

          {isAuthenticated && userType === 'user' && (
            <>
              <Route path={`/${userData?.role?.label}/userdashboard`} element={<UserDashBoard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/batchprogress" element={<BatchProgressView />} />
              <Route path="/screening" element={<ScreeningPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route
                path="/profile"
                element={<Profile setIsAuthenticated={setIsAuthenticated} />}
              />
            </>
          )}
          {isAuthenticated &&
            userType !== 'user' &&
            userType !== 'admin' && (
              <>
                <Route path="/product" element={<Product />} />
                <Route path="/invoice" element={<Invoice />} />
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
          theme="light"
          style={{ marginTop: '80px' }}
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
