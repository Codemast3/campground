const express = require('express');
const router = express.Router();

// const { app, validateCampground } = require('../app');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchasync');
const ExpressError = require('../utils/expresserror');
const { campgroundSchema } = require('../schema.js');
const {isLoggedIn} = require('../middleware')




// In routes/campgrounds.js
const validateCampground = (req, res, next) => {
   
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));




router.get("/new" , isLoggedIn, (req,res) => {
   

    res.render('campgrounds/new')
}
)

// campgroundSchema = Joi.object({
//     name:Joi.string().required(),
//     image:Joi.string().required(),
//     price:Joi.number().required().min(0),
//     description:Joi.string().required(),
//     location:Joi.string().required()
// })


router.post('/',isLoggedIn, validateCampground,catchAsync(async (req,res,next) => {
    
//    if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
} 
)
)







router.get("/:id",catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    campground.author = req.user;
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
  
    res.render('campgrounds/show',{campground})

   
})
)

router.get("/:id/edit",isLoggedIn,async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}
)

router.put("/:id",isLoggedIn,validateCampground,catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate
    (id,{...req.body.campground});
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}
))

router.delete("/:id",isLoggedIn,catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds')
}
)
)
module.exports = router;
