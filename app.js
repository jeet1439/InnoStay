const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
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
app.listen(8080, () => {
  console.log("server is listening at port 8080");
});
