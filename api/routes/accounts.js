const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const StudentsController = require('../controllers/accounts/students');
const AccountsController = require('../controllers/accounts/accounts')

router.get('/', AccountsController.get_all_accounts);
router.patch('/:accountId', AccountsController.update_student);
router.delete('/:accountId', AccountsController.delete_account);
router.get('/students', StudentsController.get_all_students);
router.post('/students', StudentsController.create_student);
router.get('/:accountId', AccountsController.get_account);



module.exports = router;
