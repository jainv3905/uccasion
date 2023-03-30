const express = require('express');
const router = express();
const authController = require('../controllers/auth');
const { body } = require('express-validator/check');

router.post('/signup', [
    body('first_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
    body('last_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
    body('email').isEmail().withMessage('email formate is wrong'),
    body('phone').isNumeric().withMessage('only numbers....').isLength({ min: 6, max: 6 })
    .withMessage('phone number must be 6 digit')
], authController.postSignup);

router.post('/login',[
    body('email').isEmail().withMessage('email formate is wrong'),
], authController.login);

router.post('/otp',[
    body('email').isEmail().withMessage('email formate is wrong'),
    body('otp').isLength({max:4, min:4}).withMessage('otp is only 4 digits...')
], authController.otp);

module.exports = router;