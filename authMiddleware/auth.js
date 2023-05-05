const jwt = require('jsonwebtoken');
// const ExpUser = require('../models/user');
const User = require('../modelsnosql/user');

exports.authenticate = (req, res, next) => {

    try{
        // console.log(req.headers.authorization)
        const token = req.headers.authorization;
        const userId = jwt.verify(token, 'amareshwar');
        console.log(userId)
        User.find( {'_id': userId} )
        // ExpUser.findByPk(userId)
            .then( user => {
                // req.user = user;
                req.user = user[0]
                next();
            })
            .catch(err => {throw new Error('Not Authorized')});
    }
    catch(err){
        return res.status(401).json({success: false})
    }

}