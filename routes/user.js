const express = require('express');
const router = express();
const { body } = require('express-validator/check');
const { authPlugins } = require('mysql2');
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

router.get('/get-venue-address', isAuth, userController.getVenueAddress);

router.post('/add-event-date', isAuth, userController.addEventDate);

module.exports = router;