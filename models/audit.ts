var Sequelize = require("sequelize");

var AuditLogs = (sequelize: any, type: any) => {
  return sequelize.define("audit", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: Sequelize.STRING,
    reciever_id: Sequelize.STRING,
    reqbody: Sequelize.TEXT,
  });
};

module.exports = AuditLogs;
