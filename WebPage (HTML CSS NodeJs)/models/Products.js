module.exports = function (sequelize, DataTypes) {
    var Products = sequelize.define('Products', {
        Name: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
        
        Quantity: {
            type: DataTypes.INTEGER(),
            defaultValue: 0,
        },

        Price: {
            type: DataTypes.FLOAT(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Description: {
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
    return Products;
}