const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../middleware.js");
const paymentController = require('../controller/payment.js');
const { isOwner } = require("../middleware.js");
const router = express.Router();

router.get('/:id', isLoggedin, (req, res) => {
res.render("bookings/bookingform.ejs", {listingId: req.params.id});
}); 
router.post('/payment/:id', wrapAsync(paymentController.createOrder));

module.exports = router;
