const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const  { listingSchema } = require("./schema.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error");
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // for put and delete request
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//root direcroery:
app.get("/", (req, res) => {
  res.send("welcome to root");
});

const validateListing = (req, res, next) =>{
  let { error, value } = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error);
  }else{
    next();
  }
};
// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new vilaa",
//     description: " sundaram",
//     price: 1200,
//     location: "Calangute, Goa",
//   });
//   await sampleListing.save();
//   console.log("sample saved");
//   res.send("successful");
// });

//index route
app.get("/listings", wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));
//new route:
app.get("/listings/new", (req, res)=>{
  res.render("listings/new.ejs");
});
//show route:
app.get("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));
//create route:
app.post("/listings", validateListing, wrapAsync (async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit Route:
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route:
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));
//Delete Route:
app.delete("/listings/:id", wrapAsync( async (req, res) =>{
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "page not found"));
});

//erroe handelimg midddle ware
app.use((err, rq, res, next) =>{
  let {statusCode=500, message="Something went wrong..." } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err })
})
app.listen(8080, () => {                                              
  console.log("server is listening at port 8080");
});
