const express = require('express');
const cors = require('cors');
const connection =  require('./connection');
const userRoute = require('./routes/user.js');
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user',userRoute);

module.exports = app;