const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const Cart = require("../models/Order");
const Order = require("../models/Order");

// CREATE; anyone is able to create new item in his/her cart
router.post("/", verifyToken, async (req,res)=>{
    const newOrder = new Order(req.body);
    // console.log(newOrder); // for testing purpose
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE; only admin can update order
router.put("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER ORDER
router.get("/find/:userId", verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const cart = await Order.find({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE; only admin can delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted successfully");
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET ALL ORDERS; only admin has access
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));
    
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: {$gte: previousMonth} } },
            {
                $project: {
                    month: { $month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;