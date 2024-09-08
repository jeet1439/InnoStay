const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
//index route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
//new route:
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new.ejs");
});
//show route:
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));
//create route:
router.post("/",isLoggedin, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing added!!");
    res.redirect("/listings");
}));

//edit Route:
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route:
router.put("/:id", isLoggedin,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated successfully!!");
    res.redirect(`/listings/${id}`);
}));
//Delete Route:
router.delete("/:id",isLoggedin, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;