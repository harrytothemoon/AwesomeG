'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    amount: DataTypes.INTEGER,
    sn: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  Order.associate = function (models) {
    Order.hasMany(models.Payment)
    Order.belongsTo(models.Product)
  };
  return Order;
};