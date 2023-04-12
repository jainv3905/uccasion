const Guest = require('../models/guest');
const { validationResult } = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');
const Event = require('../models/event');
const Event_Service = require('../models/event-service');
const Vendor_Service = require('../models/vendor-service');
const Marketing = require('../models/marketing-screens');
const Banners = require('../models/banner');
const RequestedEvent = require('../models/requestedEvent');
const Invitation = require('../models/invitation');
const InvitationList = require('../models/invitationList');
const Quotation = require('../models/quotation');
const Employe = require('../models/employe');
const { Sequelize } = require('sequelize')


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
        if ((guestLimit + req.body.capacity) > totalGuest && totalGuest !== null) {
            const error = new Error(`!sorry...your guest limit is ${totalGuest}`);
            error.status = 400;
            throw error;
        }
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
        res.status(201).json({ data: guest, status: true, message: "guest Added Successfully" });
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
        res.status(200).json({ data: occasion, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.dashboard = async (req, res, next) => {
    let serviceArray = [], rmResponse,rm,requestedEvent,quotation;
    const services = await Service.findAll();
    try {
        if (!services) {
            const error = new Error('services not found');
            error.statusCode = 404;
            throw error
        }
        const userEvent = await Event.findOne({ where: [
            { userId: req.userId },
            {date: {
                [Sequelize.Op.gt]: new Date(),
              },
            }
        ], include: Event_Service });
        if(userEvent){
        const eventName = await Occasion.findByPk(userEvent.event);
        userEvent.dataValues.occasionName = eventName.occasion;
        requestedEvent = await RequestedEvent.findOne({ where: { eventId: userEvent.id } });
        quotation = await Quotation.findOne({ where: { event: userEvent.id } })
        console.log(quotation);
        const newDate = new Date(userEvent.date);
        const date2 = new Date();
        time_difference = date2.getTime() - newDate.getTime();
        days_difference = +(time_difference / (1000 * 60 * 60 * 24));
        for (s of services) {
            const vendorServices = await Event_Service.findOne({where:[{service:s.id},{eventId:userEvent.id}]});
            if(vendorServices){
                console.log(vendorServices.id);
                s.dataValues.hasUserEvent = "completed";
            } else {
                s.dataValues.hasUserEvent = "pending";
            }
        }
        }else{
            days_difference = 0;
            for (s of services) {
                    s.dataValues.hasUserEvent = "pending";
            }
        }
        console.log(quotation);
        if (quotation) {
            rmResponse = "completed"
            rm = await Employe.findOne({where:{id:quotation.employeId},attributes:['name']});
        } else if(requestedEvent) {
            rmResponse = "pending"
        }else{
            rmResponse = "not started"
        }
        const banner = await Banners.findAll();
        if (banner.length == 0) {
            const error = new Error('banner not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            data: {
                services: services, banner: banner, userEvent: userEvent,
                days_difference: days_difference,rmResponse:rmResponse,rm:rm
            }, status: true
        });
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
            const error = new Error('category not available in this service ');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({ data: category, status: true, message: "category" })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
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
        res.status(200).json({ Service: service, status: true, message: "service found" });
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
        res.status(200).json({ category: category, status: true, message: "category found" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getVenueAddress = async (req, res, next) => {
    const type = req.body.type;
    const category = await Category.findAll({ where: [{ serviceId: 1 }, { type: type }], attributes: ['id', 'address'] });
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ data: category, status: true, message: "venue address" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addEventDate = async (req, res, next) => {
    const date = req.body.date;
    const guestCount = req.body.guestCount;
    const event = await Event.create({
        date: date,
        guestCount: guestCount,
        budget: req.body.budget,
        event: req.body.occasionId,
        userId: req.userId
    })
    try {
    const occasion = await Occasion.findByPk(req.body.occasionId);
    event.dataValues.occasionName = occasion.occasion;
        res.status(201).json({ data: event, message: "event added successfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.addEventOccasion = async (req, res, next) => {
//     const occasion = req.body.occasion;
//     const date = req.body.date;
//     const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
//     try {
//         if (event) {
//             event.event = occasion;
//             await event.save();
//             res.status(201).json({ event: event });
//         } else {
//             const newEvent = await Event.create({
//                 event: occasion,
//                 userId: req.userId
//             })
//             res.status(201).json({ event: newEvent });
//         }
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

// exports.addEventGuest = async (req, res, next) => {
//     const guest = req.body.guest;
//     const date = req.body.date;
//     const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
//     try {
//         if (event) {
//             event.guestCount = guest;
//             await event.save();
//             res.status(201).json({ event: event });
//         } else {
//             const newEvent = await Event.create({
//                 guestCount: guest,
//                 userId: req.userId
//             })
//             res.status(201).json({ event: newEvent });
//         }
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

// exports.addEventBudget = async (req, res, next) => {
//     const budget = req.body.budget;
//     const date = req.body.date;
//     const event = await Event.findOne({ where: [{ userId: req.userId }, { date: date }] });
//     try {
//         if (event) {
//             event.budget = budget;
//             await event.save();
//             res.status(201).json({ event: event });
//         } else {
//             const newEvent = await Event.create({
//                 budget: budget,
//                 userId: req.userId
//             })
//             res.status(201).json({ event: newEvent });
//         }
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

exports.addEventVenue = async (req, res, next) => {
    let event_service, id, updateUserService;
    const eventServciceId = req.body.id;
    const service = req.body.service;
    const category = req.body.category;
    try {
        const eventservice = await Event_Service.findByPk(eventServciceId);
            for (c of category) {
                event_service = await Event_Service.create({
                    service: service,
                    category: c,
                    eventId: req.body.eventId
                })
            }
            if (!event_service) {
                const error = new Error('service not created');
                error.statusCode = 401;
                throw error;
            }
            res.status(200).json({ data: event_service, status: true, message: "service added successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.editEventService = async (req, res, next) => {
    const service = req.body.service;
    const category = req.body.category;
    try {
    const eventservice = await Event_Service.findAll({where:[
        {eventId:req.body.eventId},{service:service}
    ]});
        if (!eventservice) {
            const error = new Error('service not found');
            error.statusCode = 401;
            throw error;
           } 
           for(e of eventservice){
             await e.destroy();
           }
           for (c of category) {
            event_service = await Event_Service.create({
                service: service,
                category: c,
                eventId: req.body.eventId
            })
        }
        res.status(200).json({ data: event_service, status: true, message: "service updated successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.searchGuestList = async (req, res, next) => {
    const first_name = req.body.first_name;
    const guest = await Guest.findOne({ where: [{ first_name: first_name }, { userId: req.userId }] });
    try {
        if (!guest) {
            const error = new Error('guest not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ guest: guest, status: true, status: "guest found" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getQuotation = async (req, res, next) => {
    let findService, allService = [], ab = [], caa = [];
    const userId = req.userId;
    console.log(userId);
    const eventId = await Event.findOne({ where: [
        { userId: req.userId },
        {date: {
            [Sequelize.Op.gt]: new Date(),
          },
        }
    ]})
    console.log(eventId);
    const eventServices = await Event_Service.findAll({ where: { eventId: eventId.id } });
    try {
        if (eventServices.length < 0) {
            const error = new Error('no services found with this event');
            error.statusCode = 401;
            throw error;
        }
        for (let eventServc of eventServices) {
            console.log(eventServc.category);
            findService = await Service.findOne({
                where:
                    { id: eventServc.service }
            }
            )
            console.log(findService);
            allService.push(findService.id)
        }
        newSet = new Set(allService);
        for (n of newSet) {
            const ser = await Service.findOne({ where: { id: n } });
            const cat = await Event_Service.findAll({ where: [{ service: n }, { eventId: eventId.id }] });
            ser.dataValues.category = [];
            for (c of cat) {
                console.log(c.category);
                const ca = await Category.findAll({ where: { id: c.category } });
                // console.log(ca);
                for (ccc of ca) {
                    caa.push(ca);
                    ser.dataValues.category.push(ccc);
                }
            }
            ab.push(ser);
        }
        const requestedEvent = await RequestedEvent.findOne({ where: { userId: userId } });
        if (requestedEvent) {
            getQuotation = 1;
        } else {
            getQuotation = 0;
        }
        res.status(200).json({ data: ab, eventServiceId: eventId.id, getQuotation: getQuotation, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getMarketingScreen = async (req, res, next) => {
    const marketing = await Marketing.findAll();
    try {
        if (marketing.length == 0) {
            const error = new Error('no images found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ MarketingScreen: marketing, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getBanner = async (req, res, next) => {
    const banner = await Banners.findAll();
    try {
        if (banner.length == 0) {
            const error = new Error('banner not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ banner: banner, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getServicePage = async (req, res, next) => {
    let serviceArray = [];
    const services = await Service.findAll();
    try {
        if (!services) {
            const error = new Error('services not found');
            error.statusCode = 404;
            throw error
        }
        const userEvent = await Event.findOne({ where:  [
            { userId: req.userId },
            {date: {
                [Sequelize.Op.gt]: new Date(),
              },
            }
        ]});
        for (s of services) {
            // const vendorServices = await Service.findByPk(s.serviceId);
            let userService;
            // if(vendorServices){
            if (userEvent) {
                userService = await Event_Service.findOne(
                    {
                        where: [{ service: s.id }, { eventId: userEvent.id }]
                    }
                );
            }
            if (userService) {
                s.dataValues.hasUserEvent = "completed";
                serviceArray.push(s);
            } else {
                s.dataValues.hasUserEvent = "pending";
                serviceArray.push(s);
            }
        }
        res.status(200).json({ Service: serviceArray, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSpecificCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, { include: Category_Image });
    try {
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({ data: category, status: true, message: "category" })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.searchOccasion = async (req, res, next) => {
    const name = req.body.occasion;
    const occasion = await Occasion.findOne({ where: { occasion: name } });
    try {
        if (!occasion) {
            const error = new Error('occasion not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ data: occasion, status: true, message: "occasion found" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.postDeleteCategory = async (req, res, next) => {
    const userId = req.userId;
    const categoryId = req.body.categoryId;
    const serviceId = req.body.serviceId;
    const userEvent = await Event.findOne({ where: { userId: userId } });
    const userService = await Event_Service.findOne(
        {
            where: [
                { eventId: userEvent.id }, { category: categoryId }, { service: serviceId }
            ]
        }
    );
    try {
        if (!userService) {
            const error = new Error('userService not found');
            error.statusCode = 404;
            throw error
        }
        await userService.destroy();
        res.status(200).json({ status: true, message: "category deleted successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postDeleteService = async (req, res, next) => {
    const serviceId = req.body.serviceId;
    console.log(req.userId);
    const userEvent = await Event.findOne({ where: { userId: req.userId } });
    console.log(userEvent);
    const event_service = await Event_Service.findAll({
        where: [
            { eventId: userEvent.id }, { service: serviceId }
        ]
    });
    try {
        if (!event_service) {
            const error = new Error('service not found');
            error.statusCode = 404;
            throw error
        }
        for (events of event_service) {
            await events.destroy();
        }
        res.status(200).json({ status: true, message: "service deleted successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postSendQuotation = async (req, res, next) => {
    const eventId = req.params.id;
    console.log(eventId);
    const userId = req.userId;
    const eventService = await Event_Service.findAll({ where: { eventId: eventId } });
    console.log(eventService);
    try {
        if (eventService.length == 0) {
            const error = new Error("event-services not found");
            error.statusCode = 401;
            throw error;
        }
        for (let services of eventService) {
            const requestedEvent = await RequestedEvent.create({
                serviceId: services.service,
                categoryId: services.category,
                status: "active",
                eventId: eventId,
                userId: userId
            });
        }
        res.status(200).json({ status: true, message: "quotation send successfully" });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserGuest = async (req, res, next) => {
    const userId = req.userId;
    const guest = await Guest.findAll({ where: { userId: userId } });
    try {
        res.status(200).json({ data: guest, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getInvitationImage = async (req, res, next) => {
    const eventId = await Event.findOne({where:{userId:req.userId}});
    console.log(eventId);
    const invitation = await Invitation.findAll();
    try {
        res.status(200).json({ data: invitation, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.sendInvitation = async (req, res, next) => {
    const guest = req.body.guest;
    let sendInvitation;
    for (let i = 0; i < guest.length; i++) {
        console.log(guest[i]);
        sendInvitation = await InvitationList.create({
            invitationCardId: req.body.invitationCardId,
            address: req.body.address,
            date: req.body.date,
            time: req.body.time,
            eventDescription: req.body.eventDescription,
            eventHosted: req.body.eventHosted,
            guestId: guest[i]
        })
    }
    try {
        if (!sendInvitation) {
            const error = new Error("invitation not send");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ message: "invitation send successfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getQuotationFromRm = async (req, res, next) => {
    const userId = req.userId;
    let serviceArray = new Set();
    let categoryArray = [];
    let price = 0, employe,eventStatus;
    const event = await Event.findByPk(req.params.id);
    const occasion = await Occasion.findByPk(event.event);
    event.event = occasion.occasion
    const eventService = await Quotation.findAll({ where: { event: event.id } });
    try {
        for (e of eventService) {
            // categoryArray.add(e.categoryId);
            serviceArray.add(e.serviceId);
            employe = await Employe.findByPk(e.employeId);
            if(e.status == 1){
                eventStatus = 1
            }else if(e.status == ' '){
                eventStatus = ' '
            }else{
                eventStatus = e.status
            }
        }
        for (s of serviceArray) {
            const eventCategory = await Quotation.findAll({ where: [{ event: event.id }, { serviceId: s }] });
            console.log(eventCategory);
            for (c of eventCategory) {
                // const categoryy = await Category.findAll({where:[{id:c.categoryId}]});
                // for(cc of categoryy){
                price += c.price;
                // }
            }
            const servicce = await Service.findByPk(s);
            servicce.dataValues.price = price;
            categoryArray.push(servicce);
            price = 0
        }
        res.status(200).json({ data: { event: event, services: categoryArray, employe: employe,eventStatus:eventStatus }, status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postUserStatus = async (req, res, next) => {
    let data;
    const status = req.body.status;
    const eventId = req.body.eventId;
    const quotation = await Quotation.findAll({ where: { event: eventId } });
    try {
        for (q of quotation) {
            console.log(q);
            q.status = status;
            await q.save();
        }
        if(status ==1){
            data = "proposal accepted"
        }else{
            data = "proposal resected"
        }
        res.status(200).json({data:data, message: "status updated successfully", status: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}