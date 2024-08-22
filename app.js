const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
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
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
//new route:
app.get("/listings/new", (req, res)=>{
  res.render("listings/new.ejs");
});
//show route:
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
//create route:
app.post("/listings", async (req, res) => {
  // let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit Route:
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route:
app.put("/listings/:id", async (req, res) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});
//Delete Route:
app.delete("/listings/:id", async (req, res) =>{
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})
app.listen(8080, () => {
  console.log("server is listening at port 8080");
});
