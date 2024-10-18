const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, currentUser } = require("../middleware.js");
const paymentController = require('../controller/payment.js');
const { isOwner } = require("../middleware.js");
const router = express.Router();
router.get('/:id', isLoggedin, (req, res) => {
res.locals.currUser = req.user;
res.render("bookings/bookingform.ejs", {listingId: req.params.id, user: res.locals.currUser});
}); 

router.post('/payment/:id', isLoggedin, wrapAsync(paymentController.createOrder));
router.put('/payment/:id', isLoggedin, wrapAsync(paymentController.bookOrder));
router.post('/payment/:id/bookings', isLoggedin, wrapAsync(paymentController.processPayment));
module.exports = router;
