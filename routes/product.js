const express = require('express');
const router = express.Router();
const {isAuthenticated, isSeller} = require('../middlewares/auth');
const upload = require('../utils/fileUpload');

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

        return res.status(200).json({
            status: "ok",
            productDetails
        })
    })
})
module.exports = router;