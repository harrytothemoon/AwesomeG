'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    answer: DataTypes.TEXT,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER
  }, {});
  Answer.associate = function (models) {
    // associations can be defined here
    Answer.belongsTo(models.User)
    Answer.belongsTo(models.Question)
  };
  return Answer;
};