if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

// const MONGO_URL = "mongodb://127.0.0.1:27017/";
const dbUrl = process.env.ATLASDB_URL;


const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratagy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/listing");
const paymentRouter = require("./routes/payment.js");
const policyRouter = require("./routes/policy.js");
const { currentUser } = require('./middleware.js');
// const job = require("./lib/cron.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error");
  });
async function main() {
  await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // for put and delete request
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
});
store.on("error", (err) => {
  console.log("Error in Mongo session store", err);
});
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
  }
};

// job.start();

// root direcroery:
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use(currentUser);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/listings/book", paymentRouter);
app.use("/policy", policyRouter );


app.get("/myBookings", (req, res) => {
  if (req.isAuthenticated()) {
      res.locals.currUser = req.user;
      // console.log("Current User:", res.locals.currUser);
      res.render("bookings/myBookings", { user: res.locals.currUser });
  } else {
      req.flash("error", "You must be logged in to view your bookings.");
      return res.redirect("/login");
  }
});



//error handelimg midddle ware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});
app.use((err, rq, res, next) =>{
  let {statusCode=500, message="Something went wrong..." } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err })
});
app.listen(8080, () => {                                              
  console.log("server is listening at port 8080");
});
