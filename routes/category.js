const express =  require('express');
const connection =  require('../connection')
const router = express.Router();
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

router.post('/add',auth.authenticationToken,checkRole.checkRole,((req, res) => {
    let category = req.body;
    query = "INSERT INTO category (name) value()";
    connection.query(query,[category.name],((err, result) => {
        if (!err){
            return res.status(200).json({message:"Category Added Successfully"})
        }else {
            return res.status(500).json(err)
        }
    }))
}))

router.get('/get',auth.authenticationToken,((req, res, next) => {
    let query = "select * from category order by name";
    connection.query(query,((err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }else {
            return res.status(500).json(err);
        }
    }))
}))