
const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchasync');
const ExpressError = require('../utils/expresserror');
const {campgroundSchema,
    reviewSchema
} = require('../schema.js')
const review = require('../models/review');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')



router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview)
)

module.exports = router;