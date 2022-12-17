const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.post('/signup',(req,res) => {
    let user = req.body;
    query = "select email,password,role,status from user where  email = ?";
    connection.query(query,[user.email],(err,result) => {
        if (!err){
            if (result.length <= 0){
                query = "Insert into user(name, contactnumber, email, password, status, role) values (?,?,?,?,'false','user')"
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,result) => {
                    if (!err){
                        return res.status(200).json({message:"Successfully registerd"});
                    }else {
                        return res.status(400).json({message:"Email Already Exists"});
                    }
                })
            }else {
                return res.status(400).json({message:"Email Already Exists ! "})
            }
        }else {
            return res.status(500).json(err);
        }
    })

});

router.get('/',(req,res) => {


});
module.exports = router;