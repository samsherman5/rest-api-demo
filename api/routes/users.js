const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.post('/signup', UsersController.create_user);

router.post('/login', UsersController.login_create_token);

router.delete('/:userId', UsersController.delete_user);

module.exports = router;
