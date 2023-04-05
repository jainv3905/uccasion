const Guest = require('../models/guest');
const { validationResult } = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Event = require('../models/event');
const Event_Service = require('../models/event-service');
const Vendor_Service = require('../models/vendor-service');

exports.postAddGuest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    let totalGuest, guestLimit = 0;
    let guestCount = await Event.findOne({ where: { userId: req.userId } });
    totalGuest = guestCount.guestCount;
    console.log(totalGuest);
    const guest_limit = await Guest.findAll({ where: { userId: req.userId } });
    for (limit of guest_limit) {
        guestLimit += +limit.capacity;
    }
    try {
        if ((guestLimit + req.body.capacity) > totalGuest && totalGuest!==null) {
            const error = new Error(`!sorry...your guest limit is ${totalGuest}`);
            error.status = 400;
            throw error;
        }
        // else{
        //     guestCount.guestCount = guestLimit
        //     await guestCount.save();
        // }
        const guest = await Guest.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            relationship: req.body.relationship,
            email: req.body.email,
            capacity: req.body.capacity,
            userId: req.userId,
        })
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
    let serviceArray = [];
    const services = await Vendor_Service.findAll();
    try {
        if (!services) {
            const error = new Error('services not found');
            error.statusCode = 404;
            throw error
        }
        for(s of services){
            const vendorServices = await Service.findByPk(s.serviceId);
            serviceArray.push(vendorServices.service);
        }
        res.status(200).json({ Service: serviceArray, status: true });
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
    try {
        if (category.length == 0) {
            const error = new Error('category not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({ category: category })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        throw (err);
    }
}

exports.searchServices = async (req, res, next) => {
    const name = req.body.service;
    const service = await Service.findOne({ where: { service: name } });
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
    const category = await Category.findOne({
        where:
            [{ serviceId: serviceId }, { category: name }]
        , include: Category_Image
    });
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ category: category, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getVenueAddress = async (req, res, next) => {
    const type = req.body.type;
    const category = await Category.findAll({ where: [{ serviceId: 1 }, { type: type }] });
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ category: category, status: true });
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
        date: date,
        userId: req.userId
    })
    try {
        res.status(201).json({ event: event });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEventOccasion = async (req, res, next) => {
    const occasion = req.body.occasion;
    const date = req.body.date;
    const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
    try {
        if (event) {
            event.event = occasion;
            await event.save();
            res.status(201).json({ event: event });
        } else {
            const newEvent = await Event.create({
                event: occasion,
                userId: req.userId
            })
            res.status(201).json({ event: newEvent });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEventGuest = async (req, res, next) => {
    const guest = req.body.guest;
    const date = req.body.date;
    const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
    try {
        if (event) {
            event.guestCount = guest;
            await event.save();
            res.status(201).json({ event: event });
        } else {
            const newEvent = await Event.create({
                guestCount: guest,
                userId: req.userId
            })
            res.status(201).json({ event: newEvent });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEventBudget = async (req, res, next) => {
    const budget = req.body.budget;
    const date = req.body.date;
    const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
    try {
        if (event) {
            event.budget = budget;
            await event.save();
            res.status(201).json({ event: event });
        } else {
            const newEvent = await Event.create({
                budget: budget,
                userId: req.userId
            })
            res.status(201).json({ event: newEvent });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEventVenue = async (req, res, next) => {
    let id;
    const eventId = req.body.eventId;
    const occasion = req.body.occasion;
    const service = req.body.service;
    const category = req.body.category;
    try {
        const hasEvent = await Event.findByPk(eventId);
        if (hasEvent) {
            id = eventId
        } else {
            const event = await Event.create({
                event: occasion,
                userId: req.userId
            })
            if (!event) {
                const error = new Error('event not created');
                error.statusCode = 401;
                throw error;
            }
            id = event.id;
        }
        const event_service = await Event_Service.create({
            service: service,
            category: category,
            eventId: id
        })
        if (!event_service) {
            const error = new Error('service not created');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ service: event_service });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.searchGuestList = async (req, res, next) => {
    const first_name = req.body.first_name;
    const guest = await Guest.findOne({where:[{first_name:first_name},{userId: req.userId}]}); 
    try{
        if(!guest){
            const error = new Error('guest not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({guest:guest});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getQuotation = async (req, res, next) => {
  let findService, allService = [];
  const userId = req.userId;
  const eventId = await Event.findOne({where:{userId: userId}})
  const eventServices = await Event_Service.findAll({where: {eventId:eventId.id} });
  try{
    if(eventServices.length<0){
        const error = new Error('no services found with this event');
        error.statusCode = 401;
        throw error;
    }
    for(let eventServc of eventServices){
        console.log(eventServc.category);
        findService = await Category.findOne({where: 
            {id: eventServc.category}, include:Service
        }
        )
        allService.push(findService)
    }
    res.status(200).json({eventServices: allService});
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
} 



