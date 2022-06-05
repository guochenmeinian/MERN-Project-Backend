const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        desc: {type: String, required: true, unique: true},
        img: {type: String, required: true},
        category: {type: Array},
        size: {type: String},
        color: {type: String},
        price: {type: Number, required: true},
    },
    { timestamps: true } //automatically create and update time
);

module.exports = mongoose.model("Product", productSchema);