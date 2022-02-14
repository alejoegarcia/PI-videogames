const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // id, name
    return sequelize.define('genre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(),
            allowNull: true
        }
    });
}