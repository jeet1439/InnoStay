const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))//index route
.post(isLoggedin, validateListing, wrapAsync(listingController.createListing));//create route:

//new route:
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new.ejs");}
);

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedin,isOwner, validateListing, wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing)); //delete route

//edit Route:
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;