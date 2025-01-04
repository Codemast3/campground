const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema,reviewSchema} = require('./schema.js')
const catchAsync = require('./utils/catchasync')
const ExpressError = require('./utils/expresserror')
const Review = require('./models/review')

const Campground = require("./models/campground")
const app = express();
const path = require('path')
const campground = require("./models/campground")


mongoose.connect('mongodb://localhost:27017/yelp-camp' )
.then(() => {
    console.log("Mongo Connection Open")
})
.catch(err => {
    console.log("Mongo Connection Error")
    console.log(err)
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",() => {
    console.log("Database connected")
})

// const app = express();

app.engine('ejs',ejsmate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const validateCampground = (req,res,next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
    }

    const validateReview = (req,res,next) => {
        const {error} = reviewSchema.validate(req.body);    
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg,400)
            }
            else{
                next();
            }
            }




app.get("/",(req,res) => {
    res.render('home')
}
)






app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));




app.get("/campgrounds/new",(req,res) => {
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


app.post('/campgrounds', validateCampground,catchAsync(async (req,res,next) => {
   // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
} 
)
)







app.get("/campgrounds/:id",catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
  
    res.render('campgrounds/show',{campground})

   
})
)

app.get("/campgrounds/:id/edit",async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}
)

app.put("/campgrounds/:id",validateCampground,catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate
    (id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
}
))

app.delete("/campgrounds/:id",catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}
)
)

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
   
}
)
)

app.use((err,req,res,next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Internal Server Error'
    res.status(statusCode).render('error',{err})
}
)

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
    })























app.listen(3000,() =>{
    console.log("Server is running on port 3000")
})