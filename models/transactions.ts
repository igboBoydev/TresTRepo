var Sequelize = require("sequelize");

var Transactions = (sequelize: any, type: any) => {
  return sequelize.define("transactions", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: Sequelize.STRING,
    user_id: Sequelize.STRING,
    amount: Sequelize.DECIMAL(12, 2),
    previous_balance: Sequelize.DECIMAL(12, 2),
    balance: Sequelize.DECIMAL(12, 2),
    amount_deducted: Sequelize.DECIMAL(12, 2),
    reference: Sequelize.STRING,
    type: Sequelize.STRING,
    status: Sequelize.STRING,
    description: Sequelize.STRING,
  });
};

module.exports = Transactions;
