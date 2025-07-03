const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
require('./Auth/db.js');
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');
app.use(morgan('dev'));
dotenv.config();

app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true
}));

app.use("/api/uploads", express.static('uploads'));
app.use(helmet());

app.use('/api',require('./Routes/Routes.js'))


app.get('/api', (req, res) => {
  res.json({ message: 'NOde API is working! === : 9000' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
