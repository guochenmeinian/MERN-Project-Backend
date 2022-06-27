const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        /**
         * this userId can't have unique property, otherwise we can only have one order for each user
         * spent half an hour found out this...
         */
        userId: {type: String, required: true}, 
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        amount: {type: Number, required: true},
        address: {type: Object, required: true}, //take all address requires multiple lines like street, city, country
        status: {type: String, default: "pending"}
    },
    { timestamps: true } //automatically create and update time
);

module.exports = mongoose.model("Order", orderSchema);