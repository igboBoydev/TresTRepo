var Sequelize = require("sequelize");

var Wallets = (sequelize: any, type: any) => {
  return sequelize.define("wallet", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    unique_id: Sequelize.STRING,
    user_id: Sequelize.STRING,
    type: Sequelize.STRING,
    balance: Sequelize.DECIMAL(12, 2),
  });
};

module.exports = Wallets;
