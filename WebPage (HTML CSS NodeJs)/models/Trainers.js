module.exports = function (sequelize, DataTypes) {
    var Trainers = sequelize.define('Trainers', {
      id: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
      },

      Name:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      Surname:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      Gender:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
              isIn: [['M', 'F']]
            },
          allownull: false
      },
      Address:{
        type: DataTypes.STRING(),
        validate: {
            notEmpty: true,
          },
        allownull: false
    },
      Salary:{
          type: DataTypes.FLOAT(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },

      email: {
          type: DataTypes.STRING(),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: 'This is not a valid e-mail address, please try again'
            },
          }
      },
      username:{
          type: DataTypes.STRING(),
          unique: true,
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
      password:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
  });
  return Trainers;
}