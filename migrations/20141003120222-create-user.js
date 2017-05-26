"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    facebook_id: {
      type: Sequelize.STRING,
      unique: true
    },
    num: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: Sequelize.DATE
  }).then(() => queryInterface.sequelize.query(`
    ALTER TABLE "user"
      ADD CONSTRAINT "email_or_facebook_id"
        CHECK("facebook_id" IS NOT NULL OR "email" IS NOT NULL);
    ALTER TABLE "user"
      ADD CONSTRAINT "email_and_password" CHECK(
        ("email" IS NOT NULL AND "password" IS NOT NULL) OR
        ("email" IS NULL AND "password" IS NULL)
      );
  `)),

  down: queryInterface => queryInterface.dropTable('user')
};
