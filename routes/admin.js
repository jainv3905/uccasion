const express = require('express');
const router = express();
const adminController = require('../controllers/admin');

router.post('/add-login', adminController.addAdminLogin);

router.post('/login', adminController.login);

router.post('/occasion', adminController.postOccasion);

router.post('/service', adminController.postAddServices);

router.post('/add-vendor', adminController.postAddVendor);

router.post('/category', adminController.postAddCategory);

router.get('/get-occasion', adminController.getOccasion);

router.get('/get-service',adminController.getService);

router.get('/get-user', adminController.getUser);

module.exports = router;