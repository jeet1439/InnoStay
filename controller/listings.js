const Listing = require("../models/listing");
const { isLoggedin } = require("../middleware.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path:"reviews", populate: {path: "author",},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing added!!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Updated successfully!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};
module.exports.renderFilteredpage = async (req, res)=>{
    const { category } = req.params;
    let allListings = await Listing.find({});
    res.render("listings/filterindex.ejs", { allListings , category });
};
module.exports.renderSearchPage = async (req, res) => {
    const { country } = req.query; 
    let allListings = await Listing.find({});
    if (!country) {
        res.redirect("/listings");
    } else {
        allListings = allListings.filter(listing => listing.country === country);
        if (allListings.length === 0) {
            req.flash("error", "No listings found for the selected country.");
        }
    }
    res.render("listings/searchindex.ejs", { allListings, country, messages: req.flash('error') });
};


