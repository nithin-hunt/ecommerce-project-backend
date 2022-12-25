const express = require('express');
const router = express.Router();
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require("../models/productModel");

router.post("/create", isAuthenticated, isSeller, (req,res) => {
    upload(req,res, async(err) => {
        if(err) {
            return res.status(500).send(err);
        }
        
        const {name,price} = req.body;
        if(!name || !price || !req.file) {
            return res.status(400).json({err: "All fields are required"})
        }

        if(Number.isNaN(price)) {
            return res.status(400).json({err: "Price should be a number"})
        }

        let productDetails = {
            name,
            price,
            content: req.file.path
        }

        const savedProduct = await Product.create(productDetails);

        return res.status(200).json({
            status: "ok",
            productDetails: savedProduct
        })
    })
});

router.get('get/all', isAuthenticated, async(req,res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({products});
    } catch (e) {
        res.status(500).json({err: e});
    }
})

router.post('/buy/:productId', isAuthenticated, isBuyer, async(req,res) => {
    try {
        const product = await Product.findOne({where: {id: req.params.productId}}).dataValues;
        if(!product) {
            return res.status(404).json({err: "No product found"});
        }

        const orderDetails = {
            productId,
            buyerId: req.user.id
        }
    } catch (e) {
        res.status(500).json({err: e});
    }
})
module.exports = router;