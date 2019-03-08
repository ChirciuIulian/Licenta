module.exports = function (sequelize, DataTypes) {
    var Gym = sequelize.define('Gym', {
        Name: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
        
        Address: {
            type: DataTypes.STRING(),
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
        },

        Subscription: {
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
    return Gym;
}