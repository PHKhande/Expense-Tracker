const Sib = require('sib-api-v3-sdk');
// const ExpUser = require('../models/user');
const User = require('../modelsnosql/user');

// const ForgotPasswordRequest = require('../models/forgotPassword');
const FPRequest = require('../modelsnosql/forgotpassword');

const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
const path = require('path');


exports.getResetEmailInfo = async (req, res, next) => {

    try{

    const {resetEmail} = req.body;
    // const resetUser = await ExpUser.findOne({where: {email:resetEmail}});
    const resetUser = await User.find( {'email': resetEmail} )

    if(!resetUser){
        throw new Error('Not a authorized user');
    }
    const idUser = resetUser[0].id;

    const forgotRequest = new FPRequest({
        isActive: true,
        userId: idUser
    })
    forgotRequest.save();

    // const forgotRequest = await ForgotPasswordRequest.create({
    //     isActive: true,
    //     userId: idUser
    // });

    const uuid = forgotRequest._id;
    const changePassURL = `http://localhost:3000/password/resetpassword/${uuid}`;


    // require('dotenv').config(); 
    

    const client = Sib.ApiClient.instance

    const apiKey = client.authentications['api-key'];

    apiKey.apiKey = process.env.API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'phk151raj@gmail.com'
    }

    const receivers = [
        {
        email: resetEmail
        }
    ]

    

        response = await tranEmailApi.sendTransacEmail( {
            sender,
            to: receivers,
            subject: 'Reset your password',
            textContent: `
            Trouble signing in?
            
            Resetting your password is easy.
            
            Just press the link below and follow the instructions. We'll have you up and running in no time.
            ${changePassURL}
            
            If you did not make this request then please ignore this email.
            `
        })
        console.log(response);
        res.status(201).json({message:'Succesfull'})

    } catch(err) {
        res.status(400).json({err:err});
    }


}

exports.getResetlinkInfo = async (req, res, next) => {

    try{

        const idReset = req.params.resetId;
        // const request = await ForgotPasswordRequest.findOne( {where: {id: idReset}} );
        const request = await FPRequest.find( {'_id': idReset} );
        console.log(request)
        if(!request){
            throw new Error('No such has been made');
        }
        if(request[0].isActive == 'true'){
            res.status(201).sendFile(path.join(__dirname, '../', 'public', 'form.html'));
        }
        else{
            throw new Error('Link has expired');
        }
    }
    catch(err){
        console.log(err);
        res.status(404).json({message: "Link Expired"});
    }
    
}

exports.postResetPasswordInfo = async (req, res, next) => {
    // const t = await sequelize.transaction();
    try{

        const {newPassword} = req.body;
        const idReset = req.params.resetId;
        
        const encryptPass = await bcrypt.hash(newPassword, 10); 

        // const request = await ForgotPasswordRequest.findOne( {where: {id: idReset}} );
        const request = await FPRequest.find( {'_id': idReset} );

        if(!request){
            throw new Error('No link was created');
        }
        if(request[0].isActive == 'true'){
            // console.log(request);
            const user = await User.findById(request[0].userId);
            user.password = encryptPass;
            user.save();

            const oneRequest = request[0]
            oneRequest.isActive = false
            oneRequest.save();


            // await ExpUser.update({ password: encryptPass },{where: {id: request.userId}, transaction:t});
            // await request.update({ isActive: false },{transaction:t})
            // await t.commit();
            // res.status(201).json({mesaage: "Successfully password changed"});


            res.status(201).json({mesaage: "Successfully password changed"});
        }
        else{
            throw new Error('Link has expired or password changed');
        }
    }
    catch(err){
        console.log(err);
        // await t.rollback();
        res.status(404).json({message: err});
    }
    
}