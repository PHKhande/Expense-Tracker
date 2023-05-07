// const Expenses = require('../models/expenses');
// const ExpUser = require('../models/user');

// const sequelize = require('../util/database');

const Exps = require('../modelsnosql/expenses');
const User = require('../modelsnosql/user');
const mongoose = require('mongoose');

exports.getAllExpenses = async (req, res, next) => {

  try{
    
    
    
    // const ITEMS_PER_PAGE = 5;
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.limit;
    let totalItems;

    // Expenses.count({where:{userId:req.user.id}})
    //   .then( (total) => {
    //     totalItems = total;
    //     return Expenses.findAll({
    //       where: {userId:req.user.id},
    //       offset: (page - 1) * ITEMS_PER_PAGE,
    //       limit: ITEMS_PER_PAGE
    //     })
    //   })
    //     .then( (expenses) => {
    //       res.json({
    //         expenses: expenses,
    //         currentPage: page,
    //         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    //         nextPage: page + 1,
    //         hasPreviousPage: page > 1,
    //         previousPage: page - 1,
    //         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    //       })
          
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })

    totalItems = await Exps.find().where({userId: req.user.id}).count();
    const expenses = await Exps
                                .find()
                                .where({userId: req.user.id})
                                .skip((page - 1) * ITEMS_PER_PAGE)
                                .limit(ITEMS_PER_PAGE)

    res.json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    })

    
  } catch(err) {

    console.log(err);
    res.status(500).json({message: "Error while fetching already present expenses", success:false});

  }

}

exports.postExpense = async (req, res, next) => {

  const session = await mongoose.startSession();

  try {
  
    await session.withTransaction( async () => {

      const { amount, category, description } = req.body;
      const userId = req.user.id;
    
      if (!amount || !category || !description) {
        return res.status(500).json({ message: 'All fields are mandatory' });
      }
      
      const newTotalExpense = Number(req.user.totalExpense) + Number(amount);

      const user = await User.findById(userId).session(session);
      user.totalExpense = newTotalExpense;
      await user.save();

      const expense = new Exps({
        amountDB: amount,
        categoryDB: category,
        descriptionDB: description,
        userId
      });

      await expense.save({ session });

      res.status(201).json({ newExpenseData: expense });
  
    });

  } catch (err) {
  
    console.log(err);
    res.status(500).json({ error: err });
  
  } finally {
  
    session.endSession();
  
  }

  // const t = await sequelize.transaction();
  // try{

  //   const {amount, category, description} = req.body;
  //   const idUser = req.user.id;
  //   if(!amount | !category | !description){
  //     return res.status(500).json({message: 'All fields are mandatory'});
  //   }
      
  //   const newtotalExpense = Number(req.user.totalExpense) + Number(amount);

    // await ExpUser.update({ totalExpense: newtotalExpense },{where: {id:idUser}, transaction:t});

    // const data = await Expenses.create({
    //   amountDB: amount,
    //   categoryDB: category,
    //   descriptionDB: description,
    //   userId: idUser
    // },{transaction:t});

    // await t.commit();
    // res.status(201).json({newExpenseData: data});

  // } catch(err) {

  //   await t.rollback();
  //   console.log(err);
  //   res.status(500).json({error: err});

  // }

}

exports.delExpense = async (req, res, next) => {

  const session = await mongoose.startSession();

  try {
  
    await session.withTransaction( async () => {

      const deleteId = req.params.delId;
      const userId = req.user.id;

      const negExpense = await Exps.findById(deleteId).session(session)
      const negExpenseAmt = negExpense.amountDB;

      const newTotalExpense = Number(req.user.totalExpense) - Number(negExpenseAmt);

      const user = await User.findById(userId).session(session);
      user.totalExpense = newTotalExpense;
      await user.save();
      
      await Exps.findByIdAndRemove(deleteId).session(session);

      res.status(201).json({message: 'Removed Successfully' });
  
    });

  } catch (err) {
  
    console.log(err);
    res.status(500).json({ error: err });
  
  } finally {
  
    session.endSession();
  
  }

  // const t = await sequelize.transaction();

    // try{

    //   const deleteId = req.params.delId;
    //   const userId = req.user.id;
      
      // const negExpense = await Expenses.findOne( { where: { id:deleteId, userId:userId } });
      // const negExpenseAmt = negExpense.amountDB;

      // const delExpense = await Expenses.destroy( { where: { id:deleteId, userId:userId }, transaction:t });

      // const newtotalExpense = Number(req.user.totalExpense) - Number(negExpenseAmt);
      // await ExpUser.update({ totalExpense: newtotalExpense }, {where: {id: userId}, transaction:t });

      // await t.commit();
      // res.status(201).json({message: 'Removed Successfully' });

    // } catch(err) {

    //   await t.rollback();
    //   console.log(err);
    //   res.status(500).json({error: err});

    // }
}
