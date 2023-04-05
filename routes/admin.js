const express = require('express');
const router = express();
const adminController = require('../controllers/admin');
const { body } = require('express-validator/check');
const Vendor = require('../models/vendor');
const isAuth = require('../middleware/is-auth');

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

router.get('/get-edit-occasion/:id', adminController.getEditOccasion);

router.post('/post-edit-occasion', adminController.postEditOccasion);

router.get('/get-edit-service/:id', adminController.getEditService);

router.post('/post-edit-service', adminController.postEditService);

router.post('/change-occasion-status' , adminController.changeOccasionStatus);

router.post('/change-service-status' , adminController.changeServiceStatus);

router.post('/change-vendor-status', adminController.changeVendorStatus);

router.get('/logout', isAuth , adminController.logout);

router.post('/add-marketing-screens', isAuth ,adminController.addMarketingImage);

router.post('/add-banner', isAuth, adminController.addBanner);

router.get('/get-edit-marketing-images/:id', isAuth, adminController.getEditMarketingImage);

router.post('/post-edit-marketing-images', isAuth, adminController.postEditMarketingImage);

router.get('/delete-marketing-image/:id', isAuth, adminController.deleteMarketingImage);

router.get('/get-edit-banner/:id', isAuth, adminController.getEditBanner);

router.post('/post-edit-banner', isAuth, adminController.postEditBanner);

router.get('/delete-banner/:id', isAuth, adminController.deleteBanners);

router.post('/post-add-vendor-service', isAuth, adminController.postAddVendorService);

router.get('/get-specific-vendor-details/:id', isAuth, adminController.getSpecificVendor)

router.get('/get-specific-vendor-occasion/:id', isAuth, adminController.getSpecificVendorOccasion)

router.get('/get-specific-vendor-service/:id', isAuth, adminController.getSpecificVendorService)

router.post('/get-specific-vendor-category', isAuth, adminController.getSpecificVendorCategory);

router.get('/requested-event', isAuth, adminController.userRequestedEvent);

module.exports = router;




