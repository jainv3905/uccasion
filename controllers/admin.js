const { validationResult } = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Vendor_Service = require('../models/vendor-service');
const User = require('../models/user');
const Login = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Marketing = require('../models/marketing-screens');
const Banners = require('../models/banner');
const Event = require('../models/event');
const Event_Service = require('../models/event-service');
const EventCancelQuestion = require('../models/eventCancelQuestion');
const Employe = require('../models/employe');
const RequestedEvent = require('../models/requestedEvent');
const Invitation = require('../models/invitation');
const Vendor = require('../models/vendor');
const Quotation = require('../models/quotation');
const { Sequelize } = require('sequelize');
require('dotenv').config();

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
        res.status(201).json({ message: "login successsfully", status: true });
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
    const type = req.body.type
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        const user = await Login.findOne({ where: [{ email: email }, { type: type }] });
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
    if (!req.files) {
        return res.status(422).json({
            message: 'logo not provided', status: 'false'
        });
    }
    const occasion = await Occasion.create({
        occasion: req.body.occasion,
        logo: process.env.URL + req.files.logo[0].path.replace('images\\', '/'),
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
    try {
        const vendor = await Vendor.create({
            name: req.body.name,
            email: email,
            password: password,
            phone: req.body.phone,
            status: "continue"
        });
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
        res.status(200).json({ vendor: vendor, message: "vendor added succesfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postUpdateVendor = async (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const vendorId = req.body.vendorId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        const findVendor = await Vendor.findByPk(vendorId);
        if (!findVendor) {
            const error = new error('vendor not found');
            error.statusCode = 401;
            throw error;
        }
        console.log(password);
        const hashedPassword = await bcrypt
            .hash(password, 12);
        if (!hashedPassword) {
            const error = new Error('password not hashed');
            error.statusCode = 401;
            throw error;
        }
        oldEmail = findVendor.email;
        findVendor.name = req.body.name;
        findVendor.email = email;
        findVendor.phone = req.body.phone;
        findVendor.password = password;
        findVendor.email = email;
        const updateVendor = await findVendor.save();
        const loginDetails = await Login.findOne({ where: { email: oldEmail } });
        loginDetails.password = hashedPassword;
        loginDetails.email = email;
        await loginDetails.save();
        res.status(200).json({ vendor: updateVendor, message: "vendor updated succesfully", status: true });
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
        logo: process.env.URL + req.files.logo[0].path.replace('images\\', '/'),
        image: process.env.URL + req.files.image[0].path.replace('images\\', '/'),
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
        vendorId: req.body.vendorId,
        price: req.body.price
    });
    try {
        if (!category) {
            const error = new Error('category not created');
            error.statusCode = 401;
            throw error;
        }
        if (req.files.image) {
            for (i of req.files.image) {
                image = await Category_Image.create({
                    image: process.env.URL + i.path.replace('images\\', '/'),
                    categoryId: category.id
                })
            }
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
        res.status(200).json({ data: occasion, status: true });
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
        // if (!service) {
        //     const error = new Error('service not found');
        //     error.statusCode = 404;
        //     throw error;
        // }
        // for (f of service) {
        //     const vendors = await Vendor_Service.findAll({ where: { service: f.id } });
        //     for (v of vendors) {
        //         findVendor++;
        //     }
        //     avlVendor.push(f, findVendor);
        //     findVendor = 0;
        // }
        res.status(200).json({ vendor: service, status: true });
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
    let services = [], occasion = [], setServices = [], setOccasion = [];
    try {
        if (!vendor) {
            const error = new Error('vendor not found');
            error.statusCode = 401;
            throw error;
        }
        for (v of vendor) {
            vendorDetails = await Vendor_Service.findAll({ where: { vendorId: v.id } });
            for (vndr of vendorDetails) {
                services.push(vndr.serviceId);
                occasion.push(vndr.occasionId);
            }
            newOccasion = new Set(occasion);
            newServices = new Set(services);
            setServices.push(newServices.size);
            setOccasion.push(newOccasion.size);
            services = [], occasion = [], newOccasion = [], newServices = []
        }
        res.status(200).json({ vendor: vendor, setServices, setOccasion, status: true });
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
        console.log(req.files.logo);
        if (req.files.logo) {
            occasion.logo = process.env.URL + req.files.logo[0].path.replace('images\\', '/');
        }
        occasion.occasion = req.body.occasion;
        const updateOccasion = await occasion.save();
        res.status(200).json({
            data: updateOccasion
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
        res.status(200).json({ data: service, status: true });
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
            service.logo = process.env.URL + req.files.logo[0].path.replace('images\\', '/');
        }
        if (req.files.image) {
            service.image = process.env.URL + req.files.image[0].path.replace('images\\', '/');
        }
        service.service = req.body.service;
        const updateService = await service.save();
        res.status(200).json({
            data: updateService
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
        res.status(200).json({
            data: savedOccasion
            , message: 'occasion updated successfully'
            , status: true
        });
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
    console.log(serviceId);
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
            data: updateService
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
    try {
        if (!vendor) {
            const error = new Error('vendor not found');
            error.statusCode = 400;
            throw error;
        }
        vendor.status = status;
        const savedVendor = await vendor.save();
        res.status(200).json({
            vendor: savedVendor
            , message: "vendor status updated"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.logout = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    try {
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 400;
            throw error;
        }
        user.token = '';
        await user.save();
        res.status(200).json({
            message: "logout successfully"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    if (!req.files.marketing) {
        return res.status(422).json({
            message: 'image not provided', status: 'false'
        });
    }
    const image = process.env.URL + req.files.marketing[0].path.replace('images\\', '/');
    const marketing = await Marketing.create({
        image: image,
    });
    try {
        if (!marketing) {
            const error = new Error('marketing image not created');
            error.statusCode = 400;
            throw error;
        }
        marketing.index = marketing.id;
        const updateMarketing = await marketing.save();
        res.status(201).json({
            marketingImage: updateMarketing
            , message: "image addes successsfully"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    try {
        if (!user) {
            const error = new Error('admin not found');
            error.statusCode = 400;
            throw error;
        }
        if (user.type !== "admin") {
            return res.status(422).json({
                message: 'you are not admin', status: true
            });
        }
        if (!req.files.banner) {
            return res.status(422).json({
                message: 'image not provided', status: 'false'
            });
        }
        const image = process.env.URL + req.files.banner[0].path.replace('images\\', '/');
        const banner = await Banners.create({
            image: image,
            type: req.body.type
        });
        if (!banner) {
            const error = new Error('banner image not created');
            error.statusCode = 400;
            throw error;
        }
        banner.index = banner.id;
        const updateBanner = await banner.save();
        res.status(201).json({
            banner: updateBanner
            , message: "banner addes successsfully"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const marketingId = req.params.id;
    const marketing = await Marketing.findByPk(marketingId);
    try {
        if (!marketing) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(201).json({
            marketing: marketing
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const marketingId = req.body.marketingId;
    const marketing = await Marketing.findByPk(marketingId);
    try {
        if (!marketing) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        if (req.files.marketing) {
            marketing.image = process.env.URL + req.files.marketing[0].path.replace('images\\', '/');
        }
        const updateMarketing = await marketing.save();
        res.status(201).json({
            marketing: updateMarketing
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteMarketingImage = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const marketingId = req.params.id;
    const marketing = await Marketing.findByPk(marketingId);
    try {
        if (!marketing) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        await marketing.destroy();
        res.status(201).json({
            meassage: "delete successfully"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const bannerId = req.params.id;
    const banner = await Banners.findByPk(bannerId);
    try {
        if (!banner) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(201).json({
            banner: banner
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditBanner = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const bannerId = req.body.bannerId;
    const banner = await Banners.findByPk(bannerId);
    try {
        if (!banner) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        if (req.files.banner) {
            banner.image = process.env.URL + req.files.banner[0].path.replace('images\\', '/');
        }
        banner.type = req.body.type;
        const updateBanner = await banner.save();
        res.status(201).json({
            banner: updateBanner
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteBanners = async (req, res, next) => {
    const userId = req.userId;
    const user = await Login.findByPk(userId);
    if (user.type !== "admin") {
        return res.status(422).json({
            message: 'you are not admin', status: true
        });
    }
    const bannerId = req.params.id;
    const banner = await Banners.findByPk(bannerId);
    try {
        if (!banner) {
            const error = new Error('image not found');
            error.statusCode = 400;
            throw error;
        }
        await banner.destroy();
        res.status(201).json({
            meassage: "delete successfully"
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postAddVendorService = async (req, res, next) => {
    const vendorId = req.body.vendorId;
    const occasionId = req.body.occasionId;
    const serviceId = req.body.serviceId;
    const vendorService = await Vendor_Service.create({
        serviceId: serviceId,
        occasionId: occasionId,
        status: "unblock",
        vendorId: vendorId
    });

    try {
        if (!vendorService) {
            const error = new Error('vendor service not created');
            error.statusCode = 400;
            throw error;
        }
        res.status(201).json({
            vendorService: vendorService
            , status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificVendor = async (req, res, next) => {
    const vendorId = req.params.id;
    const vendor = await Vendor.findByPk(vendorId);
    try {
        if (!vendor) {
            const error = new Error('vendor not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ vendor: vendor, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getSpecificVendorOccasion = async (req, res, next) => {
    let arr1 = []
    const vendorId = req.params.id;
    const vendor = await Vendor_Service.findAll({ where: { vendorId: vendorId } });
    try {
        if (!vendor) {
            const error = new Error('vendorService not found');
            error.statusCode = 401;
            throw error;
        }
        for (vendor_occasion of vendor) {
            const occasion = await Occasion.findByPk(vendor_occasion.occasionId);
            const service = await Vendor_Service.findAll({
                where:
                    [{ occasionId: vendor_occasion.occasionId }, { vendorId: vendorId }]
            })
            arr1.push(occasion, service.length);
        }
        res.status(200).json({ vendorOccasion: arr1, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificVendorService = async (req, res, next) => {
    let arr1 = []
    const vendorId = req.params.id;
    const vendor = await Vendor_Service.findAll({ where: { vendorId: vendorId } });
    try {
        if (!vendor) {
            const error = new Error('vendorService not found');
            error.statusCode = 401;
            throw error;
        }
        for (vendor_occasion of vendor) {
            const service = await Service.findByPk(vendor_occasion.serviceId);
            const occasion = await Vendor_Service.findAll({
                where:
                    [{ serviceId: vendor_occasion.serviceId }, { vendorId: vendorId }]
            })
            arr1.push(service, occasion.length);
        }
        res.status(200).json({ vendorService: arr1, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificVendorCategory = async (req, res, next) => {
    const vendorId = req.body.vendorId;
    const serviceId = req.body.serviceId;
    const category = await Category.findAll({ where: [{ vendorId: vendorId }, { serviceId: serviceId }] })
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ category: category });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.userRequestedEvent = async (req, res, next) => {
    const findEvent = await Event.findAll({ include: User });
    let newObject = [], newObject2 = [], service;
    try {
        if (!findEvent) {
            const error = new Error('event not found');
            error.statusCode = 401;
            throw error;
        }
        for (f of findEvent) {
            const user = await User.findByPk(f.userId);
            const occasion = await Occasion.findByPk(f.event);
            const event_service = await RequestedEvent.findAll({ where: [{ userId: f.userId }, { eventId: f.id }] });
            for (e of event_service) {
                service = await Service.findByPk(e.serviceId, { 
                    include: [
                        {
                            model: Category,
                            where: {id:e.categoryId}
                        }
                    ]
             });  
             console.log(service.dataValues.categories[0].dataValues.vendorId);
             const vendor = await Vendor.findByPk(service.dataValues.categories[0].dataValues.vendorId);
                service.dataValues.vendorname = vendor.name
                newObject.push(service);
            }
            user.dataValues.service = newObject;
            user.dataValues.occasionName = occasion.occasion
            user.dataValues.eventDate = f.date;
            user.dataValues.eventId = f.id
            user.dataValues.guestCount = f.guestCount;
            user.dataValues.budget = f.budget
            newObject2.push(user);
            newObject = [];
        }
        res.status(200).json({ event: newObject2,status:true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeVendorOccasionStatus = async (req, res, next) => {
    const status = req.body.status;
    const occasionId = req.body.occasionId;
    const vendorId = req.body.vendorId;
    const vendorOccasion = await Vendor_Service.findAll({
        where:
            [
                { vendorId: vendorId }, { occasionId: occasionId }
            ]
    });
    try {
        if (vendorOccasion.length == 0) {
            const error = new Error('vendor occasions not found');
            error.statusCode = 401;
            throw error;
        }
        for (v of vendorOccasion) {
            v.status = status;
            await v.save();
        }
        res.status(200).json({ message: "status updated successfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeVendorServiceStatus = async (req, res, next) => {
    const status = req.body.status;
    const occasionId = req.body.occasionId;
    const vendorId = req.body.vendorId;
    const serviceId = req.body.serviceId;
    const vendorOccasion = await Vendor_Service.findAll({
        where:
            [
                { vendorId: vendorId }, { occasionId: occasionId }, { serviceId: serviceId }
            ]
    });
    try {
        if (vendorOccasion.length == 0) {
            const error = new Error('vendor occasions not found');
            error.statusCode = 401;
            throw error;
        }
        for (v of vendorOccasion) {
            v.status = status;
            await v.save();
        }
        res.status(200).json({ message: "status updated successfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.eventCancelQuestion = async (req, res, next) => {
    const question = req.body.question;
    const eventQuestion = await EventCancelQuestion.create({
        question: question
    });
    try {
        if (!eventQuestion) {
            const error = new Error('question not added');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ message: "question added successfully", question: question, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEmploye = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    if (req.files) {
        image = process.env.URL + req.files.image[0].path.replace('images\\', '/');
    } else {
        image = "null"
    }
    const employe = await Employe.create({
        name: req.body.email,
        email: email,
        phone: req.body.phone,
        address: req.body.address,
        image: image,
        type: req.body.type,
        status: "active",
        image: image,
        password: password
    });
    try {
        if (!employe) {
            const error = new Error('employe not added');
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
            type: req.body.type
        })
        res.status(200).json({ message: "employe added successfully", employe: employe, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAllRm = async (req, res, next) => {
    const rm = await Employe.findAll({ where: { type: "RM" } });
    try {
        res.status(200).json({ rm: rm, status: true })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getAllDem = async (req, res, next) => {
    const dem = await Employe.findAll({ where: { type: "DEM" } });
    try {
        res.status(200).json({ dem: dem, status: true })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditEmployeDetails = async (req, res, next) => {
    const employeId = req.params.id;
    const employe = await Employe.findByPk(employeId);
    try {
        if (!employe) {
            const error = new Error('employe not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({ employe: employe, status: true })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditEmployeDetails = async (req, res, next) => {
    const employeId = req.body.employeId;
    const employe = await Employe.findByPk(employeId);
    try {
        if (!employe) {
            const error = new Error('employe not found');
            error.statusCode = 404;
            throw error;
        }
        if (req.files.image) {
            employe.image = process.env.URL + req.files.image[0].path.replace('images\\', '/');
        }
        employe.name = req.body.name;
        employe.contact = req.body.contact;
        employe.email = req.body.email;
        employe.password = req.body.password;
        employe.address = req.body.address;
        employe.type = req.body.type;
        const updatedEmploye = await employe.save();
        res.status(200).json({ message: "employe update successfully", employe: updatedEmploye, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeEmployeStatus = async (req, res, next) => {
    const employeId = req.body.employeId;
    const status = req.body.status;
    const employe = await Employe.findByPk(employeId);
    try {
        if (!employe) {
            const error = new Error('employe not found');
            error.statusCode = 404;
            throw error;
        }
        employe.status = status;
        await employe.save();
        res.json({ employe: employe, status: true, message: "status updated successfuly" })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.dashBoards = async (req, res, next) => {
    const user = await User.findAll();
    const vendor = await Vendor.findAll();
    const occasion = await Occasion.findAll();
    const services = await Service.findAll();
    const invitation = await Invitation.findAll();
    try {
        res.status(200).json({
            user: user.length,
            vendor: vendor.length,
            occasion: occasion.length,
            services: services.length,
            invitation: invitation.length,
            status: true
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, { include: Category_Image });
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ data: category, status: true, message: "category found" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditCategory = async (req, res, next) => {
    const categoryId = req.body.id;
    const category = await Category.findByPk(categoryId);
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        category.category = req.body.category,
            category.address = req.body.address,
            category.description = req.body.description,
            category.type = req.body.type,
            category.serviceId = req.body.serviceId,
            category.vendorId = req.body.vendorId,
            category.price = req.body.price
        const updateCategory = await category.save();
        if (req.files.image) {
            for (i of req.files.image) {
                image = await Category_Image.create({
                    image: process.env.URL + i.path.replace('images\\', '/'),
                    categoryId: category.id
                })
            }
        }
        res.status(200).json({ data: updateCategory, image, status: true, message: "category found" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificService = async (req, res, next) => {
    const vendorId = req.body.vendorId;
    const serviceId = req.body.serviceId;
    const vendorService = await Vendor_Service.findOne({ where: [{ vendorId: vendorId }, { serviceId: serviceId }] });
    try {
        const service = await Service.findByPk(vendorService.serviceId);
        res.status(200).json({ data: service, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addInvitation = async (req, res, next) => {
    const bgColor = req.body.bgColor;
    try {
        if (!req.files) {
            const error = new Error('image not provided');
            error.statusCode = 404;
            throw error
        }
        const invitation = await Invitation.create({
            image: process.env.URL + req.files.image[0].path.replace('images\\', '/'),
            backgroundColor: bgColor,
            event: req.body.occasion,
        })
        if (!invitation) {
            const error = new Error('invitation not created');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ data: invitation, status: true, message: "invitation image added" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificServiceCategory = async (req, res, next) => {
    const serviceId = req.body.serviceId;
    const category = await Category.findAll({ where: [{ serviceId: serviceId }, { vendorId: req.body.vendorId }] });
    try {
        res.status(200).json({ data: category, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserServiceDetails = async (req, res, next) => {
    const eventId = req.params.eventId;
    const event = await Event.findOne({ where: { id: eventId }, include: User });
    const occasion = await Occasion.findByPk(event.event);
    event.event = occasion.occasion
    const categoryArray = [];
    let userServiceArray = [];
    const requestedEvent = await RequestedEvent.findAll({ where: { eventId: eventId } });
    try {
        for (r of requestedEvent) {
            categoryArray.push(r.categoryId)
        }
        for (c of categoryArray) {
            const category = await Category.findByPk(c);
            const service = await Service.findByPk(category.serviceId);
            const vendorr = await Vendor.findByPk(category.vendorId);
            console.log(vendorr);
            category.dataValues.servicename = service.service;
            category.dataValues.vendorname = vendorr.name;
            userServiceArray.push(category);
        }
        res.status(200).json({ data: [event, userServiceArray], status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.sendQuotationToUser = async (req, res, next) => {
    const serviceId = req.body.serviceId;
    const categoryId = req.body.categoryId;
    const price = req.body.price;
    const eventId = req.body.eventId;
    const employeId = req.userId;
    const vendor = req.body.vendor;
    console.log(vendor);
    const event = await Event.findByPk(eventId);
    for (let i = 0; i < categoryId.length; i++) {
        console.log(serviceId[i], categoryId[i]);
        console.log("vendor", vendor[i]);
        quotation = await Quotation.create({
            serviceId: serviceId[i],
            categoryId: categoryId[i],
            price: price[i],
            event: event.id,
            vendor: vendor[i],
            user: event.userId,
            employeId: employeId
        })
    }
    const quotation = await RequestedEvent.findAll({where:{eventId:eventId}});
    for(q of quotation){
        await q.destroy();
    }
    try {
        res.status(200).json({ data: quotation, status: true, message: "quotation send successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.cancelBookings = async (req, res, next) => {
    const findEvent = await Quotation.findAll({
        where:
        {
            status: { [Sequelize.Op.notIn]: [1, ''] }
        }
    });
    let newObject = [], newObject2 = new Set(), service, newObject3 = [];
    try {
        for (f of findEvent) {
            newObject2.add(f.user);
        }
        for (n of newObject2) {
            let eventt;
            const findEvents = await Quotation.findAll({ where: { user: n } });
            for (ev of findEvents) {
                service = await Service.findByPk(ev.serviceId, { 
                    include: [
                        {
                            model: Category,
                            where: {id:ev.categoryId}
                        }
                    ]
             });  
                eventt = await Event.findByPk(ev.event);
                newObject.push(service);
            }
            const userdetails = await User.findByPk(n);
            const occasion = await Occasion.findByPk(eventt.event);
            userdetails.dataValues.service = newObject;
            userdetails.dataValues.date = eventt.date;
            userdetails.dataValues.occasionName = occasion.occasion;
            userdetails.dataValues.userEventId = eventt.id
            userdetails.dataValues.guestCount = eventt.guestCount;
            userdetails.dataValues.budget = eventt.budget
            newObject3.push(userdetails);
        }
        res.status(200).json({ event: newObject3, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.acceptedBookings = async (req, res, next) => {
    const findEvent = await Quotation.findAll({
        where:
        {
            status: { [Sequelize.Op.in]: [1] }
        }
    });
    let newObject = [], newObject2 = new Set(), service, newObject3 = [];
    try {
        for (f of findEvent) {
            newObject2.add(f.user);
        }
        for (n of newObject2) {
            const event = await Event.findOne({ where: { userId: n } });
            console.log(new Date(event.date), new Date());
            if (new Date(event.date).getTime() > new Date().getTime()) {
                const findEvents = await Quotation.findAll({ where: { user: n } });
                for (ev of findEvents) {
                    service = await Service.findByPk(ev.serviceId, { 
                        include: [
                            {
                                model: Category,
                                where: {id:ev.categoryId}
                            }
                        ]
                 });  
                    eventt = await Event.findByPk(ev.event);
                    newObject.push(service);
                }
                const userdetails = await User.findByPk(n);
                userdetails.dataValues.service = newObject
                const occasion = await Occasion.findByPk(eventt.event);
                userdetails.dataValues.date = eventt.date;
                userdetails.dataValues.occasionName = occasion.occasion;
                userdetails.dataValues.userEventId = eventt.id
                userdetails.dataValues.guestCount = eventt.guestCount;
                userdetails.dataValues.budget = eventt.budget
                newObject3.push(userdetails);
            }
        }
        res.status(200).json({ event: newObject3, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.completedBookings = async (req, res, next) => {
    const findEvent = await Quotation.findAll({
        where:
        {
            status: { [Sequelize.Op.in]: [1] }
        }
    });
    let newObject = [], newObject2 = new Set(), service, newObject3 = [];
    try {
        for (f of findEvent) {
            newObject2.add(f.user);
        }
        for (n of newObject2) {
            const event = await Event.findOne({ where: { userId: n } });
            console.log(new Date(event.date), new Date());
            if (new Date(event.date).getTime() < new Date().getTime()) {
                const findEvents = await Quotation.findAll({ where: { user: n } });
                for (ev of findEvents) {
                    service = await Service.findByPk(ev.serviceId, { 
                        include: [
                            {
                                model: Category,
                                where: {id:ev.categoryId}
                            }
                        ]
                 });  
                    eventt = await Event.findByPk(ev.event);
                    newObject.push(service);
                }
                const userdetails = await User.findByPk(n);
                userdetails.dataValues.service = newObject
                const occasion = await Occasion.findByPk(eventt.event);
                userdetails.dataValues.date = eventt.date;
                userdetails.dataValues.occasionName = occasion.occasion;
                userdetails.dataValues.userEventId = eventt.id
                userdetails.dataValues.guestCount = eventt.guestCount;
                userdetails.dataValues.budget = eventt.budget
                newObject3.push(userdetails);
            }
        }
        res.status(200).json({ event: newObject3, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } I
}

exports.getInvitationCard = async (req, res, next) => {
    let images = []
    const invitation = await Invitation.findAll();
    try {
        for(i of invitation){
            const occasion = await Occasion.findByPk(i.event);
            i.dataValues.event = occasion.occasion;
            images.push(i);
        }
        res.status(200).json({ data: images, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}