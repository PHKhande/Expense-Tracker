const express = require('express');

const expenses = require('../controllers/expenses');
const authenticateUser = require('../authMiddleware/auth');

const router = express.Router();

router.get('/all', authenticateUser.authenticate, expenses.getAllExpenses);

router.post('/add', authenticateUser.authenticate, expenses.postExpense);

router.delete('/:delId', authenticateUser.authenticate, expenses.delExpense);

module.exports = router;