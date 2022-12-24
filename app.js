const express = require('express');
const app = express();
const {connectDB} = require('./config/db');

const PORT = 5000;

// middlewares
app.use(express.json());
app.use(express.static('content'));
app.use(express.urlencoded({extended: false}));

app.listen(PORT, () => {
    console.log('Server is running...');
    connectDB();
})