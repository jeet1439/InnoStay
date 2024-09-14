const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedin , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

//reviews: post route
router.post("/", isLoggedin, validateReview, wrapAsync(reviewController.createReview));
//delete review route:-
router.delete("/:reviewId",isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;