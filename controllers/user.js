const Guest = require('../models/guest');
const { validationResult } = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Event = require('../models/event');
exports.postAddGuest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    const guest = await Guest.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        relationship: req.body.relationship,
        age: req.body.age,
        email: req.body.email,
        userId: req.userId,
    })
    try {
        if (!guest) {
            const error = new Error('guest not created');
            error.status = 400;
            throw error;
        }
        res.status(201).json({ guest: guest, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.eventPage = async (req, res, next) => {
    const occasion = await Occasion.findAll();
    try {
        if (!occasion) {
            const error = new Error('occasions not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ event: occasion, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.firstPage = async (req, res, next) => {
    const services = await Service.findAll();
    try {
        if (!services) {
            const error = new Error('services not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ Service: services, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCategoryPage = async (req, res, next) => {
    const serviceId = req.params.id;
    const category = await Category.findAll({ where: { serviceId: serviceId }, include: Category_Image });
    try{
      if(category.length == 0){
        const error = new Error('category not found');
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({category:category})
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
       throw(err); 
    }
}

exports.searchServices = async (req, res, next) => {
 const name = req.body.service;
 const service = await Service.findOne({where:{service:name}});
 try {
    if (!service) {
        const error = new Error('service not found');
        error.statusCode = 404;
        throw error
    }
    res.status(200).json({ Service: service, status: true });
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}   
}

exports.searchCategory = async (req, res, next) => {
    const name = req.body.category;
    const serviceId = req.body.serviceId;
    const category = await Category.findOne({where:
        [{serviceId:serviceId},{category:name}]
        ,include:Category_Image});
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ category:category, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
}

exports.getVenueAddress = async (req, res, next) => {
 const category = await Category.findAll({where: {serviceId:1}});
 try{
    if(!category){
        const error = new Error('category not found');
        error.statusCode = 404;
        throw error
    }
    res.status(200).json({ category:category, status: true });
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

exports.addEventDate = async (req, res, next) => {
 const date = req.body.date;
 const event = await Event.create({
    date: date
 })
 try{
    res.status(201).json({"message": "date added succesfully"});
 } catch(err) {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
 }
}

exports.addUserOccasion = async (req, res, next) => {
 const occasion = req.body.occasion;  
}