const express = require('express');
const connection = require('../connection');
const router = express.Router();
const ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let fs = require('fs');
let uuid = require('uuid');
let auth = require('../services/authentication');

router.post('/generateReport',auth.authenticationToken,
    ((req, res) => {
        const generatedUuid = uuid.v1();
        const orderDetails =  req.body;
        let productDetailsReport = JSON.parse(orderDetails.productDetails);

        query = "insert into bill (name, uuid, email, contactNumber, paymentMethod ,total,productDetails,createdBy) value(?,?,?,?,?,?,?,?)";

        connection.query(query,[orderDetails.name,generatedUuid,orderDetails.email,orderDetails.contactNumber,
        orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,res.locals.email],
            (err, result) => {
                if(!err){
                        ejs.renderFile(path.join(__dirname,'',"report.ejs"), {productDetail:productDetailsReport ,
                                name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,
                                paymentMethod:orderDetails.paymentMethod,totalAmount:orderDetails.totalAmount},
                            (err,result) => {
                                if (err){
                                        return res.status(500).json(err);
                                }else {
                                        pdf.create(data).toFile('./generated_pdf/'+generatedUuid ,
                                            function (err,data) {
                                                    if (err){
                                                            console.log(err)
                                                            return  res.status(500).json(err);
                                                    }else {
                                                            return res.status(200).json({uuid:generatedUuid})
                                                    }
                                            })
                                }
                            })
                }else {
                        res.status(500).json(err);
                }
            })


    }))

module.exports = router;