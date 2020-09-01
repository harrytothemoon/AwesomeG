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
    }
  };
  Question.init({
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    ScopeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};