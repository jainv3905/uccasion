const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgmail = require('@sendgrid/mail')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// const sgmailapikey = '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'
// sgmail.setApiKey(sgmailapikey);

exports.postSignup = async (req, res, next) => {
    const email = req.body.email
    const user = await User.findOne({where:{email:email}});
    const errors = validationResult(req);
    try{
    if(user){
      const error = new Error('email already exist please pick another one');
      error.statusCode = 400;
      throw error;
    }
    if (!errors.isEmpty()) {
      return res.status(422).json({
          errorMessage: errors.array()[0].msg,
      });
  }
    const newUser = await User.create({
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      email:email,
      phone:req.body.phone
    })
    res.status(201).json({message: 'user created', status:true});
    } catch(err) {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    }   
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
    });
  }
  const user = await User.findOne({where: {email:email}});
  try{
    if(!user){
      const error = new Error('user not found with this email');
      error.statusCode = 400;
      throw error;
    }
      // const mailOption = {
      //   to: email,
      //   from: 'vinitabhansali123@gmail.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // }
      // sgmail.send(mailOption,(err,info) => {
      //   if(err){
      //     console.log(err);
      //   }else{
      //     console.log(info);
      //   }
      // })
    const otp = Math.round(Math.random()*10000);
    user.otp = otp;
    await user.save();
    res.status(200).json({'message': "otp send", otp:otp});
  } catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.otp = async (req, res, next) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
    });
  }
  const user = await User.findOne({where:[{email:email},{otp:otp}]});
  try{
  if(!user){
    const error = new Error('user not found');
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign(
    {
        email:user.email,
        userId: user.id
    },
    'somesupersecretsecret'
);
  user.token = token;
  const savedUser = await user.save();
  res.status(201).json({user:savedUser,status:true});
  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}