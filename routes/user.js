const express = require('express');
const router = express();
const { body } = require('express-validator/check');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

router.post('/add-guest', [
  body('first_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
  body('last_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
  body('email').isEmail().withMessage('email formate is wrong')
], isAuth, userController.postAddGuest);

router.get('/get-user-event', isAuth, userController.eventPage);

router.get('/dashboard', isAuth, userController.dashboard);

router.get('/get-category/:id', isAuth, userController.getCategoryPage)

router.post('/search-service', isAuth, userController.searchServices);

router.post('/search-category', isAuth, userController.searchCategory);

router.post('/search-occasion', isAuth, userController.searchOccasion);

router.post('/get-venue-address', isAuth, userController.getVenueAddress);

router.post('/add-event-details', isAuth, userController.addEventDate);

router.post('/edit-event-service', isAuth, userController.editEventService);

// router.post('/add-event-occasion', isAuth, userController.addEventOccasion);

// router.post('/add-event-guest-list', isAuth, userController.addEventGuest);

// router.post('/add-event-budget', isAuth, userController.addEventBudget);

router.post('/search-guest-list', isAuth, userController.searchGuestList);

router.post('/add-event-service', isAuth, userController.addEventVenue);

router.get('/get-event-quotation', isAuth, userController.getQuotation);

router.get('/get-marketing-image', isAuth, userController.getMarketingScreen);

router.get('/get-banner-image', isAuth, userController.getBanner);

router.get('/get-service-page', isAuth, userController.getServicePage);

router.get('/get-specific-category/:id', isAuth, userController.getSpecificCategory);

router.post('/delete-category', isAuth, userController.postDeleteCategory);

router.post('/delete-service', isAuth, userController.postDeleteService);

router.get('/send-quotation/:id', isAuth, userController.postSendQuotation);

router.get('/get-user-guest', isAuth, userController.getUserGuest);

router.get('/get-invitation-image', isAuth, userController.getInvitationImage);

router.post('/send-invitation', isAuth, userController.sendInvitation);

router.get('/get-quotation-from-rm/:id', isAuth, userController.getQuotationFromRm);

router.post('/post-user-status', isAuth, userController.postUserStatus);

module.exports = router;




