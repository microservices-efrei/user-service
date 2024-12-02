const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

const app = express();

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

module.exports = app;
