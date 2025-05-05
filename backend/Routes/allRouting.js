const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { router: paymentRoutes, webhookHandler } = require('./allRoutes/paymentRoutes.js');


app.post('/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);
app.use(express.json());
app.use(cookieParser());
app.use('/users', require('./allRoutes/userRoutes.js'));
app.use('/batch', require('./allRoutes/batchRoutes.js'));
app.use('/products', require('./allRoutes/productsRoutes.js'));
app.use('/payments', paymentRoutes);
app.use('/notify', require('./allRoutes/notificationRoutes.js'));
app.use("/refreshtoken",require('../Auth/newToken.js'))


module.exports = app;