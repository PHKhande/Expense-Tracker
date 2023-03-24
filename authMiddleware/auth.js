const jwt = require('jsonwebtoken');
const ExpUser = require('../models/user');

exports.authenticate = (req, res, next) => {

    try{
        // console.log(req.headers.authorization)
        const token = req.headers.authorization;
        const userId = jwt.verify(token, 'amareshwar');
        console.log(userId)
        ExpUser.findByPk(userId)
            .then( user => {
                req.user = user;
                next();
            })
            .catch(err => {throw new Error('Not Authorized')});
    }
    catch(err){
        return res.status(401).json({success: false})
    }

}