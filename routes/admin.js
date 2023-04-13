const express = require('express');
const router = express();
const adminController = require('../controllers/admin');
const { body } = require('express-validator/check');
const Vendor = require('../models/vendor');
const isAuth = require('../middleware/is-auth');
const Employe = require('../models/employe');

router.post('/add-login', isAuth,adminController.addAdminLogin);

router.post('/login' , adminController.login);

router.post('/occasion' , isAuth, adminController.postOccasion);

router.post('/service', isAuth, adminController.postAddServices);

router.post('/add-vendor', isAuth, [
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
    body('phone').isNumeric().withMessage('only numbers....'), 
    body('password').isLength({min:6}).withMessage('minimum 6 digit password required..')
],adminController.postAddVendor);

router.post('/category', isAuth, adminController.postAddCategory);

router.get('/get-occasion', isAuth, adminController.getOccasion);

router.get('/get-service', isAuth,adminController.getService);

router.get('/get-user', isAuth, adminController.getUser);

router.get('/get-vendor-details', isAuth, adminController.getallVendors);

router.get('/get-edit-occasion/:id', isAuth, adminController.getEditOccasion);

router.post('/post-edit-occasion', isAuth, adminController.postEditOccasion);

router.get('/get-edit-service/:id', isAuth, adminController.getEditService);

router.post('/post-edit-service', isAuth, adminController.postEditService);

router.post('/change-occasion-status', isAuth , adminController.changeOccasionStatus);

router.post('/change-service-status', isAuth , adminController.changeServiceStatus);

router.post('/change-vendor-status', isAuth,adminController.changeVendorStatus);

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

router.post('/change-vendor-occasion-status' , isAuth, adminController.changeVendorOccasionStatus);

router.post('/change-vendor-service-status', isAuth, adminController.changeVendorServiceStatus);

router.post('/add-cancel-question', isAuth, adminController.eventCancelQuestion);

router.post('/add-employe',  [
    body('name').isLength({min: 3}).withMessage('name at least 3 characters'),
    body('email').isEmail().withMessage('email is not valid')
    .custom((value, { req }) => {
        return Employe.findAll({ where: { email:value } })
            .then(user => {
                if (user.length > 0) {
                    return Promise.reject('email exist,please pick another one...');
                }
            })
    }),
    body('phone').isNumeric().withMessage('only numbers....'),
    body('password').isLength({min:6}).withMessage('minimum 6 digit password required..'), 
], isAuth, adminController.addEmploye);

router.get('/get-all-rm', isAuth, adminController.getAllRm);

router.get('/get-all-dem', isAuth, adminController.getAllDem);

router.get('/get-edit-employe-details/:id', isAuth, adminController.getEditEmployeDetails);

router.post('/post-edit-employe-details', isAuth, adminController.postEditEmployeDetails);

router.post('/change-employe-status', isAuth, adminController.changeEmployeStatus);

router.get('/dashboards', isAuth, adminController.dashBoards);

router.get('/get-edit-category/:id', isAuth, adminController.getEditCategory);

router.post('/post-edit-category', isAuth, adminController.postEditCategory);

router.post('/get-specific-service', isAuth, adminController.getSpecificService);

router.post('/add-invitation', isAuth, adminController.addInvitation);

router.post('/get-specific-service-category', isAuth, adminController.getSpecificServiceCategory);

router.post('/post-update-vendor', isAuth, adminController.postUpdateVendor);

router.get('/get-user-service-details/:eventId', isAuth, adminController.getUserServiceDetails);

router.post('/send-quotation-to-user', isAuth, adminController.sendQuotationToUser);

router.get('/cancel-booking', isAuth, adminController.cancelBookings);

router.get('/accepted-booking', isAuth, adminController.acceptedBookings);

router.get('/completed-booking', isAuth, adminController.completedBookings);

router.get('/get-invitation-card', isAuth, adminController.getInvitationCard);

module.exports = router;




