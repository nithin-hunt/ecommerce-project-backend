const express = require('express');
const router = express.Router();
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({
    url: process.env.DISCORD_URL
});

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

        const createdProduct = await Product.create(productDetails);

        return res.status(200).json({
            status: "ok",
            productDetails: createdProduct
        })
    })
});

router.get('/get/all', isAuthenticated, async(req,res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({products});
    } catch (e) {
        res.status(500).json({err: e});
    }
})

router.post('/buy/:productID', isAuthenticated, isBuyer, async(req,res) => {
    try {
        const product = await Product.findOne({where: {id: req.params.productID}});
        if(!product) {
            return res.status(404).json({err: "No product found"});
        }
        
        const orderDetails = {
            productID: product.dataValues.id,
            productName: product.dataValues.name,
            productPrice: product.dataValues.price,
            buyerID: req.user.id,
            buyerEmail: req.user.email,
        };
        
        let paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: "4242424242424242",
                exp_month: 9,
                exp_year: 2023,
                cvc: "314"
            }
        });

        let paymentIntent = await stripe.paymentIntents.create({
            amount: product.dataValues.price,
            currency: "inr",
            payment_method_types: ["card"],
            payment_method: paymentMethod.id,
            confirm: true
        });

        if(paymentIntent) {
            
            const createdOrder = await Order.create(orderDetails);

            webhook.send({
                content: `Payment recieved for ecommerce testing for order id: ${createdOrder.id} `,
                username: "order-keeper",
            })
            return res.status(200).json({createdOrder})
        } else {
            return res.status(400).json({err:"Payment failed"});
        }

    } catch (e) {
        console.log(e.message);
        res.status(500).json({err: e.message});
    }
})

module.exports = router;