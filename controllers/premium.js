// const ExpTrckUser = require('../models/user');

const User = require('../modelsnosql/user');
// const sequelize = require('../util/database');

exports.getAllExpensesFromDB = async (req, res, next) => {

    try{

        const ldrbrd = await User.find().select('name totalExpense').sort({totalExpense: -1});
        
        // const leaderBoard = await ExpTrckUser.findAll( {
        //     attributes: [
        //         'name',
        //         'totalExpense'
        //     ],
        //     group: ['user.id'],
        //     order: [[sequelize.literal('totalExpense'), 'DESC']]
        // });
        // res.status(201).json( {allExpenseDataFromDB:leaderBoard} ); 

        res.status(201).json( {allExpenseDataFromDB:ldrbrd} ); 
    }

    catch(err){
        console.log(err);
        res.status(404).json({message:err});
    } 

}