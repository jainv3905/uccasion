const express = require('express');
const router = express();
const adminController = require('../controllers/admin');
const { body } = require('express-validator/check');
const Vendor = require('../models/vendor');

router.post('/add-login', adminController.addAdminLogin);

router.post('/login', adminController.login);

router.post('/occasion', adminController.postOccasion);

router.post('/service', adminController.postAddServices);

router.post('/add-vendor', [
    body('name').isLength({min: 3}).withMessage('name at least 3 characters'),
    body('email').isEmail().withMessage('email is not valid')
    .custom((value, { req }) => {
        return Vendor.findAll({ where: { email:value } })
            .then(user => {
                if (user.length > 0) {
                    return Promise.reject('email exist,please pick another one...');
                }
            })
    }),
    body('phone').isLength({min:6, max:6}).withMessage('phone must be 6 digit'), 
],adminController.postAddVendor);

router.post('/category', adminController.postAddCategory);

router.get('/get-occasion', adminController.getOccasion);

router.get('/get-service',adminController.getService);

router.get('/get-user', adminController.getUser);

router.get('/get-vendor-details', adminController.getallVendors);

module.exports = router;