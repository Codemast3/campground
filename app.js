const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const Joi = require('joi')
const {campgroundSchema,
    reviewSchema
} = require('./schema.js')
const catchAsync = require('./utils/catchasync')
const ExpressError = require('./utils/expresserror')
const Review = require('./models/review')

const Campground = require("./models/campground")
const app = express();
exports.app = app
const path = require('path')
const campgroundroutes= require("./routes/campgrounds")
const reviewroutes= require("./routes/reviews")
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userroutes = require('./routes/users')




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



app.engine('ejs',ejsmate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    }

app.use(session(sessionConfig))
app.use(flash())
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
}
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




   
app.use('/',userroutes)
app.use('/campgrounds',campgroundroutes)
app.use('/campgrounds/:id/reviews',reviewroutes)






app.get("/",(req,res) => {
    res.render('home')
}
)

app.get("/register",(req,res) => {
    res.render('users/register')
}
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