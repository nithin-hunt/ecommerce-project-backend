const express = require('express');
const app = express();

const {connectDB} = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

const PORT = 5000;

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Photo Store API",
        version: "1.0.0",
        description:
          "Completed project with file upload, payment gateway, unit testing and swagger docs",
      },
      servers: [
        {
          url: process.env.URL,
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const specs = swaggerJsDoc(options);

  connectDB();

// middlewares
app.use(express.json());
app.use(express.static('content'));
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

app.listen(PORT, () => {
    console.log('Server is running...');
})