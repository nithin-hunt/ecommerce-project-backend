const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Order = require("../models/orderModel");
const {isAuthenticated, isBuyer} = require('../middlewares/auth');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - isSeller
 *       properties:
 *         id:
 *           type: INTEGER
 *           description: The auto-generated id of the user
 *         name:
 *           type: STRING
 *           description: The name of the user
 *         email:
 *           type: STRING
 *           description: The email of the user
 *         password:
 *           type: STRING
 *           description: The password of the user
 *         isSeller:
 *           type: BOOLEAN
 *           description: The role of the user
 *       example:
 *         name: Nithin
 *         email: nr@gmail.com
 *         password: Nithin@66
 *         isSeller: false
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       403:
 *         description: There was already an existing user with the same email
 *       400:
 *         description: Validation failed for the name, email or password
 *       500:
 *         description: Some server error
 */

router.post("/signup", async(req,res) => {
    try {
        const {name, email, password, isSeller } = req.body;

        const existingUser = await User.findOne({ where: {email}});
        if(existingUser) {
            return res.status(403).json({err: "User already exists"})
        }

        if(!validateName(name)) {
            return res.status(400).json({err: "Name validate fails"})
        }
        if(!validateEmail(email)) {
            return res.status(400).json({err: "Email validate fails"})
        }
        if(!validatePassword(password)) {
            return res.status(400).json({err: "Password validate fails"})
        }

        const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

        const user = {
            email,
            name,
            isSeller,
            password: hashedPassword
        };

        const createdUser = await User.create(user);

        return res.status(201).json({message: `Welcome ${createdUser.name}`});
    }catch (e) {
        return res.status(500).send(e);
    }

})

/**
 * @swagger
 * /api/v1/user/signin:
 *   post:
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            email:
 *             type: string
 *             description: The email of the user
 *            password:
 *             type: string
 *             description: The password of the user
 *          example:
 *           email: nr@gmail.com
 *           password: Nithin@66
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       403:
 *         description: No user with the entered email exists
 *       400:
 *         description: Validation failed for the name, email or password
 *       500:
 *         description: Some server error
 */

router.post("/signin", async(req,res) => {
    try {
        const {email,password} = req.body;
        if(email.length === 0) {
            return res.status(400).json({err: "Please provide email"})
        };
        if(password.length === 0) {
            return res.status(400).json({err: "Please provide password"})
        };

        const existingUser = await User.findOne({where: {email}});
        if(!existingUser) {
            return res.status(404).json({err: "User not found"})
        };

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatched) {
            return res.status(400).json({err: "email or password mismatched"})
        }

        const payload = {user: {id: existingUser.id }};
        const bearerToken = await jwt.sign(payload, "SECRET MESSAGE",{
            expiresIn: 360000,
        });

        res.cookie('t', bearerToken, {expire: new Date() + 9999});

        return res.status(200).json({ message: "Signed In Successfully!", bearerToken: bearerToken });
    } catch (e) {
        return res.status(500).send(e);
        
    }
})

/**
 * @swagger
 * /api/v1/user/signout:
 *   get:
 *     summary: Signs out the active user
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Some server error
 */
router.get("/signout", (req,res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({ message: "Signed out successfully" });
    } catch (e) {
        res.status(500).send(e);
    }
})

router.get("/orders", isAuthenticated, isBuyer, async (req, res) => {
    try {
      // Get all orders of the user
      const orders = await Order.findAll({
        where: { buyerID: req.user.id },
        include: [{ model: User, attributes: ["name"] }],
      });
      return res.status(200).json({ orders });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ err: err.message });
    }
  });
module.exports = router;