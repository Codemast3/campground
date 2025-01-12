const express = require('express');
const router = express.Router();

// const { app, validateCampground } = require('../app');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchasync');
const ExpressError = require('../utils/expresserror');
const { campgroundSchema } = require('../schema.js');




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




router.get("/new",(req,res) => {
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


router.post('/', validateCampground,catchAsync(async (req,res,next) => {
   if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
} 
)
)







router.get("/:id",catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
  
    res.render('campgrounds/show',{campground})

   
})
)

router.get("/:id/edit",async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}
)

router.put("/:id",validateCampground,catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate
    (id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
}
))

router.delete("/:id",catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}
)
)
module.exports = router;
