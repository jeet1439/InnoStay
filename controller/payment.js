const Listing = require('../models/listing'); 
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

        // Calculate total price based on the number of days
        const pricePerDay = listing.price; // Assuming the listing has a price field
        const totalAmount = days * pricePerDay * 100; // Razorpay uses smallest currency units
        const amoutAfterTax = totalAmount + (totalAmount*18)/100;
        // const options = {
        //     amount: totalAmount,
        //     currency: "INR",
        //     receipt: `receipt_order_${Date.now()}`,
        // };
        // Create Razorpay order
        // const order = await razorpayInstance.orders.create(options);
        res.render('bookings/paymentSlip.ejs', {
            // orderId: order.id,
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
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Some error occurred while processing your booking.");
    }
};
