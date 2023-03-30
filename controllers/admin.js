const {validationResult} = require('express-validator');
const Occasion = require('../models/occasion');
const Service = require('../models/service');
const Category = require('../models/category');
const Category_Image = require('../models/category-image');

exports.postOccasion = async (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
    });
  }
    const occasion = await Occasion.create({
        occasion:req.body.occasion,
        logo:req.files.logo[0].filename
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
exports.postAddServices = async (req, res, next) => {
    console.log(req.files.logo[0].filename);
    const service = await Service.create({
        service: req.body.service,
        logo:req.files.logo[0].filename
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
    const category = await Category.create({
        category:req.body.category,
        address:req.body.address,
        description:req.body.description,
        type:req.body.type,
        serviceId: req.body.serviceId
    });
    try{
        if(!category){
            const error = new Error('category not created');
            error.statusCode = 401;
            throw error;
        }
        for(i of req.files.image){
            let image = await Category_Image.create({
                image:i.filename,
                categoryId:category.id
            })
        }
        res.status(201).json({category:category, status: true});
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}