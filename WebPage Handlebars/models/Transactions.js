module.exports = function (sequelize, DataTypes) {
    var Transactions = sequelize.define('Transactions', {
        id: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true
          },

        quantity: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Product_Name: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        }
    },
    {
        timestamps:false
    });
    return Transactions;
}