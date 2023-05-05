const express = require('express');

const premiumUser = require('../controllers/premium');
const downloadFile = require('../controllers/userController');
const authenticateUser = require('../authMiddleware/auth');

const router = express.Router();

// router.get('/allexpenses', authenticateUser.authenticate, premiumUser.getAllExpensesFromDB);

// router.get('/user/download', authenticateUser.authenticate, downloadFile.downloadExpense);

// router.get('/user/download/all', authenticateUser.authenticate, downloadFile.downloadExpenseAll);

module.exports = router;