const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config.js');
const { router: paymentRoutes, webhookHandler } = require('./Routes/paymentRoutes.js');
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
connectDB();


app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);
app.use(express.json());
app.use("/uploads", express.static('uploads'));
app.use('/api/users', require('./Routes/userRoutes.js'));
app.use('/api/batch', require('./Routes/batchRoutes.js'));
app.use('/api/products', require('./Routes/productsRoutes.js'));
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});