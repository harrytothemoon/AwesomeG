'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    grade: DataTypes.STRING,
    bankaccount: DataTypes.STRING,
    expertise: DataTypes.STRING,
    unread: DataTypes.INTEGER
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Question)
    User.hasMany(models.Answer)
    User.hasMany(models.Notification)
  };
  return User;
};