var Sequelize = require("sequelize");

var Pin = (sequelize: any, type: any) => {
  return sequelize.define("transaction_pin", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: Sequelize.STRING,
    pin: Sequelize.STRING,
    is_active: Sequelize.INTEGER,
  });
};

module.exports = Pin;
