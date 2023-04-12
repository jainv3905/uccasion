const express = require('express');
const router = express();
const authController = require('../controllers/auth');
const { body } = require('express-validator/check');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

router.post('/signup', [
    body('first_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
    body('last_name').isLength({ min: 3 }).withMessage('minimum 3 alphabates requires...'),
    body('email').isEmail().withMessage('email formate is wrong'),
    body('phone').isNumeric().withMessage('only numbers....').custom((value, { req }) => {
        return User.findAll({ where: { phone:value } })
            .then(user => {
                if (user.length > 0) {
                    return Promise.reject('phone no exist,please pick another one...');
                }
            })
    })
], authController.postSignup);

router.post('/user-login',[
    body('phone').isNumeric().withMessage('only numbers....')
], authController.login);

router.post('/otp',[
    body('phone').isNumeric().withMessage('only numbers....'),
    body('otp').isLength({max:6, min:6}).withMessage('otp is only 6 digits...')
], authController.otp);

router.get('/user-details', isAuth, authController.userDeatils);

module.exports = router;