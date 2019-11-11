module.exports = function (sequelize, DataTypes) {
    var Basket = sequelize.define('Basket', {
        Product_Name: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Quantity: {
            type: DataTypes.INTEGER(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
        
        Price: {
            type: DataTypes.FLOAT(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        }
    },

    {
        timestamps:false
    });
    
    return Basket;
}