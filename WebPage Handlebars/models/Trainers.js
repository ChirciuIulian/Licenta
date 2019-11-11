module.exports = function (sequelize, DataTypes) {
    var Trainers = sequelize.define('Trainers', {
      id: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
      },
      Salary:{
          type: DataTypes.FLOAT(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      Title:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      Short_Description:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      Long_Description:{
        type: DataTypes.STRING(),
        validate: {
            notEmpty: true,
          },
        allownull: false
    },
      Price:{
          type: DataTypes.FLOAT(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
  });
  return Trainers;
}