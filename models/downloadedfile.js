const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DownloadedFile = sequelize.define( 'downloadedfile', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    fileurl: {
        type: Sequelize.TEXT,
        allowNull: false,
    }

});

module.exports = DownloadedFile;