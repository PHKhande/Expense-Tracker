const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        minLength: 5
    },
    password: {
        type: String,
        required: true
    },

    isPremium: {
        type: Boolean,
    },

    totalExpense: {
        type: Number
    },

    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    }

});

module.exports = mongoose.model('User', userSchema);