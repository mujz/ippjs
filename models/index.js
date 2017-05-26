'use strict';

var Sequelize = require('sequelize');

const { database, username, password, host, dialect }  = require('../config')

var sequelize = new Sequelize(database, username, password, { host, dialect });

let User = sequelize.define('user', {
  email: { type: Sequelize.STRING, unique: true },
  password: Sequelize.STRING,
  facebookId: { type: Sequelize.STRING, unique: true, field: 'facebook_id' },
  value: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1, field: 'num' },
  createdAt: { type: Sequelize.DATE, allowNull: false, field: 'created_at' },
  updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
}, {
  tableName: 'user',
  defaultScope: {
    attributes: {exclude: ['password']}
  },
  scopes: {
    withPassword: {
      attributes: {include: ['password']}
    }
  }
});

User.increment = function(id) {
  let tableName = this.tableName,
    valueColumn = this.attributes.value.field,
    idColumn = this.attributes.id.field;

  return sequelize.query(`
    UPDATE "${tableName}"
    SET "${valueColumn}" = "${valueColumn}" + 1
    WHERE "${idColumn}" = $$1
    RETURNING "${idColumn}", "${valueColumn}"`,
    { bind: [id], type: sequelize.QueryTypes.SELECT, model: this })
    .then(data => ({
      id: data[0].get(idColumn),
      value: data[0].get(valueColumn)
    }));
}

module.exports = {
  Sequelize,
  sequelize,
  User
};
