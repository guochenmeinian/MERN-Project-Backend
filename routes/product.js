const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const Product = require("../models/Product");

// CREATE; only admin can create new product
router.post("/", verifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE; only admin can update product
router.put("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new:true}
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS; all have access
router.get("/", async (req,res)=>{
    const qNew = req.query.new; 
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            // sort products by create time in descending order, limit to 5 numbers
            products = await Product.find().sort({createdAt:-1}).limit(5);
        } else if (qCategory) {
            // we only want categories included in the request
            products = await Product.find({categories:{
                $in: [qCategory]
            }})
        } else {
            products = await Product.find(); // otherwise just return all
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET certain product; all have access
router.get("/:id", async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted successfully");
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;