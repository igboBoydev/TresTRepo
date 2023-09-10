"use strict";

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      customer_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      verification_status: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      login_count: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_login_time: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      locked: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      activated: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },

      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("users");
  },
};
