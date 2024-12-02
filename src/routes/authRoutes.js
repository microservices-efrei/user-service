const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/register', authController.createUser);
router.post('/login', authController.login);

module.exports = router;
