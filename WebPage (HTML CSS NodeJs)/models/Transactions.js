module.exports = function (sequelize, DataTypes) {
    var Transactions = sequelize.define('Transactions', {
        id: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true
          },

        quantity: {
            type: DataTypes.INTEGER(),
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