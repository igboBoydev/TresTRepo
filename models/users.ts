var Sequelize = require("sequelize");

var User = (sequelize: any, type: any) => {
  return sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: Sequelize.STRING,
    customer_id: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    mobile_number: Sequelize.STRING,
    verification_status: Sequelize.STRING,
    status: Sequelize.STRING,
    login_count: Sequelize.INTEGER,
    last_login_time: Sequelize.STRING,
    locked: Sequelize.INTEGER,
    activated: Sequelize.INTEGER,
  });
};

module.exports = User;
