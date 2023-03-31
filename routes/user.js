const express = require('express');
const router = express();
const { body } = require('express-validator/check');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

router.post('/add-guest', [
  body('first_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
  body('last_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
  body('email').isEmail().withMessage('email formate is wrong'),
  body('age').isNumeric().withMessage('only numbers required in age feild'),
], isAuth, userController.postAddGuest);

router.get('/get-user-event', isAuth, userController.eventPage);

router.get('/first-page', isAuth, userController.firstPage);

router.get('/second-page/:id', isAuth, userController.getCategoryPage)

router.post('/search-service', isAuth, userController.searchServices);

router.post('/search-category', isAuth, userController.searchCategory);

router.post('/get-venue-address', isAuth, userController.getVenueAddress);

router.post('/add-event-date', isAuth, userController.addEventDate);

router.post('/add-event-occasion', isAuth, userController.addEventOccasion);

router.post('/add-event-guest-list', isAuth, userController.addEventGuest);

router.post('/add-event-budget', isAuth, userController.addEventBudget);

router.post('/add-event-venue', isAuth, userController.addEventVenue);

module.exports = router;