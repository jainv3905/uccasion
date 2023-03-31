const {validationResult} = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Vendor = require('../models/vendor');
const Vendor_Service = require('../models/vendor-service');
const User = require('../models/user');
const Login = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.addAdminLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const hashedPassword = await bcrypt
        .hash(password, 12);
    if (!hashedPassword) {
        const error = new Error('password not hashed');
        error.statusCode = 401;
        throw error;
    }
    await Login.create({
        email:email,
        password:hashedPassword
    })
    res.status(201).json({message:"login successsfully"});
    } catch(err){
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        const user = await Login.findOne({ where: { email: email } });
        if (!user) {
            const error = new Error('user not Exist');
            error.statusCode = 404;
            throw error;
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.status(500).json({ error: 'invalid password' });
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
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postOccasion = async (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
    });
  }
    const occasion = await Occasion.create({
        occasion:req.body.occasion,
        logo:req.files.logo[0].filename,
        status: "active"
    })
    try{
        if(!occasion){
            const error = new Error('occasion not create');
            error.statusCode = 400;
            throw error;
        }
        res.status(201).json({occasion:occasion, status:true});
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postAddVendor = async (req, res, next) => {
 const password = req.body.password;
 const email = req.body.email;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
    });
}
 const vendor = await Vendor.create({
   name: req.body.name,
   email: email,
   phone: req.body.phone,
   address: req.body.address,
   company: req.body.company,
 });
 try{
    if(!vendor){
        const error = new Error('vendor not created');
        error.statusCode = 401;
        throw error;
    }
    const hashedPassword = await bcrypt
    .hash(password, 12);
    if (!hashedPassword) {
    const error = new Error('password not hashed');
    error.statusCode = 401;
    throw error;
}
    await Login.create({
    email:email,
    password:hashedPassword
})
    for(v of req.body.vendorservice){
    const vendorService = await Vendor_Service.create({
        service: v,
        vendorId : vendor.id
    })
    }
    res.status(200).json({vendor:vendor});
 } catch (err){
    if(!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
 }
}

exports.postAddServices = async (req, res, next) => {
    console.log(req.files.logo[0].filename);
    const service = await Service.create({
        service: req.body.service,
        logo:req.files.logo[0].filename,
        status:"active"
    })
    try{
        if(!service){
            const error = new Error('service not created');
            error.statusCode = 401;
            throw error;
        }
        res.status(201).json({service:service, status:true});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }
}

exports.postAddCategory = async (req, res, next) => {
    let image;
    const category = await Category.create({
        category:req.body.category,
        address:req.body.address,
        description:req.body.description,
        type:req.body.type,
        serviceId: req.body.serviceId,
        vendorId: req.body.vendorId
    });
    try{
        if(!category){
            const error = new Error('category not created');
            error.statusCode = 401;
            throw error;
        }
        console.log(req.files.image);
        for(i of req.files.image){
            image = await Category_Image.create({
                image:i.filename,
                categoryId:category.id
            })
        }
        res.status(201).json({category:category,image:image ,status: true});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getOccasion = async (req, res, next) => {
    const occasion = await Occasion.findAll();
    try{
        if(!occasion){
            const error = new Error('occasion not created');
            error.statusCode = 401;
            throw error;
        }
    res.status(200).json({occasion:occasion});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getService = async (req, res, next) => {
    let avlVendor = [], findVendor = 0; 
    const service = await Service.findAll();
    try{
        if(!service){
            const error = new Error('service not found');
            error.statusCode = 404;
            throw error;
        }
        for(f of service){
            const vendors = await Vendor_Service.findAll({where:{service:f.id}});
            for (v of vendors) {
                findVendor++;
            }
            avlVendor.push(f,findVendor);
            findVendor = 0;
        }
        res.status(200).json({vendor:avlVendor});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    const user = await User.findAll();
    try{
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 401;
            throw error;
        }
    res.status(200).json({user:user});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }   
}