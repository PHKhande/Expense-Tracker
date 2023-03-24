const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expenses = sequelize.define( 'expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    amountDB: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    
    categoryDB: {
        type: Sequelize.STRING,
        allowNull: false
    },

    descriptionDB: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Expenses;