const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
require('./config.js');
const jwt = require('jsonwebtoken');
const { generateToken } = require('./Auth/Authenticate.js')
const { router: paymentRoutes, webhookHandler } = require('./Routes/paymentRoutes.js');
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
app.use(morgan('dev'));
dotenv.config();
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true
}));
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static('uploads'));
app.use('/api/users', require('./Routes/userRoutes.js'));
app.use('/api/batch', require('./Routes/batchRoutes.js'));
app.use('/api/products', require('./Routes/productsRoutes.js'));
app.use('/api/payments', paymentRoutes);
app.use('/api/notify', require('./Routes/notificationRoutes.js'));
app.post("/api/refreshtoken", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    console.log("No refresh token found in cookies");
    return res.status(401).json({ message: "No refresh token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("Token successfully decoded:", decoded);
    const accessToken = generateToken(decoded.id);
    res.json({ accessToken });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
