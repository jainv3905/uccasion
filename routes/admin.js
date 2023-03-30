const express = require('express');
const router = express();
const adminController = require('../controllers/admin');

router.post('/occasion', adminController.postOccasion);

router.post('/service', adminController.postAddServices);

router.post('/category', adminController.postAddCategory);

module.exports = router;