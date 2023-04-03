const { validationResult } = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Vendor = require('../models/vendor');
const Vendor_Service = require('../models/vendor-service');
const User = require('../models/user');
const Login = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Marketing = require('../models/marketing-screens');
const Banners = require('../models/banner');

exports.addAdminLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    try {
        const hashedPassword = await bcrypt
            .hash(password, 12);
        if (!hashedPassword) {
            const error = new Error('password not hashed');
            error.statusCode = 401;
            throw error;
        }
        await Login.create({
            email: email,
            password: hashedPassword,
            type: type
        })
        res.status(201).json({ message: "login successsfully" });
    } catch (err) {
        if (!err.statusCode) {
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
                email: user.email,
                userId: user.id
            },
            'somesupersecretsecret'
        );
        user.token = token;
        const savedUser = await user.save();
        res.status(201).json({ user: savedUser, status: true, message: "login successfully" });
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
    if (!req.files.logo) {
        return res.status(422).json({
            message: 'logo not provided', status: 'false'
        });
    }
    const occasion = await Occasion.create({
        occasion: req.body.occasion,
        logo: req.files.logo[0].filename,
        status: "active"
    })
    try {
        if (!occasion) {
            const error = new Error('occasion not create');
            error.statusCode = 400;
            throw error;
        }
        res.status(201).json({ occasion: occasion, status: true, message: "occasion added successfully" });
    } catch (err) {
        if (!err.statusCode) {
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
    // if (!req.files) {
    //     return res.status(422).json({
    //         message: 'image not provided', status: 'false'
    //     });
    // }
    const vendor = await Vendor.create({
        name: req.body.name,
        email: email,
        phone: req.body.phone,
        outlet_name: req.body.outlet_name,
        outlet_address: req.body.outlet_address,
        outlet_contact: req.body.outlet_contact,
        outlet_description: req.body.outlet_description,
        status: "continue"
        //    outlet_image: req.files.outlet[0].filename
    });
    try {
        if (!vendor) {
            const error = new error('vendor not created');
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
            email: email,
            password: hashedPassword,
            type: "vendor"
        })
        for (v of req.body.vendorservice) {
            const vendorService = await Vendor_Service.create({
                service: v,
                vendorId: vendor.id
            })
        }
        res.status(200).json({ vendor: vendor, message: "vendor added succesfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postAddServices = async (req, res, next) => {
    if (!req.files.logo) {
        return res.status(422).json({
            message: 'logo not provided', status: 'false'
        });
    }
    const service = await Service.create({
        service: req.body.service,
        logo: req.files.logo[0].filename,
        status: "active"
    })
    try {
        if (!service) {
            const error = new Error('service not created');
            error.statusCode = 401;
            throw error;
        }
        res.status(201).json({ service: service, message: "service add succesfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
}

exports.postAddCategory = async (req, res, next) => {
    let image;
    const category = await Category.create({
        category: req.body.category,
        address: req.body.address,
        description: req.body.description,
        type: req.body.type,
        serviceId: req.body.serviceId,
        vendorId: req.body.vendorId
    });
    try {
        if (!category) {
            const error = new Error('category not created');
            error.statusCode = 401;
            throw error;
        }
        console.log(req.files.image);
        for (i of req.files.image) {
            image = await Category_Image.create({
                image: i.filename,
                categoryId: category.id
            })
        }
        res.status(201).json({ category: category, image: image, message: "category added succesfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getOccasion = async (req, res, next) => {
    const occasion = await Occasion.findAll();
    try {
        if (!occasion) {
            const error = new Error('occasion not created');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ occasion: occasion });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getService = async (req, res, next) => {
    let avlVendor = [], findVendor = 0;
    const service = await Service.findAll();
    try {
        if (!service) {
            const error = new Error('service not found');
            error.statusCode = 404;
            throw error;
        }
        for (f of service) {
            const vendors = await Vendor_Service.findAll({ where: { service: f.id } });
            for (v of vendors) {
                findVendor++;
            }
            avlVendor.push(f, findVendor);
            findVendor = 0;
        }
        res.status(200).json({ vendor: avlVendor });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    const user = await User.findAll();
    try {
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ user: user });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getallVendors = async (req, res, next) => {
    const vendor = await Vendor.findAll();
    try {
        if (!vendor) {
            const error = new Error('vendor not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ vendor: vendor });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditOccasion = async (req, res, next) => {
    const occasionId = req.params.id;
    const occasion = await Occasion.findByPk(occasionId);
    try {
        if (!occasion) {
            const error = new Error('occasion not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ occasion: occasion, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditOccasion = async (req, res, next) => {
    const occasionId = req.body.occasionId;
    const occasion = await Occasion.findByPk(occasionId);
    try {
        if (!occasion) {
            const error = new Error('occasion not found');
            error.statusCode = 401;
            throw error;
        }
        if (req.files.logo) {
            occasion.logo = req.files.logo[0].filename
        }
        occasion.occasion = req.body.occasion;
        const updateOccasion = await occasion.save();
        res.status(200).json({
            occasion: updateOccasion
            , status: true
            , message: 'occasion updated successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditService = async (req, res, next) => {
    const serviceId = req.params.id;
    const service = await Service.findByPk(serviceId);
    try {
        if (!service) {
            const error = new Error('service not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ service: service, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditService = async (req, res, next) => {
    const serviceId = req.body.serviceId;
    const service = await Service.findByPk(serviceId);
    try {
        if (!service) {
            const error = new Error('service not found');
            error.statusCode = 401;
            throw error;
        }
        if (req.files.logo) {
            service.logo = req.files.logo[0].filename
        }
        service.service = req.body.service;
        const updateService = await service.save();
        res.status(200).json({
            occasion: updateService
            , status: true
            , message: 'service updated successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeOccasionStatus = async (req, res, next) => {
    const status = req.body.status;
    const occasionId = req.body.occasionId;
    const occasion = await Occasion.findByPk(occasionId);
    try {
        if (!occasion) {
            const error = new Error('occasion not found');
            error.statusCode = 401;
            throw error;
        }
        occasion.status = status;
        const savedOccasion = await occasion.save();
        res.status(200).json({ occasion: savedOccasion
            , message: 'occasion updated successfully'
            , status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
}

exports.changeServiceStatus = async (req, res, next) => {
    const serviceId = req.body.serviceId;
    const status = req.body.status;
    const service = await Service.findByPk(serviceId);
    try {
        if (!service) {
            const error = new Error('service not found');
            error.statusCode = 401;
            throw error;
        }
        service.status = status;
        const updateService = await service.save();
        res.status(200).json({
            occasion: updateService
            , status: true
            , message: 'service updated successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeVendorStatus = async (req, res, next) => {
    const status = req.body.status;
    const vendorId = req.body.vendorId;
    const vendor = await Vendor.findByPk(vendorId);
    try{
        if(!vendor){
            const error = new Error('vendor not found');
            error.statusCode = 400;
            throw error; 
        }
        vendor.status = status;
        const savedVendor = await vendor.save();
        res.status(200).json({vendor:savedVendor
        , message: "vendor status updated"
        , status: true
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.logout = async (req, res, next) => {
 const userId = req.userId;
 const user = await Login.findByPk(userId); 
 try{
    if(!user){
        const error = new Error('user not found');
        error.statusCode = 400;
        throw error; 
    }
    user.token = '';
    await user.save();
    res.status(200).json({message: "logout successfully"
    , status: true
    })
} catch (err) {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.addMarketingImage = async (req,res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    if(!req.files.marketing){
        return res.status(422).json({
            message: 'image not provided', status: 'false'
        });        
    }
    const image = req.files.marketing[0].filename;
    const marketing = await Marketing.create({
        image: image   
    });
    try{
        if(!marketing){
        const error = new Error('marketing image not created');
        error.statusCode = 400;
        throw error;             
        }
    res.status(201).json({marketingImage:marketing
        , message: "image addes successsfully"
        , status: true
    })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    if(!req.files.banner){
        return res.status(422).json({
            message: 'image not provided', status: 'false'
        });        
    }
    const image = req.files.banner[0].filename;
    const banner = await Banners.create({
        image: image   
    });
    try{
        if(!banner){
        const error = new Error('banner image not created');
        error.statusCode = 400;
        throw error;             
        }
    res.status(201).json({banner:banner
        , message: "banner addes successsfully"
        , status: true
    })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditMarketingImage = async (req, res, next) => {
const userId = req.userId;
const user = await Login.findByPk(userId);
if(user.type !== "admin"){
    return res.status(422).json({
        message: 'you are not admin', status: true
    });  
}
 const marketingId = req.params.id;
 const marketing = await Marketing.findByPk(marketingId);
 try{
    if(!marketing){
    const error = new Error('image not found');
    error.statusCode = 400;
    throw error;             
    }
    res.status(201).json({marketing:marketing
    , status: true
})
} catch (err) {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}   
}

exports.postEditMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    const marketingId = req.body.marketingId;
    const marketing = await Marketing.findByPk(marketingId);
    try{
       if(!marketing){
       const error = new Error('image not found');
       error.statusCode = 400;
       throw error;             
       }
       if(req.files.marketing){
        marketing.image = req.files.marketing[0].filename;
       }
       const updateMarketing = await marketing.save();
       res.status(201).json({marketing:updateMarketing
       , status: true
   })
   } catch (err) {
       if(!err.statusCode){
           err.statusCode = 500;
       }
       next(err);
   }   
   }

exports.deleteMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    const marketingId = req.params.id;
    const marketing = await Marketing.findByPk(marketingId);
    try{
        if(!marketing){
        const error = new Error('image not found');
        error.statusCode = 400;
        throw error;             
        }
        await marketing.destroy();
        res.status(201).json({meassage: "delete successfully"
        , status: true
    })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }   
}

exports.getEditBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    const bannerId = req.params.id;
    const banner = await Banners.findByPk(bannerId);
    try{
       if(!banner){
       const error = new Error('image not found');
       error.statusCode = 400;
       throw error;             
       }
       res.status(201).json({banner:banner
       , status: true
   })
   } catch (err) {
       if(!err.statusCode){
           err.statusCode = 500;
       }
       next(err);
   }   
   }
   
exports.postEditBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    const bannerId = req.body.bannerId;
    const banner = await Banners.findByPk(bannerId);
    try{
        if(!banner){
        const error = new Error('image not found');
        error.statusCode = 400;
        throw error;             
        }
        if(req.files.banner){
         banner.image = req.files.banner[0].filename;
        }
        const updateBanner = await banner.save();
        res.status(201).json({banner:updateBanner
        , status: true
    })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteBanners = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if(user.type !== "admin"){
        return res.status(422).json({
            message: 'you are not admin', status: true
        });  
    }
    const bannerId = req.params.id;
    const banner = await Banners.findByPk(bannerId);
    try{
       if(!banner){
       const error = new Error('image not found');
       error.statusCode = 400;
       throw error;             
       }
       await banner.destroy();
        res.status(201).json({meassage: "delete successfully"
        , status: true
    })
   } catch (err) {
       if(!err.statusCode){
           err.statusCode = 500;
       }
       next(err);
   }   
   }