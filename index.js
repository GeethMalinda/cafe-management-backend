const express = require('express');
const cors = require('cors');
const connection =  require('./connection');
const userRoute = require('./routes/user.js');
const categoryRoute = require('./routes/category')
const productRoute =  require('./routes/product')
const billRoute =  require('./routes/bill')
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user',userRoute);
app.use('/category',categoryRoute);
app.use('/product',productRoute);
app.use('/bill',billRoute)

module.exports = app;