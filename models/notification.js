'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    UserId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    msg: DataTypes.STRING
  }, {});
  Notification.associate = function (models) {
    Notification.belongsTo(models.User)
    Notification.belongsTo(models.User, {
      through: models.Notification,
      foreignKey: 'teacherId',
      as: 'teacher'
    })
  };
  return Notification;
};