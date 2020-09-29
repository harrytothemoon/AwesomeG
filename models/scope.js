'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scope = sequelize.define('Scope', {
    name: DataTypes.STRING
  }, {});
  Scope.associate = function (models) {
    Scope.hasMany(models.Question)
  };
  return Scope;
};