var express = require('express');
var router = express.Router();
//config
const config = require('../config');
//jwt 
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

var db = require('../db');


/**
 * Receive email and password
 * Find user
 * generate token
 */
router.post('/login', (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body.userData;

    if( email === undefined || password === undefined ){
        res.status(401).json({
            success: false,
            code: 'DD101_API_ERROR_01',
            message: "E-mail and/or password invalid."
        });
    } else {
        //find user in MongoDB

        const handler = (err, result) => {
            if(!err && bcrypt.compareSync(password, result.password)){
                let tokenData = {
                    name: result.name,
                    email: result.email
                }
                let generatedToken = jwt.sign(tokenData, config.JWT_KEY, {  expiresIn: '1m'});
                res.json({
                    success: true,
                    token: generatedToken
                });
            } else {
                res.status(401).json({
                    success: false,
                    code: 'DD101_API_ERROR_02',
                    message: err
                });
            }
        }

        db.findUser({email}, handler);


    }
});


module.exports = router;