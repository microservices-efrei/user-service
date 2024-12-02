const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/register', userController.createUser);
router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);
router.delete('/:id', userController.deleteUser);
router.get('/', userController.listUsers);

module.exports = router;
