module.exports = function (sequelize, DataTypes) {
    var Programs = sequelize.define('Programs', {
        Description: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
        
        Subscription: {
            type: DataTypes.FLOAT(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Capacity: {
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
    
    return Programs;
}