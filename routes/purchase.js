const express = require('express');

const purchasePremium = require('../controllers/purchase');
const authenticateUser = require('../authMiddleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticateUser.authenticate, purchasePremium.getpurchasePremium);

router.post('/updatetransactionstatus', authenticateUser.authenticate, purchasePremium.postTransactionStatus);

module.exports = router;