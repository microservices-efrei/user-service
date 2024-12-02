const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const verifyToken = require('../middleware/jwt');

router.get('/:id', verifyToken, userController.getUserProfile);
router.put('/:id', verifyToken, userController.updateUserProfile);
router.delete('/:id', verifyToken, userController.deleteUser);
router.get('/', verifyToken, userController.listUsers);

module.exports = router;
