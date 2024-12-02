const express = require('express');
const userRoutes = require('./userRoutes');

const app = express();

app.use('/users', userRoutes);

module.exports = app;
