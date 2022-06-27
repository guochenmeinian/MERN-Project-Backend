const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

// CHANGE
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
            },
            {new:true}
        );
        res.status(200).json(updateUser);
    }catch(err){
        res.status(500).json(err);
    }
});

// get certain user; only admin can look up for user
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc; // prevent return any password
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
});

// get all users; only admin can look up for user
router.get("/find/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;
    try {
        /**
         * if there's query property (?=....) in the url,
         * return the latest five users otherwise just return all
         * here sort is based on id, -1 represents descending order
         */
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find(); 
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date= new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); // get last year
    
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}}, // get all that were createdAt (greater than) last year 
            {
                $project:{
                    month: {$month: "$createdAt"}, 
                    /**
                     * $project can specify an additional field, resets the values of existing fields,
                     * or specify the exclusion of fields
                     * here we create a new field and assign the month in createdAt field 
                     * to month field(variable)
                     */
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum:1} // sum every registered user
                }
            }
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted successfully");
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;