require('dotenv').config()
const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split[" "][1];

        if (token === null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
            if (err) {
                return res.sendStatus(403);
            }
            response.locals = response;
            next();
        })
    }catch (e) {
        console.log(e)
    }

}

module.exports = {authenticationToken: authenticationToken};