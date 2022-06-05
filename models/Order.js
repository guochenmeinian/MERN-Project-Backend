const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true, unique: true},
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