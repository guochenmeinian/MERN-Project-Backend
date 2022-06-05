const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

/**
 * some explaination from stackOverFlow:
 * express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
 * This method is called as a middleware in your application using the code: app.use(express.json());
 * 
 * link: https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
 */
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

mongoose
    .connect(
        process.env.MONGO_URL)
    .then(() => {
        console.log("connected to databse");
    }).catch((err) => {
        console.error(err);
    }
);

app.use(express.json());

app.listen(process.env.PORT || 3000, () => {
    console.log("backend server runs on port 3000");
})