const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const Cart = require("../models/Cart");

// CREATE; anyone is able to create new item in his/her cart
router.post("/", verifyTokenAndAuthorization, async (req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE; anyone can update cart
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER CART
router.get("/find/:userId", async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted successfully");
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET ALL CARTS; only admin has access
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;