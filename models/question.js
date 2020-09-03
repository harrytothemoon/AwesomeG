'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Status)
      Question.belongsTo(models.Subject)
      Question.belongsTo(models.Scope)
      Question.belongsTo(models.User)
      Question.belongsTo(models.Answer)
    }
  };
  Question.init({
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    ScopeId: DataTypes.INTEGER,
    StatusId: DataTypes.INTEGER,
    AnswerId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};