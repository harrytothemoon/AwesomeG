'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    ScopeId: DataTypes.INTEGER,
    StatusId: DataTypes.INTEGER,
    AnswerId: DataTypes.INTEGER,
  }, {});
  Question.associate = function (models) {
    Question.belongsTo(models.Status)
    Question.belongsTo(models.Subject)
    Question.belongsTo(models.Scope)
    Question.belongsTo(models.User)
    Question.belongsTo(models.Answer)
  };
  return Question;
};