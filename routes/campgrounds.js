const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')

const { storage } = require('../cloudinary');
const upload = multer({ storage });

// const { app, validateCampground } = require('../app');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchasync');


const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')





// In routes/campgrounds.js



router.get("/", catchAsync(campgrounds.index));



router.get("/new" , isLoggedIn, campgrounds.renderNewForm);


// campgroundSchema = Joi.obj9ect({
//     name:Joi.string().required(),
//     image:Joi.string().required(),
//     price:Joi.number().required().min(0),
//     description:Joi.string().required(),
//     location:Joi.string().required()
// })


router.post('/',isLoggedIn,upload.array('image'), validateCampground,catchAsync(campgrounds.createCampground));


// router.post('/',upload.array('image'), async (req, res, next) => {
//     console.log(req.body,req.files)
//    res.send(req.body)
// })




router.get("/:id", catchAsync(campgrounds.showCampground)
    );


router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

router.put("/:id",isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
   
   

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))  
   
    
module.exports = router;
