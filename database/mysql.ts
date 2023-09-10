require("dotenv").config();
// const tools = require("../utils/packages");
const Sequelizes = require("sequelize");

var db: any = {};

var sequelize = new Sequelizes(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to mysql database has been established successfully"
    );
  })
  .catch((error: any) => {
    console.error("Unable to connect to mysql database: ", error);
  });

db.sequelize = sequelize;

db.Users = require("../models/users")(sequelize, Sequelizes);
db.Oauth = require("../models/oauth")(sequelize, Sequelizes);
db.Transactions = require("../models/transactions")(sequelize, Sequelizes);
db.AuditLogs = require("../models/audit")(sequelize, Sequelizes);
db.Wallets = require("../models/wallet")(sequelize, Sequelizes);
db.TransactionPin = require("../models/transactionPin")(sequelize, Sequelizes);
// database associations
db.Transactions.belongsTo(db.Users, {
  foreignKey: "user_id",
  as: "user_transadtions",
});

db.Users.hasMany(db.Transactions, {
  foreignKey: "user_id",
  as: "user_transadtions",
});

db.Wallets.belongsTo(db.Users, {
  foreignKey: "user_id",
  as: "user_wallets",
});

db.Users.hasOne(db.Wallets, {
  foreignKey: "user_id",
  as: "user_wallets",
});

db.TransactionPin.belongsTo(db.Users, {
  foreignKey: "user_id",
  as: "user_transaction_pin",
});

db.Users.hasOne(db.TransactionPin, {
  foreignKey: "user_id",
  as: "user_transaction_pin",
});

module.exports = db;
