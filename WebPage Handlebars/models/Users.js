var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
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
        phone:{
          type: DataTypes.STRING(),
          validate: {
              notEmpty: true,
            },
          allownull: false
      },
        isAdmin:{
          type:DataTypes.BOOLEAN(),
          defaultValue: false
        },
        isTrainer:{
          type:DataTypes.BOOLEAN(),
          defaultValue: false
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
            }
        }, {
          hooks: {
            beforeCreate: (user) => {
              const salt = bcrypt.genSaltSync(11);
              user.password = bcrypt.hashSync(user.password, salt);
            },
            beforeUpdate: (user) =>{
              const salt = bcrypt.genSaltSync(11);
              user.password = bcrypt.hashSync(user.password, salt);
            }
          }
    });
        Users.prototype.validPassword = function(password) {
          return bcrypt.compareSync(password, this.password);
        } 
    return Users;
}
