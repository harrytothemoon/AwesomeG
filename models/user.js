'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Question)
      User.hasMany(models.Answer)
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    grade: DataTypes.STRING,
    bankaccount: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};