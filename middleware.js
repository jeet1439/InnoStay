const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const  { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


//validate listing:
module.exports.validateListing = (req, res, next) => {
    let { error, value } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//validate review:
module.exports.validateReview = (req, res, next) => {
    let { error, value } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};
module.exports.isLoggedin = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in !!");
        return res.redirect("/login");
        }
        next();
}
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//middleware for authorization
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "you don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you are not author");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.currentUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currUser = req.user;
    } else {
        res.locals.currUser = null;
    }
    next();
};