const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    bookings: [{
        bookingId: {
            type: String,
            required: true
        },
        checkinDate: {
            type: Date,
            required: true
        },
        checkoutDate: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        listing: {
            title: {
                type: String,
                required: true
            },
            image: {
                url: {
                    type: String,
                    required: true
                }
            }
        }
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);