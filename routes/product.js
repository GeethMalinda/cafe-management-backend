const express =  require('express');
const connection = require('../connection')
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/add',auth.authenticationToken,checkRole.checkRole,((req, res) => {
    let product =  req.body;
    let query = "insert into product (name, categoryId, description, price, status) value(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,],((err, result) => {
        if (!err) {
            return res.status(200).json({message:"Product Added Successfully."})
        }else {
            return res.status(500).json(err)
        }
    }))
}));

router.get('/get',auth.authenticationToken,checkRole.checkRole,(req, res) => {
    let query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId , c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query,((err, result) => {
        if (!err){
            return res.status(200).json(result)
        }else {
            return res.status(500).json(err);
        }
    }))
})
router.get('/getByCategory/:id',auth.authenticationToken,(req, res) => {
    const id = req.params.id;
    let query = "select id,name from product where categoryId = ? and status = 'true'";
    connection.query(query,[id],(err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }else {
            return res.status(500).json(err);
        }
    })
})

router.get('getById/:id',auth.authenticationToken,(req, res) => {
    const id = req.params.id;
    let query = "select id,name,description,price from product where id = ?"
    connection.query(query,[id],((err, result) => {
        if (!err) {
            return res.status(200).json(result[0])
        }else {
            return res.status(500).json(err)
        }
    }))
})

router.patch('/update',auth.authenticationToken,checkRole.checkRole,(req, res) => {
    let product = req.body;
    let query = "update product set name = ?,categoryId = ?,description = ?,price = ? where id = ? ";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err, result) => {
        if (!err){
            if (result.affectedRows === 0){
                return res.status(404).json({message:"Product Id Does Not Exists"})
            }
            return res.status(200).json({message:"Product Updated Successfully"})
        }else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id',auth.authenticationToken,checkRole.checkRole,(req, res) => {
    const id = req.params.id;
    let query = "delete from product where id = ?";
    connection.query(query,[id],((err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({message:'Product Id does not found'})
            }
            return res.status(200).json({message:"Product Deleted Successfully"});
        }else {
            return res.status(500).json(err);
        }
    }))
})

module.exports = router;