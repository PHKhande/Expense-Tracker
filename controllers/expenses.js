const Expenses = require('../models/expenses');
const ExpUser = require('../models/user');
const sequelize = require('../util/database');

exports.getAllExpenses = async (req, res, next) => {

  try{
    
    // const ITEMS_PER_PAGE = 5;
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.limit;
    let totalItems;

    Expenses.count({where:{userId:req.user.id}})
      .then( (total) => {
        totalItems = total;
        return Expenses.findAll({
          where: {userId:req.user.id},
          offset: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE
        })
      })
        .then( (expenses) => {
          res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
          })
          
        })
        .catch((err) => {
          console.log(err);
        })
  } catch(err) {

    console.log(err);
    res.status(500).json({message: "Error while fetching already present expenses", success:false});

  }

}

exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  try{

    const {amount, category, description} = req.body;
    const idUser = req.user.id;
    if(!amount | !category | !description){
      return res.status(500).json({message: 'All fields are mandatory'});
    }
      
    const newtotalExpense = Number(req.user.totalExpense) + Number(amount);

    await ExpUser.update({ totalExpense: newtotalExpense },{where: {id:idUser}, transaction:t});

    const data = await Expenses.create({
      amountDB: amount,
      categoryDB: category,
      descriptionDB: description,
      userId: idUser
    },{transaction:t});

    await t.commit();
    res.status(201).json({newExpenseData: data});

  } catch(err) {

    await t.rollback();
    console.log(err);
    res.status(500).json({error: err});

  }

}

exports.delExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

    try{

      const deleteId = req.params.delId;
      const idUser = req.user.id;

      const negExpense = await Expenses.findOne( { where: { id:deleteId, userId:idUser } });
      const negExpenseAmt = negExpense.amountDB;

      const delExpense = await Expenses.destroy( { where: { id:deleteId, userId:idUser }, transaction:t });

      const newtotalExpense = Number(req.user.totalExpense) - Number(negExpenseAmt);
      await ExpUser.update({ totalExpense: newtotalExpense }, {where: {id: idUser}, transaction:t });

      await t.commit();
      res.status(201).json({delUserfromDB: delExpense });

    } catch(err) {

      await t.rollback();
      console.log(err);
      res.status(500).json({error: err});

    }
}