module.exports = function (sequelize, DataTypes) {
    var Calories = sequelize.define('Calories', {
        Diet_Name: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
        Meal1: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Meal2: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Meal3: {
            type: DataTypes.STRING(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },

        Calories: {
            type: DataTypes.INTEGER(),
            validate: {
                notEmpty: true,
              },
            allownull: false
        },
    },

    {
        timestamps:false
    });
    
    return Calories;
}