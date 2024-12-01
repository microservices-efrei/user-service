const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use('/users', userRoutes);
