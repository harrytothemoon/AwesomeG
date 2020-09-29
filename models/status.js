'use strict';
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    name: DataTypes.STRING
  }, {});
  Status.associate = function (models) {
    Status.hasMany(models.Question)
  };
  return Status;
};