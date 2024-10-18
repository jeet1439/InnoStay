const Listing = require('../models/listing');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

module.exports.createOrder = async (req, res) => {

    const { checkinDate, checkoutDate, email, address } = req.body;
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).send("Listing not found.");
        }
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        if (days <= 0) {
            return res.status(400).send("Invalid booking dates.");
        }
        const pricePerDay = listing.price; 
        const totalAmount = days * pricePerDay * 100; 
        const amoutAfterTax = totalAmount + (totalAmount*18)/100;
        res.render('bookings/paymentSlip.ejs', {
            amount: totalAmount,
            email,
            checkinDate,
            checkoutDate,
            address,
            days,
            listing,
            totalAfterTax:  amoutAfterTax,

        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Some error occurred while processing your booking.");
    }
};

module.exports.processPayment = async (req, res) => {
    res.locals.currUser = req.user;
    const { email, checkinDate, checkoutDate, amount, listing } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found.");
        }
        const bookingId = uuidv4();

        const booking = {
            bookingId: bookingId, 
            checkinDate: new Date(checkinDate), 
            checkoutDate: new Date(checkoutDate),
            amount: amount, 
            listing: {
                title: listing.title, 
                image: {
                    url: listing.image.url 
                }
            }
        };
        user.bookings.push(booking);
        await user.save();
        const updatedListing = await Listing.findByIdAndUpdate( listing._id,{ $inc: { slots: -1 } }, { new: true });
        if (!updatedListing) {
            return res.status(404).send("Listing not found or no slots available.");
        }
        // Corrected the response handling
        // res.status(200).json({ message: 'Payment processed and booking saved successfully!' });
        // res.render("bookings/myBookings.ejs", { user: res.locals.currUser });
        res.redirect("/listings");
    } catch (error) {
        console.error("Error processing payment:", error);
        // console.log(error);
        res.status(500).send("Error processing payment and saving booking.");
    }
};

