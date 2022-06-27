const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require('cors');

dotenv.config();

/**
 * some explaination from stackOverFlow:
 * express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
 * This method is called as a middleware in your application using the code: app.use(express.json());
 * 
 * link: https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
 */
app.use(express.json());
app.use(cors()); // install so that it's not blocked by CORS policies
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

mongoose
    .connect(
        process.env.MONGO_URL)
    .then(() => {
        console.log("connected to databse");
    }).catch((err) => {
        console.error(err);
    }
);

app.listen(process.env.PORT || 5000, () => {
    console.log("backend server runs on port 5000");
})