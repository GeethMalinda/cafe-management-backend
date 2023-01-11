const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
require('dotenv').config();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole')

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where  email = ?";
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                query = "Insert into user(name, contactnumber, email, password, status, role) values (?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if (!err) {
                        return res.status(200).json({message: "Successfully registerd"});
                    } else {
                        return res.status(400).json({message: "Email Already Exists"});
                    }
                })
            } else {
                return res.status(400).json({message: "Email Already Exists ! "})
            }
        } else {
            return res.status(500).json(err);
        }
    })

});

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where  email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({message: "Incorrect username or password"})
            } else if (results[0].status === 'false') {
                return res.status(401).json({message: "Waits for admin approval"})
            } else if (results[0].password === user.password) {
                const response = {email: results[0].email, role: results[0].role}
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'});
                res.status(200).json({token: accessToken})
            } else {
                return res.status(400).json({message: "Something went wrong.Please try again later ! "})
            }
        } else {
            return res.status(500).json(err);
        }
    })

});

let transporter =  nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
});

router.post('/forgotPassword',(req,res) => {
    const user = req.body;
    query = 'select email,password from user where  email = ? ';
    connection.query(query,[user.email],(err,result) => {
        if (!err){
            //result.length <= 0 (that user not existing in our database);
            if (result.length <= 0) {
                return res.status(200).json({message:" Password sent successfully to your email "})
            }else {
                let mailOption = {
                    from:process.env.EMAIL,
                    to:result[0].email,
                    subject:'Password by cafe management system',
                    html:'<p><b>Your login details for cafe management system </b><br><b>Email: </b>'+result[0].email+'<br><b>Password:</b>'+result[0].password+'<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailOption,function (error,info) {
                    if (error){
                        console.log(error)
                    }else {
                        console.log('Email sent: '+info.response)
                    }
                })
                return res.status(200).json({message:" Password sent successfully to your email "})

            }
        }else {
            res.status(500).json(err)
        }
    })
});

router.post('/changePassword',auth.authenticationToken,(req, res) => {
    const user = req.body;
    const email = res.locals.email;
    let query = "select * from user where  email = ? and password = ? ";
    connection.query(query,[email,user.oldPassword],(err,result) => {
        if(!err){
            if (result.length <= 0){
                return res.status(400).json({message:"Incorrect old password"})
            }else if (result[0].password === user.oldPassword){
                query = "update user set password = ? where email = ?"
                connection.query(query,[user.newPassword,email],((err1, result1) =>{
                    if (!err1){
                        return res.status(200).json({message:"Password Update Sucessfully"})
                    }else {
                        return res.status(500).json(err1)
                    }
                } ))
            }else {
                return res.status(400).json({message:"Something went wrong.Please try again later"});

            }
        }else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get',auth.authenticationToken,checkRole.checkRole,(req,res) => {
     query = "select id,name,email,contactNumber,status from user where  role='user'  ";
     connection.query(query,(err,result) => {
         if (!err) {
             return res.status(200).json(result);
         }else {
             return res.status(500).json(err);
         }
     })

});

router.get('/checkToken',auth.authenticationToken,checkRole.checkRole,(req,res) => {
    return res.status(200).json({message:"true"})
});

router.patch('/update',auth.authenticationToken,(req,res) => {
    let user = req.body;
    query = "update user set status = ? where id = ?"
    connection.query(query,[user.status,user.id],(err,result) => {
        if (!err) {
            if (result.affectedRows === 0){
                return res.status(404).json({message:"User id does not exists "})
            }
            return res.status(200).json({message:" User update successfully "})
        }else {
            return res.status(500).json(err);
        }
    })
});

module.exports = router;