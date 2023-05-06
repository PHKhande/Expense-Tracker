const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({

    amountDB: {
        type: Number,
        required: true,
        min: 1,
        max: 2000
    },
    
    categoryDB: {
        type: String,
        required: true
    },

    descriptionDB: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

});

module.exports = mongoose.model('Expense', expenseSchema);