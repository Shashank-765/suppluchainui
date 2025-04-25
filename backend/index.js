const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config.js');
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/uploads", express.static('uploads'));
app.use('/api/users', require('./Routes/userRoutes.js'));
app.use('/api/batch', require('./Routes/batchRoutes.js'));
app.use('/api/products', require('./Routes/productsRoutes.js'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});